const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student is required'],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: false,
      default: null,
    },
    sop: {
      type: String,
      required: [true, 'Statement of purpose is required'],
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    resumeUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Status must be pending, approved, or rejected',
      },
      default: 'pending',
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
    assignedMentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

applicationSchema.index({ student: 1, project: 1 }, { unique: true });
applicationSchema.index({ project: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ student: 1 });

module.exports = mongoose.model('Application', applicationSchema);
