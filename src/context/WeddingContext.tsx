import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  WeddingStoreData,
  WeddingSettings,
  WeddingEvent,
  StoryEntry,
  GalleryImage,
  GuestInvitation,
  RSVPResponse,
  GuestWish,
} from '../types/wedding';
import { weddingStorage } from '../services/weddingStorage';

interface WeddingContextType {
  data: WeddingStoreData;
  activeInvitation: GuestInvitation | null;
  isAdmin: boolean;
  updateSettings: (newSettings: Partial<WeddingSettings>) => boolean;
  addEvent: (event: Omit<WeddingEvent, 'id'>) => WeddingEvent;
  updateEvent: (id: string, updates: Partial<WeddingEvent>) => boolean;
  deleteEvent: (id: string) => boolean;
  reorderEvents: (newOrder: WeddingEvent[]) => boolean;
  addStoryEntry: (entry: Omit<StoryEntry, 'id'>) => StoryEntry;
  updateStoryEntry: (id: string, updates: Partial<StoryEntry>) => boolean;
  deleteStoryEntry: (id: string) => boolean;
  addGalleryImage: (img: Omit<GalleryImage, 'id'>) => GalleryImage;
  deleteGalleryImage: (id: string) => boolean;
  createInvitation: (inv: Omit<GuestInvitation, 'id' | 'createdAt' | 'lastUpdated'>) => GuestInvitation;
  updateInvitation: (id: string, updates: Partial<GuestInvitation>) => boolean;
  deleteInvitation: (id: string) => boolean;
  submitRSVP: (rsvp: Omit<RSVPResponse, 'id' | 'submittedAt' | 'updatedAt'>) => {
    success: boolean;
    message: string;
    rsvpId?: string;
  };
  submitWish: (wish: { guestName: string; relationship?: string; message: string }) => {
    success: boolean;
    message: string;
  };
  moderateWish: (id: string, status: 'approved' | 'rejected') => boolean;
  deleteWish: (id: string) => boolean;
  exportRSVPsCSV: () => void;
  adminLogin: (passkey: string) => { success: boolean; error?: string };
  adminLogout: () => void;
  resetToSampleData: () => void;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WeddingStoreData>(() => weddingStorage.getData());
  const [activeInvitation, setActiveInvitation] = useState<GuestInvitation | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => weddingStorage.isAdminLoggedIn());

  const sync = useCallback(() => {
    setData({ ...weddingStorage.getData() });
  }, []);

  // Detect invitation token in URL: ?token=... or ?invite=...
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token') || urlParams.get('invite');
    if (token) {
      const inv = weddingStorage.getInvitationByToken(token);
      if (inv) {
        setActiveInvitation(inv);
        // Mark invitation as viewed if it was pending
        if (inv.status === 'pending') {
          weddingStorage.updateInvitation(inv.id, { status: 'viewed' });
          sync();
        }
      }
    }
  }, [sync]);

  const updateSettings = (newSettings: Partial<WeddingSettings>) => {
    const ok = weddingStorage.updateSettings(newSettings);
    sync();
    return ok;
  };

  const addEvent = (event: Omit<WeddingEvent, 'id'>) => {
    const created = weddingStorage.addEvent(event);
    sync();
    return created;
  };

  const updateEvent = (id: string, updates: Partial<WeddingEvent>) => {
    const ok = weddingStorage.updateEvent(id, updates);
    sync();
    return ok;
  };

  const deleteEvent = (id: string) => {
    const ok = weddingStorage.deleteEvent(id);
    sync();
    return ok;
  };

  const reorderEvents = (newOrder: WeddingEvent[]) => {
    const ok = weddingStorage.reorderEvents(newOrder);
    sync();
    return ok;
  };

  const addStoryEntry = (entry: Omit<StoryEntry, 'id'>) => {
    const created = weddingStorage.addStoryEntry(entry);
    sync();
    return created;
  };

  const updateStoryEntry = (id: string, updates: Partial<StoryEntry>) => {
    const ok = weddingStorage.updateStoryEntry(id, updates);
    sync();
    return ok;
  };

  const deleteStoryEntry = (id: string) => {
    const ok = weddingStorage.deleteStoryEntry(id);
    sync();
    return ok;
  };

  const addGalleryImage = (img: Omit<GalleryImage, 'id'>) => {
    const created = weddingStorage.addGalleryImage(img);
    sync();
    return created;
  };

  const deleteGalleryImage = (id: string) => {
    const ok = weddingStorage.deleteGalleryImage(id);
    sync();
    return ok;
  };

  const createInvitation = (inv: Omit<GuestInvitation, 'id' | 'createdAt' | 'lastUpdated'>) => {
    const created = weddingStorage.createInvitation(inv);
    sync();
    return created;
  };

  const updateInvitation = (id: string, updates: Partial<GuestInvitation>) => {
    const ok = weddingStorage.updateInvitation(id, updates);
    sync();
    return ok;
  };

  const deleteInvitation = (id: string) => {
    const ok = weddingStorage.deleteInvitation(id);
    sync();
    return ok;
  };

  const submitRSVP = (rsvp: Omit<RSVPResponse, 'id' | 'submittedAt' | 'updatedAt'>) => {
    const res = weddingStorage.submitRSVP(rsvp);
    sync();
    return res;
  };

  const submitWish = (wish: { guestName: string; relationship?: string; message: string }) => {
    const res = weddingStorage.submitWish(wish);
    sync();
    return res;
  };

  const moderateWish = (id: string, status: 'approved' | 'rejected') => {
    const ok = weddingStorage.moderateWish(id, status);
    sync();
    return ok;
  };

  const deleteWish = (id: string) => {
    const ok = weddingStorage.deleteWish(id);
    sync();
    return ok;
  };

  const exportRSVPsCSV = () => {
    const csvContent = weddingStorage.exportRSVPsAsCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Wedding_RSVPs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const adminLogin = (passkey: string) => {
    const res = weddingStorage.adminLogin(passkey);
    if (res.success) {
      setIsAdmin(true);
      sync();
    }
    return res;
  };

  const adminLogout = () => {
    weddingStorage.adminLogout();
    setIsAdmin(false);
    sync();
  };

  const resetToSampleData = () => {
    weddingStorage.resetToSample();
    sync();
  };

  return (
    <WeddingContext.Provider
      value={{
        data,
        activeInvitation,
        isAdmin,
        updateSettings,
        addEvent,
        updateEvent,
        deleteEvent,
        reorderEvents,
        addStoryEntry,
        updateStoryEntry,
        deleteStoryEntry,
        addGalleryImage,
        deleteGalleryImage,
        createInvitation,
        updateInvitation,
        deleteInvitation,
        submitRSVP,
        submitWish,
        moderateWish,
        deleteWish,
        exportRSVPsCSV,
        adminLogin,
        adminLogout,
        resetToSampleData,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
