# RakhtSetu - Blood Donation Platform

RakhtSetu is a comprehensive blood donation platform that connects blood donors with recipients in need. The platform facilitates blood donation requests, donor matching, pickup scheduling, and community engagement to create a robust ecosystem for blood donation.

## Features

### Core Features
- **User Authentication**: Secure registration and login system with role-based access control
- **Blood Request Management**: Create, view, and manage blood donation requests
- **Donor Matching**: Match donors with compatible blood types to recipients
- **Pickup Scheduling**: Schedule blood donation pickups with date, time, and location
- **User Profiles**: Enhanced user profiles with medical history, donation records, and preferences

### Enhanced Features
- **Community Engagement**:
  - Forum for discussions related to blood donation
  - Events calendar for blood drives and awareness campaigns
  - Testimonials from donors and recipients
- **Real-time Notifications**: In-app and email notifications for donation requests, matches, and community activities
- **Analytics Dashboard**: Comprehensive statistics on donations, requests, and user activity
- **Public Profiles**: Optional public profiles for donors to showcase their contribution

## Tech Stack

### Frontend
- React.js with React Router for navigation
- Tailwind CSS for styling
- Axios for API communication

### Backend
- Node.js with Express.js framework
- MongoDB with Mongoose ODM for data storage
- JWT for authentication
- Nodemailer for email notifications

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user information

### Blood Requests
- `GET /api/blood-requests` - Get all blood requests with filtering options
- `GET /api/blood-requests/:id` - Get a specific blood request
- `POST /api/blood-requests` - Create a new blood request
- `PUT /api/blood-requests/:id` - Update a blood request
- `DELETE /api/blood-requests/:id` - Delete a blood request

### Pickups
- `POST /api/pickups` - Schedule a blood donation pickup
- `GET /api/pickups/donor/:id` - Get pickups for a specific donor
- `GET /api/pickups/request/:id` - Get pickups for a specific request
- `PUT /api/pickups/:id` - Update pickup status

### User Profiles
- `GET /api/profile` - Get current user's profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile/donations` - Get user's donation history
- `GET /api/profile/requests` - Get user's blood requests
- `GET /api/profile/stats` - Get user-specific statistics
- `GET /api/profile/:id/public` - Get public profile of a user
- `POST /api/profile/image` - Upload profile image

### Community
- `GET /api/community/forum` - Get forum posts with pagination and filtering
- `POST /api/community/forum` - Create a new forum post
- `GET /api/community/events` - Get upcoming events
- `POST /api/community/events` - Create a new event
- `POST /api/community/events/:id/rsvp` - RSVP to an event
- `GET /api/community/testimonials` - Get approved testimonials
- `POST /api/community/testimonials` - Submit a testimonial
- `GET /api/community/notifications` - Get user notifications
- `PUT /api/community/notifications/read-all` - Mark all notifications as read

### Analytics
- `GET /api/analytics/public/donation-stats` - Get public donation statistics
- `GET /api/analytics/public/request-stats` - Get public request statistics
- `GET /api/analytics/admin/donation-stats` - Get detailed donation statistics (admin only)
- `GET /api/analytics/admin/user-activity` - Get user activity statistics (admin only)
- `GET /api/analytics/admin/request-stats` - Get detailed request statistics (admin only)
- `GET /api/analytics/admin/system-performance` - Get system performance metrics (admin only)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/rakht-setu.git
   cd rakht-setu
   ```

2. Install dependencies for both frontend and backend
   ```
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email_for_notifications
   EMAIL_PASS=your_email_password
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the development servers
   ```
   # Start backend server
   cd server
   npm run dev

   # Start frontend server in a new terminal
   cd client
   npm start
   ```

5. Access the application at `http://localhost:3000`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.