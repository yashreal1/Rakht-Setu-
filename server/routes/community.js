const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { ForumPost, Event, Testimonial, Notification } = require("../models/Community");
const User = require("../models/User");

// ===== FORUM POSTS ROUTES =====

// Get all forum posts with pagination and filtering
router.get("/forum", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, author, sort = "newest" } = req.query;
    
    // Build query
    const query = {};
    if (category) query.category = category;
    if (tag) query.tags = tag;
    if (author) query.author = author;
    
    // Determine sort order
    let sortOption = {};
    switch (sort) {
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "popular":
        sortOption = { views: -1 };
        break;
      case "mostComments":
        sortOption = { "comments.length": -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    // Execute query with pagination
    const posts = await ForumPost.find(query)
      .populate("author", "name profileImage")
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    // Get total count for pagination
    const count = await ForumPost.countDocuments(query);
    
    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalPosts: count
    });
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single forum post by ID
router.get("/forum/:id", async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id)
      .populate("author", "name profileImage")
      .populate("comments.author", "name profileImage");
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Increment view count
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (error) {
    console.error("Error fetching forum post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new forum post
router.post("/forum", auth, async (req, res) => {
  try {
    const { title, content, category, tags, attachments } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }
    
    const newPost = new ForumPost({
      title,
      content,
      author: req.user.id,
      category: category || "general",
      tags: tags || [],
      attachments: attachments || []
    });
    
    await newPost.save();
    
    // Populate author information before sending response
    const populatedPost = await ForumPost.findById(newPost._id).populate("author", "name profileImage");
    
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Error creating forum post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a forum post
router.put("/forum/:id", auth, async (req, res) => {
  try {
    const { title, content, category, tags, attachments } = req.body;
    
    // Find post and check ownership
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }
    
    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = tags;
    if (attachments) post.attachments = attachments;
    
    await post.save();
    
    res.json(post);
  } catch (error) {
    console.error("Error updating forum post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a forum post
router.delete("/forum/:id", auth, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }
    
    await post.remove();
    
    res.json({ message: "Post removed" });
  } catch (error) {
    console.error("Error deleting forum post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a comment to a forum post
router.post("/forum/:id/comments", auth, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }
    
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    const newComment = {
      content,
      author: req.user.id,
      createdAt: Date.now()
    };
    
    post.comments.push(newComment);
    await post.save();
    
    // Create notification for post author if it's not the same as commenter
    if (post.author.toString() !== req.user.id) {
      const user = await User.findById(req.user.id).select("name");
      
      const notification = new Notification({
        recipient: post.author,
        type: "forum",
        title: "New Comment on Your Post",
        message: `${user.name} commented on your post: "${post.title}"`,
        relatedTo: {
          model: "ForumPost",
          id: post._id
        },
        action: `/forum/${post._id}`
      });
      
      await notification.save();
    }
    
    // Populate the newly added comment with author info
    const updatedPost = await ForumPost.findById(req.params.id)
      .populate("comments.author", "name profileImage");
    
    res.json(updatedPost.comments[updatedPost.comments.length - 1]);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== EVENTS ROUTES =====

// Get all events with pagination and filtering
router.get("/events", async (req, res) => {
  try {
    const { page = 1, limit = 10, eventType, upcoming = "true" } = req.query;
    
    // Build query
    const query = {};
    if (eventType) query.eventType = eventType;
    
    // Filter for upcoming events if requested
    if (upcoming === "true") {
      query.startDate = { $gte: new Date() };
    }
    
    // Execute query with pagination
    const events = await Event.find(query)
      .populate("organizer", "name profileImage")
      .sort({ startDate: 1 }) // Sort by start date ascending
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    // Get total count for pagination
    const count = await Event.countDocuments(query);
    
    res.json({
      events,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalEvents: count
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single event by ID
router.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name profileImage")
      .populate("attendees.user", "name profileImage");
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new event
router.post("/events", auth, async (req, res) => {
  try {
    const { 
      title, description, location, startDate, endDate, 
      eventType, image, isVirtual, virtualLink, maxAttendees, isPublic 
    } = req.body;
    
    if (!title || !description || !location || !startDate || !endDate) {
      return res.status(400).json({ 
        message: "Title, description, location, start date, and end date are required" 
      });
    }
    
    const newEvent = new Event({
      title,
      description,
      organizer: req.user.id,
      location,
      startDate,
      endDate,
      eventType: eventType || "other",
      image,
      isVirtual: isVirtual || false,
      virtualLink,
      maxAttendees,
      isPublic: isPublic !== undefined ? isPublic : true
    });
    
    await newEvent.save();
    
    // Populate organizer information before sending response
    const populatedEvent = await Event.findById(newEvent._id)
      .populate("organizer", "name profileImage");
    
    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update an event
router.put("/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this event" });
    }
    
    // Update fields
    const updateFields = ["title", "description", "location", "startDate", "endDate", 
                         "eventType", "image", "isVirtual", "virtualLink", "maxAttendees", "isPublic"];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });
    
    await event.save();
    
    res.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an event
router.delete("/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }
    
    await event.remove();
    
    res.json({ message: "Event removed" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// RSVP to an event
router.post("/events/:id/rsvp", auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['going', 'interested', 'not_going'].includes(status)) {
      return res.status(400).json({ message: "Valid status is required" });
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Check if user is already in attendees list
    const attendeeIndex = event.attendees.findIndex(
      attendee => attendee.user.toString() === req.user.id
    );
    
    if (attendeeIndex > -1) {
      // Update existing RSVP
      event.attendees[attendeeIndex].status = status;
    } else {
      // Add new RSVP
      event.attendees.push({
        user: req.user.id,
        status
      });
    }
    
    await event.save();
    
    res.json({ message: "RSVP updated", status });
  } catch (error) {
    console.error("Error updating RSVP:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== TESTIMONIALS ROUTES =====

// Get all approved testimonials
router.get("/testimonials", async (req, res) => {
  try {
    const { featured = false } = req.query;
    
    const query = { isApproved: true };
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    const testimonials = await Testimonial.find(query)
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });
    
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new testimonial
router.post("/testimonials", auth, async (req, res) => {
  try {
    const { content, rating, relatedTo } = req.body;
    
    if (!content || !rating) {
      return res.status(400).json({ message: "Content and rating are required" });
    }
    
    const newTestimonial = new Testimonial({
      content,
      author: req.user.id,
      rating,
      relatedTo: relatedTo || { type: "general" }
    });
    
    await newTestimonial.save();
    
    res.status(201).json({
      message: "Testimonial submitted for approval",
      testimonial: newTestimonial
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== NOTIFICATIONS ROUTES =====

// Get user notifications
router.get("/notifications", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark notification as read
router.put("/notifications/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    // Check if notification belongs to user
    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark all notifications as read
router.put("/notifications/read-all", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;