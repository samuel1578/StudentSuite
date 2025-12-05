import { Room, Testimonial, Booking, Property, UserProfile } from '../types';

export const rooms: Room[] = [
  {
    id: '1',
    type: 'Single',
    title: 'Cozy Single Room',
    price: '₵800/month',
    pricingOptions: {
      monthly: '₵800/month',
      semester: '₵3000/semester',
      yearly: '₵8000/year'
    },
    availability: 'Available',
    image: 'https://hostelgig.com/_managers/media/Makassela%20Hostel/gallery/4c4eb3572d53788c4667ea1d1ad93809.jpg',
    description: 'Perfect for students who value privacy and quiet study time.',
    detailedDescription: 'This comfortable single room offers the perfect balance of privacy and functionality for dedicated students. Featuring a spacious layout with ample natural light, built-in study desk, and modern furnishings designed for academic success.',
    size: '12 sqm',
    location: {
      building: 'Akua Court',
      floor: '2nd Floor',
      address: 'North Ridge, Accra',
      distanceFromCampus: '5 min walk'
    },
    amenities: [
      'High-speed Wi-Fi',
      'Study desk & chair',
      'Built-in wardrobe',
      'Air conditioning',
      'Private balcony',
      'Reading light',
      'Power outlets',
      'Secure key card access'
    ],
    photos: {
      main: 'https://hostelgig.com/_managers/media/Makassela%20Hostel/gallery/4c4eb3572d53788c4667ea1d1ad93809.jpg',
      kitchen: 'https://hostelgig.com/_managers/media/Makassela%20Hostel/gallery/ccc0b2db1a230060ba84fb9d169ef09b.jpg',
      bathroom: 'https://hostelgig.com/_managers/media/Makassela%20Hostel/gallery/ec13f2ebce7c9b0a5b21340319b097a7.jpg',
      gallery: ['https://hostelgig.com/_managers/media/Makassela%20Hostel/gallery/1453a86b41ccb17302dbb0823403b4f8.jpg']
    },
    policies: {
      checkIn: '2:00 PM',
      checkOut: '12:00 PM',
      guests: 'No overnight guests',
      smoking: 'Non-smoking',
      pets: 'Not allowed'
    },
    included: ['Utilities', 'Internet', 'Cleaning service (weekly)', 'Security']
  },
  {
    id: '2',
    type: 'Double',
    title: 'Double Comfort',
    price: '₵1200/month',
    pricingOptions: {
      monthly: '₵1200/month',
      semester: '₵4500/semester',
      yearly: '₵1200/year'
    },
    availability: 'Limited',
    image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Spacious room ideal for sharing with a friend or classmate.',
    detailedDescription: 'Share your university experience with a friend in this thoughtfully designed double room. Each resident gets their own study space, storage, and sleeping area while enjoying the benefits of companionship and shared living costs.',
    size: '18 sqm',
    location: {
      building: 'Akua Court',
      floor: '1st Floor',
      address: 'North Ridge, Accra',
      distanceFromCampus: '5 min walk'
    },
    amenities: [
      'High-speed Wi-Fi',
      'Two study desks',
      'Twin beds',
      'Shared wardrobe',
      'Air conditioning',
      'Window with garden view',
      'Individual reading lights',
      'Multiple power outlets',
      'Secure entry'
    ],
    photos: {
      main: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800',
      kitchen: '',
      bathroom: '',
      gallery: []
    },
    policies: {
      checkIn: '2:00 PM',
      checkOut: '12:00 PM',
      guests: 'Registered guests only',
      smoking: 'Non-smoking',
      pets: 'Not allowed'
    },
    included: ['Utilities', 'Internet', 'Cleaning service (bi-weekly)', 'Security', 'Shared common areas']
  },
  {
    id: '3',
    type: 'Suite',
    title: 'Luxury Suite',
    price: '₵2000/month',
    pricingOptions: {
      monthly: '₵2000/month',
      semester: '₵7500/semester',
      yearly: '₵2000/year'
    },
    availability: 'Booked',
    image: 'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Premium accommodation with private bathroom and study area.',
    detailedDescription: 'Experience luxury student living in this premium suite featuring a private bathroom, kitchenette, and separate study area. Perfect for students who want the ultimate in comfort and privacy during their academic journey.',
    size: '25 sqm',
    location: {
      building: 'Legon View Residences',
      floor: '3rd Floor',
      address: 'N1 Bypass, Legon',
      distanceFromCampus: '8 min shuttle ride'
    },
    amenities: [
      'Private bathroom',
      'Kitchenette with fridge',
      'Premium furnishing',
      'Study area with bookshelf',
      'Queen-size bed',
      'Walk-in closet',
      'Air conditioning',
      'Private balcony',
      'High-speed Wi-Fi',
      'Smart TV',
      'Coffee machine'
    ],
    photos: {
      main: 'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=800',
      kitchen: '',
      bathroom: '',
      gallery: []
    },
    policies: {
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      guests: 'Guests allowed with prior notice',
      smoking: 'Non-smoking',
      pets: 'Small pets allowed with deposit'
    },
    included: ['All utilities', 'Premium internet', 'Daily housekeeping', '24/7 security', 'Concierge service', 'Gym access']
  },
  {
    id: '4',
    type: 'Single',
    title: 'Modern Single',
    price: '₵850/month',
    pricingOptions: {
      monthly: '₵850/month',
      semester: '₵3200/semester',
      yearly: '₵850/year'
    },
    availability: 'Available',
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Contemporary design with all modern amenities.',
    detailedDescription: 'Step into the future of student accommodation with this ultra-modern single room. Featuring contemporary design, smart home features, and eco-friendly amenities, this room is perfect for tech-savvy students who appreciate modern living.',
    size: '14 sqm',
    location: {
      building: 'East Haven Suites',
      floor: '4th Floor',
      address: 'East Legon Hills',
      distanceFromCampus: '12 min ride-share'
    },
    amenities: [
      'Smart lighting system',
      'USB charging stations',
      'Modern study desk',
      'Ergonomic chair',
      'Built-in storage solutions',
      'Climate control',
      'Floor-to-ceiling windows',
      'High-speed fiber internet',
      'Modern furnishing',
      'Bluetooth sound system'
    ],
    photos: {
      main: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
      kitchen: '',
      bathroom: '',
      gallery: []
    },
    policies: {
      checkIn: '2:00 PM',
      checkOut: '12:00 PM',
      guests: 'Day guests allowed',
      smoking: 'Non-smoking',
      pets: 'Not allowed'
    },
    included: ['Utilities', 'High-speed internet', 'Weekly cleaning', 'Security', 'Pool access', 'Rooftop lounge']
  },
  {
    id: '5',
    type: 'Double',
    title: 'Twin Sharing Room',
    price: '₵1150/month',
    availability: 'Available',
    image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Budget-friendly option with comfortable twin beds.'
  },
  {
    id: '6',
    type: 'Suite',
    title: 'Executive Suite',
    price: '₵2200/month',
    availability: 'Available',
    image: 'https://images.pexels.com/photos/1267438/pexels-photo-1267438.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Top-tier accommodation with premium furnishings.'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'John Doe',
    comment: 'Great place to stay near campus! The facilities are excellent and the staff is very helpful.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '2',
    name: 'Ama Kwame',
    comment: 'Friendly staff and clean rooms. I feel safe and comfortable here. Highly recommend!',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '3',
    name: 'Kwesi Mensah',
    comment: 'The best hostel experience I\'ve had. Close to campus and very affordable.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '4',
    name: 'Sarah Adams',
    comment: 'Perfect for students! Fast WiFi, quiet study areas, and great community.',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200'
  }
];

