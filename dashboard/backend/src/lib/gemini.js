import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Function to generate a time table using Gemini AI
export const generateTimetable = async (userData) => {
  try {
    // Get the generative model (Gemini Pro)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Structure the prompt for the AI
    const prompt = `Create a detailed and personalized study timetable for a student with the following characteristics:
      - Age: ${userData.age}
      - Study hours per day: ${userData.studyHoursPerDay}
      - Break duration: ${userData.breakDuration} minutes
      - Grade level: ${userData.gradeLevel}
      - Preferred study time: ${userData.preferredStudyTime}
      - Study goal: ${userData.studyGoal}

    Please structure the timetable in a clear and organized way, with specific time blocks for different subjects/tasks, 
    including appropriate breaks based on the student's preferences. The timetable should be optimized for the study goal.
    
    Format the response as a JSON object with the following structure:
    {
      "weeklySchedule": {
        "monday": [
          { "startTime": "09:00", "endTime": "10:30", "activity": "Math Study", "type": "study" },
          { "startTime": "10:30", "endTime": "10:45", "activity": "Short Break", "type": "break" },
          ...
        ],
        "tuesday": [
          ...
        ],
        ...
      },
      "recommendations": [
        "Recommendation 1",
        "Recommendation 2",
        ...
      ],
      "studyTips": [
        "Tip 1",
        "Tip 2",
        ...
      ]
    }`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON from the AI response
    // Extract the JSON part from the response (the AI might wrap it in text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI response did not contain valid JSON');
    }

    const timetableJson = JSON.parse(jsonMatch[0]);
    return timetableJson;
  } catch (error) {
    console.error('Error generating timetable with Gemini AI:', error);
    throw error;
  }
};

// Optionally: Function to refine a timetable based on feedback
export const refineTimetable = async (timetable, feedback) => {
  try {
    const model = genAI.getGenerativeModel({  model: "gemini-1.5-flash"  });
    
    // Create a prompt for refinement based on feedback
    const prompt = `I have the following study timetable:
    ${JSON.stringify(timetable, null, 2)}
    
    Please refine this timetable based on the following feedback:
    ${feedback}
    
    Return the refined timetable in the same JSON format.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON from the AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI response did not contain valid JSON');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error refining timetable with Gemini AI:', error);
    throw error;
  }
};