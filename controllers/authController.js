const Student = require('../models/student');
const Admin = require('../models/admin');

exports.studentLogin = async (req, res) => {
  const { rollNumber } = req.body;
  try {
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(400).json({ msg: 'Invalid roll number' });
    }
    res.json({ message: 'Login successful', student });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin || admin.password !== password) {
      return res.status(400).json({ msg: 'Invalid username or password' });
    }
    res.json({ message: 'Login successful', admin });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
