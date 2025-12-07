import { useEffect, useState, type FormEvent } from 'react';
import { Account, Databases, ID, Query } from 'appwrite';
import client from '../appwrite';
import { useRouter } from '../context/RouterContext';
import { TransportationPreference } from '../types';
import {
    AlertTriangle,
    Camera,
    Loader2,
    Save,
    User,
    Upload,
    BookOpen,
    Heart
} from 'lucide-react';

// Profile interface matching database schema
interface ProfileData {
    id?: string;
    userId?: string;
    photoUrl?: string;
    fullName: string;
    course: string;
    level: string;
    hobbies: string;
    bio: string;
    interests: string;
    transportationPreference: TransportationPreference;
    draft: boolean;
}

// Initialize Appwrite services
const account = new Account(client);
const databases = client ? new Databases(client) : null;

// Check if environment variables are ready
const envReady = !!client;

export default function Profile() {
    const { navigate } = useRouter();

    // State management
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [profileData, setProfileData] = useState<ProfileData>({
        fullName: '',
        course: '',
        level: '',
        hobbies: '',
        bio: '',
        interests: '',
        transportationPreference: 'no_own_ride',
        draft: true
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [existingProfile, setExistingProfile] = useState<ProfileData | null>(null);

    // Load current user and existing profile on mount
    useEffect(() => {
        loadUserAndProfile();
    }, []);

    const loadUserAndProfile = async () => {
        if (!envReady) {
            setError('Database connection not available. Please check your environment configuration.');
            return;
        }

        try {
            // Get current user
            const user = await account.get();
            setCurrentUser(user);
            console.log('User loaded successfully:', user.$id);

            // Try to load existing profile
            const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || '691b378400072f91e003';
            const collectionId = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID || 'profiles';

            console.log('Using database ID:', databaseId);
            console.log('Using collection ID:', collectionId);

            const profiles = await databases!.listDocuments(
                databaseId,
                collectionId,
                [Query.equal('userId', user.$id)]
            );

            if (profiles.documents.length > 0) {
                // If multiple profiles exist, use the most recent one and clean up duplicates
                const sortedProfiles = profiles.documents.sort((a: any, b: any) =>
                    new Date(b.$updatedAt).getTime() - new Date(a.$updatedAt).getTime()
                );

                const profile = sortedProfiles[0] as any;
                setExistingProfile({ ...profile, id: profile.$id });

                setProfileData({
                    id: profile.$id,
                    userId: profile.userId,
                    photoUrl: profile.photoUrl || undefined,
                    fullName: profile.fullName || user.name || '',
                    course: profile.course || '',
                    level: profile.level || '',
                    hobbies: profile.hobbies || '',
                    bio: profile.bio || '',
                    interests: profile.interests || '',
                    transportationPreference: profile.transportationPreference || 'no_own_ride',
                    draft: profile.draft ?? true
                });

                // Clean up duplicate profiles (keep only the most recent)
                if (profiles.documents.length > 1) {
                    console.log(`Found ${profiles.documents.length} profiles, cleaning up duplicates...`);
                    for (let i = 1; i < sortedProfiles.length; i++) {
                        try {
                            await databases!.deleteDocument(databaseId, collectionId, sortedProfiles[i].$id);
                            console.log(`Deleted duplicate profile: ${sortedProfiles[i].$id}`);
                        } catch (error) {
                            console.error('Error deleting duplicate profile:', error);
                        }
                    }
                }
            } else {
                // No existing profile found, pre-fill with user account information
                setProfileData(prev => ({
                    ...prev,
                    fullName: user.name || '',
                    userId: user.$id
                }));
            }
        } catch (error) {
            console.error('Failed to load user or profile:', error);
            const errorMessage = (error as any)?.message || 'Unknown error';
            if (errorMessage.includes('unauthorized') || errorMessage.includes('401')) {
                setError('You are not logged in. Please log in to access your profile.');
            } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
                setError('Network error. Please check your internet connection and try again.');
            } else {
                setError(`Cannot load user data: ${errorMessage}`);
            }
        }
    };

    const handleFieldChange = (field: keyof ProfileData, value: string | boolean) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const saveTransportationPreference = async (userId: string, studentName: string, transportationPreference: TransportationPreference) => {
        try {
            const transportDatabaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || '691b378400072f91e003';
            const transportCollectionId = import.meta.env.VITE_APPWRITE_TRANSPORT_COLLECTION_ID || 'transport_preferences';

            console.log('Saving transportation preference:', { userId, studentName, transportationPreference });

            // Check if user already has a transportation preference
            const existingTransport = await databases!.listDocuments(
                transportDatabaseId,
                transportCollectionId,
                [Query.equal('userId', userId)]
            );

            if (existingTransport.documents.length > 0) {
                // Update existing preference
                await databases!.updateDocument(
                    transportDatabaseId,
                    transportCollectionId,
                    existingTransport.documents[0].$id,
                    {
                        studentName,
                        transportationPreference
                    }
                );
                console.log('Updated existing transportation preference');
            } else {
                // Create new preference
                await databases!.createDocument(
                    transportDatabaseId,
                    transportCollectionId,
                    ID.unique(),
                    {
                        userId,
                        studentName,
                        transportationPreference
                    }
                );
                console.log('Created new transportation preference');
            }
        } catch (error) {
            console.error('Error saving transportation preference:', error);
            // Don't throw error to avoid disrupting profile save
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!currentUser || !envReady) {
            setError('User not authenticated or database not connected');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const profilePayload: any = {
                userId: currentUser.$id,
                fullName: profileData.fullName,
                course: profileData.course,
                level: profileData.level,
                hobbies: profileData.hobbies,
                bio: profileData.bio,
                interests: profileData.interests,
                transportationPreference: profileData.transportationPreference,
                draft: false // Mark as not draft when saving
            };

            // Only include photoUrl if it's a valid URL
            if (profileData.photoUrl && profileData.photoUrl.startsWith('http')) {
                profilePayload.photoUrl = profileData.photoUrl;
            }

            console.log('Saving profile with payload:', profilePayload);

            let savedProfile;

            const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || '691b378400072f91e003';
            const collectionId = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID || 'profiles';

            console.log('Save operation - Database ID:', databaseId);
            console.log('Save operation - Collection ID:', collectionId);

            // Check if we have an existing profile to update
            const existingProfileId = existingProfile?.$id || existingProfile?.id || profileData.id;

            console.log('Existing profile ID for update:', existingProfileId);

            if (existingProfileId) {
                // Update existing profile
                console.log('Updating existing profile with ID:', existingProfileId);
                savedProfile = await databases!.updateDocument(
                    databaseId,
                    collectionId,
                    existingProfileId,
                    profilePayload
                );
            } else {
                // Create new profile
                console.log('Creating new profile');
                savedProfile = await databases!.createDocument(
                    databaseId,
                    collectionId,
                    ID.unique(),
                    profilePayload
                );
            }

            // Also save transportation preference to the transport_preferences collection
            await saveTransportationPreference(currentUser.$id, profileData.fullName, profileData.transportationPreference);

            setSuccessMessage('Profile saved successfully!');
            setExistingProfile({ ...savedProfile, id: savedProfile.$id });
            setProfileData(prev => ({ ...prev, id: savedProfile.$id, draft: false }));

            // Navigate back to dashboard after success
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            setError((error as Error).message || 'Failed to save profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAsDraft = async () => {
        if (!currentUser || !envReady) {
            setError('User not authenticated or database not connected');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const draftPayload: any = {
                userId: currentUser.$id,
                fullName: profileData.fullName,
                course: profileData.course,
                level: profileData.level,
                hobbies: profileData.hobbies,
                bio: profileData.bio,
                interests: profileData.interests,
                transportationPreference: profileData.transportationPreference,
                draft: true
            };

            // Only include photoUrl if it's a valid URL
            if (profileData.photoUrl && profileData.photoUrl.startsWith('http')) {
                draftPayload.photoUrl = profileData.photoUrl;
            }

            const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || '691b378400072f91e003';
            const collectionId = import.meta.env.VITE_APPWRITE_PROFILES_COLLECTION_ID || 'profiles';

            // Check if we have an existing profile to update
            const existingProfileId = existingProfile?.$id || existingProfile?.id || profileData.id;

            if (existingProfileId) {
                await databases!.updateDocument(
                    databaseId,
                    collectionId,
                    existingProfileId,
                    draftPayload
                );
            } else {
                const savedDraft = await databases!.createDocument(
                    databaseId,
                    collectionId,
                    ID.unique(),
                    draftPayload
                );
                setExistingProfile({ ...savedDraft, id: savedDraft.$id });
            }

            setSuccessMessage('Draft saved successfully!');
        } catch (error) {
            setError((error as Error).message || 'Failed to save draft');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-6 pb-12 md:pt-12 md:pb-12 min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Student Profile
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Share your information with the Student Suite community
                    </p>
                </div>

                {/* Environment Warning */}
                {!envReady && (
                    <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50/70 p-4 flex gap-3 text-amber-800">
                        <AlertTriangle className="h-5 w-5" />
                        <div>
                            <p className="font-semibold">Database connection not available</p>
                            <p className="text-sm">Profile cannot be saved until database is configured.</p>
                        </div>
                    </div>
                )}

                {/* Success/Error Messages */}
                {(error || successMessage) && (
                    <div className={`mb-6 rounded-xl border p-4 text-sm ${error
                        ? 'border-red-200 bg-red-50 text-red-800'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-600 dark:text-emerald-200'
                        }`}>
                        {error || successMessage}
                    </div>
                )}

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">

                        {/* Profile Photo Section */}
                        <div className="mb-8 text-center">
                            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">
                                {profileData.photoUrl ? (
                                    <img
                                        src={profileData.photoUrl}
                                        alt="Profile"
                                        className="h-24 w-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="h-12 w-12" />
                                )}
                            </div>
                            <button
                                type="button"
                                disabled
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500"
                            >
                                <Camera className="h-4 w-4" />
                                Upload Photo (Coming Soon)
                            </button>
                        </div>

                        {/* Basic Information */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={profileData.fullName}
                                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Course/Program *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={profileData.course}
                                    onChange={(e) => handleFieldChange('course', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="e.g., Computer Science, Business Administration"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Academic Level *
                            </label>
                            <select
                                required
                                value={profileData.level}
                                onChange={(e) => handleFieldChange('level', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="">Select your level</option>
                                <option value="L100">L100 (Level 100)</option>
                                <option value="L200">L200 (Level 200)</option>
                                <option value="L300">L300 (Level 300)</option>
                                <option value="L400">L400 (Level 400)</option>
                                <option value="Grad">Grad (Graduate)</option>
                            </select>
                        </div>

                        {/* Hobbies */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Heart className="inline h-4 w-4 mr-1" />
                                Hobbies & Activities
                            </label>
                            <textarea
                                value={profileData.hobbies}
                                onChange={(e) => handleFieldChange('hobbies', e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                placeholder="Tell us about your hobbies, sports, activities, or things you enjoy doing in your free time..."
                            />
                        </div>

                        {/* Bio */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <BookOpen className="inline h-4 w-4 mr-1" />
                                Bio/About Me
                            </label>
                            <textarea
                                value={profileData.bio}
                                onChange={(e) => handleFieldChange('bio', e.target.value)}
                                rows={4}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                placeholder="Write a short bio about yourself. What makes you unique? What are your goals? What's your personality like?"
                            />
                        </div>

                        {/* Interests */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Interests & Preferences
                            </label>
                            <textarea
                                value={profileData.interests}
                                onChange={(e) => handleFieldChange('interests', e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-rose-500 focus:ring-rose-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                placeholder="What are you interested in? Academic subjects, career goals, lifestyle preferences, room preferences..."
                            />
                        </div>

                        {/* Transportation Preference */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Transportation Preference
                            </label>
                            <div className="space-y-3">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="transportation"
                                        value="yes_transportation"
                                        checked={profileData.transportationPreference === 'yes_transportation'}
                                        onChange={(e) => handleFieldChange('transportationPreference', e.target.value as TransportationPreference)}
                                        className="h-4 w-4 text-rose-600 border-gray-300 focus:ring-rose-500 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                                        Yes, please include transportation
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="transportation"
                                        value="no_own_ride"
                                        checked={profileData.transportationPreference === 'no_own_ride'}
                                        onChange={(e) => handleFieldChange('transportationPreference', e.target.value as TransportationPreference)}
                                        className="h-4 w-4 text-rose-600 border-gray-300 focus:ring-rose-500 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                                        No, I can arrange my own ride
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Profile Status */}
                        {existingProfile && (
                            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Profile Status</h3>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 ${profileData.draft
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {profileData.draft ? 'Draft' : 'Published'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                Back to Dashboard
                            </button>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleSaveAsDraft}
                                    disabled={isLoading || !envReady}
                                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Upload className="h-4 w-4" />
                                    )}
                                    Save as Draft
                                </button>

                                <button
                                    type="submit"
                                    disabled={isLoading || !envReady || !profileData.fullName || !profileData.course || !profileData.level}
                                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}
                                    Save Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}