import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);


// Generate AI-based Quiz
export const generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    
    if (!topic || !difficulty) {
      return res.status(400).json({ 
        success: false, 
        message: "Topic and difficulty are required" 
      });
    }

    console.log(`Generating ${difficulty} quiz about ${topic}`);
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Generate a ${difficulty} level quiz on ${topic}. 
    Provide 5 multiple-choice questions with 4 options each, and indicate the correct answer. 
    Format your response as a clean JSON array with the following structure:
    [
      {
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option that is correct"
      }
    ]
    Only return the JSON array and nothing else. No extra text, markdown formatting, code blocks, or explanations.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Gemini response received");
    
    // Improved JSON parsing with better error handling
    try {
      let quizData;
      
      // Try direct parsing first
      try {
        quizData = JSON.parse(text);
      } catch (directParseError) {
        // If direct parsing fails, try to extract JSON
        console.log("Direct JSON parsing failed, attempting to extract JSON");
        
        // Look for anything that resembles a JSON array
        const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          console.log("Found JSON-like content, attempting to parse");
          quizData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not extract valid JSON from response");
        }
      }
      
      // Validate the structure of the parsed data
      if (!Array.isArray(quizData)) {
        throw new Error("Expected array of questions");
      }
      
      // Validate each question object has the required fields
      quizData.forEach((question, index) => {
        if (!question.question || !Array.isArray(question.options) || !question.correctAnswer) {
          throw new Error(`Question at index ${index} has invalid structure`);
        }
        
        // Ensure correctAnswer is one of the options
        if (!question.options.includes(question.correctAnswer)) {
          console.warn(`Correcting answer for question ${index + 1}`);
          // Set the first option as the correct answer if not found
          question.correctAnswer = question.options[0];
        }
      });
      
      console.log(`Successfully parsed ${quizData.length} questions`);
      res.json({ success: true, quiz: quizData });
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      // Send detailed error information for debugging
      res.status(500).json({ 
        success: false, 
        message: "Failed to parse quiz data", 
        error: parseError.message,
        rawResponse: text.substring(0, 1000) // Include part of the raw response for debugging
      });
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to generate quiz", 
      error: error.message || "Unknown error" 
    });
  }
};

// Evaluate Quiz Answers
export const evaluateQuiz = async (req, res) => {
  try {
    const { userAnswers, quiz } = req.body;
    
    if (!userAnswers || !quiz || !Array.isArray(userAnswers) || !Array.isArray(quiz)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid quiz data provided" 
      });
    }
    
    let score = 0;

    // Only count answers for questions that exist
    const validAnswers = Math.min(userAnswers.length, quiz.length);
    
    for (let i = 0; i < validAnswers; i++) {
      if (userAnswers[i] === quiz[i].correctAnswer) {
        score++;
      }
    }

    res.json({ success: true, score });
  } catch (error) {
    console.error("Evaluation error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to evaluate quiz",
      error: error.message || "Unknown error" 
    });
  }
};
