// server/models/BloodRequest.js

const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
  bloodGroup: { type: String, required: true },
  units: { type: Number, required: true },
  location: { 
    address: { type: String, required: true },
    coordinates: { 
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  fulfilled: { type: Boolean, default: false },
  // Enhanced request fields
  urgency: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
  patientName: { type: String },
  patientAge: { type: Number },
  patientGender: { type: String, enum: ["male", "female", "other", ""], default: "" },
  hospitalName: { type: String },
  purpose: { type: String },
  notes: { type: String },
  contactPhone: { type: String },
  expiresAt: { type: Date },
  status: { type: String, enum: ["active", "fulfilled", "expired", "cancelled"], default: "active" },
  donors: [{
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    donationDate: { type: Date },
    units: { type: Number, default: 1 }
  }],
  viewCount: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
