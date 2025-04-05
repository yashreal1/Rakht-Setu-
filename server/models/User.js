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
});

module.exports = mongoose.model("User", userSchema);
