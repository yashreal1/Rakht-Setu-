const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { DonationStatistics, UserActivity, RequestStatistics, SystemPerformance } = require("../models/Analytics");
const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");

// Middleware to check if user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===== PUBLIC ANALYTICS ROUTES =====

// Get public donation statistics
router.get("/public/donation-stats", async (req, res) => {
  try {
    // Find the most recent donation statistics record
    const stats = await DonationStatistics.findOne().sort({ createdAt: -1 });
    
    if (!stats) {
      return res.status(404).json({ message: "No statistics available yet" });
    }
    
    // Return only public data
    const publicStats = {
      totalDonations: stats.totalDonations,
      bloodGroupStats: stats.bloodGroupStats,
      successRate: stats.successRate,
      locationStats: stats.locationStats.map(loc => ({
        city: loc.city,
        state: loc.state,
        count: loc.count
      }))
    };
    
    res.json(publicStats);
  } catch (error) {
    console.error("Error fetching public donation stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get public request statistics
router.get("/public/request-stats", async (req, res) => {
  try {
    // Find the most recent request statistics record
    const stats = await RequestStatistics.findOne().sort({ createdAt: -1 });
    
    if (!stats) {
      return res.status(404).json({ message: "No statistics available yet" });
    }
    
    // Return only public data
    const publicStats = {
      totalRequests: stats.totalRequests,
      fulfilledRequests: stats.fulfilledRequests,
      pendingRequests: stats.pendingRequests,
      bloodGroupStats: stats.bloodGroupStats,
      urgencyStats: stats.urgencyStats
    };
    
    res.json(publicStats);
  } catch (error) {
    console.error("Error fetching public request stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== ADMIN ANALYTICS ROUTES =====

// Get full donation statistics (admin only)
router.get("/admin/donation-stats", auth, isAdmin, async (req, res) => {
  try {
    const { period = "all" } = req.query;
    let timeFilter = {};
    
    // Apply time filtering if specified
    const now = new Date();
    if (period === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: weekAgo } };
    } else if (period === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: monthAgo } };
    } else if (period === "year") {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: yearAgo } };
    }
    
    // Find the most recent donation statistics record with time filter
    const stats = await DonationStatistics.find(timeFilter).sort({ createdAt: -1 }).limit(1);
    
    if (!stats || stats.length === 0) {
      return res.status(404).json({ message: "No statistics available for the selected period" });
    }
    
    res.json(stats[0]);
  } catch (error) {
    console.error("Error fetching admin donation stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get full user activity statistics (admin only)
router.get("/admin/user-activity", auth, isAdmin, async (req, res) => {
  try {
    const { period = "all" } = req.query;
    let timeFilter = {};
    
    // Apply time filtering if specified
    const now = new Date();
    if (period === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: weekAgo } };
    } else if (period === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: monthAgo } };
    } else if (period === "year") {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: yearAgo } };
    }
    
    // Find the most recent user activity record with time filter
    const activity = await UserActivity.find(timeFilter).sort({ createdAt: -1 }).limit(1);
    
    if (!activity || activity.length === 0) {
      return res.status(404).json({ message: "No activity data available for the selected period" });
    }
    
    res.json(activity[0]);
  } catch (error) {
    console.error("Error fetching user activity stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get full request statistics (admin only)
router.get("/admin/request-stats", auth, isAdmin, async (req, res) => {
  try {
    const { period = "all" } = req.query;
    let timeFilter = {};
    
    // Apply time filtering if specified
    const now = new Date();
    if (period === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: weekAgo } };
    } else if (period === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: monthAgo } };
    } else if (period === "year") {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: yearAgo } };
    }
    
    // Find the most recent request statistics record with time filter
    const stats = await RequestStatistics.find(timeFilter).sort({ createdAt: -1 }).limit(1);
    
    if (!stats || stats.length === 0) {
      return res.status(404).json({ message: "No statistics available for the selected period" });
    }
    
    res.json(stats[0]);
  } catch (error) {
    console.error("Error fetching admin request stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get system performance metrics (admin only)
router.get("/admin/system-performance", auth, isAdmin, async (req, res) => {
  try {
    const { period = "all" } = req.query;
    let timeFilter = {};
    
    // Apply time filtering if specified
    const now = new Date();
    if (period === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: weekAgo } };
    } else if (period === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: monthAgo } };
    } else if (period === "year") {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      timeFilter = { createdAt: { $gte: yearAgo } };
    }
    
    // Find the most recent system performance record with time filter
    const performance = await SystemPerformance.find(timeFilter).sort({ createdAt: -1 }).limit(1);
    
    if (!performance || performance.length === 0) {
      return res.status(404).json({ message: "No performance data available for the selected period" });
    }
    
    res.json(performance[0]);
  } catch (error) {
    console.error("Error fetching system performance stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== ANALYTICS GENERATION ROUTES =====

// Generate donation statistics (admin only)
router.post("/admin/generate-donation-stats", auth, isAdmin, async (req, res) => {
  try {
    // Get all blood requests with donations
    const requests = await BloodRequest.find({ "donors.status": "completed" })
      .populate("donors.donor", "gender age location")
      .populate("requester", "location");
    
    // Calculate total donations
    let totalDonations = 0;
    let bloodGroupStats = {};
    let locationStats = [];
    let donorDemographics = { gender: {}, ageGroups: {} };
    let successRate = 0;
    let avgResponseTime = 0;
    
    // Process each request
    requests.forEach(request => {
      // Count completed donations
      const completedDonations = request.donors.filter(d => d.status === "completed");
      totalDonations += completedDonations.length;
      
      // Blood group stats
      if (!bloodGroupStats[request.bloodGroup]) {
        bloodGroupStats[request.bloodGroup] = 0;
      }
      bloodGroupStats[request.bloodGroup] += completedDonations.length;
      
      // Location stats
      if (request.requester && request.requester.location) {
        const { city, state } = request.requester.location;
        if (city && state) {
          const locationIndex = locationStats.findIndex(
            loc => loc.city === city && loc.state === state
          );
          
          if (locationIndex > -1) {
            locationStats[locationIndex].count += completedDonations.length;
          } else {
            locationStats.push({
              city,
              state,
              count: completedDonations.length
            });
          }
        }
      }
      
      // Donor demographics
      completedDonations.forEach(donation => {
        if (donation.donor) {
          // Gender stats
          if (donation.donor.gender) {
            if (!donorDemographics.gender[donation.donor.gender]) {
              donorDemographics.gender[donation.donor.gender] = 0;
            }
            donorDemographics.gender[donation.donor.gender]++;
          }
          
          // Age group stats
          if (donation.donor.age) {
            let ageGroup = "unknown";
            if (donation.donor.age < 25) ageGroup = "18-24";
            else if (donation.donor.age < 35) ageGroup = "25-34";
            else if (donation.donor.age < 45) ageGroup = "35-44";
            else if (donation.donor.age < 55) ageGroup = "45-54";
            else ageGroup = "55+";
            
            if (!donorDemographics.ageGroups[ageGroup]) {
              donorDemographics.ageGroups[ageGroup] = 0;
            }
            donorDemographics.ageGroups[ageGroup]++;
          }
        }
      });
      
      // Calculate response time if available
      if (request.createdAt && completedDonations.length > 0 && completedDonations[0].donatedAt) {
        const responseTime = new Date(completedDonations[0].donatedAt) - new Date(request.createdAt);
        avgResponseTime += responseTime;
      }
    });
    
    // Calculate success rate (completed donations / total donation attempts)
    const allDonationAttempts = await BloodRequest.aggregate([
      { $unwind: "$donors" },
      { $count: "total" }
    ]);
    
    if (allDonationAttempts.length > 0 && allDonationAttempts[0].total > 0) {
      successRate = (totalDonations / allDonationAttempts[0].total) * 100;
    }
    
    // Calculate average response time
    if (totalDonations > 0) {
      avgResponseTime = avgResponseTime / totalDonations / (1000 * 60 * 60); // Convert to hours
    }
    
    // Create new donation statistics record
    const newStats = new DonationStatistics({
      totalDonations,
      bloodGroupStats,
      locationStats,
      donorDemographics,
      successRate,
      avgResponseTime
    });
    
    await newStats.save();
    
    res.status(201).json({
      message: "Donation statistics generated successfully",
      stats: newStats
    });
  } catch (error) {
    console.error("Error generating donation stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Generate request statistics (admin only)
router.post("/admin/generate-request-stats", auth, isAdmin, async (req, res) => {
  try {
    // Get all blood requests
    const requests = await BloodRequest.find();
    
    // Calculate statistics
    const totalRequests = requests.length;
    const fulfilledRequests = requests.filter(r => r.status === "fulfilled").length;
    const pendingRequests = requests.filter(r => r.status === "active").length;
    const expiredRequests = requests.filter(r => r.status === "expired").length;
    
    // Blood group stats
    const bloodGroupStats = {};
    requests.forEach(request => {
      if (!bloodGroupStats[request.bloodGroup]) {
        bloodGroupStats[request.bloodGroup] = 0;
      }
      bloodGroupStats[request.bloodGroup]++;
    });
    
    // Urgency stats
    const urgencyStats = {};
    requests.forEach(request => {
      if (!urgencyStats[request.urgency]) {
        urgencyStats[request.urgency] = 0;
      }
      urgencyStats[request.urgency]++;
    });
    
    // Location stats
    const locationStats = [];
    requests.forEach(request => {
      if (request.location && request.location.address) {
        const { city, state } = request.location;
        if (city && state) {
          const locationIndex = locationStats.findIndex(
            loc => loc.city === city && loc.state === state
          );
          
          if (locationIndex > -1) {
            locationStats[locationIndex].count++;
          } else {
            locationStats.push({
              city,
              state,
              count: 1
            });
          }
        }
      }
    });
    
    // Calculate average fulfillment time
    let totalFulfillmentTime = 0;
    let fulfillmentCount = 0;
    
    requests.forEach(request => {
      if (request.status === "fulfilled" && request.createdAt && request.updatedAt) {
        const fulfillmentTime = new Date(request.updatedAt) - new Date(request.createdAt);
        totalFulfillmentTime += fulfillmentTime;
        fulfillmentCount++;
      }
    });
    
    const avgFulfillmentTime = fulfillmentCount > 0 ? 
      totalFulfillmentTime / fulfillmentCount / (1000 * 60 * 60) : 0; // Convert to hours
    
    // Create new request statistics record
    const newStats = new RequestStatistics({
      totalRequests,
      fulfilledRequests,
      pendingRequests,
      expiredRequests,
      bloodGroupStats,
      urgencyStats,
      locationStats,
      avgFulfillmentTime
    });
    
    await newStats.save();
    
    res.status(201).json({
      message: "Request statistics generated successfully",
      stats: newStats
    });
  } catch (error) {
    console.error("Error generating request stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Generate user activity statistics (admin only)
router.post("/admin/generate-user-activity", auth, isAdmin, async (req, res) => {
  try {
    // Get all users
    const users = await User.find();
    
    // Calculate active users (users who logged in within the last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = users.filter(user => 
      user.lastLogin && new Date(user.lastLogin) >= thirtyDaysAgo
    ).length;
    
    // Calculate new users (registered within the last 30 days)
    const newUsers = users.filter(user => 
      user.createdAt && new Date(user.createdAt) >= thirtyDaysAgo
    ).length;
    
    // Get user actions (simplified - would need actual logging in a real app)
    const userActions = {
      logins: users.filter(user => user.lastLogin).length,
      bloodRequests: await BloodRequest.countDocuments(),
      donations: await BloodRequest.aggregate([
        { $unwind: "$donors" },
        { $match: { "donors.status": "completed" } },
        { $count: "total" }
      ]).then(result => result.length > 0 ? result[0].total : 0)
    };
    
    // User retention (simplified - would need cohort analysis in a real app)
    const userRetention = {
      oneMonth: 0,
      threeMonths: 0,
      sixMonths: 0
    };
    
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
    
    const usersOneMonthAgo = users.filter(user => 
      user.createdAt && new Date(user.createdAt) <= oneMonthAgo
    );
    
    const usersThreeMonthsAgo = users.filter(user => 
      user.createdAt && new Date(user.createdAt) <= threeMonthsAgo
    );
    
    const usersSixMonthsAgo = users.filter(user => 
      user.createdAt && new Date(user.createdAt) <= sixMonthsAgo
    );
    
    if (usersOneMonthAgo.length > 0) {
      const activeOneMonthUsers = usersOneMonthAgo.filter(user => 
        user.lastLogin && new Date(user.lastLogin) >= oneMonthAgo
      ).length;
      userRetention.oneMonth = (activeOneMonthUsers / usersOneMonthAgo.length) * 100;
    }
    
    if (usersThreeMonthsAgo.length > 0) {
      const activeThreeMonthUsers = usersThreeMonthsAgo.filter(user => 
        user.lastLogin && new Date(user.lastLogin) >= oneMonthAgo
      ).length;
      userRetention.threeMonths = (activeThreeMonthUsers / usersThreeMonthsAgo.length) * 100;
    }
    
    if (usersSixMonthsAgo.length > 0) {
      const activeSixMonthUsers = usersSixMonthsAgo.filter(user => 
        user.lastLogin && new Date(user.lastLogin) >= oneMonthAgo
      ).length;
      userRetention.sixMonths = (activeSixMonthUsers / usersSixMonthsAgo.length) * 100;
    }
    
    // Average session duration (would need actual session tracking in a real app)
    const avgSessionDuration = 0; // Placeholder
    
    // Create new user activity record
    const newActivity = new UserActivity({
      activeUsers,
      newUsers,
      userActions,
      userRetention,
      avgSessionDuration
    });
    
    await newActivity.save();
    
    res.status(201).json({
      message: "User activity statistics generated successfully",
      activity: newActivity
    });
  } catch (error) {
    console.error("Error generating user activity stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Generate system performance metrics (admin only)
router.post("/admin/generate-system-performance", auth, isAdmin, async (req, res) => {
  try {
    // This would typically come from server monitoring tools
    // Here we're just creating a placeholder with sample data
    
    const newPerformance = new SystemPerformance({
      apiCalls: {
        total: 1000, // Sample value
        byEndpoint: {
          "/api/auth": 250,
          "/api/requests": 350,
          "/api/pickups": 200,
          "/api/profile": 150,
          "/api/community": 50
        }
      },
      errorRate: 2.5, // Sample value (percentage)
      avgResponseTime: 120, // Sample value (ms)
      peakUsageTime: "14:00-16:00", // Sample value
      resourceUtilization: {
        cpu: 45, // Sample value (percentage)
        memory: 60, // Sample value (percentage)
        disk: 30 // Sample value (percentage)
      }
    });
    
    await newPerformance.save();
    
    res.status(201).json({
      message: "System performance metrics generated successfully",
      performance: newPerformance
    });
  } catch (error) {
    console.error("Error generating system performance metrics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;