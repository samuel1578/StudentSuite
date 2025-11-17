import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Student Suite Hostels</h3>
            <p className="text-sm mb-4">
              Providing comfortable and affordable accommodation for students near campus.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Rooms</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Amenities</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>123 University Road, Accra, Ghana</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+233 24 123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>info@studentsuitehostels.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Student Suite Hostels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
