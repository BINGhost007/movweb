require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  let client;
  
  try {
    console.log('Connecting to MongoDB using native driver...');
    
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movweb';
    client = new MongoClient(uri, { 
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000 
    });
    
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    const db = client.db('movweb');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await db.collection('users').deleteMany({});
    await db.collection('categories').deleteMany({});
    await db.collection('movies').deleteMany({});
    
    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = {
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profileImage: '/uploads/default-profile.jpg'
    };
    
    const adminResult = await db.collection('users').insertOne(adminUser);
    console.log('Admin user created:', adminUser.email);
    
    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const regularUser = {
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      profileImage: '/uploads/default-profile.jpg'
    };
    
    await db.collection('users').insertOne(regularUser);
    console.log('Regular user created:', regularUser.email);
    
    // Create categories
    const categories = [
      { name: 'Action', description: 'Action movies', createdAt: new Date() },
      { name: 'Comedy', description: 'Comedy movies', createdAt: new Date() },
      { name: 'Drama', description: 'Drama movies', createdAt: new Date() },
      { name: 'Sci-Fi', description: 'Science Fiction movies', createdAt: new Date() },
      { name: 'Horror', description: 'Horror movies', createdAt: new Date() },
      { name: 'Romance', description: 'Romance movies', createdAt: new Date() },
      { name: 'Thriller', description: 'Thriller movies', createdAt: new Date() },
      { name: 'Documentary', description: 'Documentary movies', createdAt: new Date() }
    ];
    
    const categoryResults = await db.collection('categories').insertMany(categories);
    console.log('Categories created:', categoryResults.insertedCount);
    
    // Get category IDs for movies
    const categoryIds = Object.values(categoryResults.insertedIds);
    
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
        categories: [categoryIds[0]], // Action
        tags: ['batman', 'superhero', 'crime'],
        createdBy: adminResult.insertedId,
        createdAt: new Date(),
        views: 0,
        downloads: 0
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
        categories: [categoryIds[3]], // Sci-Fi
        tags: ['sci-fi', 'mind-bending', 'action'],
        createdBy: adminResult.insertedId,
        createdAt: new Date(),
        views: 0,
        downloads: 0
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
        categories: [categoryIds[2]], // Drama
        tags: ['prison', 'friendship', 'hope'],
        createdBy: adminResult.insertedId,
        createdAt: new Date(),
        views: 0,
        downloads: 0
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
        categories: [categoryIds[6]], // Thriller
        tags: ['crime', 'tarantino', 'violence'],
        createdBy: adminResult.insertedId,
        createdAt: new Date(),
        views: 0,
        downloads: 0
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
        categories: [categoryIds[2]], // Drama
        tags: ['mafia', 'crime', 'classic'],
        createdBy: adminResult.insertedId,
        createdAt: new Date(),
        views: 0,
        downloads: 0
      },
      {
        title: 'Forrest Gump',
        description: 'The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold through the perspective of an Alabama man with an IQ of 75.',
        year: 1994,
        duration: 142,
        rating: 8.8,
        quality: 'HD',
        posterUrl: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
        streamingUrl: 'https://example.com/stream/forrest-gump.mp4',
        downloadUrl: 'https://example.com/download/forrest-gump.mp4',
        isPopular: true,
        categories: [categoryIds[2]], // Drama
        tags: ['friendship', 'comedy', 'drama'],
        createdBy: adminResult.insertedId,
        createdAt: new Date(),
        views: 0,
        downloads: 0
      },
      {
        title: 'The Matrix',
        description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
        year: 1999,
        duration: 136,
        rating: 8.7,
        quality: '4K',
        posterUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        streamingUrl: 'https://example.com/stream/matrix.mp4',
        downloadUrl: 'https://example.com/download/matrix.mp4',
        isPopular: true,
        categories: [categoryIds[3]], // Sci-Fi
        tags: ['action', 'cyberpunk', 'philosophy'],
        createdBy: adminResult.insertedId,
        createdAt: new Date(),
        views: 0,
        downloads: 0
      },
      {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
        year: 2001,
        duration: 178,
        rating: 8.8,
        quality: '4K',
        posterUrl: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
        streamingUrl: 'https://example.com/stream/lotr-fellowship.mp4',
        downloadUrl: 'https://example.com/download/lotr-fellowship.mp4',
        isPopular: true,
        categories: [categoryIds[3]], // Sci-Fi
        tags: ['fantasy', 'adventure', 'epic'],
        createdBy: adminResult.insertedId,
        createdAt: new Date(),
        views: 0,
        downloads: 0
      },
      {
        title: 'Titanic',
        description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
        year: 1997,
        duration: 194,
        rating: 7.8,
        quality: 'Full HD',
        posterUrl: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
        streamingUrl: 'https://example.com/stream/titanic.mp4',
        downloadUrl: 'https://example.com/download/titanic.mp4',
        categories: [categoryIds[5]], // Romance
        tags: ['romance', 'disaster', 'classic'],
        createdBy: adminResult.insertedId,
        createdAt: new Date(),
        views: 0,
        downloads: 0
      },
      {
        title: 'The Silence of the Lambs',
        description: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.',
        year: 1991,
        duration: 118,
        rating: 8.6,
        quality: 'HD',
        posterUrl: 'https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg',
        streamingUrl: 'https://example.com/stream/silence-lambs.mp4',
        downloadUrl: 'https://example.com/download/silence-lambs.mp4',
        categories: [categoryIds[4]], // Horror
        tags: ['psychological', 'thriller', 'crime'],
        createdBy: adminResult.insertedId,
        createdAt: new Date(),
        views: 0,
        downloads: 0
      },
      {
        title: 'Jurassic Park',
        description: 'A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids after a power failure causes the park\'s cloned dinosaurs to run loose.',
        year: 1993,
        duration: 127,
        rating: 8.1,
        quality: 'Full HD',
        posterUrl: 'https://image.tmdb.org/t/p/w500/c8Ass7acuOe4za6DhSattE359gr.jpg',
        streamingUrl: 'https://example.com/stream/jurassic-park.mp4',
        downloadUrl: 'https://example.com/download/jurassic-park.mp4',
        isPopular: true,
        categories: [categoryIds[3]], // Sci-Fi
        tags: ['dinosaurs', 'adventure', 'family'],
        createdBy: adminResult.insertedId,
        createdAt: new Date(),
        views: 0,
        downloads: 0
      },
      {
        title: 'The Avengers',
        description: 'Earth\'s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.',
        year: 2012,
        duration: 143,
        rating: 8.0,
        quality: '4K',
        posterUrl: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
        streamingUrl: 'https://example.com/stream/avengers.mp4',
        downloadUrl: 'https://example.com/download/avengers.mp4',
        isPopular: true,
        categories: [categoryIds[0]], // Action
        tags: ['superhero', 'action', 'marvel'],
        createdBy: adminResult.insertedId,
        createdAt: new Date(),
        views: 0,
        downloads: 0
      },
      {
        title: 'Casablanca',
        description: 'A cynical American expatriate struggles to decide whether or not he should help his former lover and her fugitive husband escape the Nazis in French Morocco.',
        year: 1942,
        duration: 102,
        rating: 8.5,
        quality: 'HD',
        posterUrl: 'https://image.tmdb.org/t/p/w500/lwH0W8Yp5P8s6Q6x3fX2L8G6G4P.jpg',
        streamingUrl: 'https://example.com/stream/casablanca.mp4',
        downloadUrl: 'https://example.com/download/casablanca.mp4',
        categories: [categoryIds[5]], // Romance
        tags: ['classic', 'romance', 'war'],
        createdBy: adminResult.insertedId,
        createdAt: new Date(),
        views: 0,
        downloads: 0
      },
      {
        title: 'Psycho',
        description: 'A Phoenix secretary embezzles $40,000 from her employer\'s client and goes on the run, checking into a remote motel run by a young man under the domination of his mother.',
        year: 1960,
        duration: 109,
        rating: 8.5,
        quality: 'HD',
        posterUrl: 'https://image.tmdb.org/t/p/w500/7Jm6xhfz8s7v6N9L0s9QK3bK7vV.jpg',
        streamingUrl: 'https://example.com/stream/psycho.mp4',
        downloadUrl: 'https://example.com/download/psycho.mp4',
        categories: [categoryIds[4]], // Horror
        tags: ['horror', 'classic', 'suspense'],
        createdBy: adminResult.insertedId,
        createdAt: new Date(),
        views: 0,
        downloads: 0
      }
    ];
    
    const movieResults = await db.collection('movies').insertMany(movies);
    console.log('Movies created:', movieResults.insertedCount);
    
    // Create indexes for better performance
    await db.collection('movies').createIndex({ title: 'text' });
    await db.collection('movies').createIndex({ isPopular: 1 });
    await db.collection('movies').createIndex({ categories: 1 });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    console.log('Database seeding completed successfully!');
    console.log(`Final counts:`);
    console.log(`- Users: ${await db.collection('users').countDocuments()}`);
    console.log(`- Categories: ${await db.collection('categories').countDocuments()}`);
    console.log(`- Movies: ${await db.collection('movies').countDocuments()}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
};

seedDatabase();