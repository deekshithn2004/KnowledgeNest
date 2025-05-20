import React, { useState } from 'react';
import {axiosInstance} from '../lib/axios';
import { toast } from 'react-hot-toast';

const TimetableForm = ({ onTimetableGenerated }) => {
  const [formData, setFormData] = useState({
    studyHours: 4,
    breakTime: 15,
    subjects: [''],
    startTime: '09:00',
    endTime: '18:00',
    daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  });
  const [loading, setLoading] = useState(false);

  const daysOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubjectChange = (index, value) => {
    const updatedSubjects = [...formData.subjects];
    updatedSubjects[index] = value;
    setFormData({
      ...formData,
      subjects: updatedSubjects
    });
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, '']
    });
  };

  const removeSubject = (index) => {
    const updatedSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      subjects: updatedSubjects
    });
  };

  const handleDaySelection = (day) => {
    if (formData.daysOfWeek.includes(day)) {
      setFormData({
        ...formData,
        daysOfWeek: formData.daysOfWeek.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        daysOfWeek: [...formData.daysOfWeek, day]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (formData.subjects.some(subject => !subject.trim())) {
      toast.error('Please fill in all subject fields');
      return;
    }
    
    if (formData.daysOfWeek.length === 0) {
      toast.error('Please select at least one day of the week');
      return;
    }

    setLoading(true);
    try {
      // Changed endpoint from '/api/timetable/generate' to '/timetable/generate'
      // to avoid duplication of '/api' in the URL
      const response = await axiosInstance.post('/timetable/generate', formData);
      onTimetableGenerated(response.data.timetable);
      toast.success('Timetable generated successfully!');
    } catch (error) {
      console.error('Error generating timetable:', error);
      toast.error(error.response?.data?.error || 'Failed to generate timetable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Generate Study Timetable</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Study Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Daily Study Hours
            </label>
            <input
              type="number"
              name="studyHours"
              min="1"
              max="16"
              value={formData.studyHours}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          
          {/* Break Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Break Time (minutes)
            </label>
            <input
              type="number"
              name="breakTime"
              min="5"
              max="60"
              step="5"
              value={formData.breakTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          
          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          
          {/* End Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        </div>
        
        {/* Subjects */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subjects
          </label>
          {formData.subjects.map((subject, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={subject}
                onChange={(e) => handleSubjectChange(index, e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder={`Subject ${index + 1}`}
                required
              />
              {formData.subjects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSubject(index)}
                  className="ml-2 p-2 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSubject}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Subject
          </button>
        </div>
        
        {/* Days of Week */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Days of Week
          </label>
          <div className="flex flex-wrap gap-2">
            {daysOptions.map(day => (
              <button
                key={day}
                type="button"
                onClick={() => handleDaySelection(day)}
                className={`px-3 py-1.5 rounded-md focus:outline-none ${
                  formData.daysOfWeek.includes(day)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Timetable'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TimetableForm;