const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  jobRequests: [
    {
      date: { type: Date, default: Date.now },
      jobTitle: String,
    },
  ],
  streak: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', userSchema);