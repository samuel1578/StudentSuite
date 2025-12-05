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
  fullName: string;
  email: string;
  phone: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
}

export type ProfileField = 'fullName' | 'email' | 'phone' | 'room' | 'paymentStatus';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface RoomAssignment {
  roomId: string;
  roomTitle: string;
  bed?: string;
  moveInDate?: string;
  moveOutDate?: string;
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string;
  preferredName?: string;
  level?: string;
  avatarUrl?: string;
  room?: RoomAssignment;
  paymentStatus?: PaymentStatus;
  emergencyContact?: EmergencyContact;
  preferences?: string | string[];
  bio?: string;
  updatedAt?: string;
  completionPercent?: number;
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type TransportationPreference = 'yes_transportation' | 'no_own_ride';

export interface TransportPreferenceDocument {
  $id: string;
  userId: string;
  studentName: string;
  transportationPreference: TransportationPreference;
  $createdAt: string;
  $updatedAt: string;
}
