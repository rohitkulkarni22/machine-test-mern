// service/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const generateAuthToken = async (userId) => {
  try {
    // Generate a JWT token with the user ID as the payload
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' }); // You can set the token expiry time as per your requirements
    return token;
  } catch (error) {
    throw new Error('Failed to generate auth token');
  }
};

const verifyAuthToken = async (token) => {
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid auth token');
  }
};

const authenticateUser = async (f_userName, f_Pwd) => {
  try {
    // Find the user by username
    const user = await User.findOne({ f_userName });
    if (!user) {
      throw new Error('User not found');
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(f_Pwd, user.f_Pwd);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    // If authentication is successful, return the user object
    return user;
  } catch (error) {
    throw new Error('Authentication failed');
  }
};

module.exports = { generateAuthToken, verifyAuthToken, authenticateUser };
