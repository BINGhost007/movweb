const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Review = require('../models/Review');
const Watchlist = require('../models/Watchlist');
const logger = require('../utils/logger');

// Sample movie data
const sampleMovies = [
  {
    tmdbId: 550,
    title: "Fight Club",
    originalTitle: "Fight Club",
    overview: "A ticking-time-bomb insomniac and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
    synopsis: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    tagline: "The first rule of Fight Club is: You don't talk about Fight Club.",
    genres: ["Drama"],
    genreDetails: [{ id: 18, name: "Drama" }],
    cast: [
      { name: "Edward Norton", character: "The Narrator", order: 1 },
      { name: "Brad Pitt", character: "Tyler Durden", order: 2 },
      { name: "Helena Bonham Carter", character: "Marla Singer", order: 3 }
    ],
    crew: [
      { name: "David Fincher", job: "Director", department: "Directing", order: 1 }
    ],
    releaseDate: new Date("1999-10-15"),
    runtime: 139,
    ratings: [
      { source: "imdb", value: 8.8, voteCount: 1940000 },
      { source: "rotten_tomatoes", value: 79, voteCount: 2000 }
    ],
    contentRating: "R",
    languages: ["English"],
    originalLanguage: "en",
    subtitles: [
      { language: "English", url: "/subtitles/fight-club-en.vtt", format: "vtt" },
      { language: "Spanish", url: "/subtitles/fight-club-es.vtt", format: "vtt" }
    ],
    videoFiles: [
      {
        quality: "720p",
        url: "/videos/fight-club-720p.mp4",
        fileSize: 2147483648,
        duration: 8340,
        codec: "H.264",
        bitrate: 2500
      },
      {
        quality: "1080p",
        url: "/videos/fight-club-1080p.mp4",
        fileSize: 4294967296,
        duration: 8340,
        codec: "H.264",
        bitrate: 5000
      }
    ],
    trailer: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=qtRKdVHc-cE",
      thumbnail: "/images/fight-club-trailer.jpg"
    },
    images: [
      {
        type: "poster",
        url: "/images/fight-club-poster.jpg",
        alt: "Fight Club Poster",
        width: 600,
        height: 900,
        size: 150000
      },
      {
        type: "banner",
        url: "/images/fight-club-banner.jpg",
        alt: "Fight Club Banner",
        width: 1920,
        height: 1080,
        size: 500000
      }
    ],
    metadata: {
      productionCompany: "20th Century Fox",
      productionCountries: ["US"],
      budget: 63000000,
      revenue: 101218804,
      awards: ["MTV Movie Award for Best Movie"]
    },
    statistics: {
      viewCount: 125000,
      likeCount: 9800,
      averageRating: 4.4,
      ratingCount: 2450,
      downloadCount: 1200
    },
    accessibility: {
      hasAudioDescription: true,
      hasClosedCaptions: true,
      audioLanguages: ["English", "Spanish"],
      signLanguageSupported: false
    },
    availability: {
      regions: ["US", "CA", "GB"],
      startDate: new Date("2024-01-01"),
      isActive: true
    },
    contentType: "standard",
    isOriginal: false,
    trendingScore: 8.5,
    status: "approved"
  },
  {
    tmdbId: 13,
    title: "Forrest Gump",
    originalTitle: "Forrest Gump",
    overview: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    synopsis: "The story of a man who, despite his low IQ, accomplishes great things and experiences significant historical events.",
    tagline: "Life is like a box of chocolates. You never know what you're going to get.",
    genres: ["Drama", "Romance"],
    genreDetails: [{ id: 18, name: "Drama" }, { id: 10749, name: "Romance" }],
    cast: [
      { name: "Tom Hanks", character: "Forrest Gump", order: 1 },
      { name: "Robin Wright", character: "Jenny Curran", order: 2 },
      { name: "Gary Sinise", character: "Lt. Dan Taylor", order: 3 }
    ],
    crew: [
      { name: "Robert Zemeckis", job: "Director", department: "Directing", order: 1 }
    ],
    releaseDate: new Date("1994-07-06"),
    runtime: 142,
    ratings: [
      { source: "imdb", value: 8.8, voteCount: 2100000 },
      { source: "rotten_tomatoes", value: 71, voteCount: 1500 }
    ],
    contentRating: "PG-13",
    languages: ["English"],
    originalLanguage: "en",
    subtitles: [
      { language: "English", url: "/subtitles/forrest-gump-en.vtt", format: "vtt" }
    ],
    videoFiles: [
      {
        quality: "720p",
        url: "/videos/forrest-gump-720p.mp4",
        fileSize: 2415919104,
        duration: 8520,
        codec: "H.264",
        bitrate: 2800
      }
    ],
    trailer: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=bLvqoHBptjg",
      thumbnail: "/images/forrest-gump-trailer.jpg"
    },
    images: [
      {
        type: "poster",
        url: "/images/forrest-gump-poster.jpg",
        alt: "Forrest Gump Poster",
        width: 600,
        height: 900,
        size: 120000
      }
    ],
    metadata: {
      productionCompany: "Paramount Pictures",
      productionCountries: ["US"],
      budget: 55000000,
      revenue: 678226465,
      awards: ["Academy Award for Best Picture"]
    },
    statistics: {
      viewCount: 180000,
      likeCount: 15200,
      averageRating: 4.6,
      ratingCount: 3200,
      downloadCount: 2100
    },
    accessibility: {
      hasAudioDescription: true,
      hasClosedCaptions: true,
      audioLanguages: ["English"],
      signLanguageSupported: true
    },
    availability: {
      regions: ["US", "CA", "GB"],
      startDate: new Date("2024-01-01"),
      isActive: true
    },
    contentType: "standard",
    isOriginal: false,
    trendingScore: 9.2,
    status: "approved"
  },
  {
    tmdbId: 155,
    title: "The Dark Knight",
    originalTitle: "The Dark Knight",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    synopsis: "Batman faces his greatest psychological and physical tests when the Joker wreaks havoc on Gotham.",
    tagline: "Why So Serious?",
    genres: ["Action", "Crime", "Drama"],
    genreDetails: [{ id: 28, name: "Action" }, { id: 80, name: "Crime" }, { id: 18, name: "Drama" }],
    cast: [
      { name: "Christian Bale", character: "Bruce Wayne", order: 1 },
      { name: "Heath Ledger", character: "Joker", order: 2 },
      { name: "Aaron Eckhart", character: "Harvey Dent", order: 3 }
    ],
    crew: [
      { name: "Christopher Nolan", job: "Director", department: "Directing", order: 1 }
    ],
    releaseDate: new Date("2008-07-18"),
    runtime: 152,
    ratings: [
      { source: "imdb", value: 9.0, voteCount: 2600000 },
      { source: "rotten_tomatoes", value: 94, voteCount: 3500 }
    ],
    contentRating: "PG-13",
    languages: ["English"],
    originalLanguage: "en",
    subtitles: [
      { language: "English", url: "/subtitles/dark-knight-en.vtt", format: "vtt" },
      { language: "Spanish", url: "/subtitles/dark-knight-es.vtt", format: "vtt" },
      { language: "French", url: "/subtitles/dark-knight-fr.vtt", format: "vtt" }
    ],
    videoFiles: [
      {
        quality: "720p",
        url: "/videos/dark-knight-720p.mp4",
        fileSize: 2576980377,
        duration: 9120,
        codec: "H.264",
        bitrate: 2800
      },
      {
        quality: "1080p",
        url: "/videos/dark-knight-1080p.mp4",
        fileSize: 5153960755,
        duration: 9120,
        codec: "H.264",
        bitrate: 5600
      },
      {
        quality: "4k",
        url: "/videos/dark-knight-4k.mp4",
        fileSize: 20615843020,
        duration: 9120,
        codec: "H.265",
        bitrate: 20000
      }
    ],
    trailer: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
      thumbnail: "/images/dark-knight-trailer.jpg"
    },
    images: [
      {
        type: "poster",
        url: "/images/dark-knight-poster.jpg",
        alt: "The Dark Knight Poster",
        width: 600,
        height: 900,
        size: 180000
      }
    ],
    metadata: {
      productionCompany: "Warner Bros. Pictures",
      productionCountries: ["US", "GB"],
      budget: 185000000,
      revenue: 1004938000,
      awards: ["Academy Award for Best Supporting Actor"]
    },
    statistics: {
      viewCount: 320000,
      likeCount: 28500,
      averageRating: 4.8,
      ratingCount: 5600,
      downloadCount: 4500
    },
    accessibility: {
      hasAudioDescription: true,
      hasClosedCaptions: true,
      audioLanguages: ["English", "Spanish", "French"],
      signLanguageSupported: true
    },
    availability: {
      regions: ["US", "CA", "GB", "AU"],
      startDate: new Date("2024-01-01"),
      isActive: true
    },
    contentType: "premium",
    isOriginal: false,
    trendingScore: 9.8,
    status: "approved"
  }
];

