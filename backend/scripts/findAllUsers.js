const mongoose = require('mongoose');
require('dotenv').config();

const findAllUsers = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    // Check each collection for user documents
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`\n=== Checking collection: ${collectionName} ===`);
      
      try {
        const Model = mongoose.models[collectionName] || mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }));
        const docs = await Model.find({}).limit(5).lean();
        
        if (docs.length > 0) {
          console.log(`Found ${docs.length} documents:`);
          docs.forEach((doc, index) => {
            console.log(`\nDocument ${index + 1}:`);
            console.log(JSON.stringify({
              _id: doc._id,
              email: doc.email,
              name: doc.name,
              role: doc.role,
              ...(doc.isApproved !== undefined && { isApproved: doc.isApproved }),
              ...(doc.isActive !== undefined && { isActive: doc.isActive }),
            }, null, 2));
          });
        } else {
          console.log('No documents found');
        }
      } catch (err) {
        console.error(`Error querying collection ${collectionName}:`, err.message);
      }
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.connection.close();
  }
};

findAllUsers();
