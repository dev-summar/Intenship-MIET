const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    projectCode: {
      type: String,
      required: [true, 'Project code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [20, 'Project code cannot exceed 20 characters'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
      trim: true,
      maxlength: [100, 'Domain cannot exceed 100 characters'],
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
      maxlength: [50, 'Duration cannot exceed 50 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'closed'],
        message: 'Status must be open or closed',
      },
      default: 'open',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

projectSchema.index({ status: 1 });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ domain: 1 });

module.exports = mongoose.model('Project', projectSchema);
