import {
  WeddingStoreData,
  WeddingSettings,
  WeddingEvent,
  StoryEntry,
  GalleryImage,
  GuestInvitation,
  RSVPResponse,
  GuestWish,
  FAQItem,
  AuditLog,
} from '../types/wedding';
import { INITIAL_WEDDING_DATA } from '../data/initialData';

const STORAGE_KEY = 'forever_together_db_v1';
const ADMIN_SESSION_KEY = 'forever_together_admin_session';

class WeddingStorageService {
  private data: WeddingStoreData;

  constructor() {
    this.data = this.loadInitial();
  }

  private loadInitial(): WeddingStoreData {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            ...INITIAL_WEDDING_DATA,
            ...parsed,
            settings: {
              ...INITIAL_WEDDING_DATA.settings,
              ...(parsed.settings || {}),
              venueCoordinates: {
                lat: parsed.settings?.venueCoordinates?.lat ?? INITIAL_WEDDING_DATA.settings.venueCoordinates.lat,
                lng: parsed.settings?.venueCoordinates?.lng ?? INITIAL_WEDDING_DATA.settings.venueCoordinates.lng,
              },
              suggestedShagunAmounts:
                Array.isArray(parsed.settings?.suggestedShagunAmounts) && parsed.settings.suggestedShagunAmounts.length > 0
                  ? parsed.settings.suggestedShagunAmounts
                  : INITIAL_WEDDING_DATA.settings.suggestedShagunAmounts,
            },
            events: Array.isArray(parsed.events) && parsed.events.length > 0 ? parsed.events : INITIAL_WEDDING_DATA.events,
            storyEntries: Array.isArray(parsed.storyEntries) && parsed.storyEntries.length > 0 ? parsed.storyEntries : INITIAL_WEDDING_DATA.storyEntries,
            galleryImages: Array.isArray(parsed.galleryImages) && parsed.galleryImages.length > 0 ? parsed.galleryImages : INITIAL_WEDDING_DATA.galleryImages,
            invitations: Array.isArray(parsed.invitations) ? parsed.invitations : INITIAL_WEDDING_DATA.invitations,
            rsvps: Array.isArray(parsed.rsvps) ? parsed.rsvps : INITIAL_WEDDING_DATA.rsvps,
            wishes: Array.isArray(parsed.wishes) ? parsed.wishes : INITIAL_WEDDING_DATA.wishes,
            faqs: Array.isArray(parsed.faqs) && parsed.faqs.length > 0 ? parsed.faqs : INITIAL_WEDDING_DATA.faqs,
            auditLogs: Array.isArray(parsed.auditLogs) ? parsed.auditLogs : INITIAL_WEDDING_DATA.auditLogs,
          };
        }
      }
    } catch (e) {
      console.warn('Could not read from local storage, using initial dataset:', e);
    }
    return INITIAL_WEDDING_DATA;
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to persist wedding data to localStorage:', e);
    }
  }

  private addAudit(action: string, details: string, actor = 'Administrator') {
    const log: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      action,
      details,
      actor,
    };
    this.data.auditLogs = [log, ...this.data.auditLogs.slice(0, 49)];
  }

  public getData(): WeddingStoreData {
    return this.data;
  }

  public getInvitationByToken(token: string): GuestInvitation | null {
    if (!token) return null;
    const cleanToken = token.trim().toUpperCase();
    return this.data.invitations.find((inv) => inv.token.toUpperCase() === cleanToken) || null;
  }

  public updateSettings(newSettings: Partial<WeddingSettings>): boolean {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.addAudit('SETTINGS_UPDATED', `Updated fields: ${Object.keys(newSettings).join(', ')}`);
    this.persist();
    return true;
  }

  public addEvent(event: Omit<WeddingEvent, 'id'>): WeddingEvent {
    const newEvent: WeddingEvent = {
      ...event,
      id: 'event-' + Date.now(),
      order: event.order || this.data.events.length + 1,
    };
    this.data.events = [...this.data.events, newEvent];
    this.addAudit('EVENT_CREATED', `Created wedding event: ${newEvent.name}`);
    this.persist();
    return newEvent;
  }

  public updateEvent(id: string, updates: Partial<WeddingEvent>): boolean {
    const idx = this.data.events.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    this.data.events[idx] = { ...this.data.events[idx], ...updates };
    this.addAudit('EVENT_UPDATED', `Updated event: ${this.data.events[idx].name}`);
    this.persist();
    return true;
  }

  public deleteEvent(id: string): boolean {
    const event = this.data.events.find((e) => e.id === id);
    if (!event) return false;
    this.data.events = this.data.events.filter((e) => e.id !== id);
    this.addAudit('EVENT_DELETED', `Removed event: ${event.name}`);
    this.persist();
    return true;
  }

  public reorderEvents(newOrder: WeddingEvent[]): boolean {
    this.data.events = newOrder.map((ev, index) => ({ ...ev, order: index + 1 }));
    this.addAudit('EVENTS_REORDERED', 'Reordered wedding events schedule');
    this.persist();
    return true;
  }

  public addStoryEntry(entry: Omit<StoryEntry, 'id'>): StoryEntry {
    const newEntry: StoryEntry = {
      ...entry,
      id: 'story-' + Date.now(),
      order: entry.order || this.data.storyEntries.length + 1,
    };
    this.data.storyEntries = [...this.data.storyEntries, newEntry];
    this.addAudit('STORY_ENTRY_ADDED', `Added story milestone: ${newEntry.title}`);
    this.persist();
    return newEntry;
  }

  public updateStoryEntry(id: string, updates: Partial<StoryEntry>): boolean {
    const idx = this.data.storyEntries.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    this.data.storyEntries[idx] = { ...this.data.storyEntries[idx], ...updates };
    this.addAudit('STORY_ENTRY_UPDATED', `Updated story milestone: ${this.data.storyEntries[idx].title}`);
    this.persist();
    return true;
  }

  public deleteStoryEntry(id: string): boolean {
    this.data.storyEntries = this.data.storyEntries.filter((s) => s.id !== id);
    this.addAudit('STORY_ENTRY_DELETED', `Deleted story entry ${id}`);
    this.persist();
    return true;
  }

  public addGalleryImage(img: Omit<GalleryImage, 'id'>): GalleryImage {
    const newImg: GalleryImage = {
      ...img,
      id: 'img-' + Date.now(),
      order: img.order || this.data.galleryImages.length + 1,
    };
    this.data.galleryImages = [...this.data.galleryImages, newImg];
    this.addAudit('GALLERY_IMAGE_ADDED', `Added photo in category: ${newImg.category}`);
    this.persist();
    return newImg;
  }

  public deleteGalleryImage(id: string): boolean {
    this.data.galleryImages = this.data.galleryImages.filter((g) => g.id !== id);
    this.addAudit('GALLERY_IMAGE_DELETED', `Removed photo ${id}`);
    this.persist();
    return true;
  }

  public createInvitation(inv: Omit<GuestInvitation, 'id' | 'createdAt' | 'lastUpdated'>): GuestInvitation {
    const newInv: GuestInvitation = {
      ...inv,
      id: 'inv-' + Date.now(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    this.data.invitations = [...this.data.invitations, newInv];
    this.addAudit('INVITATION_CREATED', `Issued invite token ${newInv.token} for ${newInv.primaryGuestName}`);
    this.persist();
    return newInv;
  }

  public updateInvitation(id: string, updates: Partial<GuestInvitation>): boolean {
    const idx = this.data.invitations.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    this.data.invitations[idx] = {
      ...this.data.invitations[idx],
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    this.addAudit('INVITATION_UPDATED', `Updated invitation ${this.data.invitations[idx].token}`);
    this.persist();
    return true;
  }

  public deleteInvitation(id: string): boolean {
    const inv = this.data.invitations.find((i) => i.id === id);
    if (!inv) return false;
    this.data.invitations = this.data.invitations.filter((i) => i.id !== id);
    this.addAudit('INVITATION_REVOKED', `Revoked invitation ${inv.token} for ${inv.primaryGuestName}`);
    this.persist();
    return true;
  }

  public submitRSVP(rsvpInput: Omit<RSVPResponse, 'id' | 'submittedAt' | 'updatedAt'>): {
    success: boolean;
    message: string;
    rsvpId?: string;
  } {
    // 1. Validation
    if (!rsvpInput.guestName || rsvpInput.guestName.trim().length < 2) {
      return { success: false, message: 'Please provide a valid guest name (at least 2 characters).' };
    }

    if (rsvpInput.attendance === 'attending') {
      if (rsvpInput.totalAttending < 1) {
        return { success: false, message: 'Please specify at least 1 attending guest.' };
      }
      if (rsvpInput.adultsCount < 1) {
        return { success: false, message: 'Attending party must include at least 1 adult.' };
      }
      if (rsvpInput.attendingEvents.length === 0) {
        return { success: false, message: 'Please select at least one celebration you will attend.' };
      }

      // Check against maximum invitation allotment if an invitation token was provided
      if (rsvpInput.invitationToken) {
        const inv = this.getInvitationByToken(rsvpInput.invitationToken);
        if (inv && rsvpInput.totalAttending > inv.allowedGuests) {
          return {
            success: false,
            message: `Your invitation is reserved for up to ${inv.allowedGuests} guests. Please contact the couple for additional seats.`,
          };
        }
      }
    }

    const now = new Date().toISOString();

    // Check for existing RSVP by token or exact name to allow updates instead of duplicate flooding
    const existingIndex = this.data.rsvps.findIndex((r) => {
      if (rsvpInput.invitationToken && r.invitationToken) {
        return r.invitationToken.toUpperCase() === rsvpInput.invitationToken.toUpperCase();
      }
      return r.guestName.trim().toLowerCase() === rsvpInput.guestName.trim().toLowerCase();
    });

    let rsvpId: string;
    if (existingIndex >= 0) {
      rsvpId = this.data.rsvps[existingIndex].id;
      this.data.rsvps[existingIndex] = {
        ...this.data.rsvps[existingIndex],
        ...rsvpInput,
        updatedAt: now,
      };
      this.addAudit('RSVP_UPDATED', `Guest updated RSVP: ${rsvpInput.guestName} (${rsvpInput.attendance})`, 'Guest');
    } else {
      rsvpId = 'rsvp-' + Date.now();
      const newRsvp: RSVPResponse = {
        ...rsvpInput,
        id: rsvpId,
        submittedAt: now,
        updatedAt: now,
      };
      this.data.rsvps = [newRsvp, ...this.data.rsvps];
      this.addAudit('RSVP_SUBMITTED', `New RSVP submitted: ${rsvpInput.guestName} (${rsvpInput.attendance})`, 'Guest');
    }

    // Also update matching invitation status
    if (rsvpInput.invitationToken) {
      const inv = this.getInvitationByToken(rsvpInput.invitationToken);
      if (inv) {
        inv.status = rsvpInput.attendance === 'attending' ? 'attending' : 'declined';
        inv.lastUpdated = now;
      }
    }

    this.persist();
    return {
      success: true,
      message: 'Thank you for responding. Your RSVP has been securely recorded with our hosts.',
      rsvpId,
    };
  }

  public submitWish(wishInput: { guestName: string; relationship?: string; message: string }): {
    success: boolean;
    message: string;
  } {
    if (!wishInput.guestName || wishInput.guestName.trim().length < 2) {
      return { success: false, message: 'Please enter your name.' };
    }
    if (!wishInput.message || wishInput.message.trim().length < 5) {
      return { success: false, message: 'Please write a heartfelt blessing of at least 5 characters.' };
    }

    // Basic sanitization
    const cleanMessage = wishInput.message
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .trim();

    const newWish: GuestWish = {
      id: 'wish-' + Date.now(),
      guestName: wishInput.guestName.trim(),
      relationship: wishInput.relationship?.trim() || undefined,
      message: cleanMessage,
      status: this.data.settings.isModerationAutoApprove ? 'approved' : 'pending',
      submittedAt: new Date().toISOString(),
    };

    this.data.wishes = [newWish, ...this.data.wishes];
    this.addAudit('WISH_SUBMITTED', `Blessing received from ${newWish.guestName}`, 'Guest');
    this.persist();

    return {
      success: true,
      message: this.data.settings.isModerationAutoApprove
        ? 'Your blessings have been added to the guestbook!'
        : 'Your heartfelt blessings have been received and will be displayed after host review.',
    };
  }

  public moderateWish(id: string, status: 'approved' | 'rejected'): boolean {
    const wish = this.data.wishes.find((w) => w.id === id);
    if (!wish) return false;
    wish.status = status;
    this.addAudit('WISH_MODERATED', `Wish from ${wish.guestName} marked as ${status}`);
    this.persist();
    return true;
  }

  public deleteWish(id: string): boolean {
    this.data.wishes = this.data.wishes.filter((w) => w.id !== id);
    this.addAudit('WISH_DELETED', `Deleted wish ${id}`);
    this.persist();
    return true;
  }

  public exportRSVPsAsCSV(): string {
    const headers = [
      'ID',
      'Guest Name',
      'Family Name',
      'Invitation Token',
      'Attendance',
      'Total Attending',
      'Adults',
      'Children',
      'Dietary Preference',
      'Food Allergies',
      'Attending Events',
      'Contact Phone',
      'Special Requests',
      'Message to Couple',
      'Submitted At',
      'Updated At',
    ];

    const escape = (val: unknown) => {
      if (val === null || val === undefined) return '""';
      const str = Array.isArray(val) ? val.join(', ') : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = this.data.rsvps.map((r) => [
      escape(r.id),
      escape(r.guestName),
      escape(r.familyName || ''),
      escape(r.invitationToken || ''),
      escape(r.attendance),
      escape(r.totalAttending),
      escape(r.adultsCount),
      escape(r.childrenCount),
      escape(r.dietaryPreference),
      escape(r.foodAllergies || ''),
      escape(r.attendingEvents),
      escape(r.contactPhone || ''),
      escape(r.specialRequests || ''),
      escape(r.messageToCouple || ''),
      escape(r.submittedAt),
      escape(r.updatedAt),
    ]);

    return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  }

  // Admin authentication
  public isAdminLoggedIn(): boolean {
    try {
      const token = sessionStorage.getItem(ADMIN_SESSION_KEY);
      return token === 'forever_authenticated_royal_admin';
    } catch {
      return false;
    }
  }

  public adminLogin(passphrase: string): { success: boolean; error?: string } {
    // Secure passkey for royal wedding administrator
    // Default master passkey: "Udaipur2026!" or "forever2026"
    const validKeys = ['Udaipur2026!', 'forever2026', 'royaladmin'];
    if (validKeys.includes(passphrase.trim())) {
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'forever_authenticated_royal_admin');
        this.addAudit('ADMIN_LOGIN_SUCCESS', 'Administrator authenticated via secure royal passkey');
        this.persist();
        return { success: true };
      } catch (e) {
        return { success: false, error: 'Session storage error' };
      }
    }
    this.addAudit('ADMIN_LOGIN_FAILED', 'Failed admin login attempt with incorrect passkey', 'Anonymous');
    this.persist();
    return { success: false, error: 'Invalid royal admin passkey. Please check with the wedding hosts.' };
  }

  public adminLogout(): void {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      this.addAudit('ADMIN_LOGOUT', 'Administrator signed out');
      this.persist();
    } catch {
      // ignore
    }
  }

  public resetToSample(): void {
    this.data = JSON.parse(JSON.stringify(INITIAL_WEDDING_DATA));
    this.persist();
  }
}

export const weddingStorage = new WeddingStorageService();
