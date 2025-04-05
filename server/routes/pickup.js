const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Pickup = require("../models/Pickup");
const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Schedule a new pickup
router.post("/", auth, async (req, res) => {
  try {
    const { requestId, date, time, location } = req.body;

    // Validate request body
    if (!requestId || !date || !time || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get blood request and donor details
    const bloodRequest = await BloodRequest.findById(requestId).populate('requestedBy');
    const donor = await User.findById(req.user.id);

    if (!bloodRequest || !donor) {
      return res.status(404).json({ message: "Request or donor not found" });
    }

    const pickup = new Pickup({
      donor: req.user.id,
      request: requestId,
      date,
      time,
      location,
    });

    await pickup.save();

    // Validate email addresses
    const requesterEmail = bloodRequest.requestedBy?.email;
    const donorEmail = donor?.email;

    if (!requesterEmail || !donorEmail) {
      console.error('Missing email addresses:', { requesterEmail, donorEmail });
      return res.status(400).json({ message: 'Invalid email addresses' });
    }

    try {
      // Send email to requester
      const requesterSubject = "Blood Donation Pickup Scheduled";
      const requesterText = `Dear ${bloodRequest.requestedBy.name},

Good news! A donor has scheduled a pickup for your blood request.

Details:
Blood Group: ${bloodRequest.bloodGroup}
Pickup Date: ${date}
Pickup Time: ${time}
Pickup Location: ${location}

Donor Name: ${donor.name}

Thank you for using Life Bridge!
`;

      await sendEmail(requesterEmail, requesterSubject, requesterText);

      // Send confirmation email to donor
      const donorSubject = "Blood Donation Pickup Confirmation";
      const donorText = `Dear ${donor.name},

Thank you for scheduling a blood donation pickup!

Details:
Blood Group: ${bloodRequest.bloodGroup}
Pickup Date: ${date}
Pickup Time: ${time}
Pickup Location: ${location}

Recipient Hospital: ${bloodRequest.requestedBy.hospital}

Thank you for your generosity!
`;

      await sendEmail(donorEmail, donorSubject, donorText);
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      return res.status(500).json({ message: 'Error sending notification emails' });
    }

    res.status(201).json({ message: "Pickup scheduled", pickup });
  } catch (error) {
    console.error("Error scheduling pickup:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    } else if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid request ID" });
    }
    res.status(500).json({ message: "Error scheduling pickup" });
  }
});

// Get user's donation history
router.get("/user", auth, async (req, res) => {
  try {
    const pickups = await Pickup.find({ donor: req.user.id })
      .populate({
        path: 'request',
        populate: { path: 'requestedBy' },
        options: { retainNullValues: true }
      })
      .sort({ date: -1 });

    if (!pickups) {
      return res.status(404).json({ message: 'No donations found' });
    }

    // Transform the data for the frontend
    const donations = pickups.map(pickup => {
      const request = pickup.request || {};
      const requestedBy = request.requestedBy || {};
      return {
        _id: pickup._id || null,
        date: pickup.date || 'Unknown',
        time: pickup.time || 'Unknown',
        location: pickup.location || 'Unknown',
        bloodGroup: request.bloodGroup || 'Unknown',
        units: request.units || 1,
        recipient: {
          name: requestedBy.name || 'Unknown',
          hospital: requestedBy.hospital || 'Unknown'
        },
        status: pickup.status || 'Unknown'
      };
    });

    res.json(donations);
  } catch (err) {
    console.error('Error fetching donation history:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
