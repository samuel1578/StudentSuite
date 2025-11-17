import { useState } from 'react';
import { Filter } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import { rooms } from '../data/sampleData';

export default function Rooms() {
  const [selectedType, setSelectedType] = useState<string>('All');

  const roomTypes = ['All', 'Single', 'Double', 'Suite'];

  const filteredRooms = selectedType === 'All'
    ? rooms
    : rooms.filter(room => room.type === selectedType);

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Available Rooms
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Find your perfect accommodation
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filter by:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {roomTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
              {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} found
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No rooms found for the selected filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
