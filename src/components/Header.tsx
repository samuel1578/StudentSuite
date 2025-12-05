import { useState, useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { Account } from 'appwrite';
import client from '../appwrite';
import DarkModeToggle from './DarkModeToggle';
import logo from '../assets/logo.webp';

export default function Header() {
  const { currentPath, navigate } = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const account = new Account(client);
        await account.get();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [currentPath]); // Re-check when path changes

  // Dynamic navigation based on authentication status
  const navLinks = [
    { path: '/', label: 'HOME' },
    { path: '/rooms', label: 'Rooms' },
    isAuthenticated
      ? { path: '/news', label: 'News' }
      : { path: '/booking', label: 'Book Now' },
    { path: '/menu', label: 'Menu' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    // Fixed on mobile (always visible) and sticky on medium+ screens.
    <header className="fixed md:sticky top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-800/95 shadow-md transition-colors backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-800/80">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 h-[115px]">
          <button
            type="button"
            onClick={() => handleNavigate('/')}
            className="flex h-full items-center justify-center md:justify-start w-full md:w-auto md:flex-shrink-0 text-xl font-bold text-gray-800 dark:text-white hover:text-rose-700 transition-colors focus:outline-none overflow-hidden"
          >
            <img
              src={logo}
              alt="Student Suite Hostels Logo"
              className="h-[300px] w-auto object-contain dark:brightness-0 dark:invert dark:opacity-90"
            />
          </button>

          <nav className="hidden md:flex items-center gap-3 lg:gap-4">
            {navLinks.map(link => (
              <button
                key={link.path}
                type="button"
                onClick={() => handleNavigate(link.path)}
                className={`font-charm uppercase text-sm font-semibold transition-colors focus:outline-none md:px-3 md:py-2 lg:px-4 md:rounded-full md:border md:border-transparent md:bg-white/70 md:shadow-sm md:hover:bg-rose-50 md:hover:border-rose-200 md:transition-all dark:md:bg-gray-800/70 dark:md:hover:bg-gray-700 ${currentPath === link.path
                  ? ' text-rose-700 dark:text-rose-200 md:bg-rose-100 md:border-rose-300 md:text-rose-700 dark:md:bg-rose-500/20 dark:md:border-rose-400'
                  : ' text-gray-600 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-300'
                  }`}
              >
                {link.label.toUpperCase()}
              </button>
            ))}
            <div className="ml-2 flex-shrink-0">
              <DarkModeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
