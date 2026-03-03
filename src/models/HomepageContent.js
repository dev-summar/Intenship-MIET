const mongoose = require('mongoose');

const homepageContentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: 'singleton',
    },
    centreName: {
      type: String,
      default: 'The Centre for Research, Innovation & Entrepreneurship Lab',
      trim: true,
    },
    programName: {
      type: String,
      default: "Director's Internship Program",
      trim: true,
    },
    heroTitle: {
      type: String,
      default: 'Find Your Next Internship Opportunity',
      trim: true,
    },
    heroSubtitle: {
      type: String,
      default:
        'Browse open projects from multiple domains and apply with one click.',
      trim: true,
    },
    liveProjects: {
      type: Number,
      default: 10,
    },
    interns: {
      type: Number,
      default: 50,
    },
    domains: {
      type: Number,
      default: 4,
    },
    aboutTitle: {
      type: String,
      default: 'About the Internship Program',
      trim: true,
    },
    aboutDescription: {
      type: String,
      default:
        "This Director's Internship Program offers real-world project experience across AI, Web, IoT, and Infrastructure domains. Students collaborate on live systems and gain practical exposure under expert mentorship.",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HomepageContent', homepageContentSchema);

