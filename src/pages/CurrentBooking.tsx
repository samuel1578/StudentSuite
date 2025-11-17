import { CheckCircle } from 'lucide-react';
import BookingForm from '../components/BookingForm';
import { BookingFormData } from '../types';
import { rooms } from '../data/sampleData';

export default function CurrentBooking() {
  const handleBookingSubmit = (data: BookingFormData) => {
    const selectedRoom = rooms.find(r => r.id === data.roomId);
    console.log('Booking submitted:', { ...data, room: selectedRoom });
    // TODO: Connect to backend here
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Book Your Room
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Fill in your details to reserve your accommodation
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Booking Process
                </h3>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>1. Fill in your personal information</li>
                  <li>2. Select your preferred room and dates</li>
                  <li>3. Submit the booking request</li>
                  <li>4. Our team will contact you within 24 hours to confirm</li>
                </ul>
              </div>
            </div>
          </div>

          <BookingForm onSubmit={handleBookingSubmit} />

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
