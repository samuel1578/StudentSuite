import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-yellow-500" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-500" />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
}
