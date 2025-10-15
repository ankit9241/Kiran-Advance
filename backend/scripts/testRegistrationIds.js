const mongoose = require('mongoose');
const { generateNextId } = require('../utils/idGenerator');
require('dotenv').config({ path: './config/config.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB Connected');
  testIdGeneration();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function testIdGeneration() {
  try {
    console.log('Testing registration ID generation...');
    
    // Test student ID generation
    const studentId1 = await generateNextId('student');
    const studentId2 = await generateNextId('student');
    console.log('Student IDs:', { studentId1, studentId2 });
    
    // Test mentor ID generation
    const mentorId1 = await generateNextId('mentor');
    const mentorId2 = await generateNextId('mentor');
    console.log('Mentor IDs:', { mentorId1, mentorId2 });
    
    // Verify format
    const studentRegex = /^STU\d{8}$/;
    const mentorRegex = /^MEN\d{8}$/;
    
    console.log('\nTest Results:');
    console.log('Student ID 1 format valid:', studentRegex.test(studentId1));
    console.log('Student ID 2 format valid:', studentRegex.test(studentId2));
    console.log('Mentor ID 1 format valid:', mentorRegex.test(mentorId1));
    console.log('Mentor ID 2 format valid:', mentorRegex.test(mentorId2));
    console.log('Student IDs are sequential:', parseInt(studentId2.slice(-4)) > parseInt(studentId1.slice(-4)));
    console.log('Mentor IDs are sequential:', parseInt(mentorId2.slice(-4)) > parseInt(mentorId1.slice(-4)));
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing ID generation:', error);
    process.exit(1);
  }
}
