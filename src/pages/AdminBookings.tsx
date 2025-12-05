import { useEffect, useState } from 'react';
import { Account, Databases, Query, ID } from 'appwrite';
import client from '../appwrite';
import { useRouter } from '../context/RouterContext';
import { STATUS_META, BookingStatus } from '../lib/statusMeta';

const account = new Account(client);
const databases = new Databases(client);

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '691b378400072f91e003';
const BOOKINGS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_BOOKINGS_COLLECTION_ID || 'bookings';

interface BookingDoc {
    $id: string;
    fullName?: string;
    roomId?: string;
    checkIn?: string;
    checkOut?: string;
    status?: BookingStatus;
    userId?: string;
}

export default function AdminBookings() {
    const [bookings, setBookings] = useState<BookingDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const { navigate } = useRouter();

    useEffect(() => {
        const load = async () => {
            try {
                const currentUser = await account.get();
                const role = ((currentUser as any)?.prefs?.role === 'admin') ? 'admin' : 'user';
                if (role !== 'admin') {
                    // Not authorized, redirect to home
                    navigate('/');
                    return;
                }

                const res = await databases.listDocuments(DB_ID, BOOKINGS_COLLECTION_ID, [Query.orderDesc('$createdAt')]);
                setBookings(res.documents as BookingDoc[]);
            } catch (err) {
                console.error('Failed to load bookings', err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const updateStatus = async (id: string, newStatus: BookingStatus) => {
        setSavingId(id);
        try {
            await databases.updateDocument(DB_ID, BOOKINGS_COLLECTION_ID, id, { status: newStatus });
            setBookings((prev) => prev.map((b) => (b.$id === id ? { ...b, status: newStatus } : b)));
        } catch (err) {
            console.error('Failed to update booking', err);
            alert('Failed to update booking status. Please try again.');
        } finally {
            setSavingId(null);
        }
    };

    if (loading) return <div className="min-h-[40vh] flex items-center justify-center">Loading bookings...</div>;

    return (
        <div className="min-h-screen container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Manage Student Bookings</h1>
            {bookings.length === 0 ? (
                <div className="rounded-md border p-4 text-sm text-gray-600">No bookings found.</div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((b) => (
                        <div key={b.$id} className="rounded-lg border p-4 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{b.fullName || 'Anonymous'}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Room: {b.roomId || 'Unassigned'}</p>
                                    <p className="text-xs text-gray-400">{b.checkIn ? new Date(b.checkIn).toLocaleDateString() : '—'} — {b.checkOut ? new Date(b.checkOut).toLocaleDateString() : '—'}</p>
                                </div>
                                <div className="flex flex-wrap gap-2 items-center">
                                    {(Object.keys(STATUS_META) as BookingStatus[]).map((s) => {
                                        const meta = STATUS_META[s];
                                        const isActive = b.status === s;
                                        return (
                                            <button
                                                key={s}
                                                onClick={() => updateStatus(b.$id, s)}
                                                disabled={savingId === b.$id}
                                                className={`px-3 py-1 rounded-full w-full sm:w-auto text-sm font-medium ${meta.bg} ${meta.text} ${isActive ? `ring-2 ring-offset-1 ${meta.ring}` : 'opacity-90 hover:opacity-100'} transition`}
                                                title={meta.description}
                                            >
                                                {meta.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-2 sm:mt-3">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{STATUS_META[b.status || 'pending'].description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
