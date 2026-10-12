export type AttendanceStatus = 'attending' | 'declined' | 'tentative';
export type DietaryPreference = 'vegetarian' | 'vegan' | 'jain' | 'no_preference' | 'other';
export type WishStatus = 'approved' | 'pending' | 'rejected';
export type Language = 'en' | 'hi';

export interface WeddingSettings {
  brideName: string;
  brideParents: string;
  brideBio?: string;
  groomName: string;
  groomParents: string;
  groomBio?: string;
  coupleDisplayNames: string;
  weddingDate: string; // ISO format: e.g. "2026-12-18T10:30:00"
  timeZone: string;
  invitationMessage: string;
  invitationMessageHindi: string;
  weddingHashtag: string;
  venueName: string;
  venueAddress: string;
  venueCoordinates: {
    lat: number;
    lng: number;
  };
  venueDirectionsUrl: string;
  parkingInfo: string;
  accommodationInfo: string;
  upiId: string;
  upiRecipientName: string;
  upiQrImageUrl?: string;
  shagunInstructions: string;
  suggestedShagunAmounts: number[];
  musicUrl?: string;
  musicTitle: string;
  isThankYouMode: boolean;
  thankYouMessage: string;
  isModerationAutoApprove: boolean;
}

export interface WeddingEvent {
  id: string;
  name: string;
  nameHindi: string;
  date: string; // e.g. "2026-12-16"
  startTime: string; // e.g. "10:30 AM"
  endTime: string; // e.g. "02:00 PM"
  venue: string;
  address: string;
  description: string;
  descriptionHindi: string;
  dressCode: string;
  dressCodeHindi: string;
  imageUrl: string;
  directionsUrl: string;
  order: number;
}

export interface StoryEntry {
  id: string;
  yearOrDate: string;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  imageUrl: string;
  order: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: 'pre-wedding' | 'haldi' | 'mehendi' | 'sangeet' | 'portraits' | 'ceremony';
  order: number;
}

export interface GuestInvitation {
  id: string;
  token: string;
  primaryGuestName: string;
  familyName: string;
  allowedGuests: number;
  assignedEvents: string[]; // event IDs
  status: 'pending' | 'viewed' | 'attending' | 'declined';
  contactPhone?: string;
  contactEmail?: string;
  createdAt: string;
  lastUpdated: string;
  notes?: string;
}

export interface RSVPResponse {
  id: string;
  invitationToken?: string;
  guestName: string;
  familyName?: string;
  attendance: AttendanceStatus;
  totalAttending: number;
  adultsCount: number;
  childrenCount: number;
  dietaryPreference: DietaryPreference;
  foodAllergies?: string;
  attendingEvents: string[];
  contactPhone?: string;
  specialRequests?: string;
  messageToCouple?: string;
  submittedAt: string;
  updatedAt: string;
}

export interface GuestWish {
  id: string;
  guestName: string;
  relationship?: string;
  message: string;
  status: WishStatus;
  submittedAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  questionHindi: string;
  answer: string;
  answerHindi: string;
  category: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  actor: string;
}

export interface WeddingStoreData {
  settings: WeddingSettings;
  events: WeddingEvent[];
  storyEntries: StoryEntry[];
  galleryImages: GalleryImage[];
  invitations: GuestInvitation[];
  rsvps: RSVPResponse[];
  wishes: GuestWish[];
  faqs: FAQItem[];
  auditLogs: AuditLog[];
}
