import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TimetableDisplay = ({ timetable }) => {
  const [selectedDay, setSelectedDay] = useState(Object.keys(timetable)[0] || 'Monday');
  const days = Object.keys(timetable);
  
  // Handle the case where Gemini didn't return proper JSON
  if (timetable.parsed === false) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Generated Timetable</h2>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Print
          </button>
        </div>
        <div className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          {timetable.raw}
        </div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    const input = document.getElementById('timetable-container');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save('study-timetable.pdf');
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Generated Timetable</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
          >
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Print
          </button>
        </div>
      </div>

      {/* Day Selection Tabs */}
      <div className="flex overflow-x-auto mb-4 border-b border-gray-200 dark:border-gray-700">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 font-medium ${
              selectedDay === day
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timetable Display */}
      <div id="timetable-container" className="overflow-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">Time</th>
              <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">Activity</th>
            </tr>
          </thead>
          <tbody>
            {timetable[selectedDay] && Array.isArray(timetable[selectedDay]) ? (
              timetable[selectedDay].map((slot, index) => (
                <tr 
                  key={index} 
                  className={`${
                    slot.isBreak 
                      ? 'bg-green-50 dark:bg-green-900 dark:bg-opacity-20' 
                      : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <td className="px-4 py-3 border border-gray-200 dark:border-gray-600">
                    {slot.startTime} - {slot.endTime}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 dark:border-gray-600">
                    <div className="font-medium">{slot.activity}</div>
                    {slot.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">{slot.description}</div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-4 py-3 text-center text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                  No schedule available for this day.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimetableDisplay;