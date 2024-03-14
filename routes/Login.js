// loginRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import the User model
const { generateAuthToken } = require('../service/auth');


// POST /api/login
router.post('/', async (req, res) => {
  try {
    // Retrieve username and password from request body
    const { f_userName, f_Pwd } = req.body;

    // Find the user by username
    const user = await User.findOne({ f_userName });

    // Check if user exists
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(f_Pwd, user.f_Pwd);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = await generateAuthToken(user._id);

    // Set the token in a cookie named 'authToken'
    res.cookie('authToken', token, { httpOnly: true }); // Set other options as needed


    // Respond with token and user role
    res.status(200).json({ message: 'Login successful', token: token});
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
