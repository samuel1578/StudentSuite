import { useState, useEffect, type FormEvent } from 'react';
import {
  ArrowRight,
  Calendar,
  Clock,
  History,
  Home,
  Lock,
  LogIn,
  LogOut,
  MessageSquare,
  Newspaper,
  ShieldCheck,
  User,
  UserPlus,
  Wrench
} from 'lucide-react';
import DarkModeToggle from '../components/DarkModeToggle';
import { useRouter } from '../context/RouterContext';
import { Account } from 'appwrite';
import client from '../appwrite';

// Create Account instance once at module level
const account = new Account(client);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { navigate } = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await account.get();
        setUser({ name: currentUser.name, email: currentUser.email });
        setIsAuthenticated(true);
      } catch (error) {
        console.log('User not authenticated');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const menuItems = [
    {
      title: 'Current Booking',
      description: 'View your active reservation details, check-in dates, and room information.',
      icon: Home,
      path: '/current-booking',
      requiresAuth: true
    },
    {
      title: 'Booking History',
      description: 'Access your past and upcoming bookings, download receipts and documents.',
      icon: History,
      path: '/booking-history',
      requiresAuth: true
    },
    {
      title: 'News & Updates',
      description: 'Stay informed about property updates, community events, and announcements.',
      icon: Newspaper,
      path: '/news',
      requiresAuth: false
    },
    {
      title: 'Maintenance',
      description: 'Submit maintenance requests and track the status of your service tickets.',
      icon: Wrench,
      path: '/maintenance',
      requiresAuth: true
    },
    {
      title: 'Messages',
      description: 'Communicate with property management and access your message history.',
      icon: MessageSquare,
      path: '/messages',
      requiresAuth: true
    },
    {
      title: 'Support',
      description: 'Get help from our support team, access FAQ, and contact information.',
      icon: ShieldCheck,
      path: '/support',
      requiresAuth: false
    }
  ];

  const sampleNews = [
    {
      title: 'Campus Safety Reminder',
      description: 'Important safety guidelines for walking around campus during evening hours.',
      date: '2025-11-15',
      type: 'Safety'
    },
    {
      title: 'Block Party After Internal Assessment',
      description: 'Join us for a community block party to celebrate the end of internal assessments!',
      date: '2025-11-20',
      type: 'Event'
    },
    {
      title: 'End of Semester Exam Schedule',
      description: 'Final exam schedules have been posted. Check your student portal for details.',
      date: '2025-11-18',
      type: 'Academic'
    }
  ];

  const handleAuthSubmit = (mode: 'signup' | 'login') => async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if Appwrite is properly configured
    if (!import.meta.env.VITE_APPWRITE_PROJECT_ID) {
      alert('Authentication service is not configured. Please contact support.');
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    try {
      if (mode === 'signup') {
        // Create new account
        await account.create('unique()', email, password, fullName);
        console.log('Account created successfully');
      }

      // Sign in (for both signup and login)
      await account.createEmailPasswordSession(email, password);
      console.log('Signed in successfully');

      // Get user info and update state
      const currentUser = await account.get();
      setUser({ name: currentUser.name, email: currentUser.email });
      setIsAuthenticated(true);
      console.log('User info:', currentUser);

    } catch (error: any) {
      console.error(`${mode} failed:`, error);

      // Provide more specific error messages
      let errorMessage = error.message || 'An unexpected error occurred';

      // Check for specific Appwrite error codes first
      if (error.code === 409) {
        errorMessage = 'An account with this email already exists. Please try signing in instead.';
      } else if (error.code === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.code === 400) {
        errorMessage = 'Invalid input. Please check your email and password meet the requirements.';
      } else if (error.type === 'general_unauthorized_scope' || error.code === 403) {
        errorMessage = 'Authentication service is not properly configured. Please contact support.';
      } else if (error.type === 'project_unknown' || error.message?.includes('project') && error.message?.includes('not found')) {
        errorMessage = 'Authentication service is not available. Please contact support.';
      } else if (error.message?.includes('CORS') || error.type === 'general_cors_disabled') {
        errorMessage = 'Cannot connect to authentication service. Please try again later or contact support.';
      } else if (error.name === 'TypeError' && error.message?.includes('fetch')) {
        // Only treat as network error if it's a TypeError with fetch (actual network failure)
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message?.toLowerCase().includes('network') && !error.message?.includes('fetch')) {
        // Only treat as network error if explicitly mentioned and not just from fetch API
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }

      alert(`${mode} failed: ${errorMessage}`);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      // Get current origin for redirect URLs
      const origin = window.location.origin;
      await account.createOAuth2Session('google' as any, `${origin}/`, `${origin}/`);
    } catch (error) {
      console.error('Google authentication failed:', error);
      alert('Google authentication is not available. Please use email/password sign in.');
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setIsAuthenticated(false);
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleMenuItemClick = (path: string, requiresAuth: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      alert('Please sign in to access this feature.');
      return;
    }
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Mobile Dark Mode Toggle */}
        <div className="mb-6 flex justify-end md:hidden">
          <DarkModeToggle />
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Auth Card - Always visible, transforms when authenticated */}
          {!isAuthenticated ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl shadow-rose-500/5 dark:border-gray-800 dark:bg-gray-950">
              <Lock className="h-10 w-10 text-rose-600 dark:text-rose-400 mx-auto" />
              <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white text-center">
                Sign in to access Menu
              </h1>
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
                Create an account or sign in to access your personalized menu and manage your Student Suite experience.
              </p>

              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition ${activeTab === 'signup'
                      ? 'border-rose-600 bg-rose-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-rose-400 dark:border-gray-700 dark:text-gray-300'
                    }`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold transition ${activeTab === 'login'
                      ? 'border-rose-600 bg-rose-600 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-rose-400 dark:border-gray-700 dark:text-gray-300'
                    }`}
                >
                  Sign In
                </button>
              </div>

              <form onSubmit={handleAuthSubmit(activeTab)} className="mt-6 space-y-4">
                {activeTab === 'signup' && (
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />
                )}
                <input
                  type="email"
                  name="email"
                  placeholder="Student email"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  {activeTab === 'signup' ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              {/* OAuth Authentication Options */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white dark:bg-gray-950 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full inline-flex justify-center items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* User Profile Card - Shows when authenticated */
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center flex-shrink-0">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {user?.name || 'User'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user?.email || ''}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Manage your account and preferences
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => navigate('/profile')}
                    className="px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors dark:text-rose-400 dark:bg-rose-900/20 dark:border-rose-800 dark:hover:bg-rose-900/30"
                  >
                    Account
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items - Always visible */}
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student Suite Menu</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access all your features and services
              </p>
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isDisabled = item.requiresAuth && !isAuthenticated;

              return (
                <button
                  key={item.title}
                  onClick={() => handleMenuItemClick(item.path, item.requiresAuth)}
                  disabled={isDisabled}
                  className={`w-full rounded-xl border p-6 text-left transition ${isDisabled
                      ? 'border-gray-200 bg-gray-100 opacity-60 dark:border-gray-700 dark:bg-gray-800'
                      : 'border-gray-200 bg-white hover:border-rose-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-rose-600'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${isDisabled
                        ? 'bg-gray-200 dark:bg-gray-700'
                        : 'bg-rose-100 dark:bg-rose-900/30'
                      }`}>
                      <Icon className={`h-6 w-6 ${isDisabled
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-rose-600 dark:text-rose-400'
                        }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              );
            })}

            {/* News Preview */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Latest News</h3>
              </div>
              <div className="space-y-3">
                {sampleNews.slice(0, 2).map((news, index) => (
                  <div key={index} className="border-l-4 border-rose-500 pl-4">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{news.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{news.type} • {news.date}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleMenuItemClick('/news', false)}
                className="mt-4 text-sm text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
              >
                View all news →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
