# Employee Hub - Frontend & Backend Integration

This document describes the integration between the Angular frontend and Spring Boot backend.

## Architecture Overview

- **Frontend**: Angular 20+ with standalone components, signals, and reactive forms
- **Backend**: Spring Boot with JWT authentication, PostgreSQL database
- **Communication**: RESTful APIs with CORS enabled

## Key Integration Features

### 1. Authentication System
- JWT-based authentication
- Login/Register forms with validation
- Automatic token management
- Protected routes and API calls

### 2. API Service Layer
- Centralized HTTP client service (`ApiService`)
- Reactive state management with Angular signals
- Error handling and loading states
- Automatic token injection for authenticated requests

### 3. CORS Configuration
- Backend configured to accept requests from frontend
- Development proxy configuration for seamless API calls

## File Structure

### Frontend Services
- `src/services/api.service.ts` - Main API communication service
- `src/services/auth.service.ts` - Authentication management
- `src/components/auth/login.component.ts` - Login/Register component

### Backend Controllers
- `AuthController` - Authentication endpoints
- `UsersController` - User management
- `ProjectsController` - Project CRUD operations
- `KudosController` - Kudos system
- `RewardsController` - Reward redemption

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/` - List all users
- `PATCH /api/users/{id}/role` - Update user role (Admin only)

### Projects
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project (Admin only)

### Kudos
- `POST /api/kudos/send` - Send kudos
- `GET /api/kudos/feed` - Get kudos feed
- `GET /api/kudos/leaderboard` - Get leaderboard

### Rewards
- `GET /api/rewards/` - List rewards
- `POST /api/rewards/{id}/redeem` - Redeem reward

## Development Setup

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL database
- Maven

### Backend Setup
1. Configure database connection in `application.properties`
2. Run the backend:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```

### Quick Start
Use the provided batch script:
```bash
start-dev.bat
```

## Configuration

### Backend Configuration
- Server runs on port 8080
- API base path: `/api`
- CORS enabled for all origins (development)
- JWT secret configured in `application.properties`

### Frontend Configuration
- Development server on port 3000
- Proxy configuration for API calls
- Automatic HTTP client setup

## Data Flow

1. **Authentication Flow**:
   - User submits login/register form
   - Frontend calls backend auth endpoints
   - JWT token stored in localStorage
   - Token automatically included in subsequent requests

2. **Data Loading**:
   - Components initialize by calling API service methods
   - Data stored in reactive signals
   - UI automatically updates when data changes

3. **User Actions**:
   - User interactions trigger API calls
   - Success/error notifications shown
   - Local state updated on success

## Security Features

- JWT token-based authentication
- Role-based access control (Admin/User)
- CORS protection
- Input validation on both frontend and backend
- Secure password handling with BCrypt

## Error Handling

- Global error handling in API service
- User-friendly error messages
- Loading states for better UX
- Automatic token refresh handling

## Future Enhancements

- Real-time updates with WebSocket
- File upload capabilities
- Advanced project assignment features
- Email notifications
- Mobile app support

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS configuration is correct
2. **Authentication Issues**: Check JWT token validity and expiration
3. **Database Connection**: Verify PostgreSQL is running and configured
4. **Port Conflicts**: Ensure ports 3000 and 8080 are available

### Debug Tips

- Check browser network tab for API call details
- Review backend logs for server-side errors
- Use browser developer tools for frontend debugging
- Verify database connection and data seeding

