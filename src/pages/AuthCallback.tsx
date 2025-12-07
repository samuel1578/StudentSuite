import { useEffect, useState } from 'react';
import { Account, Databases, Permission, Role } from 'appwrite';
import client from '../appwrite';
import { useRouter } from '../context/RouterContext';
import { DB_ID, PROFILES_COLLECTION_ID } from '../lib/appwriteIds.ts';

const account = new Account(client);
const databases = new Databases(client);

export default function AuthCallback() {
    const { navigate } = useRouter();
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let isActive = true;
        const finalizeOAuth = async () => {
            try {
                const user = await account.get();
                if (!user) {
                    throw new Error('No active session found after authentication.');
                }

                if (isActive) {
                    navigate('/dashboard');
                }

                const profileCollection = PROFILES_COLLECTION_ID;
                const databaseId = DB_ID;

                const profilePayload = {
                    userId: user.$id,
                    fullName: user.name ?? '',
                    email: user.email ?? '',
                    provider: 'google',
                    password: '__google_oauth__'
                };

                try {
                    const existingProfile = await databases.getDocument(databaseId, profileCollection, user.$id);
                    if (existingProfile) {
                        const updatePayload: Record<string, string> = { provider: 'google' };
                        if (!existingProfile.fullName && profilePayload.fullName) {
                            updatePayload.fullName = profilePayload.fullName;
                        }
                        if (!existingProfile.email && profilePayload.email) {
                            updatePayload.email = profilePayload.email;
                        }

                        if (Object.keys(updatePayload).length > 0) {
                            await databases.updateDocument(databaseId, profileCollection, user.$id, updatePayload);
                        }
                    }
                } catch (readError: any) {
                    console.warn('Profile lookup failed, attempting to create profile document.', readError);
                    try {
                        await databases.createDocument(
                            databaseId,
                            profileCollection,
                            user.$id,
                            profilePayload,
                            [
                                Permission.read(Role.user(user.$id)),
                                Permission.update(Role.user(user.$id))
                            ]
                        );
                    } catch (createError: any) {
                        if (createError?.code !== 409) {
                            console.error('Failed to create profile document.', createError);
                        } else {
                            console.info('Profile document already exists, continuing.');
                        }
                    }
                }
            } catch (err) {
                console.error('OAuth callback failed:', err);
                if (isActive) {
                    setHasError(true);
                }
            }
        };

        finalizeOAuth();
        return () => {
            isActive = false;
        };
    }, [navigate]);

    const handleRetry = () => {
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-xl shadow-rose-500/10 text-center dark:border-gray-800 dark:bg-gray-900">
                {!hasError ? (
                    <>
                        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-b-2 border-rose-500" />
                        <h1 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                            Signing you in…
                        </h1>
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                            We are securing your Student Suite account. This only takes a moment.
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Something went wrong
                        </h1>
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                            We could not finish signing you in.
                        </p>
                        <button
                            type="button"
                            onClick={handleRetry}
                            className="mt-6 inline-flex items-center justify-center rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                        >
                            Return to dashboard
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
