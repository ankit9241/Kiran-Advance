const mongoose = require('mongoose');
require('dotenv').config({ path: './config/config.env' });

const listCollections = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n=== Collections ===');
    console.log(collections.map(c => c.name).join('\n'));

    // Check for admin users in each collection that might contain users
    const userCollections = ['users', 'admins', 'students', 'mentors'];
    
    for (const collName of userCollections) {
      if (collections.some(c => c.name === collName)) {
        console.log(`\n=== Checking collection: ${collName} ===`);
        const collection = mongoose.connection.db.collection(collName);
        const users = await collection.find({}).limit(5).toArray();
        
        console.log(`Found ${users.length} users in ${collName}:`);
        users.forEach((user, index) => {
          console.log(`\nUser ${index + 1}:`);
          console.log(`ID: ${user._id}`);
          console.log(`Email: ${user.email || 'No email'}`);
          console.log(`Name: ${user.name || 'No name'}`);
          console.log(`Role: ${user.role || 'No role'}`);
        });
      }
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
};

listCollections();
