
const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env",
});

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mern-1.s4kbaw5.mongodb.net/`;
async function connectToMongoDB() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = { connectToMongoDB };