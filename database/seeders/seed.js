require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Category = require('../models/Category');
const Movie = require('../models/Movie');

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movweb');
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Movie.deleteMany({});

    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });

    console.log('Admin user created:', adminUser.email);

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      isActive: true
    });

    console.log('Regular user created:', regularUser.email);

    // Create categories
    const categories = [
      { name: 'Action', description: 'Action movies' },
      { name: 'Comedy', description: 'Comedy movies' },
      { name: 'Drama', description: 'Drama movies' },
      { name: 'Sci-Fi', description: 'Science Fiction movies' },
      { name: 'Horror', description: 'Horror movies' },
      { name: 'Romance', description: 'Romance movies' },
      { name: 'Thriller', description: 'Thriller movies' },
      { name: 'Documentary', description: 'Documentary movies' }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log('Categories created:', createdCategories.length);

    // Create sample movies
    const movies = [
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        year: 2008,
        duration: 152,
        rating: 9.0,
        quality: 'Full HD',
        posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        streamingUrl: 'https://example.com/stream/dark-knight.mp4',
        downloadUrl: 'https://example.com/download/dark-knight.mp4',
        isPopular: true,
        categories: [createdCategories[0]._id], // Action
        tags: ['batman', 'superhero', 'crime'],
        createdBy: adminUser._id
      },
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
        year: 2010,
        duration: 148,
        rating: 8.8,
        quality: '4K',
        posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        streamingUrl: 'https://example.com/stream/inception.mp4',
        downloadUrl: 'https://example.com/download/inception.mp4',
        isPopular: true,
        categories: [createdCategories[3]._id], // Sci-Fi
        tags: ['sci-fi', 'mind-bending', 'action'],
        createdBy: adminUser._id
      },
      {
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        year: 1994,
        duration: 142,
        rating: 9.3,
        quality: 'HD',
        posterUrl: 'https://image.tmdb.org/t/p/w500/9O7gLzmreU0nGkIB6K3BsJbzvNv.jpg',
        streamingUrl: 'https://example.com/stream/shawshank.mp4',
        downloadUrl: 'https://example.com/download/shawshank.mp4',
        categories: [createdCategories[2]._id], // Drama
        tags: ['prison', 'friendship', 'hope'],
        createdBy: adminUser._id
      },
      {
        title: 'Pulp Fiction',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        year: 1994,
        duration: 154,
        rating: 8.9,
        quality: 'Full HD',
        posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JU9kxab.jpg',
        streamingUrl: 'https://example.com/stream/pulp-fiction.mp4',
        downloadUrl: 'https://example.com/download/pulp-fiction.mp4',
        categories: [createdCategories[6]._id], // Thriller
        tags: ['crime', 'tarantino', 'violence'],
        createdBy: adminUser._id
      },
      {
        title: 'The Godfather',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        year: 1972,
        duration: 175,
        rating: 9.2,
        quality: '4K',
        posterUrl: 'https://image.tmdb.org/t/p/w500/3Bk3j7zXPQy0H0HQ5oL3W4JQJ3M.jpg',
        streamingUrl: 'https://example.com/stream/godfather.mp4',
        downloadUrl: 'https://example.com/download/godfather.mp4',
        isPopular: true,
        categories: [createdCategories[2]._id], // Drama
        tags: ['mafia', 'crime', 'classic'],
        createdBy: adminUser._id
      }
    ];

    const createdMovies = await Movie.insertMany(movies);
    console.log('Movies created:', createdMovies.length);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();