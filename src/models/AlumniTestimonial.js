const mongoose = require('mongoose');

const alumniTestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    branch: {
      type: String,
      trim: true,
      maxlength: [120, 'Branch cannot exceed 120 characters'],
    },
    batch: {
      type: String,
      trim: true,
      maxlength: [50, 'Batch cannot exceed 50 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
      maxlength: [120, 'Company cannot exceed 120 characters'],
    },
    testimonial: {
      type: String,
      required: [true, 'Testimonial is required'],
      trim: true,
      maxlength: [2000, 'Testimonial cannot exceed 2000 characters'],
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AlumniTestimonial', alumniTestimonialSchema);

