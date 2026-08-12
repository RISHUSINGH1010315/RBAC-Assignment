import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Task from './models/Task.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rbac_task_db');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Task.deleteMany();
    console.log('Cleared existing Users and Tasks.');

    // Create default password hashes
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Create seed Users
    const admin = await User.create({
      name: 'Rishu Admin',
      email: 'admin@braviching.com',
      password: 'password123', // hooks will auto hash
      role: 'Admin'
    });

    const manager = await User.create({
      name: 'Abhinit Manager',
      email: 'manager@braviching.com',
      password: 'password123',
      role: 'Manager'
    });

    const developer = await User.create({
      name: 'Amit Sharma',
      email: 'user@braviching.com',
      password: 'password123',
      role: 'User'
    });

    const developer2 = await User.create({
      name: 'Sneha Patel',
      email: 'sarah@braviching.com',
      password: 'password123',
      role: 'User'
    });

    console.log('Seed users created.');

    // Create seed Tasks
    await Task.create([
      {
        title: 'Design DB Schemas',
        description: 'Create and verify MongoDB schemas for Users, Tasks, and Audit Logs.',
        status: 'Completed',
        assignedTo: developer._id,
        assignedBy: admin._id,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2) // 2 days from now
      },
      {
        title: 'Setup API Authentication & Guards',
        description: 'Configure JWT and role restriction middleware on the Express router.',
        status: 'In Progress',
        assignedTo: developer._id,
        assignedBy: manager._id,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4)
      },
      {
        title: 'Implement Dark Glassmorphic Theme',
        description: 'Polish frontend styling using CSS and custom variables to achieve premium look.',
        status: 'Pending',
        assignedTo: developer2._id,
        assignedBy: manager._id,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
    ]);

    console.log('Seed tasks created.');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
