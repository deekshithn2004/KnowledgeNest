import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, X, Save, BookOpen } from 'lucide-react';

const NotesGradePage = () => {
  const navigate = useNavigate();
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', description: '', icon: '📚' });
  const [topics, setTopics] = useState([
    { id: '1', title: 'Mathematics', icon: '🧮', description: 'Algebra, Geometry, Calculus' },
    { id: '2', title: 'Physics', icon: '⚛️', description: 'Mechanics, Thermodynamics, Waves' },
    { id: '3', title: 'Chemistry', icon: '🧪', description: 'Organic, Inorganic, Biochemistry' },
    { id: '4', title: 'Biology', icon: '🧬', description: 'Genetics, Ecology, Physiology' },
    { id: '5', title: 'Computer Science', icon: '💻', description: 'Programming, Algorithms, Data Structures' },
    { id: '6', title: 'Literature', icon: '📖', description: 'Fiction, Poetry, Drama' },
    { id: '7', title: 'History', icon: '🏛️', description: 'Ancient, Medieval, Modern' },
    { id: '8', title: 'Geography', icon: '🌍', description: 'Physical, Human, Environmental' }
  ]);

  const handleAddTopic = () => {
    if (newTopic.title.trim() === '') return;
    
    const newId = (topics.length + 1).toString();
    setTopics([...topics, { ...newTopic, id: newId }]);
    setNewTopic({ title: '', description: '', icon: '📚' });
    setIsAddingTopic(false);
  };

  const icons = ['📚', '🧮', '⚛️', '🧪', '🧬', '💻', '📖', '🏛️', '🌍', '🎨', '🎵', '🔍', '📝', '📊'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-800 mb-3">Learning Topics</h1>
          <p className="text-lg text-indigo-600 max-w-2xl mx-auto">
            Select a topic to explore notes, resources, and study materials
          </p>
        </div>
        
        {/* Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => navigate(`/notes/${topic.id}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {topic.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-gray-600 text-sm flex-grow">{topic.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-indigo-500 text-sm font-medium">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>View notes</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Topic Card */}
          {!isAddingTopic ? (
            <div
              onClick={() => setIsAddingTopic(true)}
              className="bg-white bg-opacity-60 rounded-xl border-2 border-dashed border-indigo-300 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-opacity-80 transition-all duration-300 hover:border-indigo-400"
            >
              <PlusCircle className="h-12 w-12 text-indigo-400 mb-2" />
              <p className="text-indigo-600 font-medium">Add New Topic</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add New Topic</h3>
                <button 
                  onClick={() => setIsAddingTopic(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {icons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setNewTopic({...newTopic, icon})}
                        className={`h-10 w-10 flex items-center justify-center text-xl rounded-md ${
                          newTopic.icon === icon 
                            ? 'bg-indigo-100 border-2 border-indigo-400' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTopic.title}
                    onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Topic title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newTopic.description}
                    onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief description"
                  />
                </div>
                
                <button
                  onClick={handleAddTopic}
                  disabled={!newTopic.title.trim()}
                  className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Topic
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesGradePage;