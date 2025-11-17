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
  <header className="bg-white/95 dark:bg-gray-800/95 shadow-md sticky top-0 z-50 transition-colors backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-800/80">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 h-[115px]">
          <button
            type="button"
            onClick={() => handleNavigate('/')}
            className="flex h-full items-center justify-center md:justify-start w-full md:w-auto text-xl font-bold text-gray-800 dark:text-white hover:text-rose-700 transition-colors focus:outline-none overflow-hidden"
          >
            <img
              src={logo}  
              alt="Student Suite Hostels Logo"
              className="h-[300px] w-auto object-contain dark:brightness-0 dark:invert dark:opacity-90"
            />
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <button
                key={link.path}
                type="button"
                onClick={() => handleNavigate(link.path)}
                className={`text-sm font-semibold transition-colors ${
                  currentPath === link.path
                    ? 'text-rose-700 dark:text-rose-300'
                    : 'text-gray-600 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-300'
                }`}
              >
                {link.label}
              </button>
            ))}
            <DarkModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
