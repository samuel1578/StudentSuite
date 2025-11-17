import { Check, X } from 'lucide-react';
import { Room } from '../types';
import { useRouter } from '../context/RouterContext';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const { navigate } = useRouter();

  const getAvailabilityColor = () => {
    switch (room.availability) {
      case 'Available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Limited':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Booked':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={room.image}
          alt={room.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor()}`}>
          {room.availability}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{room.title}</h3>
          <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
            {room.type}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{room.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{room.price}</span>
          {room.location && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {room.location.distanceFromCampus}
            </span>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/rooms/${room.id}`)}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => navigate(`/booking?room=${room.id}`)}
            disabled={room.availability === 'Booked'}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              room.availability === 'Booked'
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            {room.availability === 'Booked' ? 'Unavailable' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
