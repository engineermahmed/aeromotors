export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: "Automatic" | "Manual";
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  bodyStyle: "Sedan" | "SUV" | "Coupe" | "Convertible" | "Hatchback" | "Wagon";
  color: string;
  driveType: "AWD" | "RWD" | "FWD" | "4WD";
  engineSize: string;
  horsepower: number;
  images: string[];
  description: string;
  features: string[];
  isNew: boolean;
  isFeatured: boolean;
  status: "available" | "sold" | "reserved";
  vin?: string;
  createdAt: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  count: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface Listing {
  id: string;
  sellerName: string;
  sellerPhone: string;
  sellerEmail: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  color: string;
  transmission: string;
  condition: string;
  vin?: string;
  comments?: string;
  imageUrls?: string[];
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  adminNote?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: "url" | "upload";
  uploadedAt: string;
}

export interface SearchFilters {
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  bodyStyle?: string;
  transmission?: string;
  fuelType?: string;
  driveType?: string;
  color?: string;
  search?: string;
}
