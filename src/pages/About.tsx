import { Building2, Target, Award, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            About Student Suite Hostels
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
            Providing quality student accommodation since 2010
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Our Hostel"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Student Suite Hostels was founded in 2010 with a simple mission: to provide students with comfortable, affordable, and safe accommodation that feels like home.
              </p>
              <p>
                Located just minutes from major university campuses, our hostels offer more than just a place to sleep. We create a community where students can focus on their studies while enjoying a supportive and vibrant living environment.
              </p>
              <p>
                Over the years, we've grown from a single building to multiple locations, always maintaining our commitment to quality, safety, and student well-being.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            Our Mission & Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-400">
                To provide affordable, high-quality student accommodation that supports academic success and personal growth.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Excellence</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We maintain the highest standards in facilities, services, and student care.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <div className="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Community</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We foster a supportive environment where students can thrive together.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Our Amenities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                High-speed WiFi in all rooms and common areas
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                24/7 security with CCTV surveillance
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                Fully furnished rooms with study desks
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                Clean and modern bathroom facilities
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                Laundry services available
              </li>
            </ul>

            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                Common study areas and lounges
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                Shared kitchen facilities
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                Close proximity to campus (5-10 minutes walk)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                Regular maintenance and cleaning services
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                Friendly and responsive management team
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
