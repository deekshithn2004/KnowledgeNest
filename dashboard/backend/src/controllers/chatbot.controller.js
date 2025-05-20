
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash", // Using the fastest model
  generationConfig: {
    maxOutputTokens: 1024, // Limit output size
    temperature: 0.7,
    topP: 0.9,
  }
});

// Simple in-memory cache
const responseCache = new Map();
const MAX_CACHE_SIZE = 100; // Cache size limit

// Function to add an entry to the cache
const addToCache = (key, value) => {
  // If cache is full, remove oldest entry
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = responseCache.keys().next().value;
    responseCache.delete(oldestKey);
  }
  responseCache.set(key, value);
};

// Get standard prompt for category
const getCategoryPrompt = (prompt, category) => {
  switch (category) {
    case "Mathematics":
      return `Explain ${prompt} in simple terms with examples. Keep your answer concise.`;
    case "Science":
      return `Provide a clear explanation about ${prompt} with practical applications. Keep your answer concise.`;
    case "History":
      return `Describe ${prompt} with key historical details and significance. Keep your answer concise.`;
    case "Programming":
      return `Explain ${prompt} in a way that helps a beginner understand it, with a brief example. Keep your answer concise.`;
    default:
      return `Provide a concise explanation on ${prompt}.`;
  }
};

export const chatbotResponse = async (req, res) => {
  try {
    const { prompt, category } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    
    // Create cache key from prompt and category
    const cacheKey = `${category}:${prompt}`;
    
    // Check if we have a cached response
    if (responseCache.has(cacheKey)) {
      return res.json({ response: responseCache.get(cacheKey) });
    }
    
    // Create an appropriate prompt for the category
    const fullPrompt = getCategoryPrompt(prompt, category);
    
    // Set up a timeout for the API request
    const timeoutPromise = new Promise((_, reject) => {
      const timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        reject(new Error("API request timed out"));
      }, 7000); // 7 second timeout
    });
    
    // Make the API request with appropriate limits
    const apiPromise = model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }]
    });
    
    // Race the timeout against the API call
    const result = await Promise.race([apiPromise, timeoutPromise]);
    
    // Extract and clean up the response
    const responseText = result.response.text();
    
    // Store in cache
    addToCache(cacheKey, responseText);
    
    // Send response
    res.json({ response: responseText });
  } catch (error) {
    console.error("Chatbot error:", error);
    
    // Provide a helpful fallback response
    const fallbackResponse = "I'm having trouble generating a detailed response right now. " +
      "Could you try asking a simpler question or try again in a moment?";
    
    res.status(200).json({ 
      response: fallbackResponse,
      error: error.message 
    });
  }
};