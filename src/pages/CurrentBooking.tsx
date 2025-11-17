import { useState, useEffect } from 'react';
import { Account, Databases, Query, Models } from 'appwrite';
import { Calendar, Clock, Home, User, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import client from '../appwrite';
import BookingForm from '../components/BookingForm';
import { BookingFormData } from '../types';
import { createBooking } from '../lib/createBooking';
import { useRouter } from '../context/RouterContext';

const account = new Account(client);
const databases = new Databases(client);

const DATABASE_ID = '691b378400072f91e003';
const BOOKINGS_COLLECTION_ID = 'bookings';
const DEFAULT_HOSTEL_ID = 'student-suite-main';
const ROOM_MONTHLY_RATES: Record<string, number> = {
    'cozy-single-room': 800,
    'double-delight-room': 600,
    'executive-suite-room': 1200,
    'penthouse-suite-room': 1500
};

export default function CurrentBooking() {
    const { navigate } = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentBooking, setCurrentBooking] = useState<Models.Document | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        checkAuthAndFetchBooking();
    }, []);

    const checkAuthAndFetchBooking = async () => {
        try {
            // Check if user is authenticated
            const user = await account.get();
            setIsAuthenticated(true);

            // Fetch user's active booking
            const response = await databases.listDocuments(
                DATABASE_ID,
                BOOKINGS_COLLECTION_ID,
                [
                    Query.equal('userId', user.$id),
                    Query.orderDesc('$createdAt'),
                    Query.limit(1)
                ]
            );

            if (response.documents.length > 0) {
                setCurrentBooking(response.documents[0]);
            }
        } catch (error) {
            console.error('Auth or fetch error:', error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookingSubmit = async (data: BookingFormData) => {
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            const checkInISO = new Date(data.checkIn).toISOString();
            const checkOutISO = new Date(data.checkOut).toISOString();

            const monthRate = ROOM_MONTHLY_RATES[data.roomId] ?? 0;
            const stayDays = Math.max(
                1,
                Math.ceil(
                    (new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
            );
            const estimatedTotal =
                monthRate === 0
                    ? 0
                    : Number(((monthRate / 30) * stayDays).toFixed(2));

            const bookingData = {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                roomId: data.roomId,
                checkIn: checkInISO,
                checkOut: checkOutISO,
                guests: data.guests,
                specialRequests: data.specialRequests || '',
                status: 'pending',
                hostelId: DEFAULT_HOSTEL_ID,
                totalAmount: estimatedTotal
            };

            const result = await createBooking(bookingData);

            if (result) {
                setCurrentBooking(result);
                setSubmitSuccess(true);
                console.log('Booking created successfully:', result);
            } else {
                setSubmitError('Failed to create booking. Please try again.');
            }
        } catch (error: any) {
            console.error('Booking submission error:', error);
            setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="max-w-md mx-auto px-4 text-center">
                    <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Authentication Required
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Please sign in to view or create a booking.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Show booking details if user has an active booking
    if (currentBooking) {
        return (
            <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                                Your Current Booking
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Here are the details of your active reservation
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-rose-500 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {currentBooking.fullName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-rose-500 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {currentBooking.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-rose-500 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {currentBooking.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Home className="h-5 w-5 text-rose-500 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Room</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            Room #{currentBooking.roomId}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-rose-500 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Check-in</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {new Date(currentBooking.checkIn).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-rose-500 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Check-out</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {new Date(currentBooking.checkOut).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-rose-500 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Guests</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {currentBooking.guests}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-rose-500 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                            {currentBooking.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {currentBooking.specialRequests && (
                                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Special Requests</p>
                                    <p className="text-gray-900 dark:text-white">
                                        {currentBooking.specialRequests}
                                    </p>
                                </div>
                            )}

                            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Booked on {new Date(currentBooking.$createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show booking form if no active booking
    return (
        <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                            No Active Booking
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            You don't have an active booking yet. Create one below!
                        </p>
                    </div>

                    {submitSuccess && (
                        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <p className="text-green-800 dark:text-green-300">
                                    Booking created successfully! Refreshing...
                                </p>
                            </div>
                        </div>
                    )}

                    {submitError && (
                        <div className="mb-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                <p className="text-rose-800 dark:text-rose-300">{submitError}</p>
                            </div>
                        </div>
                    )}

                    <BookingForm onSubmit={handleBookingSubmit} disabled={isSubmitting} />

                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                            Important Information
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>• Valid student ID required at check-in</li>
                            <li>• Minimum booking period: 1 month</li>
                            <li>• Deposit: One month's rent (refundable)</li>
                            <li>• Payment methods: Cash, Mobile Money, Bank Transfer</li>
                            <li>• Cancellation policy: 7 days notice required</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
