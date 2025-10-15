const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const listUsers = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Get the users collection
    const usersCollection = mongoose.connection.db.collection('users');
    
    // Find all users
    const users = await usersCollection.find({}).toArray();
    
    if (users.length === 0) {
      console.log('No users found in the database.');
      return;
    }

    console.log(`\n=== Found ${users.length} users ===`);
    
    users.forEach((user, index) => {
      console.log(`\nUser #${index + 1}:`);
      console.log(`ID: ${user._id}`);
      console.log(`Name: ${user.name || 'Not set'}`);
      console.log(`Email: ${user.email || 'Not set'}`);
      console.log(`Role: ${user.role || 'Not set'}`);
      console.log(`Active: ${user.isActive !== false ? 'Yes' : 'No'}`);
      if (user.role === 'mentor') {
        console.log(`Approved: ${user.isApproved ? 'Yes' : 'No'}`);
      }
      console.log(`Created: ${user.createdAt || 'Unknown'}`);
      console.log(`Last Login: ${user.lastLogin || 'Never'}`);
    });

    // Check for admin users
    const adminUsers = users.filter(user => user.role === 'admin');
    console.log(`\n=== Found ${adminUsers.length} admin users ===`);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.connection.close();
  }
};

listUsers();
