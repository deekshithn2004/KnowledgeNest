// frontend/src/lib/fileService.js
import { axiosInstance } from './axios';

export const uploadFile = async (formData) => {
  try {
    const response = await axiosInstance.post('/files/upload', formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFiles = async (grade) => {
  try {
    const params = grade ? { grade } : {};
    const response = await axiosInstance.get('/files', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteFile = async (fileId) => {
  try {
    const response = await axiosInstance.delete(`/files/${fileId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};