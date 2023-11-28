const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
    minlength: 6,

  },
  password: {
    type: String,
    required: true,
    maxlength: 255,
    minlength: 6,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

 
const User = mongoose.model('User', userSchema);

module.exports = User;
