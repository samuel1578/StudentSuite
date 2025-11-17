import { useState, FormEvent } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            We're here to help. Get in touch with us today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">Visit Us</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              123 University Road<br />
              Accra, Ghana<br />
              Near University Campus
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">Call Us</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              +233 24 123 4567<br />
              +233 20 987 6543<br />
              Mon - Sat, 8AM - 6PM
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="bg-orange-100 dark:bg-orange-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">Email Us</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              info@studentsuitehostels.com<br />
              bookings@studentsuitehostels.com<br />
              We reply within 24 hours
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Inquiry about booking"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>

              {submitted && (
                <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 px-4 py-3 rounded-lg">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Office Hours
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-semibold">Monday - Friday</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">8:00 AM - 6:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-semibold">Saturday</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">9:00 AM - 4:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-semibold">Sunday</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>Map Placeholder</p>
                  <p className="text-sm">123 University Road, Accra</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                Need Immediate Assistance?
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                For urgent inquiries or emergencies, please call our hotline:
              </p>
              <a
                href="tel:+233241234567"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                <Phone className="w-4 h-4" />
                +233 24 123 4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
