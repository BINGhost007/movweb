# Movie Streaming Platform - Full Stack Application

A modern, scalable movie streaming platform with premium UI/UX, user authentication, and powerful admin dashboard.

## Features

### 🎬 User Features
- Netflix-like streaming interface
- Popular Movies & All Movies sections
- Movie details with streaming and download options
- Search, filter, and pagination
- User authentication (signup, login, logout)
- User profiles with favorites and watchlist
- Watched history tracking

### 🛠️ Admin Dashboard
- Full CRUD for movies (title, description, year, duration, rating, quality)
- Category/Genre management
- Tag management (many-to-many relationships)
- Poster upload functionality
- Streaming and download source management
- Mark movies as popular
- User management (roles, ban/activate)
- Basic statistics (users, movies, views/downloads)

### 🔒 Security & Architecture
- Secure authentication with JWT and hashed passwords
- Role-based access control (admin vs user)
- REST API with pagination and filtering
- Input validation (frontend + backend)
- Error handling and logging
- Environment configuration
- Production-ready code structure

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT + bcrypt
- **Database**: MongoDB (scalable, flexible schema)
- **File Storage**: Local uploads (ready for cloud integration)

## Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB v6+
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/movweb.git
   cd movweb
   ```

2. **Install dependencies:**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit the .env file with your configuration
   nano .env
   ```

4. **Set up the database:**
   ```bash
   # Make sure MongoDB is running
   mongod
   
   # Seed the database with initial data
   cd database
   node seeders/seed.js
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend application:**
   ```bash
   cd client
   npm start
   ```

3. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`
   - Admin Dashboard: `http://localhost:3000/admin`

### Admin Access

Use the following credentials to access the admin dashboard:
- **Email**: `admin@example.com`
- **Password**: `admin123`

## Project Structure

```
movweb/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API service calls
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main application
│   └── public/              # Static assets
├── server/                  # Backend Node.js API
│   ├── controllers/         # Route controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   ├── config/              # Configuration files
│   ├── utils/               # Utility functions
│   └── app.js               # Main server entry
├── database/                # Database setup
│   ├── models/              # Database schemas
│   └── seeders/             # Data seeding scripts
├── .env.example             # Environment configuration template
├── README.md                # Project documentation
└── package.json             # Root package configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Movies
- `GET /api/movies` - Get all movies (with pagination)
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Create movie (Admin only)
- `PUT /api/movies/:id` - Update movie (Admin only)
- `DELETE /api/movies/:id` - Delete movie (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user details (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Favorites
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:id` - Remove from favorites

### Watchlist
- `GET /api/watchlist` - Get user watchlist
- `POST /api/watchlist` - Add to watchlist
- `DELETE /api/watchlist/:id` - Remove from watchlist

## Development

### Running tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Building for production
```bash
# Build frontend
cd client
npm run build

# Build backend
cd server
npm run build
```

## Docker Support

To run the application with Docker:

```bash
# Build and start containers
docker-compose up --build

# Stop containers
docker-compose down
```

## Deployment

The application is ready for cloud deployment. Recommended platforms:
- **Frontend**: Vercel, Netlify, AWS Amplify
- **Backend**: AWS EC2, Heroku, Render
- **Database**: MongoDB Atlas, AWS DocumentDB
- **Storage**: AWS S3, Cloudinary

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

MIT License

## Support

For any issues or questions, please open an issue on GitHub or contact our support team.

---

**Enjoy your movie streaming experience! 🎥🍿**