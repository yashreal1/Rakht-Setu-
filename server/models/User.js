const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  age: Number,
  bloodGroup: String,
  role: { type: String, enum: ["donor", "recipient"], required: true },
  location: {
    type: { lat: Number, lng: Number },
    address: String,
  },
  // Enhanced profile fields
  phone: { type: String, default: "" },
  gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
  weight: { type: Number, min: 0 },
  lastDonation: { type: Date },
  medicalConditions: [String],
  profileImage: { type: String, default: "" },
  bio: { type: String, default: "" },
  preferences: {
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    privacySettings: {
      showContactInfo: { type: Boolean, default: false },
      showDonationHistory: { type: Boolean, default: true },
    }
  },
  donationCount: { type: Number, default: 0 },
  badges: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
