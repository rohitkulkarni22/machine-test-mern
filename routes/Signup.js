// signupRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { generateAuthToken } = require('../service/auth');
const User = require('../models/User'); // Import the User model


// POST /api/signup
router.post('/', async (req, res) => {
  try {
    // Extract user data from request body
    const { f_userName, f_Pwd, role } = req.body;

    // Check if user with the same username already exists
    const existingUser = await User.findOne({ f_userName });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(f_Pwd, 10); // Use bcrypt to hash the password

    // Create a new user with hashed password
    const newUser = new User({
      f_userName,
      f_Pwd: hashedPassword, // Save the hashed password to the database
      role,
    });

    // Save the new user to the database
    await newUser.save();
    
    // Generate JWT token
    const token = await generateAuthToken(newUser._id);

    // Set the token in a cookie named 'authToken'
    res.cookie('authToken', token, { httpOnly: true }); // Set other options as needed


    // Respond with success message
    res.status(201).json({ message: 'User registered successfully', token: token});
  } catch (error) {
    console.error('Error during sign up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
