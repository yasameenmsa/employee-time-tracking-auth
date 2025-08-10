const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function seedUsers() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('calculate_auth');
    const usersCollection = db.collection('users');

    // Clear existing users (optional)
    await usersCollection.deleteMany({});
    console.log('Cleared existing users');

    // Create test users with roles
    const testUsers = [
      // Admin users
      {
        username: 'admin',
        email: 'admin@company.com',
        password: await bcrypt.hash('admin123', 12),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'احمد_المدير',
        email: 'ahmed.admin@company.com',
        password: await bcrypt.hash('admin456', 12),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // HR users
      {
        username: 'hr_manager',
        email: 'hr@company.com',
        password: await bcrypt.hash('hr123', 12),
        role: 'HR',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'فاطمة_الموارد',
        email: 'fatima.hr@company.com',
        password: await bcrypt.hash('hr456', 12),
        role: 'HR',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'سارة_التوظيف',
        email: 'sara.hr@company.com',
        password: await bcrypt.hash('hr789', 12),
        role: 'HR',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Employee users
      {
        username: 'employee1',
        email: 'emp1@company.com',
        password: await bcrypt.hash('emp123', 12),
        role: 'employees',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'محمد_الموظف',
        email: 'mohammed.emp@company.com',
        password: await bcrypt.hash('emp456', 12),
        role: 'employees',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'علي_المطور',
        email: 'ali.dev@company.com',
        password: await bcrypt.hash('emp789', 12),
        role: 'employees',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'نور_المحاسبة',
        email: 'nour.acc@company.com',
        password: await bcrypt.hash('emp101', 12),
        role: 'employees',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const result = await usersCollection.insertMany(testUsers);
    console.log(`Inserted ${result.insertedCount} users`);
    
    console.log('\nTest users created:');
    console.log('\n=== ADMIN USERS ===');
    console.log('Username: admin, Password: admin123, Role: admin');
    console.log('Username: احمد_المدير, Password: admin456, Role: admin');
    console.log('\n=== HR USERS ===');
    console.log('Username: hr_manager, Password: hr123, Role: HR');
    console.log('Username: فاطمة_الموارد, Password: hr456, Role: HR');
    console.log('Username: سارة_التوظيف, Password: hr789, Role: HR');
    console.log('\n=== EMPLOYEE USERS ===');
    console.log('Username: employee1, Password: emp123, Role: employees');
    console.log('Username: محمد_الموظف, Password: emp456, Role: employees');
    console.log('Username: علي_المطور, Password: emp789, Role: employees');
    console.log('Username: نور_المحاسبة, Password: emp101, Role: employees');

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

seedUsers();