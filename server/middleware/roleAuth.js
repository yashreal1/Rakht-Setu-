const User = require('../models/User');

/**
 * Middleware for role-based access control
 * @param {Array} roles - Array of roles allowed to access the route
 * @returns {Function} Express middleware function
 */
const roleAuth = (roles = []) => {
  // Convert string to array if only one role is provided
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    try {
      // User ID should be available from the auth middleware
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized - Authentication required' });
      }

      // Find user and check role
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized - User not found' });
      }

      // If no specific roles are required or user is admin, proceed
      if (roles.length === 0 || user.role === 'admin') {
        return next();
      }

      // Check if user has one of the required roles
      if (!roles.includes(user.role)) {
        return res.status(403).json({ 
          message: 'Forbidden - You do not have the required role to access this resource' 
        });
      }

      // User has required role, proceed
      next();
    } catch (error) {
      console.error('Role authorization error:', error);
      res.status(500).json({ message: 'Server error during role verification' });
    }
  };
};

module.exports = roleAuth;