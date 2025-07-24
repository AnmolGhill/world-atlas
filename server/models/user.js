

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 17,
    max: 45
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
    // Removed `select: false` ✅
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'users'
});

module.exports = mongoose.model('User', userSchema);


