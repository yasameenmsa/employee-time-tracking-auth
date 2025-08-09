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

    // Create test users
    const testUsers = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 12),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('secret123', 12),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('test123', 12),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const result = await usersCollection.insertMany(testUsers);
    console.log(`Inserted ${result.insertedCount} users`);
    
    console.log('\nTest users created:');
    console.log('Username: admin, Password: password123');
    console.log('Username: user1, Password: secret123');
    console.log('Username: testuser, Password: test123');

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await client.close();
    console.log('\nDisconnected from MongoDB');
  }
}

seedUsers();