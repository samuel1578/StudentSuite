import { useState, useEffect, type FormEvent, Fragment } from 'react';
import {
  ArrowRight,
  Calendar,
  History,
  Home,
  Lock,
  MessageSquare,
  Mail,
  Newspaper,
  ShieldCheck,
  BusFront,
  User,
  Wrench,
  Wallet,
  BookOpen,
  Award,
  Check,
  AlertTriangle
} from 'lucide-react';
import DarkModeToggle from '../components/DarkModeToggle';
import { sampleProfiles } from '../data/sampleData';
import { useRouter } from '../context/RouterContext';
import { Account, Databases, ID, Query } from 'appwrite';
import client from '../appwrite';
import { TransportationPreference, TransportPreferenceDocument, PaymentStatus } from '../types';

// Create Account instance once at module level
const account = new Account(client);
const databases = new Databases(client);

// Appwrite DB and Collection IDs — update these placeholders with your actual database and collection IDs
const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '691b378400072f91e003';
const BOOKINGS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_BOOKINGS_COLLECTION_ID || 'bookings';
const PROFILES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID || 'profiles';

/*
  Required document-level permissions for bookings:
    Permission.read(Role.user(ownerId)),
    Permission.read(Role.team('admins')),
    Permission.update(Role.team('admins')).
  Note: Use Role and Permission when creating documents so teams/users have proper access.
*/
type BookingStatus = 'pending' | 'accepted' | 'awaiting_payment' | 'finished';