// Sample user data
const createSampleUsers = async () => {
  try {
    // Admin user
    const adminUser = new User({
      email: 'admin@movweb.com',
      password: 'Admin123!',
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        preferences: {
          language: 'en',
          autoplay: true,
          quality: '1080p',
          notifications: true
        }
      },
      subscription: {
        plan: 'family',
        status: 'active',
        autoRenew: true
      },
      isEmailVerified: true
    });

    // Regular user
    const regularUser = new User({
      email: 'user@movweb.com',
      password: 'User123!',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        preferences: {
          language: 'en',
          autoplay: false,
          quality: '720p',
          notifications: true
        }
      },
      subscription: {
        plan: 'basic',
        status: 'active',
        autoRenew: true
      },
      isEmailVerified: true
    });

    // Premium user
    const premiumUser = new User({
      email: 'premium@movweb.com',
      password: 'Premium123!',
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
        preferences: {
          language: 'en',
          autoplay: true,
          quality: '4k',
          notifications: true
        }
      },
      subscription: {
        plan: 'premium',
        status: 'active',
        autoRenew: true
      },
      isEmailVerified: true
    });

    await adminUser.save();
    await regularUser.save();
    await premiumUser.save();

    logger.info('Sample users created successfully');
    return { adminUser, regularUser, premiumUser };
  } catch (error) {
    logger.error('Error creating sample users:', error);
    throw error;
  }
};

