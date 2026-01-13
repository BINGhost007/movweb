import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <header className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-6xl px-4">
            <div className="h-16 flex items-center justify-between">
              <NavLink to="/" className="text-lg font-extrabold tracking-tight">
                MovieStream
              </NavLink>

              <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium text-slate-700">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    [
                      'px-3 py-2 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors',
                      isActive ? 'bg-slate-100 text-slate-900' : '',
                    ].join(' ')
                  }
                >
                  Home
                </NavLink>
                <a
                  href="#popular"
                  className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  Popular
                </a>
                <a
                  href="#genres"
                  className="hidden sm:inline-flex px-3 py-2 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  Genres
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="*"
                element={
                  <div className="rounded-lg border border-slate-200 bg-white p-8">
                    <h1 className="text-2xl font-bold">Page not found</h1>
                    <p className="mt-2 text-slate-600">Try going back to the homepage.</p>
                  </div>
                }
              />
            </Routes>
          </div>
        </main>

        <footer className="bg-white border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-4 py-6">
            <p className="text-sm text-slate-600">© {new Date().getFullYear()} MovieStream</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
