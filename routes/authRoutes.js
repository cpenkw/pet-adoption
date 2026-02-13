const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateRequest, registerSchema, loginSchema } = require('../middleware/validation');

// @route   POST /api/auth/register
router.post('/register', validateRequest(registerSchema), register);

// @route   POST /api/auth/login
router.post('/login', validateRequest(loginSchema), login);

module.exports = router;