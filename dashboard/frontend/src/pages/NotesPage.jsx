// frontend/src/pages/NotesPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { uploadFile, getFiles, deleteFile } from '../lib/fileService';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Upload, Trash2, Download, FileText } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const NotesPage = () => {
  const { grade } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser } = useAuthStore();
  
  // Get topic name from location state (passed from previous page)
  const topicName = location.state?.topicName || `Grade ${grade}`;
  
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [grade]);

  const fetchFiles = async () => {
    try {
      const fetchedFiles = await getFiles(grade);
      setFiles(fetchedFiles);
    } catch (error) {
      toast.error('Failed to load files');
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('grade', grade);
    
    setIsUploading(true);
    
    try {
      await uploadFile(formData);
      toast.success('File uploaded successfully');
      setSelectedFile(null);
      document.getElementById('fileInput').value = '';
      await fetchFiles();
    } catch (error) {
      toast.error('Upload failed');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await deleteFile(id);
      toast.success('File deleted successfully');
      await fetchFiles();
    } catch (error) {
      toast.error('Failed to delete file');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-5xl mx-auto border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-blue-100">
          <div className="flex items-center mb-4 md:mb-0">
            <button 
              onClick={() => navigate('/notes')}
              className="flex items-center mr-4 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            >
              <ArrowLeft size={22} className="stroke-2" />
              <span className="ml-2 font-medium">Back</span>
            </button>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
              Notes section
            </h1>
          </div>
          
          <div className="text-sm text-gray-500">
            {files.length} {files.length === 1 ? 'file' : 'files'} available
          </div>
        </div>
        
        <form onSubmit={handleUpload} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 group">
              <label 
                htmlFor="fileInput" 
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 cursor-pointer group-hover:border-indigo-400"
              >
                <Upload size={24} className="text-indigo-500 mb-2" />
                <span className="font-medium text-indigo-600">
                  {selectedFile ? selectedFile.name : 'Choose a file'}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOC, DOCX, etc.'}
                </span>
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className={`px-8 py-4 rounded-xl font-medium transition-all duration-200 ${
                isUploading || !selectedFile
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:shadow-lg hover:from-indigo-700 hover:to-blue-600 transform hover:-translate-y-1'
              }`}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center">
                  <Upload size={18} className="mr-2" /> Upload File
                </span>
              )}
            </button>
          </div>
        </form>
        
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <FileText size={22} className="mr-2 text-indigo-500" />
          Available Notes
        </h2>
        
        {files.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium mb-2">No files uploaded yet</p>
            <p className="text-sm text-gray-400">Upload your first note to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div 
                key={file._id} 
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center overflow-hidden">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mr-4">
                    <FileText size={24} className="text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{file.filename}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <span className="mr-2">{new Date(file.uploadDate).toLocaleDateString()}</span>
                      {file.uploadedBy?.fullName && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300 mx-2"></span>
                          <span>{file.uploadedBy.fullName}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <a 
                    href={file.path} 
                    download 
                    className="flex items-center justify-center w-10 h-10 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-colors duration-200"
                    title="Download"
                  >
                    <Download size={20} />
                  </a>
                  
                  {authUser && file.uploadedBy && authUser._id === file.uploadedBy._id && (
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="flex items-center justify-center w-10 h-10 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;