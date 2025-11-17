import { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { rooms } from '../data/sampleData';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Wifi, 
  Car, 
  Shield, 
  Clock, 
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface RoomDetailProps {
  roomId: string;
}

export default function RoomDetail({ roomId }: RoomDetailProps) {
  const { navigate } = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPricing, setSelectedPricing] = useState<'monthly' | 'semester' | 'yearly'>('monthly');
  
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Room Not Found</h1>
          <button
            onClick={() => navigate('/rooms')}
            className="text-rose-600 dark:text-rose-400 hover:underline"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  const allImages = [
    room.image,
    ...(room.photos?.gallery || []),
    room.photos?.kitchen,
    room.photos?.bathroom
  ].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/rooms')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Rooms
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img
                src={allImages[currentImageIndex]}
                alt={room.title}
                className="w-full h-full object-cover"
              />
              
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {allImages.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex 
                        ? 'border-rose-500' 
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${room.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Room Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-full text-sm font-medium mb-2">
                    {room.type}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {room.title}
                  </h1>
                  
                  {/* Pricing Options */}
                  {room.pricingOptions ? (
                    <div className="mt-4">
                      {/* Pricing Tabs */}
                      <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-3">
                        <button
                          onClick={() => setSelectedPricing('monthly')}
                          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                            selectedPricing === 'monthly'
                              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={() => setSelectedPricing('semester')}
                          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                            selectedPricing === 'semester'
                              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          Semester
                        </button>
                        <button
                          onClick={() => setSelectedPricing('yearly')}
                          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                            selectedPricing === 'yearly'
                              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          Yearly
                        </button>
                      </div>
                      
                      {/* Selected Price Display */}
                      <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">
                        {room.pricingOptions[selectedPricing]}
                      </p>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-2">
                      {room.price}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  room.availability === 'Available' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : room.availability === 'Limited'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {room.availability}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {room.detailedDescription || room.description}
              </p>

              {room.size && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <Users className="h-4 w-4" />
                  <span>{room.size}</span>
                </div>
              )}

              <button 
                onClick={() => navigate(`/booking?room=${room.id}`)}
                className="w-full bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={room.availability === 'Booked'}
              >
                {room.availability === 'Booked' ? 'Currently Unavailable' : 'Book Now'}
              </button>
            </div>

            {/* Location */}
            {room.location && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  Location
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Building:</strong> {room.location.building}</p>
                  <p><strong>Floor:</strong> {room.location.floor}</p>
                  <p><strong>Address:</strong> {room.location.address}</p>
                  <p><strong>Distance:</strong> {room.location.distanceFromCampus}</p>
                </div>
              </div>
            )}

            {/* Policies */}
            {room.policies && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  Policies
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Check-in:</strong> {room.policies.checkIn}</p>
                  <p><strong>Check-out:</strong> {room.policies.checkOut}</p>
                  <p><strong>Guests:</strong> {room.policies.guests}</p>
                  <p><strong>Smoking:</strong> {room.policies.smoking}</p>
                  <p><strong>Pets:</strong> {room.policies.pets}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Amenities & Included */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Wifi className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                Amenities
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What's Included */}
          {room.included && room.included.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                What's Included
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {room.included.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}