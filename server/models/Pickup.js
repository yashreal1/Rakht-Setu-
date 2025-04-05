const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  request: { type: mongoose.Schema.Types.ObjectId, ref: "BloodRequest" },
  date: String,
  time: String,
  location: String,
});

module.exports = mongoose.model("Pickup", pickupSchema);
