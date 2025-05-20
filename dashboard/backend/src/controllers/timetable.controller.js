import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const generateTimetable = async (req, res) => {
  try {
    const { studyHours, breakTime, subjects, startTime, endTime, daysOfWeek } = req.body;
    
    // Validate input
    if (!studyHours || !subjects || !startTime || !endTime || !daysOfWeek) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if API key is properly configured
    if (!process.env.GOOGLE_API_KEY) {
      console.error('Missing Gemini API key');
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Format the prompt for Gemini AI - add more structure to help get valid JSON
    const prompt = `Generate a detailed weekly study timetable with the following parameters:
    - Total study hours per day: ${studyHours} hours
    - Break time between sessions: ${breakTime} minutes
    - Subjects to study: ${subjects.join(', ')}
    - Study time starts at: ${startTime} and ends at: ${endTime}
    - Days of the week: ${daysOfWeek.join(', ')}
    
    Format the response STRICTLY as a valid JSON object with this exact structure:
    {
      "Monday": [
        {"startTime": "09:00", "endTime": "10:30", "activity": "Mathematics", "isBreak": false},
        {"startTime": "10:30", "endTime": "10:45", "activity": "Break", "isBreak": true},
        ...and so on
      ],
      "Tuesday": [...],
      ...other days
    }
    
    IMPORTANT: Only include the days specified in the input. Ensure all time slots are within the start and end times.
    Each slot should have startTime, endTime, activity, and isBreak properties.`;

    // Generate content with Gemini
    const model = genAI.getGenerativeModel({  model: "gemini-1.5-flash"  });
    
    // Add more safety checking
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const timetableText = response.text();
      
      // First attempt to extract JSON from the response
      // Look for JSON-like content between curly braces
      const jsonMatch = timetableText.match(/\{[\s\S]*\}/);
      let timetableJSON = jsonMatch ? jsonMatch[0] : timetableText;
      
      // Try to parse the extracted JSON
      try {
        const timetable = JSON.parse(timetableJSON);
        return res.status(200).json({ timetable });
      } catch (jsonError) {
        console.error('Failed to parse Gemini response as JSON:', jsonError);
        
        // As a fallback, create a structured timetable based on the days requested
        const fallbackTimetable = {};
        daysOfWeek.forEach(day => {
          fallbackTimetable[day] = [
            {
              startTime: startTime,
              endTime: calculateEndTime(startTime, 60), // 1 hour session
              activity: "Study Session (AI generation failed)",
              isBreak: false,
              description: "Please try generating again. The AI response was not in valid format."
            }
          ];
        });
        
        return res.status(200).json({ 
          timetable: fallbackTimetable,
          generationError: true,
          rawResponse: timetableText
        });
      }
    } catch (apiError) {
      console.error('Gemini API error:', apiError);
      return res.status(500).json({ error: 'Failed to communicate with AI service' });
    }
  } catch (error) {
    console.error('Error generating timetable:', error);
    res.status(500).json({ error: 'Failed to generate timetable' });
  }
};

// Helper function to calculate end time given a start time and duration in minutes
function calculateEndTime(startTime, durationMinutes) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  const endHours = endDate.getHours().toString().padStart(2, '0');
  const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
  
  return `${endHours}:${endMinutes}`;
}