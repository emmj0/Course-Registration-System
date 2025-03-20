// seed.js
const mongoose = require('mongoose');
const Student = require('./models/student');
const admin = require('./models/admin');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/courseRegistrationDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedDB = async () => {
  await connectDB();
  await admin.deleteMany({}); // Clear existing admin data


  const SampleAdmins = [
    { username: 'admin', password: 'admin' },
  ];

  await admin.insertMany(SampleAdmins);
  console.log('Sample student data seeded successfully');
  console.log('Sample admin data seeded successfully');
  process.exit(0);
};

seedDB();