const express = require('express');
const { addCourse, getCourses, updateCourse, deleteCourse, getStudents, overrideRegistration, adjustSeats, getReports } = require('../controllers/adminController');
const router = express.Router();

router.post('/addCourse', addCourse);
router.get('/getCourse', getCourses);
router.put('/updateCourse/:id', updateCourse);
router.delete('/deleteCourse/:id', deleteCourse);
router.get('/getStudents', getStudents);
router.post("/registerStudent", overrideRegistration);
router.put('/adjustSeats/:courseId', adjustSeats);
router.get('/getReports', getReports);

module.exports = router;