// Create sample movies
const createSampleMovies = async (users) => {
  try {
    const movies = [];
    for (const movieData of sampleMovies) {
      const movie = new Movie({
        ...movieData,
        createdBy: users.adminUser._id
      });
      await movie.save();
      movies.push(movie);
    }

    logger.info('Sample movies created successfully');
    return movies;
  } catch (error) {
    logger.error('Error creating sample movies:', error);
    throw error;
  }
};

// Create sample reviews
const createSampleReviews = async (users, movies) => {
  try {
    const reviews = [
      {
        userId: users.regularUser._id,
        movieId: movies[0]._id, // Fight Club
        rating: 5,
        title: 'Mind-blowing!',
        content: 'This movie completely changed my perspective on life. The performances are incredible and the story is so well crafted.',
        isApproved: true,
        moderationStatus: 'approved'
      },
      {
        userId: users.premiumUser._id,
        movieId: movies[1]._id, // Forrest Gump
        rating: 5,
        title: 'A timeless classic',
        content: 'Tom Hanks delivers an outstanding performance. This movie makes you laugh, cry, and think about life.',
        isApproved: true,
        moderationStatus: 'approved'
      },
      {
        userId: users.regularUser._id,
        movieId: movies[2]._id, // The Dark Knight
        rating: 5,
        title: 'Heath Ledger was incredible',
        content: 'The Joker performance in this movie is absolutely phenomenal. Best superhero movie ever made.',
        isApproved: true,
        moderationStatus: 'approved'
      }
    ];

    for (const reviewData of reviews) {
      const review = new Review(reviewData);
      await review.save();
    }

    logger.info('Sample reviews created successfully');
  } catch (error) {
    logger.error('Error creating sample reviews:', error);
    throw error;
  }
};

// Create sample watchlist
const createSampleWatchlist = async (users, movies) => {
  try {
    const watchlist = new Watchlist({
      userId: users.regularUser._id,
      name: 'My Watchlist',
      description: 'Movies I want to watch',
      isDefault: true,
      isPublic: false,
      items: [
        {
          movieId: movies[0]._id, // Fight Club
          addedAt: new Date(),
          notes: 'Must watch this classic!',
          priority: 'high',
          tags: ['classic', 'drama']
        },
        {
          movieId: movies[2]._id, // The Dark Knight
          addedAt: new Date(),
          notes: 'Heard this is amazing',
          priority: 'medium',
          tags: ['action', 'superhero']
        }
      ]
    });

    await watchlist.save();
    logger.info('Sample watchlist created successfully');
  } catch (error) {
    logger.error('Error creating sample watchlist:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    logger.info('Starting database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Review.deleteMany({});
    await Watchlist.deleteMany({});

    logger.info('Cleared existing data');

    // Create sample data
    const users = await createSampleUsers();
    const movies = await createSampleMovies(users);
    await createSampleReviews(users, movies);
    await createSampleWatchlist(users, movies);

    logger.info('Database seeding completed successfully!');
    logger.info('Sample accounts created:');
    logger.info('Admin: admin@movweb.com (password: Admin123!)');
    logger.info('User: user@movweb.com (password: User123!)');
    logger.info('Premium: premium@movweb.com (password: Premium123!)');

    process.exit(0);

  } catch (error) {
    logger.error('Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, createSampleUsers, createSampleMovies };