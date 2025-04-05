const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Get all requests
router.get("/", auth, async (req, res) => {
  const requests = await BloodRequest.find({ fulfilled: false }).populate(
    "requestedBy"
  );
  res.json(requests);
});

// Create request
router.post("/", auth, async (req, res) => {
  const { bloodGroup, units, location } = req.body;

  try {
    const request = new BloodRequest({
      userId: req.user.id,
      bloodGroup,
      units,
      location,
    });

    await request.save();

    // find donors (simple: all users except requester)
    const donors = await User.find({ _id: { $ne: req.user.id } });

    for (let donor of donors) {
      await sendEmail(
        donor.email,
        "🚨 Blood Request Alert",
        `Hello ${donor.name},\n\nA new blood request has been made:\n\nBlood Group: ${bloodGroup}\nUnits: ${units}\nLocation: ${location}\n\nPlease login to Life Bridge if you're available to donate.`
      );
    }

    res.status(201).json({ message: "Request submitted and donors notified!" });
  } catch (error) {
    console.error("Error submitting request:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
