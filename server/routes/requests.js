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
  try {
    const { bloodGroup, units, location } = req.body;

    // Validate required fields with detailed error messages
    const missingFields = [];
    if (!bloodGroup) missingFields.push('bloodGroup');
    if (!units) missingFields.push('units');
    if (!location) missingFields.push('location');

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        fields: missingFields
      });
    }

    // Validate blood group format
    const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({
        message: "Invalid blood group",
        validGroups: validBloodGroups
      });
    }

    // Validate units with type checking
    const unitsNum = Number(units);
    if (isNaN(unitsNum) || !Number.isInteger(unitsNum) || unitsNum <= 0) {
      return res.status(400).json({
        message: "Invalid units value",
        details: "Units must be a positive integer"
      });
    }

    // Validate location length
    if (typeof location !== 'string' || location.trim().length < 3) {
      return res.status(400).json({
        message: "Invalid location",
        details: "Location must be a string with at least 3 characters"
      });
    }

    const request = new BloodRequest({
      requestedBy: req.user._id,
      bloodGroup,
      units,
      location,
    });

    await request.save();

    // find donors (simple: all users except requester)
    const donors = await User.find({ _id: { $ne: req.user._id } });

    const donationUrl = `http://localhost:3000/donate/${request._id}`;
    const emailPromises = donors.map(donor => 
      sendEmail(
        donor.email,
        "🚨 Blood Request Alert",
        `Hello ${donor.name},

A new blood request has been made:

Blood Group: ${bloodGroup}
Units: ${units}
Location: ${location}

If you're available to donate, please click the link below:
${donationUrl}

Your contribution can save a life!

Best regards,
Life Bridge Team`
      )
    );

    await Promise.all(emailPromises);

    res.status(201).json({ 
      message: "Request submitted and donors notified!",
      request: await BloodRequest.findById(request._id).populate('requestedBy')
    });
  } catch (error) {
    console.error("Error submitting request:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
