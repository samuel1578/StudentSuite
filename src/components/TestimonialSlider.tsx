import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../data/sampleData';

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
      <Quote className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4 opacity-50" />

      <div className="min-h-[200px] flex flex-col justify-center">
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 italic">
          "{testimonials[currentIndex].comment}"
        </p>

        <div className="flex items-center gap-4">
          <img
            src={testimonials[currentIndex].avatar}
            alt={testimonials[currentIndex].name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h4 className="font-bold text-gray-800 dark:text-white">
              {testimonials[currentIndex].name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Student</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-blue-600 dark:bg-blue-400 w-8'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
}
