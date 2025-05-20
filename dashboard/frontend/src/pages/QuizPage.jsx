import React, { useState, useEffect } from 'react';
import { axiosInstance } from "../lib/axios";

const QuizPage = () => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timer, setTimer] = useState(null);
  const [quizResults, setQuizResults] = useState({});

  // Fetch quiz with loading and error handling
  const fetchQuiz = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuizSubmitted(false);
    setScore(null);
    setQuizResults({});

    try {
      const { data } = await axiosInstance.post("/quiz/generate", { topic, difficulty });
      setQuiz(data.quiz);
      setAnswers({});
      
      // Set timer for quiz (20 seconds per question)
      const quizDuration = data.quiz.length * 20;
      setTimeRemaining(quizDuration);
      
      // Start countdown timer
      const countdownTimer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimer(countdownTimer);
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit quiz with detailed scoring
  const submitQuiz = async () => {
    // Clear the timer if it exists
    if (timer) {
      clearInterval(timer);
    }

    setQuizSubmitted(true);
    setIsLoading(true);

    try {
      const { data } = await axiosInstance.post("/quiz/evaluate", { 
        userAnswers: Object.values(answers), 
        quiz 
      });
      setScore(data.score);
      
      // Create a results mapping for each question
      const results = {};
      quiz.forEach((q, index) => {
        results[index] = {
          correctAnswer: q.correctAnswer,
          userAnswer: answers[index]
        };
      });
      
      setQuizResults(results);
    } catch (error) {
      console.error("Error evaluating quiz:", error);
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswerChange = (index, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [index]: selectedAnswer
    }));
  };

  // Format time remaining
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Determine answer styling
  const getAnswerStyle = (index, option) => {
    if (!quizSubmitted) {
      return answers[index] === option ? 'bg-indigo-100 border-2 border-indigo-500' : 'bg-white hover:bg-indigo-50';
    }

    const result = quizResults[index];
    if (!result) return 'bg-white';

    // Correct answer
    if (option === result.correctAnswer) {
      return 'bg-emerald-100 border-2 border-emerald-500 text-emerald-800';
    }
    
    // Wrong answer selected by user
    if (option === result.userAnswer && option !== result.correctAnswer) {
      return 'bg-red-100 border-2 border-red-500 text-red-800';
    }

    // Other options
    return 'bg-gray-100 text-gray-500';
  };

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI-Generated Quiz Challenge</h1>
        
        {/* Topic and Difficulty Selection */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            placeholder="Enter quiz topic..." 
            className="flex-grow border-2 border-indigo-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm"
          />
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)} 
            className="border-2 border-indigo-300 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg shadow-sm"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button 
            onClick={fetchQuiz} 
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 text-lg font-semibold shadow-md"
          >
            {isLoading ? 
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span> : 
              'Generate Quiz'
            }
          </button>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-md" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Display */}
      {quiz.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {/* Timer Display */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg font-semibold">Time Remaining: </span>
              <span className={`ml-2 font-mono text-lg font-bold ${
                timeRemaining <= 10 ? 'text-red-500' : 
                timeRemaining <= 30 ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Quiz Questions */}
          <div className="space-y-8">
            {quiz.map((q, index) => (
              <div 
                key={index} 
                className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${
                  quizSubmitted && quizResults[index]
                    ? quizResults[index].userAnswer === quizResults[index].correctAnswer
                      ? 'border-emerald-500'
                      : 'border-red-500'
                    : 'border-indigo-500'
                }`}
              >
                <p className="font-bold text-lg mb-4 text-gray-800">{index + 1}. {q.question}</p>
                <div className="space-y-3 mt-4">
                  {q.options.map((opt, i) => (
                    <label 
                      key={i} 
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                        getAnswerStyle(index, opt)
                      }`}
                    >
                      <div className={`h-5 w-5 rounded-full mr-3 flex items-center justify-center border ${
                        answers[index] === opt && !quizSubmitted
                          ? 'border-indigo-500 bg-indigo-500'
                          : quizSubmitted && opt === quizResults[index]?.correctAnswer
                          ? 'border-emerald-500 bg-emerald-500'
                          : quizSubmitted && opt === quizResults[index]?.userAnswer && opt !== quizResults[index]?.correctAnswer
                          ? 'border-gray-300 bg-white'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {(answers[index] === opt || 
                         (quizSubmitted && (opt === quizResults[index]?.correctAnswer || 
                                            opt === quizResults[index]?.userAnswer))) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="radio"
                        name={`q${index}`}
                        value={opt}
                        checked={answers[index] === opt}
                        onChange={() => !quizSubmitted && handleAnswerChange(index, opt)}
                        disabled={quizSubmitted}
                        className="sr-only"
                      />
                      <span className="text-lg">{opt}</span>
                      {quizSubmitted && (
                        <>
                          {opt === quizResults[index]?.correctAnswer && (
                            <span className="ml-auto flex items-center text-emerald-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Correct
                            </span>
                          )}
                          {/* {opt === quizResults[index]?.userAnswer && opt !== quizResults[index]?.correctAnswer && (
                            <span className="ml-auto flex items-center text-red-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              Incorrect
                            </span>
                          )} */}
                        </>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          {!quizSubmitted && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={submitQuiz} 
                disabled={Object.keys(answers).length !== quiz.length || isLoading}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 text-lg font-semibold shadow-lg transform hover:-translate-y-1 flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Submit Quiz
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Score Display */}
      {score !== null && (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fadeIn">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
            score === quiz.length 
              ? 'bg-emerald-100 text-emerald-600' 
              : score > quiz.length / 2 
                ? 'bg-indigo-100 text-indigo-600' 
                : 'bg-amber-100 text-amber-600'
          }`}>
            <span className="text-3xl font-bold">{Math.round((score / quiz.length) * 100)}%</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-2">
            Your Score: 
            <span className={`ml-2 ${
              score === quiz.length 
                ? 'text-emerald-600' 
                : score > quiz.length / 2 
                  ? 'text-indigo-600' 
                  : 'text-amber-600'
            }`}>
              {score}/{quiz.length}
            </span>
          </h2>
          
          <p className="text-xl mb-6">
            {score === quiz.length 
              ? "Perfect score! You're a master of this topic!" 
              : score > quiz.length / 2 
                ? "Good job! You've got a solid understanding." 
                : "Keep practicing. You're making progress!"}
          </p>
          
          <button 
            onClick={() => {
              setTopic("");
              setQuiz([]);
              setScore(null);
              setQuizSubmitted(false);
            }}
            className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all text-lg font-semibold shadow-md"
          >
            Try Another Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;