import File from '../models/file.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { grade } = req.body;
        
        const newFile = new File({
            filename: req.file.filename,
            grade: grade || 'unspecified',
            path: `/uploads/${req.file.filename}`,
            uploadedBy: req.user?._id
        });

        await newFile.save();

        res.status(201).json({
            message: 'File uploaded successfully',
            file: newFile
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });
    }
};

export const getFiles = async (req, res) => {
    try {
        const { grade } = req.query;
        
        const query = {};
        if (grade) query.grade = grade;
        
        const files = await File.find(query)
            .sort({ uploadDate: -1 })
            .populate('uploadedBy', 'fullName');
            
        res.status(200).json(files);
    } catch (error) {
        console.error('Error retrieving files:', error);
        res.status(500).json({ error: 'Error retrieving files' });
    }
};

export const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        // Check if user has permission
        if (file.uploadedBy && file.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this file' });
        }
        
        // Delete from filesystem
        const filePath = path.join(__dirname, '../../', file.path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        // Delete from database
        await File.findByIdAndDelete(id);
        
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Error deleting file' });
    }
};