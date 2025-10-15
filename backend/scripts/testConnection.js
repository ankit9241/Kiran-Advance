const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGO_URI ? 'Found' : 'Not found');
    
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not set in .env file');
      return;
    }

    console.log('\nAttempting to connect to MongoDB...');
    
    // Set up event listeners
    mongoose.connection.on('connecting', () => {
      console.log('Connecting to MongoDB...');
    });
    
    mongoose.connection.on('connected', () => {
      console.log('✅ Successfully connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
    // Attempt connection
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    });
    
    // If we get here, connection was successful
    console.log('\n✅ Successfully connected to MongoDB database:', mongoose.connection.name);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    console.log(collections.map(c => `- ${c.name}`).join('\n') || 'No collections found');
    
  } catch (err) {
    console.error('\n❌ Connection failed:', err.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Verify your MongoDB server is running');
    console.log('2. Check if the connection string is correct');
    console.log('3. If using MongoDB Atlas, ensure your IP is whitelisted');
    console.log('4. Check your internet connection');
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

testConnection();
