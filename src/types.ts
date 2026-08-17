export type UserRole = 'tourist' | 'provider' | 'official';

export type DestinationCategory = 'eco' | 'cultural' | 'spiritual' | 'waterfalls' | 'heritage' | 'adventure';

export interface Destination {
  id: string;
  name: string;
  hindiName?: string;
  tagline: string;
  category: DestinationCategory;
  district: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  elevation?: string;
  bestTimeToVisit: string;
  entryFee: string;
  timings: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  galleryUrls: string[];
  has360Panorama: boolean;
  panoramaUrl?: string;
  transportInfo: {
    nearestAirport: string;
    nearestRailway: string;
    roadAccess: string;
    localTransportTips: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  ecoGuidelines: string[];
  culturalSignificance: string;
}

export type ProviderType = 'guide' | 'homestay' | 'artisan' | 'transport';

export interface Provider {
  id: string;
  name: string;
  role: ProviderType;
  community: string; // e.g. "Munda Tribe, Khunti", "Oraon Community, Netarhat"
  location: string;
  district: string;
  contactPhone: string;
  contactEmail: string;
  experienceYears: number;
  languages: string[];
  rating: number;
  reviewsCount: number;
  bio: string;
  servicesOffered: string[];
  pricing: string;
  verified: boolean;
  certificateHash: string;
  blockHeight: number;
  issuedDate: string;
  avatarUrl: string;
  documentsVerified: string[];
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  hindiName?: string;
  category: 'dokra' | 'painting' | 'silk' | 'bamboo' | 'lac' | 'organic';
  price: number;
  artisanId: string;
  artisanName: string;
  village: string;
  description: string;
  materials: string;
  craftHeritage: string;
  stock: number;
  imageUrl: string;
  dimensions?: string;
  weight?: string;
  rating: number;
  reviewsCount: number;
}

export interface CulturalEvent {
  id: string;
  title: string;
  hindiTitle?: string;
  dateOrSeason: string;
  location: string;
  district: string;
  category: 'festival' | 'haat' | 'cultural_dance' | 'exhibition';
  description: string;
  significance: string;
  imageUrl: string;
  highlights: string[];
}

export interface BookingRecord {
  id: string;
  touristName: string;
  touristEmail?: string;
  touristPhone?: string;
  touristContact?: string;
  serviceType: string;
  targetTitle: string; // e.g. "Betla Forest Safari with Somra Munda"
  providerId?: string;
  productId?: string;
  bookingDate: string;
  travelDate?: string;
  scheduledDate?: string;
  partySize?: number;
  amount: number;
  status: 'confirmed' | 'pending' | 'completed' | string;
  transactionHash?: string;
  blockchainTxHash?: string;
  blockHeight?: number;
  blockIndex?: number;
  paymentMethod?: string;
  notes?: string;
}

export interface BlockchainBlock {
  index: number;
  timestamp: string;
  type: 'PROVIDER_CERTIFICATION' | 'BOOKING_ESCROW' | 'PRODUCT_PROVENANCE' | 'SYSTEM_GENESIS';
  payload: {
    entityId: string;
    entityName: string;
    action: string;
    details: string;
    amount?: number;
    issuer?: string;
  };
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface TouristReview {
  id: string;
  destinationId?: string;
  providerId?: string;
  authorName: string;
  authorLocation: string;
  rating: number;
  date: string;
  comment: string;
  sentimentScore: number; // 0 to 100
  sentimentLabel: 'Positive' | 'Neutral' | 'Constructive';
  aspects: {
    authenticity: number;
    cleanliness: number;
    safety: number;
    hospitality: number;
    value: number;
  };
  verifiedVisit: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  morning: {
    activity: string;
    destinationName: string;
    tips: string;
    estCost: number;
  };
  afternoon: {
    activity: string;
    destinationName: string;
    lunchSuggestion: string;
    estCost: number;
  };
  evening: {
    activity: string;
    destinationName: string;
    sunsetSpot?: string;
    estCost: number;
  };
  staySuggestion: string;
  transportAdvice: string;
  dailyTotalEst: number;
}

export interface GeneratedItinerary {
  id: string;
  tripTitle: string;
  summary: string;
  durationDays: number;
  budgetTier: 'Budget' | 'Moderate' | 'Heritage Luxury';
  interests: string[];
  totalEstimatedCost: number;
  bestSeason: string;
  sustainabilityScore: number;
  days: ItineraryDay[];
  essentialPacking: string[];
  culturalEtiquette: string[];
}

export interface AnalyticsSnapshot {
  date: string;
  totalVisitors: number;
  activeBookings: number;
  verifiedProviders: number;
  overallSentiment: number;
  topDestinations: { name: string; visits: number; sentiment: number }[];
  categoryBreakdown: { category: string; count: number }[];
  revenueVolume: number;
  ecoComplianceScore: number;
}

export interface AnalyticsSummary {
  totalTouristsMonthly: number;
  totalRevenueMonthlyINR: number;
  activeProvidersCount: number;
  averageSatisfactionScore: number;
  totalLedgerBlocks: number;
  topVisitedDestinations: { name: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
  recentReviewsCount: number;
}

export interface EcoExplorer {
  id: string;
  name: string;
  avatarUrl?: string;
  location: string;
  points: number;
  badgeTitle: string;
  tier: 'Diamond Sentinel' | 'Gold Guardian' | 'Silver Trailblazer' | 'Bronze Wayfarer' | 'Sprout Explorer';
  destinationsVisitedCount: number;
  ecoActionsCount: number;
  verifiedBadges: string[];
  isCurrentUser?: boolean;
}

export interface EcoQuest {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'vr' | 'itinerary' | 'marketplace' | 'pledge' | 'review' | 'verify';
  completed: boolean;
  actionText: string;
  targetAction?: string;
}
