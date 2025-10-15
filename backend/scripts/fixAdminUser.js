const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const fixAdminUser = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Get the users collection
    const usersCollection = mongoose.connection.db.collection('users');
    
    // Find the admin user
    const adminEmail = 'ankitkumarjsr2020@gmail.com';
    const adminUser = await usersCollection.findOne({ email: adminEmail });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('\n=== Current Admin User ===');
    console.log(`Name: ${adminUser.name}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Current Role: ${adminUser.role}`);
    
    // Set new password
    const newPassword = 'Admin@123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the user
    await usersCollection.updateOne(
      { _id: adminUser._id },
      {
        $set: {
          password: hashedPassword,
          role: 'admin', // Ensure role is lowercase
          isActive: true,
          lastLogin: new Date()
        }
      }
    );
    
    console.log('\n✅ Admin user updated successfully!');
    console.log('New password:', newPassword);
    console.log('Role set to: admin');
    console.log('\n⚠️ IMPORTANT: Change this password after logging in!');
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.connection.close();
  }
};

fixAdminUser();
