const mongoose = require("mongoose");

// DonationStatistics Schema - For tracking donation metrics
const donationStatisticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  totalDonations: { type: Number, default: 0 },
  bloodGroupStats: {
    "A+": { type: Number, default: 0 },
    "A-": { type: Number, default: 0 },
    "B+": { type: Number, default: 0 },
    "B-": { type: Number, default: 0 },
    "AB+": { type: Number, default: 0 },
    "AB-": { type: Number, default: 0 },
    "O+": { type: Number, default: 0 },
    "O-": { type: Number, default: 0 }
  },
  locationStats: [{
    location: { type: String },
    count: { type: Number, default: 0 }
  }],
  donorDemographics: {
    ageGroups: {
      "18-25": { type: Number, default: 0 },
      "26-35": { type: Number, default: 0 },
      "36-45": { type: Number, default: 0 },
      "46-55": { type: Number, default: 0 },
      "56+": { type: Number, default: 0 }
    },
    gender: {
      male: { type: Number, default: 0 },
      female: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    }
  },
  successRate: { type: Number, default: 0 }, // Percentage of successful donations
  averageResponseTime: { type: Number } // Average time to fulfill requests (in hours)
}, {
  timestamps: true
});

// UserActivity Schema - For tracking user engagement
const userActivitySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  activeUsers: { type: Number, default: 0 },
  newUsers: { type: Number, default: 0 },
  userActions: {
    logins: { type: Number, default: 0 },
    registrations: { type: Number, default: 0 },
    bloodRequests: { type: Number, default: 0 },
    donationOffers: { type: Number, default: 0 },
    profileUpdates: { type: Number, default: 0 },
    forumPosts: { type: Number, default: 0 },
    forumComments: { type: Number, default: 0 }
  },
  userRetention: { type: Number, default: 0 }, // Percentage of returning users
  averageSessionDuration: { type: Number, default: 0 } // In minutes
}, {
  timestamps: true
});

// RequestStatistics Schema - For tracking blood request metrics
const requestStatisticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  totalRequests: { type: Number, default: 0 },
  fulfilledRequests: { type: Number, default: 0 },
  pendingRequests: { type: Number, default: 0 },
  expiredRequests: { type: Number, default: 0 },
  bloodGroupStats: {
    "A+": { type: Number, default: 0 },
    "A-": { type: Number, default: 0 },
    "B+": { type: Number, default: 0 },
    "B-": { type: Number, default: 0 },
    "AB+": { type: Number, default: 0 },
    "AB-": { type: Number, default: 0 },
    "O+": { type: Number, default: 0 },
    "O-": { type: Number, default: 0 }
  },
  urgencyStats: {
    low: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    high: { type: Number, default: 0 },
    critical: { type: Number, default: 0 }
  },
  locationStats: [{
    location: { type: String },
    count: { type: Number, default: 0 }
  }],
  averageFulfillmentTime: { type: Number } // Average time to fulfill requests (in hours)
}, {
  timestamps: true
});

// SystemPerformance Schema - For tracking system metrics
const systemPerformanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  apiCalls: { type: Number, default: 0 },
  errorRate: { type: Number, default: 0 }, // Percentage of failed API calls
  averageResponseTime: { type: Number, default: 0 }, // In milliseconds
  peakUsageTime: { type: Date },
  resourceUtilization: {
    cpu: { type: Number, default: 0 }, // Percentage
    memory: { type: Number, default: 0 }, // Percentage
    storage: { type: Number, default: 0 } // Percentage
  }
}, {
  timestamps: true
});

// Export models
const DonationStatistics = mongoose.model("DonationStatistics", donationStatisticsSchema);
const UserActivity = mongoose.model("UserActivity", userActivitySchema);
const RequestStatistics = mongoose.model("RequestStatistics", requestStatisticsSchema);
const SystemPerformance = mongoose.model("SystemPerformance", systemPerformanceSchema);

module.exports = {
  DonationStatistics,
  UserActivity,
  RequestStatistics,
  SystemPerformance
};