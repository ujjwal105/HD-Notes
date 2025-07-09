# HD App Backend

**Host URL:** https://hd-notes.onrender.com

A Node.js Express backend with MongoDB for OTP-based authentication and user management.

## Features

- 🔐 OTP-based authentication (signup & signin)
- 📧 Email OTP delivery with HTML templates
- 🛡️ JWT token-based authorization with refresh tokens
- 📝 Notes CRUD operations
- 🔒 Account lockout after failed attempts
- 🚦 Rate limiting for security
- ✅ Input validation and sanitization
- 🛡️ Security headers with Helmet
- 📊 Pagination support for notes

## Project Structure

\`\`\`
backend/
├── models/
│ ├── User.js # User model with OTP functionality
│ └── Note.js # Note model for user notes
├── routes/
│ ├── auth.js # Authentication routes
│ ├── user.js # User management routes
│ └── notes.js # Notes CRUD routes
├── middleware/
│ └── auth.js # JWT authentication middleware
├── utils/
│ ├── emailService.js # Email sending functionality
│ └── otpGenerator.js # OTP generation utility
├── server.js # Main server file
├── package.json # Dependencies and scripts
├── .env.example # Environment variables template
└── README.md # This file
\`\`\`

## Setup

1. **Navigate to backend directory:**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Configuration:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Update the `.env` file with your configuration.

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

## 🏗️ Building the Project

This backend is written in JavaScript and does **not require a separate build step**. You can run it directly with Node.js.

### Development

```bash
npm run dev
```

- Uses `nodemon` for automatic restarts on file changes.

### Production

```bash
npm start
```

- Runs the server with Node.js.

**Note:**

- Ensure you have installed all dependencies with `npm install`.
- Make sure your `.env` file is configured as described above.

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user and send OTP
- `POST /api/auth/verify-signup` - Verify OTP and complete registration
- `POST /api/auth/signin` - Sign in with OTP
- `POST /api/auth/request-signin-otp` - Request OTP for signin
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user

### User Management

- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/account` - Delete user account

### Notes

- `GET /api/notes` - Get all user notes (paginated)
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note (soft delete)

### Health Check

- `GET /api/health` - Server health status

## Security Features

- Rate limiting on sensitive endpoints
- Account lockout after failed login attempts
- JWT token expiration and refresh mechanism
- Input validation and sanitization
- CORS protection
- Security headers with Helmet
- Password-like OTP hashing

## Email Configuration

For development, the app uses Ethereal Email for testing. For production, configure your email service in the environment variables.

## Database Schema

### User Model

- name, email, dateOfBirth
- OTP management with expiration and attempts
- Account lockout mechanism
- Refresh token storage

### Note Model

- text content with user association
- Soft delete functionality
- Timestamps for creation/updates

## Error Handling

The API returns consistent error responses with appropriate HTTP status codes and descriptive messages.

## Development

\`\`\`bash

# Install nodemon for development

npm install -g nodemon

# Run in development mode

npm run dev
\`\`\`

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database URI
3. Set up proper email service credentials
4. Use process manager like PM2
5. Set up reverse proxy with Nginx
6. Enable HTTPS

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request
