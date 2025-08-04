const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const Pickup = require("../models/Pickup");
const BloodRequest = require("../models/BloodRequest");

// Get user profile
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/", auth, async (req, res) => {
  try {
    const {
      name,
      age,
      bloodGroup,
      location,
      phone,
      gender,
      weight,
      lastDonation,
      medicalConditions,
      bio,
      preferences
    } = req.body;

    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (age) profileFields.age = age;
    if (bloodGroup) profileFields.bloodGroup = bloodGroup;
    if (location) profileFields.location = location;
    if (phone) profileFields.phone = phone;
    if (gender) profileFields.gender = gender;
    if (weight) profileFields.weight = weight;
    if (lastDonation) profileFields.lastDonation = lastDonation;
    if (medicalConditions) profileFields.medicalConditions = medicalConditions;
    if (bio) profileFields.bio = bio;
    if (preferences) profileFields.preferences = preferences;

    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload profile image
router.post("/image", auth, async (req, res) => {
  try {
    const { profileImage } = req.body;

    if (!profileImage) {
      return res.status(400).json({ message: "No image provided" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { profileImage } },
      { new: true }
    ).select("-password");

    res.json({ profileImage: user.profileImage });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user donation history
router.get("/donations", auth, async (req, res) => {
  try {
    const donations = await Pickup.find({ donor: req.user.id })
      .populate({
        path: "request",
        populate: { path: "requestedBy", select: "name hospital" }
      })
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error("Error fetching donation history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user blood requests (for recipients)
router.get("/requests", auth, async (req, res) => {
  try {
    const requests = await BloodRequest.find({ requestedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching blood requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user statistics
router.get("/stats", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let stats = {};

    if (user.role === "donor") {
      // Get donation count
      const donationCount = await Pickup.countDocuments({ 
        donor: req.user.id,
        status: "completed"
      });

      // Get pending donations
      const pendingDonations = await Pickup.countDocuments({ 
        donor: req.user.id,
        status: "scheduled"
      });

      // Calculate impact (assuming each donation helps 3 people)
      const livesImpacted = donationCount * 3;

      stats = {
        donationCount,
        pendingDonations,
        livesImpacted
      };
    } else if (user.role === "recipient") {
      // Get total requests
      const totalRequests = await BloodRequest.countDocuments({ 
        requestedBy: req.user.id 
      });

      // Get fulfilled requests
      const fulfilledRequests = await BloodRequest.countDocuments({ 
        requestedBy: req.user.id,
        fulfilled: true
      });

      // Get active requests
      const activeRequests = await BloodRequest.countDocuments({ 
        requestedBy: req.user.id,
        fulfilled: false
      });

      stats = {
        totalRequests,
        fulfilledRequests,
        activeRequests
      };
    }

    res.json(stats);
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get public profile of a user
router.get("/public/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "name bloodGroup role location bio profileImage donationCount badges createdAt preferences"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only include contact info if user has allowed it in privacy settings
    const publicProfile = {
      name: user.name,
      bloodGroup: user.bloodGroup,
      role: user.role,
      location: {
        address: user.location?.address
      },
      bio: user.bio,
      profileImage: user.profileImage,
      donationCount: user.donationCount,
      badges: user.badges,
      memberSince: user.createdAt
    };

    // Add contact info if user has allowed it
    if (user.preferences?.privacySettings?.showContactInfo) {
      publicProfile.email = user.email;
      publicProfile.phone = user.phone;
    }

    res.json(publicProfile);
  } catch (error) {
    console.error("Error fetching public profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;