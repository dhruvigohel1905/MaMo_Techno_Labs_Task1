const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://23bt04201_db_user:dhruvi19@cluster0.lxgu7qk.mongodb.net/?appName=Cluster0';

async function setupOrg() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const users = db.collection('users');
    const orgs = db.collection('organizations');
    
    // Find an organizer user
    const user = await users.findOne({ role: 'organizer' });
    if (!user) {
      console.log('No organizer user found! Cannot create org.');
      process.exit(1);
    }
    
    console.log(`Found organizer: ${user.firstName} ${user.lastName}`);
    
    // Create an organization
    const orgData = {
      name: "Dhruvi's Event Company",
      description: "A cool test organization",
      type: "corporate",
      email: user.email,
      website: "https://example.com",
      admin: user._id,
      status: "approved", // auto-approve it!
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const orgInsert = await orgs.insertOne(orgData);
    
    // Link org to user
    await users.updateOne(
      { _id: user._id },
      { $set: { organization: orgInsert.insertedId } }
    );
    
    console.log(`Successfully created and approved organization for ${user.firstName}!`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

setupOrg();
