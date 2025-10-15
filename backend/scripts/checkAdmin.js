const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const Admin = require('../models/Admin');

const checkAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');

    // Find all admin users
    const admins = await Admin.find({}).select('email name role createdAt lastLogin');
    
    if (admins.length === 0) {
      console.log('No admin users found in the database.');
      return;
    }

    console.log('\n=== Admin Users ===');
    admins.forEach((admin, index) => {
      console.log(`\nAdmin #${index + 1}:`);
      console.log(`  ID: ${admin._id}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Name: ${admin.name || 'Not set'}`);
      console.log(`  Role: ${admin.role}`);
      console.log(`  Created: ${admin.createdAt}`);
      console.log(`  Last Login: ${admin.lastLogin || 'Never logged in'}`);
    });

    // Find users by role (case-sensitive check)
    console.log('\n=== Users by Role (case-sensitive) ===');
    const roles = ['admin', 'Admin', 'ADMIN'];
    for (const role of roles) {
      const users = await Admin.find({ role });
      console.log(`\nUsers with role '${role}': ${users.length}`);
      users.forEach(user => {
        console.log(`- ${user.email} (${user._id})`);
      });
    }

    // Check if we can find a user by email
    const testEmail = 'admin@example.com'; // Replace with the email you're trying to log in with
    const userByEmail = await Admin.findOne({ email: testEmail });
    console.log('\n=== User by Email ===');
    if (userByEmail) {
      console.log(`Found user with email ${testEmail}:`);
      console.log(`  ID: ${userByEmail._id}`);
      console.log(`  Name: ${userByEmail.name}`);
      console.log(`  Role: ${userByEmail.role}`);
      console.log(`  Password set: ${!!userByEmail.password}`);
    } else {
      console.log(`No user found with email: ${testEmail}`);
    }

  } catch (err) {
    console.error('Error checking admin users:', err.message);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

checkAdmin();
