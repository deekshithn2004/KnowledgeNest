
import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    filename: String,
    grade: String,
    path: String,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('File', fileSchema);