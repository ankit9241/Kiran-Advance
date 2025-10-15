require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const createAdminUser = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Admin user data (role is set automatically by the Admin model)
    const adminData = {
      name: 'Admin User',
      email: 'ankitkumarjsr2020@gmail.com',
      password: 'aaaaaa',
      phone: '+1234567890',
      department: 'management',
      permissions: [
        'manage_users',
        'manage_content', 
        'manage_settings',
        'view_analytics',
        'manage_payments'
      ],
      canImpersonate: true,
      isActive: true
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', adminData.email);
      console.log('Deleting existing admin user...');
      await Admin.deleteOne({ email: adminData.email });
      console.log('✅ Existing admin user deleted');
    }

    // Create new admin user (password will be hashed automatically by the User model)
    const newAdmin = new Admin(adminData);
    await newAdmin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', newAdmin.email);
    console.log('🔑 Password: aaaaaa');
    console.log('👤 Role:', newAdmin.role);
    console.log('🆔 ID:', newAdmin._id);
    console.log('📱 Phone:', newAdmin.phone);
    console.log('🏢 Department:', newAdmin.department);
    console.log('🔐 Permissions:', newAdmin.permissions);

    // Test login to verify the user was created correctly
    const testAdmin = await Admin.findOne({ email: newAdmin.email }).select('+password');
    if (testAdmin) {
      const isPasswordMatch = await testAdmin.matchPassword('aaaaaa');
      console.log('🔍 Password verification:', isPasswordMatch ? '✅ SUCCESS' : '❌ FAILED');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

// Run the script
createAdminUser();