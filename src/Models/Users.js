
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  userType: String,
  password: String,
  city: String,
  pinCode: Number
});

const User = mongoose.model('User', userSchema);

module.exports = User;
