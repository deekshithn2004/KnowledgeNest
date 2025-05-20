import { create } from 'zustand';
import {axiosInstance} from '../lib/axios';

export const useFileStore = create((set) => ({
  files: [],
  isLoading: false,
  error: null,
  

  fetchFiles: async (grade) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(grade ? `/api/files/grade/${grade}` : '/api/files');
      set({ files: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  uploadFile: async (file, grade) => {
    set({ isLoading: true, error: null });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('grade', grade);
    
    try {
      await axiosInstance.post('/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Refresh the file list after upload
      const response = await axiosInstance.get(`/api/files/grade/${grade}`);
      set({ files: response.data, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
  
  deleteFile: async (fileId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/api/files/${fileId}`);
      set(state => ({
        files: state.files.filter(file => file._id !== fileId),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  }
}));