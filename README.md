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

   Choose one of the following options to run MongoDB:

   **Option 1: MongoDB installed locally**
   ```bash
   # Start MongoDB service
   # On macOS: brew services start mongodb-community
   # On Ubuntu: sudo systemctl start mongodb
   # On Windows: MongoDB should be running as a service
   ```

   **Option 2: Use Docker Compose (recommended)**
   ```bash
   # Start MongoDB with Docker Compose
   docker-compose up -d

   # To view MongoDB with Mongo Express UI
   # Open: http://localhost:8081
   ```

   **Option 3: Connect to remote MongoDB**
   ```bash
   # Edit .env file and update MONGODB_URI with your connection string
   # Example: mongodb+srv://username:password@cluster.mongodb.net/movweb
   ```

   **Seed the database with initial data:**
   ```bash
   cd database
   node seeders/seed.js
   ```

### Running the Application

You can run the application in two ways:

**Option 1: Run both servers from the root directory (recommended)**
   ```bash
   # Make sure MongoDB is running first, then:
   npm run dev
   ```
   This will start both the backend (port 5000) and frontend (port 3000) concurrently.

**Option 2: Run servers separately**

1. **Start the backend server:**
    ```bash
    cd server
    npm run dev
    ```

2. **Start the frontend application (in a new terminal):**
    ```bash
    cd client
    npm run dev
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
# Build and start containers (includes MongoDB, backend, and Mongo Express)
docker-compose up --build

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
```

When using Docker, the MongoDB URI is automatically set to `mongodb://mongo:27017/movweb` and Mongo Express is available at `http://localhost:8081`.

## Troubleshooting

### MongoDB Connection Error

If you see `MongoDB connection error: connect ECONNREFUSED`, follow these steps:

1. **Check if MongoDB is running:**
   ```bash
   # For local MongoDB installation
   mongod --version
   # Start MongoDB service
   # macOS: brew services start mongodb-community
   # Ubuntu: sudo systemctl start mongodb
   # Windows: Check Services app
   ```

2. **Use Docker Compose (easiest):**
   ```bash
   docker-compose up -d
   ```

3. **Connect to MongoDB Atlas (cloud):**
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string
   - Update `.env` file:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movweb
     ```

4. **Check if port 27017 is available:**
   ```bash
   # On macOS/Linux
   lsof -i :27017
   # Kill process using the port
   kill -9 <PID>
   ```

### Port Already in Use

If you see `EADDRINUSE` error for ports 3000 or 5000:

```bash
# Find process using the port (macOS/Linux)
lsof -i :3000
lsof -i :5000

# Kill the process
kill -9 <PID>

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Dependencies Issues

If you encounter module not found errors:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# For both client and server
cd server && rm -rf node_modules package-lock.json && npm install
cd ../client && rm -rf node_modules package-lock.json && npm install
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