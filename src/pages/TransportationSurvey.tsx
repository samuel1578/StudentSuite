import { useState, useEffect } from 'react';
import { Account, Databases } from 'appwrite';
import client from '../appwrite';
import { TransportPreferenceDocument } from '../types';
import { ArrowLeft, BusFront, Car, Download, Users } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

const account = new Account(client);
const databases = new Databases(client);

const TransportationSurvey = () => {
    const { navigate } = useRouter();
    const [preferences, setPreferences] = useState<TransportPreferenceDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        loadUserAndPreferences();
    }, []);

    const loadUserAndPreferences = async () => {
        try {
            // Check user authentication and admin role
            const currentUser = await account.get();
            const role = (currentUser.prefs as any)?.role;

            if (role !== 'admin') {
                navigate('/dashboard');
                return;
            }

            setUser(currentUser);

            // Load transportation preferences
            const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || '691b378400072f91e003';
            const transportCollectionId = import.meta.env.VITE_APPWRITE_TRANSPORT_COLLECTION_ID || 'transport_preferences';

            const response = await databases.listDocuments(
                databaseId,
                transportCollectionId
            );

            setPreferences(response.documents as unknown as TransportPreferenceDocument[]);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const getPreferenceLabel = (preference: string) => {
        return preference === 'yes_transportation'
            ? 'Yes, please include transportation'
            : 'No, I can arrange my own ride';
    };

    const getPreferenceStats = () => {
        const total = preferences.length;
        const needsTransport = preferences.filter(p => p.transportationPreference === 'yes_transportation').length;
        const ownRide = preferences.filter(p => p.transportationPreference === 'no_own_ride').length;

        return { total, needsTransport, ownRide };
    };

    const exportToCSV = () => {
        const csvContent = [
            ['Student Name', 'User ID', 'Transportation Preference', 'Submitted At'],
            ...preferences.map(p => [
                p.studentName,
                p.userId,
                getPreferenceLabel(p.transportationPreference),
                new Date(p.$createdAt).toLocaleDateString()
            ])
        ]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transportation_survey_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading transportation survey...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const stats = getPreferenceStats();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Transportation Survey Results
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Student transportation preferences for program coordination
                            </p>
                        </div>
                        <button
                            onClick={exportToCSV}
                            className="inline-flex items-center bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <Users className="w-8 h-8 text-blue-500" />
                            <div className="ml-4">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</h3>
                                <p className="text-gray-600 dark:text-gray-400">Total Responses</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <BusFront className="w-8 h-8 text-green-500" />
                            <div className="ml-4">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.needsTransport}</h3>
                                <p className="text-gray-600 dark:text-gray-400">Need Transportation</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <Car className="w-8 h-8 text-orange-500" />
                            <div className="ml-4">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.ownRide}</h3>
                                <p className="text-gray-600 dark:text-gray-400">Own Transportation</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Responses Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Responses</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Detailed view of all transportation preferences
                        </p>
                    </div>

                    {preferences.length === 0 ? (
                        <div className="p-8 text-center">
                            <BusFront className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No responses yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Transportation preferences will appear here as students submit them.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Student
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Transportation Preference
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Submitted
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {preferences.map((preference) => (
                                        <tr key={preference.$id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {preference.studentName}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    ID: {preference.userId.slice(-8)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {preference.transportationPreference === 'yes_transportation' ? (
                                                        <>
                                                            <BusFront className="w-4 h-4 text-green-500 mr-2" />
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                Needs Transportation
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Car className="w-4 h-4 text-orange-500 mr-2" />
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                                                Own Transportation
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(preference.$createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransportationSurvey;