const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://23bt04201_db_user:dhruvi19@cluster0.lxgu7qk.mongodb.net/?appName=Cluster0';

async function approveOrgs() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // We can't easily import the model since it's TypeScript, so we just use the raw collection
    const db = mongoose.connection.db;
    const orgs = db.collection('organizations');
    
    const result = await orgs.updateMany({}, { $set: { status: 'approved' } });
    console.log(`Successfully approved ${result.modifiedCount} organizations.`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

approveOrgs();
