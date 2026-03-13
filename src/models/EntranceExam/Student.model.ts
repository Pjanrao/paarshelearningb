// models/EntranceExam/Student.model.js
import mongoose from 'mongoose';

const entranceStudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  university: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EntranceCollege',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

entranceStudentSchema.index({ email: 1, college: 1 }, { unique: true });
entranceStudentSchema.index({ college: 1 });

export default mongoose.models.EntranceStudent || mongoose.model('EntranceStudent', entranceStudentSchema);
