const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://ankitkumarjsr2020:ankitkumar%401234@kiran.ybb11xp.mongodb.net/Kiran?retryWrites=true&w=majority&appName=Kiran';
mongoose.connect(mongoUri);

const Student = require('./models/Student');

async function createTestStudent() {
  try {
    console.log('🔍 Creating/updating test student account...');
    
    const studentEmail = 'adityasinghofficial296@gmail.com';
    const newPassword = 'student123'; // Simple test password
    
    // Check if student exists
    let student = await Student.findOne({ email: studentEmail });
    
    if (student) {
      console.log('✅ Student found, updating password...');
      
      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      student.password = hashedPassword;
      await student.save();
      
      console.log('✅ Password updated successfully!');
    } else {
      console.log('❌ Student not found, creating new student...');
      
      // Create new student
      student = await Student.create({
        name: 'Aditya Singh',
        email: studentEmail,
        password: newPassword, // Will be hashed by the pre-save middleware
        stream: 'Science',
        studentClass: '11',
        dateOfBirth: new Date('2006-09-11'),
        gender: 'male',
        phone: '+916485687985',
        bio: 'i am the best',
        address: {
          street: '',
          city: 'Jamshedpur',
          state: 'Jharkhand',
          country: 'India',
          pincode: '832108'
        },
        schoolCollegeName: 'Jusco',
        board: 'ICSE',
        preferredSubjects: ['Phy', 'chem', 'math'],
        learningGoals: '',
        targetExam: 'Jee, Neet',
        targetExams: ['Jee', 'Neet'],
        hobbies: [],
        emergencyContact: {
          name: '',
          relation: '',
          phone: ''
        }
      });
      
      console.log('✅ New student created successfully!');
    }
    
    console.log('\n🎯 Login Credentials:');
    console.log('📧 Email:', studentEmail);
    console.log('🔑 Password:', newPassword);
    
    console.log('\n📋 Student Details:');
    console.log('- ID:', student._id);
    console.log('- Student ID:', student.studentId);
    console.log('- Name:', student.name);
    console.log('- Stream:', student.stream);
    console.log('- Class:', student.studentClass);
    
    console.log('\n✅ You can now login with these credentials!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

createTestStudent();