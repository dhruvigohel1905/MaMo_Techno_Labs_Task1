import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './modules/user/user.model';
import { env } from './config/env';

dotenv.config();

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ email: 'admin@eventhub.com' });
    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    await User.create({
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@eventhub.com',
      password: 'password123',
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@eventhub.com');
    console.log('Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
