import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import WatchlistPage from './pages/WatchlistPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/:genre" element={<CategoriesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="*"
              element={
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-8">
                  <h1 className="text-2xl font-bold text-white">Page not found</h1>
                  <p className="mt-2 text-gray-400">Try going back to the homepage.</p>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
