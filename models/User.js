const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  f_userName: { type: String, required: true },
  f_Pwd: { type: String, required: true },
  role: { type: String, enum: ['employee', 'admin'] } // No default role set
});

userSchema.pre('validate', function(next) {
  if (!this.role) {
    console.log('Please specify role');
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