export const properties: Property[] = [
  {
    id: 'p1',
    name: 'Akua Court',
    address: 'North Ridge, Accra',
    distanceFromCampus: '5 min walk to campus',
    occupancy: '92% occupied',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Studio & 2-Bed Units', 'In-house Café', 'Female-only Wing']
  },
  {
    id: 'p2',
    name: 'Legon View Residences',
    address: 'N1 Bypass, Legon',
    distanceFromCampus: '8 min shuttle ride',
    occupancy: '87% occupied',
    image: 'https://images.pexels.com/photos/3237804/pexels-photo-3237804.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Group Study Pods', 'Gym & Yoga Studio', '24/7 Concierge']
  },
  {
    id: 'p3',
    name: 'East Haven Suites',
    address: 'East Legon Hills',
    distanceFromCampus: '12 min ride-share',
    occupancy: '78% occupied',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Pool & Rooftop Lounge', 'Cinema Nights', 'Secure Bike Storage']
  },
  {
    id: 'p4',
    name: 'Labone Loft',
    address: 'Labone Crescent',
    distanceFromCampus: '15 min bus ride',
    occupancy: '93% occupied',
    image: 'https://images.pexels.com/photos/3074749/pexels-photo-3074749.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Co-working Hub', 'Meditation Garden', 'On-site Laundry']
  }
];

export const sampleBookings: Booking[] = [
  {
    id: 'B001',
    studentName: 'John Doe',
    email: 'john@example.com',
    phone: '+233 24 123 4567',
    roomId: '1',
    roomTitle: 'Cozy Single Room',
    checkIn: '2024-01-15',
    checkOut: '2024-06-15',
    status: 'Active',
    totalPrice: '₵4000'
  },
  {
    id: 'B002',
    studentName: 'John Doe',
    email: 'john@example.com',
    phone: '+233 24 123 4567',
    roomId: '2',
    roomTitle: 'Double Comfort',
    checkIn: '2023-09-01',
    checkOut: '2023-12-20',
    status: 'Completed',
    totalPrice: '₵3600'
  }
];

export const sampleProfiles: UserProfile[] = [
  {
    id: 'P001',
    userId: 'user_001',
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+233 24 123 4567',
    room: {
      roomId: '1',
      roomTitle: 'Cozy Single Room',
      moveInDate: '2024-01-15',
      moveOutDate: '2024-06-15'
    },
    paymentStatus: 'Pending',
    emergencyContact: {
      name: 'Mary Doe',
      relationship: 'Parent',
      phone: '+233 24 765 4321'
    },
    preferences: ['Quiet wing', 'Upper floor'],
    bio: 'Final-year Computer Science major balancing thesis research and student leadership duties.',
    completionPercent: 78,
    updatedAt: '2025-11-20T10:00:00.000Z'
  }
];
