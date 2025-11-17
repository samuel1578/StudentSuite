import { useState, useEffect } from 'react';
import { Compass, Home, MessageCircle, User, Calendar, ShoppingBag } from 'lucide-react';
import { Account } from 'appwrite';
import client from '../appwrite';
import { useRouter } from '../context/RouterContext';

export default function BottomNav() {
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
  }, [currentPath]);

  // Dynamic navigation based on authentication
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/rooms', label: 'Explore', icon: Compass },
    isAuthenticated 
      ? { path: '/news', label: 'News', icon: Calendar }
      : { path: '/booking', label: 'Book', icon: ShoppingBag },
    { path: '/menu', label: 'Menu', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden">
      <div className="grid grid-cols-4">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-rose-700 dark:text-rose-300'
                  : 'text-gray-500 dark:text-gray-400 hover:text-rose-700 dark:hover:text-rose-300'
              }`}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
