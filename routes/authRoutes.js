const express = require('express');
const { studentLogin, adminLogin } = require('../controllers/authController');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('auth/login');
});
router.post('/student/login', studentLogin);
router.post('/admin/login', adminLogin);

module.exports = router;