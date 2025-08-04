const { Notification } = require('../models/Community');
const User = require('../models/User');
const sendEmail = require('./sendEmail');

/**
 * Notification Service - Handles sending notifications to users through various channels
 */
class NotificationService {
  /**
   * Create a new notification in the database
   * @param {Object} notificationData - Notification data
   * @param {String} notificationData.recipient - User ID of the recipient
   * @param {String} notificationData.type - Type of notification (e.g., 'request', 'donation', 'forum', 'event')
   * @param {String} notificationData.title - Notification title
   * @param {String} notificationData.message - Notification message
   * @param {Object} notificationData.relatedTo - Related entity information
   * @param {String} notificationData.action - Action URL or path
   * @returns {Promise<Object>} Created notification object
   */
  static async createNotification(notificationData) {
    try {
      const notification = new Notification(notificationData);
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  /**
   * Send a notification to a user through their preferred channels
   * @param {String} userId - User ID of the recipient
   * @param {Object} notificationData - Notification data
   * @param {String} notificationData.type - Type of notification
   * @param {String} notificationData.title - Notification title
   * @param {String} notificationData.message - Notification message
   * @param {Object} notificationData.relatedTo - Related entity information
   * @param {String} notificationData.action - Action URL or path
   * @returns {Promise<Object>} Result of notification attempts
   */
  static async notifyUser(userId, notificationData) {
    try {
      // Get user and their notification preferences
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      const results = {
        inApp: false,
        email: false
      };

      // Create in-app notification (always create this regardless of preferences)
      const notification = await this.createNotification({
        recipient: userId,
        ...notificationData
      });
      
      results.inApp = true;

      // Check user preferences for email notifications
      const shouldSendEmail = user.preferences && 
                             user.preferences.notifications && 
                             user.preferences.notifications.email;
      
      // Send email notification if user has opted in
      if (shouldSendEmail && user.email) {
        try {
          // Prepare email content
          const emailSubject = notificationData.title;
          
          // Create email body with action button if action URL is provided
          let emailText = notificationData.message;
          
          if (notificationData.action && notificationData.action.startsWith('/')) {
            // Convert relative path to absolute URL (assuming frontend URL is available in env)
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            const actionUrl = `${frontendUrl}${notificationData.action}`;
            emailText += `\n\nClick here to view: ${actionUrl}`;
          }
          
          // Send the email
          await sendEmail({
            to: user.email,
            subject: emailSubject,
            text: emailText
          });
          
          results.email = true;
        } catch (emailError) {
          console.error('Error sending notification email:', emailError);
          // Don't throw here, we still created the in-app notification
        }
      }

      return results;
    } catch (error) {
      console.error('Error in notifyUser:', error);
      throw error;
    }
  }

  /**
   * Send a notification to multiple users
   * @param {Array<String>} userIds - Array of user IDs
   * @param {Object} notificationData - Notification data
   * @returns {Promise<Array>} Results of notification attempts
   */
  static async notifyMultipleUsers(userIds, notificationData) {
    const results = [];
    
    for (const userId of userIds) {
      try {
        const result = await this.notifyUser(userId, notificationData);
        results.push({ userId, success: true, channels: result });
      } catch (error) {
        results.push({ userId, success: false, error: error.message });
      }
    }
    
    return results;
  }

  /**
   * Send a broadcast notification to all users or users with specific roles
   * @param {Object} notificationData - Notification data
   * @param {Array<String>} [roles] - Optional array of roles to filter recipients
   * @returns {Promise<Object>} Results of the broadcast operation
   */
  static async broadcastNotification(notificationData, roles = []) {
    try {
      // Build query to find users
      const query = {};
      if (roles && roles.length > 0) {
        query.role = { $in: roles };
      }
      
      // Find all relevant users
      const users = await User.find(query).select('_id');
      const userIds = users.map(user => user._id);
      
      // Send notifications
      const results = await this.notifyMultipleUsers(userIds, notificationData);
      
      return {
        totalAttempted: userIds.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        details: results
      };
    } catch (error) {
      console.error('Error in broadcastNotification:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;