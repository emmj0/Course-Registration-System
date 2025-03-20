// seedCourses.js
const mongoose = require('mongoose');
const Course = require('./models/course');

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
  await Course.deleteMany({}); // Clear existing course data

  // Define sample courses
  const sampleCourses = [
    { name: 'Introduction to Programming', department: 'Computer Science', level: 'Intermediate', time: '9:00 AM - 10:00 AM', days: 'MWF', seats: 30 },
    { name: 'Data Structures', department: 'Computer Science', level: 'Basic', time: '10:00 AM - 11:00 AM', days: 'TTh', seats: 25 },
    { name: 'Algorithms', department: 'Computer Science', level: 'Extreme', time: '11:00 AM - 11:30 AM', days: 'MWF', seats: 20 },
    { name: 'Database Systems', department: 'Computer Science', level: 'Basic', time: '1:00 PM - 2:00 PM', days: 'TTh', seats: 25 },
    { name: 'Operating Systems', department: 'Computer Science', level: 'Intermediate', time: '2:00 PM - 2:30 PM', days: 'MWF', seats: 30 },
  ];

  // Insert sample courses into the database
  const courses = await Course.insertMany(sampleCourses);

  // Define prerequisites for some courses
  const dataStructures = courses.find(course => course.name === 'Data Structures');
  const algorithms = courses.find(course => course.name === 'Algorithms');
  const databaseSystems = courses.find(course => course.name === 'Database Systems');
  const operatingSystems = courses.find(course => course.name === 'Operating Systems');

  // Set prerequisites
  await Course.findByIdAndUpdate(dataStructures._id, {
    $set: { prerequisites: [courses[0]._id] } // Data Structures requires Introduction to Programming
  });

  await Course.findByIdAndUpdate(algorithms._id, {
    $set: { prerequisites: [dataStructures._id] } // Algorithms requires Data Structures
  });

  await Course.findByIdAndUpdate(databaseSystems._id, {
    $set: { prerequisites: [dataStructures._id] } // Database Systems requires Data Structures
  });

  await Course.findByIdAndUpdate(operatingSystems._id, {
    $set: { prerequisites: [algorithms._id] } // Operating Systems requires Algorithms
  });

  console.log('Sample course data seeded successfully');
  process.exit(0);
};

seedDB();