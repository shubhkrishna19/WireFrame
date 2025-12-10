# MULARY E-COMMERCE AUTHENTICATION SYSTEM

## Overview
This document describes the complete authentication system implemented for the Mulary e-commerce backend. The system includes user registration, login, JWT token management, password reset, email verification, and role-based access control.

## Features

### 1. User Registration
- Secure registration with email verification
- Password hashing with bcrypt
- Welcome email after successful verification
- Automatic JWT token generation

### 2. User Login
- Secure login with email and password
- JWT token generation (access and refresh tokens)
- Last login tracking
- Rate limiting for authentication endpoints

### 3. JWT Token Management
- Access tokens with short expiration (default 7 days)
- Refresh tokens with longer expiration (default 30 days)
- Token blacklisting using Redis
- Token refresh functionality
- Proper token validation and verification

### 4. Password Reset
- Secure password reset via email
- One-time use tokens with expiration
- Email notifications for password reset requests

### 5. Email Verification
- Email verification during registration
- Welcome email after verification
- Expiring verification tokens

### 6. Role-Based Access Control
- Customer, Admin, and Editor roles
- Middleware for role-based authorization
- Flexible role checking functions

### 7. Security Features
- Rate limiting for authentication endpoints
- Bcrypt password hashing
- JWT token security
- Token blacklisting on logout
- Input validation and sanitization

## Architecture

### Directory Structure
```
backend/
├── src/
│   ├── controllers/
│   │   └── auth.controller.ts    # Authentication controllers
│   ├── services/
│   │   ├── auth.service.ts       # Authentication business logic
│   │   ├── token.service.ts      # Token management
│   │   └── email.service.ts      # Email functionality
│   ├── middleware/
│   │   └── auth.middleware.ts    # Authentication middleware
│   ├── routes/
│   │   └── auth.routes.ts        # Authentication routes
│   ├── utils/
│   │   ├── jwt.util.ts          # JWT utilities
│   │   └── hash.util.ts         # Password hashing utilities
│   └── auth/
│       └── setup.ts             # Authentication setup module
```

### Database Schema
The authentication system uses the following user table structure:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'editor')),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Environment Variables
Required environment variables for authentication:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-secret-at-least-32-characters-long
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-token-secret-at-least-32-characters-long
JWT_REFRESH_EXPIRES_IN=30d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@mulary.com
EMAIL_FROM_NAME=Mulary

# Redis (for token blacklisting)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_AUTH_MAX=5  # Max auth attempts per window
```

## API Endpoints

### Public Endpoints (Rate Limited)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify-email/:token` - Verify email with token
- `POST /api/auth/refresh` - Refresh access token

### Protected Endpoints (Require Authentication)
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/change-password` - Change password

## Security Implementation

### Password Security
- Passwords are hashed using bcrypt with configurable salt rounds
- Minimum 8-character password requirement enforced
- Current password verification required for password changes

### JWT Security
- Separate secrets for access and refresh tokens
- Short-lived access tokens (7 days default)
- Longer-lived refresh tokens (30 days default)
- Token blacklisting on logout using Redis
- Token validation on every protected route

### Rate Limiting
- Authentication endpoints are protected by rate limiting
- Default: 5 attempts per 15 minutes window
- Prevents brute force attacks

### Email Security
- Verification tokens expire after 24 hours
- Password reset tokens expire after 1 hour
- All email tokens are randomly generated with crypto-secure methods

## Middleware

### Authentication Middleware
- `authenticate` - Require valid JWT token
- `requireRole(...roles)` - Require specific roles
- `requireAdmin` - Require admin role
- `requireAdminOrEditor` - Require admin or editor role
- `optionalAuth` - Optional authentication (no failure if no token)

## Usage Examples

### Register New User
```javascript
// POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

### Login
```javascript
// POST /api/auth/login
{
  "email": "user@example.com",
  "password": "securePassword123"
}
// Response includes access and refresh tokens
```

### Protected Route Access
```javascript
// GET /api/auth/me
// Headers: Authorization: Bearer <access_token>
// Returns user information
```

## Token Management

### Refresh Token Flow
1. Client stores both access and refresh tokens
2. When access token expires, use refresh token to get new tokens
3. `POST /api/auth/refresh` with refresh token in request body
4. Server validates refresh token and returns new access/refresh tokens
5. Old refresh token is blacklisted and new one issued

### Logout Flow
1. Client calls `POST /api/auth/logout`
2. Server blacklists all tokens for the user in Redis
3. Client should clear tokens from local storage

## Error Handling

The system provides comprehensive error handling:

- `400 Bad Request` - Invalid input or expired tokens
- `401 Unauthorized` - Invalid credentials or expired/blacklisted tokens
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - User not found
- `409 Conflict` - User already exists
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server errors

## Email Templates

The system includes professionally designed email templates for:
- Welcome emails
- Email verification
- Password reset
- Order confirmations
- Shipping notifications
- Delivery confirmations

## Testing

### Unit Tests
- Password hashing and verification
- JWT token generation and validation
- Email verification flow
- Password reset flow
- Role-based access control

### Integration Tests
- Complete registration flow
- Login/logout flow
- Token refresh flow
- Password change flow

## Deployment Considerations

### Production Environment
- Use strong, unique JWT secrets
- Configure proper SMTP settings
- Set up Redis for production
- Use HTTPS in production
- Implement proper logging
- Set up monitoring for auth endpoints

### Security Best Practices
- Regularly rotate JWT secrets
- Monitor authentication logs
- Implement account lockout after failed attempts
- Use secure, HTTP-only cookies if applicable
- Regular security audits

## Future Enhancements

- Two-factor authentication (2FA)
- Social login integration
- Account activity monitoring
- IP-based security
- Device management
- Session management
- Biometric authentication

## Troubleshooting

### Common Issues
1. **JWT Secret Too Short**: Ensure JWT secrets are at least 32 characters
2. **Email Not Sending**: Check SMTP configuration and credentials
3. **Token Blacklisting Not Working**: Verify Redis is running and configured
4. **Rate Limiting Issues**: Check rate limit configuration in env variables

### Debugging
- Enable debug logging in development
- Check database connections
- Verify environment variables
- Test email configuration separately