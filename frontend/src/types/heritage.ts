export interface Chip {
  label: string;
  className?: string;
}

export interface GalleryItem {
  url: string;
  tag?: string;
  caption: string;
  subcaption?: string;
}

export interface UniqueTouch {
  step: string;
  title: string;
  desc: string;
  highlight: string;
}

export interface TimelineItem {
  stage: string;
  time: string;
  title: string;
  desc: string;
}

export interface Keeper {
  name: string;
  title: string;
  experience: string;
  quote: string;
  bio: string;
  avatar?: string;
}

export interface Tour {
  id: number | string;
  slug: string;
  badge: string;
  badgeClass: string;
  duration: string;
  location: string;
  price: string;
  adultPrice?: number;
  childPrice?: number;
  title: string;
  description: string;
  image: string;
  category?: 'all' | 'craft' | 'architecture' | 'ritual';
  rating?: string | number;
  reviewsCount?: string | number;
  chips: Chip[];
  // Các trường mở rộng cho trang chi tiết & checklist
  gallery?: GalleryItem[];
  uniqueTouches?: UniqueTouch[];
  timeline?: TimelineItem[];
  keeper?: Keeper;
}

export interface Waypoint {
  id: number;
  icon: string;
  shortName: string;
  district: string;
  title: string;
  sub: string;
  rules: string;
  coords?: [number, number];
  badge?: string;
  badgeClass?: string;
  openHours?: string;
  distance?: string;
  googleMapsUrl?: string;
}

export interface Artisan {
  id: number;
  name: string;
  slug?: string;
  title: string;
  experience: string;
  village: string;
  specialty?: string;
  yearsOfDedication?: number;
  achievements?: string[];
  workshopLocation?: string;
  handsImage?: string;
  featuredProductIds?: string[];
  quote: string;
  bio: string;
  schedule: string;
  image: string;
  productImage?: string;
  productName?: string;
  badgeClass: string;
}

export interface Testimonial {
  id: number;
  initials: string;
  name: string;
  origin: string;
  avatarClass: string;
  content: string;
}

export interface NavSubLink {
  href: string;
  label: string;
  desc?: string;
  badge?: string;
}

export interface PcNavLink {
  href: string;
  label: string;
  active?: boolean;
  children?: NavSubLink[];
}

export interface NavItem {
  path: string;
  icon: string;
  label: string;
}

export interface TripFormValues {
  destination: string;
  date: string;
  travelers: string;
}
