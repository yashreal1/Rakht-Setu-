const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Pickup = require("../models/Pickup");
const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");

// Schedule a new pickup
router.post("/", auth, async (req, res) => {
  const { requestId, date, time, location } = req.body;

  const pickup = new Pickup({
    donor: req.user.id,
    request: requestId,
    date,
    time,
    location,
  });

  await pickup.save();
  res.status(201).json({ message: "Pickup scheduled", pickup });
});

// Get user's donation history
router.get("/user", auth, async (req, res) => {
  try {
    const pickups = await Pickup.find({ donor: req.user.id })
      .populate({
        path: 'request',
        populate: { path: 'requestedBy' }
      })
      .sort({ date: -1 });

    // Transform the data for the frontend
    const donations = pickups.map(pickup => {
      const request = pickup.request;
      return {
        _id: pickup._id,
        date: pickup.date,
        time: pickup.time,
        location: pickup.location,
        bloodGroup: request ? request.bloodGroup : 'Unknown',
        units: request ? request.units : 1,
        recipient: request && request.requestedBy ? {
          name: request.requestedBy.name,
          hospital: request.requestedBy.hospital
        } : { name: 'Unknown' },
        status: 'completed' // You might want to add a status field to your Pickup model
      };
    });

    res.json(donations);
  } catch (err) {
    console.error('Error fetching donation history:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
