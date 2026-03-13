// models/EntranceExam/College.model.js
import mongoose from 'mongoose';

const entranceCollegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  testLink: {
    type: String,
  },
  testIds: [{
    type: String,
    required: true,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

export default mongoose.models.EntranceCollege || mongoose.model('EntranceCollege', entranceCollegeSchema);
