/**
 * Seed script for open projects.
 * Safe to run multiple times: uses upsert by projectCode to avoid duplicates.
 * If no admin user exists, creates one from env (SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME).
 *
 * Run from project root: npm run seed:projects
 */

require('dotenv').config();
const path = require('path');

// Load .env from project root when running as node scripts/seedProjects.js
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const Project = require('../src/models/Project');
const User = require('../src/models/User');

const SEED_PROJECTS = [
  {
    projectCode: 'PETPULSE',
    title: 'Petpulse',
    description: 'A pet health and wellness tracking platform leveraging IoT and mobile apps for real-time monitoring and vet insights.',
    domain: 'IoT',
    duration: '3-6 months',
    requiredSkills: ['IoT', 'Mobile Development', 'Node.js'],
    status: 'open',
  },
  {
    projectCode: 'DUCKIETOWN',
    title: 'Autonomous Vehicles - Duckietown',
    description: 'Hands-on autonomous driving and robotics using Duckietown platform for perception, planning, and control.',
    domain: 'AI',
    duration: '4-6 months',
    requiredSkills: ['Python', 'Computer Vision', 'Robotics'],
    status: 'open',
  },
  {
    projectCode: 'SEEDO-ATTEND',
    title: 'Staff and Classroom Attendance (Seedo.ai)',
    description: 'Automated attendance system for staff and classrooms using computer vision and identity verification.',
    domain: 'AI',
    duration: '3-5 months',
    requiredSkills: ['Computer Vision', 'Python', 'Web APIs'],
    status: 'open',
  },
  {
    projectCode: 'PEOPLE-FITMENT',
    title: 'Faculty Fitment - People.ai',
    description: 'AI-driven faculty-to-course fitment and workload optimization for better resource allocation.',
    domain: 'AI',
    duration: '3-6 months',
    requiredSkills: ['Machine Learning', 'Data Analysis', 'Backend'],
    status: 'open',
  },
  {
    projectCode: 'SEEDO-VEHICLE',
    title: 'Campus Vehicle Management - Seedo.ai',
    description: 'Campus vehicle tracking, access control, and fleet management using IoT and dashboards.',
    domain: 'IoT',
    duration: '4-6 months',
    requiredSkills: ['IoT', 'Web Development', 'Database'],
    status: 'open',
  },
  {
    projectCode: 'CARETAKER-AI',
    title: 'Caretaker.ai',
    description: 'AI-assisted caregiving and health monitoring for elderly or dependent care with alerts and reporting.',
    domain: 'AI',
    duration: '3-6 months',
    requiredSkills: ['AI/ML', 'Mobile or Web', 'APIs'],
    status: 'open',
  },
  {
    projectCode: 'CRICKEYE',
    title: 'Smart Cricket Analytics: CrickEye',
    description: 'Real-time cricket analytics and visualizations for performance tracking and strategic insights.',
    domain: 'Web',
    duration: '3-5 months',
    requiredSkills: ['Data Analytics', 'Web Development', 'APIs'],
    status: 'open',
  },
  {
    projectCode: 'AASRA-SEWA',
    title: 'Aasra Sewa',
    description: 'Community support and volunteer coordination platform for outreach and service initiatives.',
    domain: 'Web',
    duration: '3-4 months',
    requiredSkills: ['Web Development', 'Database', 'REST APIs'],
    status: 'open',
  },
  {
    projectCode: 'SAFETY-ADVISORY',
    title: 'Safety Advisory System for Critical Infrastructure',
    description: 'Monitoring and advisory system for critical infrastructure safety using sensors and predictive alerts.',
    domain: 'Infrastructure',
    duration: '4-6 months',
    requiredSkills: ['IoT', 'Data Analytics', 'Backend'],
    status: 'open',
  },
  {
    projectCode: 'BLDG-PLAN-VIOL',
    title: 'A SYSTEM AND METHOD FOR DETECTING BUILDING PLAN VIOLATION',
    description: 'Computer vision and geospatial system to detect building plan violations and unauthorized construction.',
    domain: 'AI',
    duration: '4-6 months',
    requiredSkills: ['Computer Vision', 'Geospatial', 'Python'],
    status: 'open',
  },
];

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI is not set. Ensure .env exists in project root.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected.');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }

  let adminUser;
  try {
    adminUser = await User.findOne({ role: 'admin' }).select('_id').lean();
  } catch (err) {
    console.error('Failed to find admin user:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }

  if (!adminUser) {
    const seedEmail = process.env.SEED_ADMIN_EMAIL;
    const seedPassword = process.env.SEED_ADMIN_PASSWORD;
    const seedName = process.env.SEED_ADMIN_NAME || 'Seed Admin';
    if (seedEmail && seedPassword) {
      try {
        const newAdmin = await User.create({
          name: seedName,
          email: seedEmail.toLowerCase().trim(),
          password: seedPassword,
          role: 'admin',
        });
        adminUser = { _id: newAdmin._id };
        console.log('Created seed admin user:', seedEmail);
      } catch (err) {
        console.error('Failed to create seed admin:', err.message);
        await mongoose.disconnect();
        process.exit(1);
      }
    } else {
      console.error(
        'No admin user found. Either set SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD (and optionally SEED_ADMIN_NAME) in .env and re-run, or create an admin via POST /api/auth/register with role: admin.'
      );
      await mongoose.disconnect();
      process.exit(1);
    }
  }

  const createdBy = adminUser._id;
  let inserted = 0;
  let updated = 0;

  for (const doc of SEED_PROJECTS) {
    const projectCode = doc.projectCode.toUpperCase();
    const filter = { projectCode };
    const update = {
      $set: {
        title: doc.title,
        description: doc.description,
        domain: doc.domain,
        duration: doc.duration,
        requiredSkills: doc.requiredSkills || [],
        status: doc.status || 'open',
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdBy,
        createdAt: new Date(),
      },
    };
    const opts = { upsert: true, new: true, runValidators: true };

    try {
      const existing = await Project.findOne(filter).select('createdAt updatedAt').lean();
      await Project.findOneAndUpdate(filter, update, opts);
      const isNew = !existing;
      if (isNew) {
        inserted += 1;
        console.log(`Inserted: ${doc.title} (${projectCode})`);
      } else {
        updated += 1;
        console.log(`Updated (existing): ${doc.title} (${projectCode})`);
      }
    } catch (err) {
      console.error(`Error upserting ${projectCode}:`, err.message);
    }
  }

  console.log(`\nDone. Inserted: ${inserted}, Updated: ${updated}.`);
  await mongoose.disconnect();
  console.log('MongoDB disconnected.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
