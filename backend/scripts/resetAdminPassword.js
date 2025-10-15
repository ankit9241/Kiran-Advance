const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config({ path: '../.env' });

const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Admin details
    const adminEmail = 'admin@example.com';
    const newPassword = 'admin123';

    // Check if admin exists
    let admin = await Admin.findOne({ email: adminEmail });

    if (!admin) {
      console.log('No admin found with email:', adminEmail);
      console.log('Creating new admin user...');
      
      // Create new admin
      admin = new Admin({
        name: 'Admin User',
        email: adminEmail,
        password: newPassword,
        role: 'admin',
        isApproved: true
      });
    } else {
      console.log('Found existing admin:', admin.email);
      console.log('Current role:', admin.role);
      
      // Update password
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(newPassword, salt);
    }

    // Save admin
    await admin.save();
    console.log('\n✅ Admin user has been updated/created successfully!');
    console.log('Email:', admin.email);
    console.log('Password:', newPassword);
    console.log('Role:', admin.role);
    console.log('\n⚠️ IMPORTANT: Change this password after logging in!');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
};

resetAdminPassword();
