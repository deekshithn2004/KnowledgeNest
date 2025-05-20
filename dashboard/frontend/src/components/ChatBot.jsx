
import { useState, useEffect, useRef } from "react";
import { axiosInstance } from "/src/lib/axios.js";
import { Send, BookOpen, Bot, Sparkles, Brain, Lightbulb, Zap, Clock, Stars, Info } from "lucide-react";

const ChatBot = () => {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("General");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showTips, setShowTips] = useState(true);
  const messagesEndRef = useRef(null);

  // Cache for storing recent responses
  const responseCache = useRef(new Map());
  const MAX_CACHE_SIZE = 10;

  useEffect(() => {
    setMounted(true);
    // Load initial message immediately without timeout
    setMessages([
      { type: "bot", content: "Hello! I'm your AI Study Assistant. How can I help you today?" }
    ]);
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Function to add a message to cache
  const addToCache = (key, value) => {
    // Remove oldest entry if cache is full
    if (responseCache.current.size >= MAX_CACHE_SIZE) {
      const oldestKey = responseCache.current.keys().next().value;
      responseCache.current.delete(oldestKey);
    }
    responseCache.current.set(key, value);
  };

  // Create a cache key from prompt and category
  const getCacheKey = (promptText, categoryText) => `${categoryText}:${promptText}`;

  const handleSend = async () => {
    if (!prompt.trim()) return;
    
    // Add user message to history immediately
    const trimmedPrompt = prompt.trim();
    setMessages(prev => [...prev, { type: "user", content: trimmedPrompt }]);
    setPrompt(""); // Clear input right away for better UX
    
    setIsLoading(true);
    
    // Check cache first
    const cacheKey = getCacheKey(trimmedPrompt, category);
    if (responseCache.current.has(cacheKey)) {
      // Use cached response
      const cachedResponse = responseCache.current.get(cacheKey);
      
      // Still add a small delay for natural feeling
      setTimeout(() => {
        setMessages(prev => [...prev, { type: "bot", content: cachedResponse }]);
        setIsLoading(false);
      }, 300);
      
      return;
    }
    
    try {
      // Set a timeout to limit API call time
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timed out")), 8000)
      );
      
      // Make the API request
      const apiPromise = axiosInstance.post("/chatbot", { 
        prompt: trimmedPrompt, 
        category 
      });
      
      // Race the timeout against the API call
      const { data } = await Promise.race([apiPromise, timeoutPromise]);
      
      const fullResponse = data.response || 
        `I've processed your request about ${trimmedPrompt}. Let me help you understand this topic better.`;
      
      // Skip animation for better performance, directly add response
      setMessages(prev => [...prev, { type: "bot", content: fullResponse }]);
      
      // Cache the response
      addToCache(cacheKey, fullResponse);
      
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = error.message === "Request timed out" 
        ? "The response is taking too long. Please try again with a simpler question."
        : "Error fetching response. Please try again.";
      
      setMessages(prev => [...prev, { type: "bot", content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryIcons = {
    General: <BookOpen className="w-4 h-4" />,
    Mathematics: <span className="text-sm">∑</span>,
    Science: <span className="text-sm">⚗️</span>,
    History: <span className="text-sm">🏛️</span>,
    Programming: <span className="text-sm">&lt;/&gt;</span>,
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const tips = [
    "Try asking about specific study topics to get detailed explanations",
    "Use the category buttons to get specialized help",
    "You can ask for practice problems or examples",
    "Request step-by-step explanations for complex topics"
  ];

  return (
    <div className="relative flex justify-center items-center min-h-screen p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,120,255,0.1)_0,rgba(120,120,255,0)_70%)]"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>
        
        {/* Reduced number of floating particles for performance */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full bg-white animate-float-slow"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
                animationDuration: `${Math.random() * 15 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Reduced number of gradient orbs for performance */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute rounded-full blur-3xl animate-pulse-slow"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                background: `radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(129, 140, 248, 0.1) 50%, rgba(99, 102, 241, 0.05) 100%)`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 8 + 4}s`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Feature info button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => setShowFeatures(!showFeatures)}
          className="bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-all duration-300 text-white shadow-lg border border-white/20"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {showFeatures && (
        <div className="absolute top-16 right-4 w-64 bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-xl z-10 transform transition-all duration-300 animate-fade-in text-white">
          <h3 className="text-lg font-medium mb-3 flex items-center"><Stars className="w-4 h-4 mr-2" /> Features</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <Brain className="w-4 h-4 mr-2 mt-1 text-purple-300" />
              <span className="text-sm">Advanced AI understanding of complex topics</span>
            </li>
            <li className="flex items-start">
              <Lightbulb className="w-4 h-4 mr-2 mt-1 text-yellow-300" />
              <span className="text-sm">Topic-specific knowledge categories</span>
            </li>
            <li className="flex items-start">
              <Zap className="w-4 h-4 mr-2 mt-1 text-blue-300" />
              <span className="text-sm">Instant responses with detailed explanations</span>
            </li>
            <li className="flex items-start">
              <Clock className="w-4 h-4 mr-2 mt-1 text-green-300" />
              <span className="text-sm">Study session history saved automatically</span>
            </li>
          </ul>
        </div>
      )}

      {/* Usage Tips */}
      {showTips && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-lg text-white">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-yellow-300" /> Study Assistant Tips
              </h3>
              <button 
                onClick={() => setShowTips(false)}
                className="text-white/70 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
              {tips.map((tip, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 bg-white/5 rounded-lg p-2 border border-white/10 text-xs max-w-xs"
                >
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div 
        className="relative z-10 w-full max-w-xl transform transition-all duration-700 flex flex-col space-y-4"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)'
        }}
      >
        {/* Status indicator */}
        <div className="flex justify-between items-center px-2">
          <div className="text-white text-sm flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
            <span>AI Assistant Online</span>
          </div>
        </div>

        {/* Main Container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20 flex flex-col h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Study Assistant</h2>
              <p className="text-xs text-white/70">Powered by advanced machine learning</p>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <div className="animate-pulse">
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="text-xs px-2 py-1 bg-indigo-700/50 rounded-full text-white border border-indigo-500/30">
                {category}
              </div>
            </div>
          </div>
          
          {/* Message History - using will-change to optimize rendering */}
          <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent will-change-scroll">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md rounded-2xl px-4 py-2 ${
                      msg.type === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white/10 backdrop-blur-sm text-white rounded-tl-none border border-white/10'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none px-4 py-3 text-white border border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                      </div>
                      <span className="text-white/70 text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-white/10"></div>
          
          {/* Input Area */}
          <div className="p-4">
            {/* Category Selector */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent scroll-smooth">
              {Object.keys(categoryIcons).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap transition-all ${
                    category === cat
                      ? "bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400/50"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  <span>{categoryIcons[cat]}</span>
                  <span className="text-sm">{cat}</span>
                </button>
              ))}
            </div>

            {/* Text Area */}
            <div className="relative">
              <textarea
                className="p-4 border border-indigo-100/20 rounded-xl w-full min-h-24 bg-white/5 backdrop-blur-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent resize-none"
                placeholder="Ask me anything..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
              />
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={handleSend}
                  disabled={isLoading || !prompt.trim()}
                  className={`p-2 rounded-full ${
                    prompt.trim() && !isLoading ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-400/50 cursor-not-allowed"
                  } text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-indigo-900/50`}
                >
                  <Send className={`w-5 h-5 ${isLoading ? "animate-pulse" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-10px); }
          75% { transform: translateY(-20px) translateX(5px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float-slow {
          animation: float-slow 15s infinite ease-in-out;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 5s infinite ease-in-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        /* Custom scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        
        .scrollbar-thumb-white\\/20::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
};

export default ChatBot;