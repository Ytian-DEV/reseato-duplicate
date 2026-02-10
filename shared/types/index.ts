export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RestaurantImage {
  id?: string;
  url: string;
  imageUrl?: string;
  isPrimary: boolean;
}

export interface Table {
  id: string;
  tableNumber: string;
  capacity: number;
  restaurantId: string;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  cuisine: string;
  cuisineType: string; // Added to match usage
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  openingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  openingTime: string; // Added to match usage
  closingTime: string; // Added to match usage
  images: RestaurantImage[];
  tables?: Table[];
  rating: number; // Changed to required
  reviewCount?: number;
  totalReviews: number; // Added to match usage
  latitude?: number; // Added
  longitude?: number; // Added
  isActive?: boolean; // Added
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RestaurantFilters {
  cuisine?: string;
  location?: string;
  rating?: number;
  search?: string;
  openNow?: boolean;
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

export interface Reservation {
  id: string;
  userId: string;
  restaurantId: string;
  tableId?: string;
  reservationDate: string; // ISO date
  reservationTime: string; // HH:mm
  guestCount: number;
  status: ReservationStatus;
  specialNotes?: string;
  user?: User;
  customer?: User; // Added to match usage
  customerId?: string; // Added to match usage
  restaurant?: Restaurant;
  table?: Table; // Added to match usage
  commissionPaid?: boolean; // Added to match usage
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateReservationDTO {
  restaurantId: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  specialNotes?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  tablesAvailable: number; // Added to match usage
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: any[];
  count?: number;
}