type ProfileSummary = {
  fullName: string;
  email: string;
  course?: string;
  level?: string;
  hobbies?: string;
  bio?: string;
  transportationPreference?: TransportationPreference | string;
  paymentStatus?: PaymentStatus | string;
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: 'user' | 'admin' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transportChoice, setTransportChoice] = useState<'yes' | 'no' | ''>('');
  const [transportMessage, setTransportMessage] = useState('');
  const [transportError, setTransportError] = useState('');
  const [existingTransportPreference, setExistingTransportPreference] = useState<TransportPreferenceDocument | null>(null);
  const [transportLoading, setTransportLoading] = useState<boolean>(false);
  const [adminBookings, setAdminBookings] = useState<unknown[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [profileSummary, setProfileSummary] = useState<ProfileSummary | null>(null);
  const [isProfileSummaryLoading, setIsProfileSummaryLoading] = useState(false);
  const { navigate } = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await account.get();
        const role: 'user' | 'admin' = ((currentUser as { prefs?: { role?: string } }).prefs?.role === 'admin') ? 'admin' : 'user'; // TODO: Strongly type Appwrite prefs access
        setUser({ name: currentUser.name, email: currentUser.email, role });
        setIsAuthenticated(true);

        // Fetch admin bookings if admin
        if (role === 'admin') {
          try {
            const response = await databases.listDocuments(DB_ID, COLLECTION_ID);
            setAdminBookings(response.documents);
          } catch (error) {
            console.error('Failed to fetch bookings:', error);
          }
        }
        // Load profile for user on sign in
        try {
          await hydrateProfileSummary(currentUser.$id, currentUser.name, currentUser.email);
        } catch (err) {
          console.error('Failed to hydrate profile summary:', err);
        }
      } catch (err) {
        console.log('User not authenticated', err);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setTransportChoice('');
      setTransportMessage('');
      setTransportError('');
    }
  }, [isAuthenticated]);

  const loadTransportationPreference = async () => {
    if (!isAuthenticated) return;
    try {
      const currentUser = await account.get();
      const databaseId = DB_ID;
      const collectionId = import.meta.env.VITE_APPWRITE_TRANSPORT_COLLECTION_ID || 'transport_preferences';
      const response = await databases.listDocuments(databaseId, collectionId, [Query.equal('userId', currentUser.$id), Query.limit(1), Query.orderDesc('$createdAt')]);
      if (response.documents.length > 0) {
        const preference = response.documents[0] as TransportPreferenceDocument;
        setExistingTransportPreference(preference);
        setTransportChoice(preference.transportationPreference === 'yes_transportation' ? 'yes' : 'no');
        // Update profile summary transportationPreference if we already have profileSummary
        setProfileSummary(prev => prev ? { ...prev, transportationPreference: preference.transportationPreference } : prev);
      }
    } catch (error) {
      console.error('Failed to load transportation preference:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadTransportationPreference();
    }
  }, [isAuthenticated]);

  const userMenuItems = [
    {
      title: 'Book a Room',
      description: 'Reserve your accommodation by filling out our booking form.',
      icon: Calendar,
      path: '/current-booking',
      requiresAuth: false
    },
    {
      title: 'Current Booking',
      description: 'View your active reservation details, check-in dates, and room information.',
      icon: Home,
      path: '/current-booking',
      requiresAuth: true,
      // roles: ['user', 'admin']
    },
    {
      title: 'Booking History',
      description: 'Access your past and upcoming bookings, download receipts and documents.',
      icon: History,
      path: '/booking-history',
      requiresAuth: true,
      // roles: ['user', 'admin']
    },
    {
      title: 'News & Updates',
      description: 'Stay informed about property updates, community events, and announcements.',
      icon: Newspaper,
      path: '/news',
      requiresAuth: false,
      // roles: ['user', 'admin']
    },
    {
      title: 'Maintenance',
      description: 'Submit maintenance requests and track the status of your service tickets.',
      icon: Wrench,
      path: '/maintenance',
      requiresAuth: true,
      // roles: ['user', 'admin']
    },
    {
      title: 'Messages',
      description: 'Communicate with property management and access your message history.',
      icon: MessageSquare,
      path: '/messages',
      requiresAuth: true,
      // roles: ['user', 'admin']
    },
    {
      title: 'Support',
      description: 'Get help from our support team, access FAQ, and contact information.',
      icon: ShieldCheck,
      path: '/support',
      requiresAuth: false,
      // roles: ['user', 'admin']
    },
    // Admin only items (deprecated: 'Admin Dashboard' removed from the general menu)
    // Booking Management removed from main user menu to avoid accidental admin access
  ];

  const hydrateProfileSummary = async (userId: string, fallbackName: string, fallbackEmail: string) => {
    setIsProfileSummaryLoading(true);
    try {
      if (DB_ID && PROFILES_COLLECTION_ID) {
        const response = await databases.listDocuments(DB_ID, PROFILES_COLLECTION_ID, [Query.equal('userId', userId)]);
        if (response.documents.length > 0) {
          const doc: any = response.documents[0];
          setProfileSummary({
            fullName: doc.fullName || fallbackName,
            email: doc.email || fallbackEmail,
            course: doc.course || 'Not set',
            level: doc.level || 'Not set',
            hobbies: doc.hobbies || 'Not set',
            bio: doc.bio || 'Not set',
            transportationPreference: doc.transportationPreference || undefined,
            paymentStatus: (doc.paymentStatus as PaymentStatus) || 'Pending'
          });
          return;
        }
      }
      const fallbackProfile = sampleProfiles.find(profile => profile.email === fallbackEmail) || sampleProfiles[0];
      setProfileSummary({
        fullName: fallbackProfile?.fullName || fallbackName,
        email: fallbackProfile?.email || fallbackEmail,
        course: 'Not set',
        level: 'Not set',
        hobbies: 'Not set',
        bio: 'Not set',
        transportationPreference: undefined,
        paymentStatus: fallbackProfile?.paymentStatus || 'Pending'
      });
    } catch (err) {
      console.error('Unable to load profile summary', err);
    } finally {
      setIsProfileSummaryLoading(false);
    }
  };

  const adminMenuItems = [
    {
      title: 'Manage Student Bookings',
      description: 'View and manage all student booking requests and reservations.',
      icon: Calendar,
      path: '/admin/bookings',
      requiresAuth: true
    },
    {
      title: 'Transportation Survey Results',
      description: 'View and analyze all student transportation preferences.',
      icon: BusFront,
      path: '/admin/transportation',
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
      title: 'Maintenance',
      description: 'Submit maintenance requests and track the status of your service tickets.',
      icon: Wrench,
      path: '/maintenance',
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
      title: 'Support',
      description: 'Get help from our support team, access FAQ, and contact information.',
      icon: ShieldCheck,
      path: '/support',
      requiresAuth: true
    }
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;
  // Defensive filter: ensure no direct '/admin' landing card shows in menus for any user
  const filteredMenuItems = menuItems.filter((item) => item.path !== '/admin');

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
      const role: 'user' | 'admin' = ((currentUser as { prefs?: { role?: string } }).prefs?.role === 'admin') ? 'admin' : 'user'; // TODO: Strongly type Appwrite prefs access
      setUser({ name: currentUser.name, email: currentUser.email, role });
      setIsAuthenticated(true);
      console.log('User info:', currentUser);

    } catch (error: unknown) {
      console.error(`${mode} failed:`, error);
      const err = error as { code?: number; type?: string; message?: string; name?: string };

      // Provide more specific error messages based on error type
      let errorMessage = (err.message as string) || 'An unexpected error occurred';

      // Check for specific Appwrite error codes first
      if (err.code === 409) {
        errorMessage = 'An account with this email already exists. Please try signing in instead.';
      } else if (err.code === 401) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 400) {
        errorMessage = 'Invalid input. Please check your email and password meet the requirements.';
      } else if (err.type === 'general_unauthorized_scope' || err.code === 403) {
        errorMessage = 'Authentication service is not properly configured. Please contact support.';
      } else if (err.type === 'project_unknown' || (err.message && err.message.includes('project') && err.message.includes('not found'))) {
        errorMessage = 'Authentication service is not available. Please contact support.';
      } else if ((err.message && err.message.includes('CORS')) || err.type === 'general_cors_disabled') {
        errorMessage = 'Cannot connect to authentication service. Please try again later or contact support.';
      } else if (err.name === 'TypeError' && err.message && err.message.includes('fetch')) {
        // Only treat as network error if it's a TypeError with fetch (actual network failure)
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (err.message && err.message.toLowerCase().includes('network') && !err.message.includes('fetch')) {
        // Only treat as network error if explicitly mentioned and not just from fetch API
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }

      alert(`${mode} failed: ${errorMessage}`);
    }
  };

  const handleTransportationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated || !user) {
      alert('Please sign in to share your transportation preference.');
      return;
    }

    if (!transportChoice) {
      setTransportError('Please choose an option before submitting.');
      return;
    }

    setTransportError('');
    setTransportLoading(true);

    try {
      const databaseId = DB_ID;
      const collectionId = import.meta.env.VITE_APPWRITE_TRANSPORT_COLLECTION_ID || 'transport_preferences';
      const transportationPreference: TransportationPreference = transportChoice === 'yes' ? 'yes_transportation' : 'no_own_ride';
      const currentUser = await account.get();
      const preferenceData = { userId: currentUser.$id, studentName: currentUser.name || user?.name || 'Anonymous', transportationPreference };

      if (existingTransportPreference) {
        await databases.updateDocument(databaseId, collectionId, existingTransportPreference.$id, preferenceData);
      } else {
        const newPref = await databases.createDocument(databaseId, collectionId, ID.unique(), preferenceData);
        setExistingTransportPreference(newPref as TransportPreferenceDocument);
      }

      const message = transportChoice === 'yes' ? 'Thanks! We will prioritize transportation services based on interest.' : 'Thanks for the feedback. Transportation will remain optional for now.';
      setTransportMessage(message);
    } catch (error: unknown) {
      const err = error as { message?: string };
      console.error('Failed to save transport preference', err);
      setTransportError('Failed to save preference. Please try again.');
    } finally {
      setTransportLoading(false);
    }
  };

  // (Old placeholder handleTransportationSubmit removed in favor of async version above)

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
    console.log('Menu item clicked:', path, 'requiresAuth:', requiresAuth, 'isAuthenticated:', isAuthenticated, 'userRole:', user?.role);
    if (requiresAuth && !isAuthenticated) {
      alert('Please sign in to access this feature.');
      return;
    }
    console.log('Calling navigate with:', path);
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
    <div className="pt-6 pb-12 md:pt-12 md:pb-12 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Mobile Dark Mode Toggle removed — using profile card toggle instead */}

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
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 mt-0">
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
                    Personalize Profile
                  </button>
                  <div className="px-4 py-2 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                    <DarkModeToggle />
                  </div>
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

          {/* Profile Snapshot - 6 cards */}
          {isAuthenticated && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Snapshot</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">A quick view of your key profile details.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/profile')}
                    className="px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors dark:text-rose-400 dark:bg-rose-900/20"
                  >
                    Personalize Profile
                  </button>
                </div>
              </div>

              {isProfileSummaryLoading ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse dark:bg-gray-700" />
                  ))}
                </div>
              ) : (
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: 'Name', value: profileSummary?.fullName || user?.name || 'Not set', icon: User },
                    { label: 'Course', value: profileSummary?.course || 'Not set', icon: BookOpen },
                    { label: 'Level', value: profileSummary?.level || 'Not set', icon: Award },
                    { label: 'Hobbies', value: profileSummary?.hobbies || 'Not set', icon: Newspaper },
                    { label: 'Bio', value: profileSummary?.bio || 'Not set', icon: Mail },
                    { label: 'Transportation', value: (existingTransportPreference?.transportationPreference ?? profileSummary?.transportationPreference) || 'Not set yet', icon: BusFront }
                  ].map((field, idx) => {
                    const completed = field.value && field.value !== 'Not set' && field.value !== 'Not set yet' && field.value !== 'Pending';
                    const Icon = field.icon as any;
                    let displayValue = field.value as string;
                    if (displayValue === 'yes_transportation') displayValue = 'Yes, include transportation';
                    if (displayValue === 'no_own_ride') displayValue = 'No, I can arrange my own ride';

                    return (
                      <div
                        key={idx}
                        className={`rounded-lg border p-3 ${completed ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-600' : 'bg-white dark:bg-gray-800'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`rounded-full p-2 ${completed ? 'bg-emerald-600 text-white dark:bg-emerald-500' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                            {/* For special cases (Hobbies, Bio) use emoticons instead of check icons */}
                            {field.label === 'Hobbies' ? (
                              <span className="text-lg">🕺</span>
                            ) : field.label === 'Bio' ? (
                              <span className="text-lg">🧍</span>
                            ) : (
                              <Icon className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{field.label}</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{displayValue}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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

            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isDisabled = item.requiresAuth && !isAuthenticated;

              if (item.title === 'Transportation Survey' && user?.role !== 'admin') {
                return (
                  <Fragment key={item.title}>
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-center gap-3 mb-3">
                        <BusFront className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Campus Transportation Survey
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Let us know if you want campus transportation included in our next destination plans.
                      </p>
                      {isAuthenticated ? (
                        <form onSubmit={handleTransportationSubmit} className="mt-4 space-y-4">
                          <div className="flex flex-wrap gap-4">
                            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <input
                                type="radio"
                                name="transport"
                                value="yes"
                                checked={transportChoice === 'yes'}
                                onChange={() => {
                                  setTransportChoice('yes');
                                  setTransportError('');
                                  setTransportMessage('');
                                }}
                                className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                              />
                              Yes, please include transportation
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <input
                                type="radio"
                                name="transport"
                                value="no"
                                checked={transportChoice === 'no'}
                                onChange={() => {
                                  setTransportChoice('no');
                                  setTransportError('');
                                  setTransportMessage('');
                                }}
                                className="h-4 w-4 text-rose-600 focus:ring-rose-500"
                              />
                              No, I can arrange my own ride
                            </label>
                          </div>
                          {transportError && (
                            <p className="text-sm text-rose-600 dark:text-rose-400">{transportError}</p>
                          )}
                          {transportMessage && (
                            <p className="text-sm text-emerald-600 dark:text-emerald-400">{transportMessage}</p>
                          )}
                          <button
                            type="submit"
                            disabled={transportLoading}
                            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {transportLoading ? 'Submitting...' : 'Submit preference'}
                          </button>
                        </form>
                      ) : (
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                          Sign in to share your transportation preference.
                        </p>
                      )}
                    </div>

                    <button
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
                  </Fragment>
                );
              }

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

          {/* Admin Booking Management */}
          {user?.role === 'admin' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage bookings and system settings
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Management</h3>
                <div className="space-y-4">
                  {adminBookings.map((booking: any) => (
                    <div key={booking.$id} className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{booking.fullName}</p>
                          <div className="mt-6">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                              Profile snapshot
                            </p>
                            {isProfileSummaryLoading ? (
                              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {[0, 1, 2, 3, 4, 5].map(item => (
                                  <div key={item} className="h-16 rounded-lg bg-gray-100 animate-pulse dark:bg-gray-700" />
                                ))}
                              </div>
                            ) : (
                              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                  { label: 'Name', value: profileSummary?.fullName || user?.name || 'Not set', icon: User },
                                  { label: 'Email', value: profileSummary?.email || user?.email || 'Not set', icon: Mail },
                                  { label: 'Course', value: profileSummary?.course || 'Not set', icon: Calendar },
                                  { label: 'Level', value: profileSummary?.level || 'Not set', icon: User },
                                  { label: 'Hobbies', value: profileSummary?.hobbies || 'Not set', icon: Newspaper },
                                  { label: 'Payment Status', value: profileSummary?.paymentStatus || 'Pending', icon: Wallet }
                                ].map((field, idx) => {
                                  const completed = field.value && field.value !== 'Not set' && field.value !== 'Pending' && field.value !== '';
                                  const Icon = field.icon as any;
                                  return (
                                    <div
                                      key={idx}
                                      className={`rounded-lg border p-3 ${completed ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-600' : 'bg-white dark:bg-gray-800'}`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`rounded-full p-2 ${completed ? 'bg-emerald-600 text-white dark:bg-emerald-500' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                          {completed ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                        </div>
                                        <div>
                                          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{field.label}</p>
                                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{field.value}</p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                        <select
                          value={booking.status}
                          onChange={async (e) => {
                            if (user?.role !== 'admin') {
                              alert('You do not have permission to update booking status.');
                              return;
                            }
                            const newStatus = e.target.value as BookingStatus;
                            const prevStatus = booking.status as BookingStatus;
                            // Optimistically update UI
                            setAdminBookings(prev => prev.map(b => b.$id === booking.$id ? { ...b, status: newStatus } : b));
                            setSavingId(booking.$id);
                            try {
                              // Use DB_ID/COLLECTION_ID constants defined above
                              await databases.updateDocument(DB_ID, COLLECTION_ID, booking.$id, { status: newStatus });
                            } catch (error) {
                              console.error('Failed to update status:', error);
                              // Revert to previous status
                              setAdminBookings(prev => prev.map(b => b.$id === booking.$id ? { ...b, status: prevStatus } : b));
                              alert('Failed to update booking status. Please try again.');
                            } finally {
                              setSavingId(null);
                            }
                          }}
                          disabled={savingId === booking.$id}
                          className="px-3 py-1 border border-gray-300 rounded text-sm dark:border-gray-600 dark:bg-gray-700"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="awaiting_payment">Awaiting Payment</option>
                          <option value="finished">Finished</option>
                        </select>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>Room: {booking.roomId}</p>
                        <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                        <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
