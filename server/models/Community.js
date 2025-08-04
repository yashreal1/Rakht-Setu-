const mongoose = require("mongoose");

// Forum Post Schema
const forumPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, enum: ["general", "donation", "request", "medical", "success_stories", "questions"], default: "general" },
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  views: { type: Number, default: 0 },
  comments: [{
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isEdited: { type: Boolean, default: false }
  }],
  isAnnouncement: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  attachments: [{
    url: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true }
  }]
}, {
  timestamps: true
});

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: {
    address: { type: String, required: true },
    coordinates: { lat: Number, lng: Number }
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  eventType: { type: String, enum: ["donation_drive", "awareness", "workshop", "other"], default: "other" },
  image: { type: String },
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["going", "interested", "not_going"], default: "interested" }
  }],
  isVirtual: { type: Boolean, default: false },
  virtualLink: { type: String },
  maxAttendees: { type: Number },
  isPublic: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Testimonial Schema
const testimonialSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  relatedTo: {
    type: { type: String, enum: ["donation", "request", "general"], default: "general" },
    id: { type: mongoose.Schema.Types.ObjectId, refPath: "relatedTo.type" }
  },
  isApproved: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Notification Schema
const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["request", "donation", "forum", "event", "system"], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedTo: {
    model: { type: String, enum: ["BloodRequest", "Pickup", "ForumPost", "Event"] },
    id: { type: mongoose.Schema.Types.ObjectId }
  },
  isRead: { type: Boolean, default: false },
  action: { type: String }
}, {
  timestamps: true
});

// Export models
const ForumPost = mongoose.model("ForumPost", forumPostSchema);
const Event = mongoose.model("Event", eventSchema);
const Testimonial = mongoose.model("Testimonial", testimonialSchema);
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = {
  ForumPost,
  Event,
  Testimonial,
  Notification
};