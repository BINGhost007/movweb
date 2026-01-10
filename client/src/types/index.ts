export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  profileImage?: string;
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  year: number;
  duration: number;
  rating: number;
  quality: 'SD' | 'HD' | 'Full HD' | '4K' | '8K';
  posterUrl: string;
  streamingUrl: string;
  downloadUrl?: string;
  isPopular: boolean;
  categories: { _id: string; name: string }[];
  tags: string[];
  views: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  createdBy: { _id: string; name: string };
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  createdAt: string;
}

export interface Favorite {
  _id: string;
  user: string;
  movie: Movie;
  createdAt: string;
}

export interface Watchlist {
  _id: string;
  user: string;
  movie: Movie;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  message?: string;
}

export interface Stats {
  movies: {
    total: number;
    popular: number;
    views: number;
    downloads: number;
  };
  users: {
    total: number;
    active: number;
    admin: number;
    inactive: number;
  };
  categories: {
    total: number;
  };
  topMovies: {
    byViews: { title: string; views: number }[];
    byDownloads: { title: string; downloads: number }[];
  };
}