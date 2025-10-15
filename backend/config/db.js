const mongoose = require('mongoose');
require('dotenv').config();

// Disable debug mode for cleaner output
mongoose.set('debug', false);

const connectDB = async () => {
  // Set up connection event handlers first
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });
  
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  // Connection options
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    socketTimeoutMS: 45000, // 45 seconds socket timeout
    retryWrites: true,
    w: 'majority'
  };

  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB connection string is not defined in environment variables');
    }
    
    // Attempt connection with minimal logging
    const connection = await mongoose.connect(process.env.MONGO_URI, options);
    return connection.connection;
    
  } catch (err) {
    // Enhanced error handling
    console.error('MongoDB connection failed!');
    console.error('Error name:', err.name);
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    
    // Check common issues
    if (err.name === 'MongooseServerSelectionError') {
      console.error('\nPossible causes:');
      console.error('- Incorrect connection string');
      console.error('- Network connectivity issues');
      console.error('- MongoDB server not running');
      console.error('- Incorrect credentials');
      console.error('- IP not whitelisted in MongoDB Atlas (if using Atlas)');
    }
    
    console.error('\nTroubleshooting tips:');
    console.log('- Verify your MongoDB server is running');
    console.log('- Check your connection string in .env file');
    console.log('- If using MongoDB Atlas, ensure your IP is whitelisted');
    console.log('- Check your internet connection');
    
    // Exit with error code
    process.exit(1);
  }
};

module.exports = connectDB;
