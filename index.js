// index.js
const { app } = require("./App");
const { connectToMongoDB } = require("./db/mongoDB");
const dotenv = require('dotenv');
const express = require('express');

dotenv.config({
  path: "./.env",
});

connectToMongoDB(); 

const PORT = process.env.PORT; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
