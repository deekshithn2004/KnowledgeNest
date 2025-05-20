import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import TimetableForm from '../components/TimetableForm';
import TimetableDisplay from '../components/TimetableDisplay';
import Navbar from '../components/Navbar';

const TimetablePage = () => {
  const [generatedTimetable, setGeneratedTimetable] = useState(null);

  const handleTimetableGenerated = (timetable) => {
    setGeneratedTimetable(timetable);
  };

  return (
    <>
      <Helmet>
        <title>Study Timetable Generator | Student Portal</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
            AI Study Timetable Generator
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <TimetableForm onTimetableGenerated={handleTimetableGenerated} />
            </div>
            
            <div className="lg:col-span-7">
              {generatedTimetable ? (
                <TimetableDisplay timetable={generatedTimetable} />
              ) : (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg 
                      className="w-16 h-16 mx-auto text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                      Fill out the form to generate your personalized study timetable
                    </p>
                    <p className="mt-2 text-gray-500 dark:text-gray-500">
                      Our AI will create an optimized schedule based on your preferences
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimetablePage;