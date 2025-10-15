const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const os = require('os');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xss());

// Prevent http param pollution
app.use(hpp());

// Enable CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parser
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: process.env.MAX_FILE_UPLOAD || 5 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: os.tmpdir(),
  safeFileNames: true,
  preserveExtension: 4,
}));

// Make uploads directory publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Import routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/roles/studentRoutes');

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);

// Error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('Route:', req.method, req.url);
  console.error('Headers:', req.headers);
  
  res.status(500).json({
    success: false,
    error: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Import all models
const User = require('./models/base/User');
const Student = require('./models/Student');
const Mentor = require('./models/Mentor');
const Admin = require('./models/Admin');
const Doubt = require('./models/Doubt');
const Feedback = require('./models/Feedback');
const Material = require('./models/Material');
const Meeting = require('./models/Meeting');
const Notification = require('./models/Notification');

// Test route to create sample data for all models
app.get('/test', async (req, res) => {
    try {
        // Create test student if doesn't exist
        let user = await Student.findOne({ email: 'student@example.com' });
        
        if (!user) {
            user = await Student.create({
                name: 'Test Student',
                email: 'student@example.com',
                password: 'test1234',
                grade: '10',
                school: 'Test School',
                subjects: ['Mathematics', 'Physics']
            });
            console.log('Test student created');
        }

        // Create sample doubt
        const doubt = await Doubt.create({
            title: 'Sample Doubt',
            description: 'This is a sample doubt',
            subject: 'Mathematics',
            user: user._id,
            status: 'pending'  // Changed from 'open' to 'pending' to match enum values in Doubt model
        });
        console.log('Sample doubt created');

        // Create a tutor user for the feedback
        let tutor = await User.findOne({ email: 'tutor@example.com' });
        
        if (!tutor) {
            tutor = await User.create({
                name: 'Sample Tutor',
                email: 'tutor@example.com',
                password: 'tutor1234',
                role: 'tutor'
            });
            console.log('Tutor user created');
        }

        // Create sample feedback
        await Feedback.create({
            user: user._id,
            tutor: tutor._id,  // Added required tutor field
            rating: 5,
            comment: 'Great help!',
            doubt: doubt._id
        });
        console.log('Sample feedback created');

        // Create sample material
        await Material.create({
            title: 'Sample Material',
            description: 'This is a sample study material',
            subject: 'Mathematics',
            fileUrl: 'https://example.com/uploads/sample.pdf',
            fileType: 'pdf',
            fileSize: 1024, // 1KB in bytes
            uploadedBy: user._id
        });
        console.log('Sample material created');

        // Create sample meeting
        await Meeting.create({
            title: 'Sample Meeting',
            description: 'This is a sample meeting',
            startTime: new Date(),
            endTime: new Date(Date.now() + 3600000), // 1 hour later
            participants: [user._id],
            createdBy: user._id
        });
        console.log('Sample meeting created');

        // Create sample notification
        await Notification.create({
            user: user._id,
            message: 'Welcome to Kiran Mentorship!',
            type: 'welcome'
        });
        console.log('Sample notification created');

        res.json({
            success: true,
            message: 'Sample data created successfully',
            data: {
                user: user._id,
                doubt: doubt._id
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
