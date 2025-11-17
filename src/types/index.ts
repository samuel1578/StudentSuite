export interface Room {
  id: string;
  type: 'Single' | 'Double' | 'Suite';
  title: string;
  price: string;
  availability: 'Available' | 'Limited' | 'Booked';
  image: string;
  description: string;
  detailedDescription?: string;
  size?: string;
  pricingOptions?: {
    monthly: string;
    semester: string;
    yearly: string;
  };
  location?: {
    building: string;
    floor: string;
    address: string;
    distanceFromCampus: string;
  };
  amenities?: string[];
  photos?: {
    main: string;
    kitchen?: string;
    bathroom?: string;
    gallery?: string[];
  };
  policies?: {
    checkIn: string;
    checkOut: string;
    guests: string;
    smoking: string;
    pets: string;
  };
  included?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  comment: string;
  avatar: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  distanceFromCampus: string;
  occupancy: string;
  image: string;
  highlights: string[];
}

export interface Booking {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  roomId: string;
  roomTitle: string;
  checkIn: string;
  checkOut: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  totalPrice: string;
}

export interface BookingFormData {
  studentName: string;
  email: string;
  phone: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
}
