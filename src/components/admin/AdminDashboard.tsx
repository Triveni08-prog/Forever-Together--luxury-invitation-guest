import React, { useState } from 'react';
import {
  Shield,
  X,
  Users,
  Calendar,
  Settings,
  MessageSquare,
  Image as ImageIcon,
  Download,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  XCircle,
  Clock,
  Key,
  LogOut,
  RefreshCw,
  Share2,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { WeddingEvent, GuestInvitation, DietaryPreference } from '../../types/wedding';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    data,
    isAdmin,
    adminLogin,
    adminLogout,
    updateSettings,
    addEvent,
    updateEvent,
    deleteEvent,
    addGalleryImage,
    deleteGalleryImage,
    createInvitation,
    updateInvitation,
    deleteInvitation,
    moderateWish,
    deleteWish,
    exportRSVPsCSV,
    resetToSampleData,
  } = useWedding();

  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'events' | 'guests' | 'rsvps' | 'wishes' | 'gallery'>('overview');
  const [passkeyInput, setPasskeyInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({ ...data.settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // New Event form state
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<Omit<WeddingEvent, 'id'>>({
    name: '',
    nameHindi: '',
    date: '2026-12-16',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    venue: '',
    address: '',
    description: '',
    descriptionHindi: '',
    dressCode: '',
    dressCodeHindi: '',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    directionsUrl: '',
    order: 1,
  });

  // New Guest Invitation form state
  const [showNewGuestModal, setShowNewGuestModal] = useState(false);
  const [guestForm, setGuestForm] = useState({
    primaryGuestName: '',
    familyName: '',
    allowedGuests: 2,
    contactPhone: '',
    notes: '',
  });

  // New Gallery Photo form state
  const [showNewPhotoModal, setShowNewPhotoModal] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    url: '',
    caption: '',
    category: 'pre-wedding' as const,
  });

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = adminLogin(passkeyInput);
    if (!res.success) {
      setLoginError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  // Handle Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Handle Save Event
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEventId) {
      updateEvent(editingEventId, eventForm);
      setEditingEventId(null);
    } else {
      addEvent(eventForm);
    }
    setShowNewEventModal(false);
  };

  // Handle Create Guest Invitation
  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    const token =
      (guestForm.familyName || guestForm.primaryGuestName)
        .replace(/[^a-zA-Z]/g, '')
        .toUpperCase()
        .slice(0, 6) +
      '-' +
      Math.random().toString(36).substring(2, 6).toUpperCase();

    createInvitation({
      token,
      primaryGuestName: guestForm.primaryGuestName,
      familyName: guestForm.familyName || guestForm.primaryGuestName,
      allowedGuests: guestForm.allowedGuests,
      assignedEvents: data.events.map((e) => e.id),
      status: 'pending',
      contactPhone: guestForm.contactPhone || undefined,
      notes: guestForm.notes || undefined,
    });

    setGuestForm({
      primaryGuestName: '',
      familyName: '',
      allowedGuests: 2,
      contactPhone: '',
      notes: '',
    });
    setShowNewGuestModal(false);
  };

  // Copy Personalized Link
  const handleCopyPersonalizedLink = (token: string) => {
    const link = `${window.location.origin}/?token=${token}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  // Share via WhatsApp
  const handleShareWhatsApp = (inv: GuestInvitation) => {
    const link = `${window.location.origin}/?token=${inv.token}`;
    const text = `🌸 Dear ${inv.familyName || inv.primaryGuestName}, with the blessings of our families, you are warmly invited to celebrate the royal wedding of ${data.settings.coupleDisplayNames}!%0A%0AOpen your personalized invitation: ${encodeURIComponent(link)}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
    const a = document.createElement('a');
    a.href = whatsappUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Compute Aggregates
  const totalInvitedGuests = data.invitations.reduce((acc, inv) => acc + inv.allowedGuests, 0);
  const attendingRSVPs = data.rsvps.filter((r) => r.attendance === 'attending');
  const declinedRSVPs = data.rsvps.filter((r) => r.attendance === 'declined');
  const totalAttendingHeads = attendingRSVPs.reduce((acc, r) => acc + r.totalAttending, 0);
  const adultsAttendingHeads = attendingRSVPs.reduce((acc, r) => acc + r.adultsCount, 0);
  const childrenAttendingHeads = attendingRSVPs.reduce((acc, r) => acc + r.childrenCount, 0);

  const dietaryCounts = data.rsvps.reduce((acc, r) => {
    if (r.attendance === 'attending') {
      acc[r.dietaryPreference] = (acc[r.dietaryPreference] || 0) + r.totalAttending;
    }
    return acc;
  }, {} as Record<string, number>);

  const pendingWishes = data.wishes.filter((w) => w.status === 'pending');

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#FFFDF9] rounded-3xl p-8 max-w-md w-full border border-[#C5A059]/50 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#6B5A51] hover:text-[#2D241E]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#6B1724]/10 border border-[#6B1724]/30 flex items-center justify-center text-[#6B1724] mx-auto mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl text-[#6B1724] font-bold">
              Wedding Host Administration
            </h3>
            <p className="font-serif text-xs text-[#6B5A51] mt-1 italic">
              Restricted management portal for bride, groom, and wedding planners.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-serif">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-serif font-semibold text-[#6B1724] uppercase tracking-wider mb-1.5">
                Admin Master Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="Enter administrator passkey"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-sm font-serif text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B1724]/40"
                />
                <Key className="w-4 h-4 text-[#8C6D37] absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] font-serif text-[#8C6D37] mt-1.5 italic">
                Tip: Default passkey is <code>Udaipur2026!</code> or <code>royaladmin</code>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#6B1724] hover:bg-[#801427] text-white rounded-full text-xs font-serif font-semibold uppercase tracking-wider transition-all shadow-md"
            >
              Authenticate & Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-2 sm:p-6 flex justify-center items-start">
      <div className="bg-[#FFFDF9] text-[#2D241E] w-full max-w-6xl rounded-3xl border border-[#C5A059]/50 shadow-2xl my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#C5A059]/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#6B1724] text-[#E5C378] flex items-center justify-center font-display font-bold">
              FT
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[#6B1724]">
                Forever Together Administration
              </h2>
              <span className="text-[11px] text-[#8C6D37] font-serif">
                Session Active · Royal Host Role
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportRSVPsCSV}
              className="px-3 py-1.5 rounded-full bg-[#FFFDF9] hover:bg-[#F4EFE6] border border-[#C5A059]/40 text-xs font-serif text-[#6B1724] font-semibold transition-colors flex items-center gap-1.5"
              title="Export all guest RSVPs as CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#8C6D37]" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={adminLogout}
              className="p-2 rounded-full text-[#6B5A51] hover:text-[#6B1724] hover:bg-[#F4EFE6] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#6B5A51] hover:text-[#2D241E] hover:bg-[#F4EFE6] transition-colors"
              title="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#FAF7F2]/60 px-6 py-2 border-b border-[#C5A059]/20 flex items-center gap-2 overflow-x-auto text-xs font-serif">
          {[
            { id: 'overview', label: 'Overview & Stats', icon: Users },
            { id: 'settings', label: 'Wedding Settings', icon: Settings },
            { id: 'events', label: `Events (${data.events.length})`, icon: Calendar },
            { id: 'guests', label: `Guest Invitations (${data.invitations.length})`, icon: Users },
            { id: 'rsvps', label: `RSVP Responses (${data.rsvps.length})`, icon: CheckCircle },
            { id: 'wishes', label: `Wishes Moderation (${pendingWishes.length} pending)`, icon: MessageSquare },
            { id: 'gallery', label: `Gallery (${data.galleryImages.length})`, icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 font-medium ${
                  activeTab === tab.id
                    ? 'bg-[#6B1724] text-white shadow-sm font-semibold'
                    : 'text-[#6B5A51] hover:bg-[#F4EFE6] hover:text-[#2D241E]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 font-serif text-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#C5A059]/30">
                  <span className="text-[11px] uppercase tracking-wider text-[#8C6D37] block font-semibold">
                    Confirmed Attending
                  </span>
                  <span className="font-display text-2xl font-bold text-[#6B1724] block mt-1">
                    {totalAttendingHeads}
                  </span>
                  <span className="text-[11px] text-[#6B5A51]">
                    {adultsAttendingHeads} adults · {childrenAttendingHeads} children
                  </span>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#C5A059]/30">
                  <span className="text-[11px] uppercase tracking-wider text-[#8C6D37] block font-semibold">
                    Total Invited Capacity
                  </span>
                  <span className="font-display text-2xl font-bold text-[#2D241E] block mt-1">
                    {totalInvitedGuests}
                  </span>
                  <span className="text-[11px] text-[#6B5A51]">
                    Across {data.invitations.length} invitations
                  </span>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#C5A059]/30">
                  <span className="text-[11px] uppercase tracking-wider text-[#8C6D37] block font-semibold">
                    Declined
                  </span>
                  <span className="font-display text-2xl font-bold text-[#8C6D37] block mt-1">
                    {declinedRSVPs.length}
                  </span>
                  <span className="text-[11px] text-[#6B5A51]">Sending blessings remotely</span>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#C5A059]/30">
                  <span className="text-[11px] uppercase tracking-wider text-[#8C6D37] block font-semibold">
                    Pending Wishes
                  </span>
                  <span className="font-display text-2xl font-bold text-[#6B1724] block mt-1">
                    {pendingWishes.length}
                  </span>
                  <span className="text-[11px] text-[#6B5A51]">Awaiting host moderation</span>
                </div>
              </div>

              {/* Dietary Breakdown */}
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#C5A059]/30">
                <h4 className="font-display text-sm font-bold text-[#6B1724] uppercase tracking-wider mb-3">
                  Dietary Preferences Breakdown (For Royal Catering)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="bg-[#FFFDF9] p-3 rounded-xl border border-[#C5A059]/20">
                    <span className="text-[#8C6D37] block">Vegetarian</span>
                    <strong className="text-base text-[#6B1724]">{dietaryCounts['vegetarian'] || 0}</strong>
                  </div>
                  <div className="bg-[#FFFDF9] p-3 rounded-xl border border-[#C5A059]/20">
                    <span className="text-[#8C6D37] block">Strict Jain</span>
                    <strong className="text-base text-[#6B1724]">{dietaryCounts['jain'] || 0}</strong>
                  </div>
                  <div className="bg-[#FFFDF9] p-3 rounded-xl border border-[#C5A059]/20">
                    <span className="text-[#8C6D37] block">Vegan</span>
                    <strong className="text-base text-[#6B1724]">{dietaryCounts['vegan'] || 0}</strong>
                  </div>
                  <div className="bg-[#FFFDF9] p-3 rounded-xl border border-[#C5A059]/20">
                    <span className="text-[#8C6D37] block">No Preference</span>
                    <strong className="text-base text-[#6B1724]">{dietaryCounts['no_preference'] || 0}</strong>
                  </div>
                  <div className="bg-[#FFFDF9] p-3 rounded-xl border border-[#C5A059]/20">
                    <span className="text-[#8C6D37] block">Other / Custom</span>
                    <strong className="text-base text-[#6B1724]">{dietaryCounts['other'] || 0}</strong>
                  </div>
                </div>
              </div>

              {/* Recent Audit Logs */}
              <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#C5A059]/30">
                <h4 className="font-display text-sm font-bold text-[#6B1724] uppercase tracking-wider mb-3">
                  Recent Host Audit Log
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                  {data.auditLogs.slice(0, 8).map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-[#FFFDF9] border border-[#C5A059]/20 flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="font-mono text-[#6B1724] font-semibold text-[11px] block">
                          {log.action}
                        </span>
                        <span className="text-[#4A3E38] text-[11px]">{log.details}</span>
                      </div>
                      <span className="text-[10px] text-[#8C6D37] shrink-0 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reset to Sample Button */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => {
                    resetToSampleData();
                  }}
                  className="px-4 py-2 rounded-lg text-xs text-[#8C6D37] hover:text-[#6B1724] hover:bg-[#FAF7F2] border border-[#C5A059]/30 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Sample Dataset</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: WEDDING SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {settingsSaved && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Wedding settings successfully updated and saved!</span>
                </div>
              )}

              {/* Bride & Groom Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#6B1724] uppercase tracking-wider mb-1">
                    Bride's Full Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.brideName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brideName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-xs text-[#2D241E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B1724] uppercase tracking-wider mb-1">
                    Groom's Full Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.groomName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, groomName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-xs text-[#2D241E]"
                  />
                </div>
              </div>

              {/* Wedding Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#6B1724] uppercase tracking-wider mb-1">
                    Wedding Date & Time (ISO)
                  </label>
                  <input
                    type="datetime-local"
                    value={settingsForm.weddingDate.slice(0, 16)}
                    onChange={(e) => setSettingsForm({ ...settingsForm, weddingDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-xs text-[#2D241E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B1724] uppercase tracking-wider mb-1">
                    Display Names
                  </label>
                  <input
                    type="text"
                    value={settingsForm.coupleDisplayNames}
                    onChange={(e) => setSettingsForm({ ...settingsForm, coupleDisplayNames: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-xs text-[#2D241E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B1724] uppercase tracking-wider mb-1">
                    Wedding Hashtag
                  </label>
                  <input
                    type="text"
                    value={settingsForm.weddingHashtag}
                    onChange={(e) => setSettingsForm({ ...settingsForm, weddingHashtag: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-xs text-[#2D241E]"
                  />
                </div>
              </div>

              {/* Invitation Messages */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6B1724] uppercase tracking-wider mb-1">
                    Invitation Welcome Message (English)
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.invitationMessage}
                    onChange={(e) => setSettingsForm({ ...settingsForm, invitationMessage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-xs text-[#2D241E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B1724] uppercase tracking-wider mb-1">
                    Invitation Welcome Message (Hindi)
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.invitationMessageHindi}
                    onChange={(e) => setSettingsForm({ ...settingsForm, invitationMessageHindi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-xs text-[#2D241E]"
                  />
                </div>
              </div>

              {/* Venue & Directions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#6B1724] uppercase tracking-wider mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.venueName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, venueName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-xs text-[#2D241E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B1724] uppercase tracking-wider mb-1">
                    Venue Address
                  </label>
                  <input
                    type="text"
                    value={settingsForm.venueAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, venueAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-xs text-[#2D241E]"
                  />
                </div>
              </div>

              {/* Payment / Shagun Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#6B1724] uppercase tracking-wider mb-1">
                    Shagun Recipient Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.upiRecipientName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, upiRecipientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-xs text-[#2D241E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B1724] uppercase tracking-wider mb-1">
                    Verified UPI ID
                  </label>
                  <input
                    type="text"
                    value={settingsForm.upiId}
                    onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-xs text-[#2D241E]"
                  />
                </div>
              </div>

              {/* Music Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#6B1724] uppercase tracking-wider mb-1">
                    Music Title
                  </label>
                  <input
                    type="text"
                    value={settingsForm.musicTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, musicTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-xs text-[#2D241E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B1724] uppercase tracking-wider mb-1">
                    Custom Audio MP3 URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.musicUrl || ''}
                    placeholder="Leave blank for built-in Raag Yaman shehnai synthesis"
                    onChange={(e) => setSettingsForm({ ...settingsForm, musicUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-xs text-[#2D241E]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#6B1724] hover:bg-[#801427] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4 text-[#E5C378]" />
                  <span>Save Wedding Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-[#6B1724]">
                  Wedding Itinerary Events ({data.events.length})
                </h3>
                <button
                  onClick={() => {
                    setEditingEventId(null);
                    setShowNewEventModal(true);
                  }}
                  className="px-4 py-2 rounded-full bg-[#6B1724] hover:bg-[#801427] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Event</span>
                </button>
              </div>

              <div className="space-y-3">
                {data.events.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-4 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-display text-sm text-[#6B1724]">{ev.name}</strong>
                        <span className="text-[11px] text-[#8C6D37]">({ev.nameHindi})</span>
                      </div>
                      <p className="text-xs text-[#6B5A51] mt-0.5">
                        {ev.date} · {ev.startTime} - {ev.endTime} · 📍 {ev.venue}
                      </p>
                      <p className="text-xs text-[#8C6D37] italic mt-0.5">
                        Dress code: {ev.dressCode}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingEventId(ev.id);
                          setEventForm({
                            name: ev.name,
                            nameHindi: ev.nameHindi,
                            date: ev.date,
                            startTime: ev.startTime,
                            endTime: ev.endTime,
                            venue: ev.venue,
                            address: ev.address,
                            description: ev.description,
                            descriptionHindi: ev.descriptionHindi,
                            dressCode: ev.dressCode,
                            dressCodeHindi: ev.dressCodeHindi,
                            imageUrl: ev.imageUrl,
                            directionsUrl: ev.directionsUrl,
                            order: ev.order,
                          });
                          setShowNewEventModal(true);
                        }}
                        className="p-2 rounded-lg bg-[#FFFDF9] hover:bg-[#F4EFE6] text-[#6B5A51] hover:text-[#6B1724]"
                        title="Edit event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteEvent(ev.id);
                        }}
                        className="p-2 rounded-lg bg-[#FFFDF9] hover:bg-red-50 text-red-600"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Event Edit / Create Modal */}
              {showNewEventModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-[#FFFDF9] rounded-2xl p-6 max-w-lg w-full border border-[#C5A059] shadow-2xl max-h-[85vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-display font-bold text-[#6B1724]">
                        {editingEventId ? 'Edit Event' : 'Create New Wedding Event'}
                      </h4>
                      <button onClick={() => setShowNewEventModal(false)}>
                        <X className="w-5 h-5 text-[#6B5A51]" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-semibold mb-1">Event Name (English)</label>
                        <input
                          type="text"
                          required
                          value={eventForm.name}
                          onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                          className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Event Name (Hindi)</label>
                        <input
                          type="text"
                          value={eventForm.nameHindi}
                          onChange={(e) => setEventForm({ ...eventForm, nameHindi: e.target.value })}
                          className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold mb-1">Date</label>
                          <input
                            type="date"
                            required
                            value={eventForm.date}
                            onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                            className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Timings</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 10:00 AM"
                            value={eventForm.startTime}
                            onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                            className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Venue / Pavilion</label>
                        <input
                          type="text"
                          required
                          value={eventForm.venue}
                          onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                          className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Dress Code (English & Hindi)</label>
                        <input
                          type="text"
                          value={eventForm.dressCode}
                          onChange={(e) => setEventForm({ ...eventForm, dressCode: e.target.value })}
                          className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Photo Image URL</label>
                        <input
                          type="url"
                          value={eventForm.imageUrl}
                          onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                          className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                        />
                      </div>
                      <div className="pt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowNewEventModal(false)}
                          className="px-4 py-2 rounded-lg bg-[#FAF7F2] text-[#6B5A51]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-[#6B1724] text-white font-semibold"
                        >
                          Save Event
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GUEST INVITATIONS */}
          {activeTab === 'guests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-[#6B1724]">
                    Personalized Guest Invitations ({data.invitations.length})
                  </h3>
                  <p className="text-xs text-[#6B5A51] mt-0.5">
                    Generate unique secure tokens with guest-count limits & share via WhatsApp.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewGuestModal(true)}
                  className="px-4 py-2 rounded-full bg-[#6B1724] hover:bg-[#801427] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Issue Invitation</span>
                </button>
              </div>

              <div className="space-y-3">
                {data.invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-4 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-display text-sm text-[#6B1724]">
                          {inv.familyName || inv.primaryGuestName}
                        </strong>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#FFFDF9] border border-[#C5A059]/40 text-[#8C6D37]">
                          {inv.token}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            inv.status === 'attending'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.status === 'declined'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B5A51] mt-1">
                        Allowed Seats: <strong>{inv.allowedGuests}</strong> · Contact:{' '}
                        {inv.contactPhone || 'Not provided'}
                      </p>
                      {inv.notes && (
                        <p className="text-xs text-[#8C6D37] italic mt-0.5">Note: {inv.notes}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopyPersonalizedLink(inv.token)}
                        className="px-3 py-1.5 rounded-lg bg-[#FFFDF9] hover:bg-[#F4EFE6] border border-[#C5A059]/40 text-xs text-[#6B1724] font-semibold flex items-center gap-1"
                        title="Copy personalized URL"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#8C6D37]" />
                        <span>{copiedToken === inv.token ? 'Copied!' : 'Copy Link'}</span>
                      </button>

                      <button
                        onClick={() => handleShareWhatsApp(inv)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1"
                        title="Send via WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => {
                          deleteInvitation(inv.id);
                        }}
                        className="p-1.5 rounded-lg bg-[#FFFDF9] text-red-600 hover:bg-red-50"
                        title="Revoke invitation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* New Guest Modal */}
              {showNewGuestModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-[#FFFDF9] rounded-2xl p-6 max-w-md w-full border border-[#C5A059] shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-display font-bold text-[#6B1724]">
                        Create Guest Invitation Link
                      </h4>
                      <button onClick={() => setShowNewGuestModal(false)}>
                        <X className="w-5 h-5 text-[#6B5A51]" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateGuest} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-semibold mb-1">Primary Guest Name *</label>
                        <input
                          type="text"
                          required
                          value={guestForm.primaryGuestName}
                          onChange={(e) =>
                            setGuestForm({ ...guestForm, primaryGuestName: e.target.value })
                          }
                          placeholder="e.g. Dr. Alok Sharma"
                          className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Family / Household Label</label>
                        <input
                          type="text"
                          value={guestForm.familyName}
                          onChange={(e) =>
                            setGuestForm({ ...guestForm, familyName: e.target.value })
                          }
                          placeholder="e.g. The Sharma Family"
                          className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Max Guests Allowed</label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={guestForm.allowedGuests}
                          onChange={(e) =>
                            setGuestForm({ ...guestForm, allowedGuests: parseInt(e.target.value) || 1 })
                          }
                          className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Contact Phone</label>
                        <input
                          type="tel"
                          value={guestForm.contactPhone}
                          onChange={(e) =>
                            setGuestForm({ ...guestForm, contactPhone: e.target.value })
                          }
                          placeholder="e.g. +91 98201 23456"
                          className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Internal Notes</label>
                        <input
                          type="text"
                          value={guestForm.notes}
                          onChange={(e) => setGuestForm({ ...guestForm, notes: e.target.value })}
                          placeholder="e.g. Close family from Jaipur"
                          className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                        />
                      </div>
                      <div className="pt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowNewGuestModal(false)}
                          className="px-4 py-2 rounded-lg bg-[#FAF7F2] text-[#6B5A51]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-[#6B1724] text-white font-semibold"
                        >
                          Generate Invitation
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: RSVPS */}
          {activeTab === 'rsvps' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-[#6B1724]">
                  Recorded Guest Responses ({data.rsvps.length})
                </h3>
                <button
                  onClick={exportRSVPsCSV}
                  className="px-4 py-2 rounded-full bg-[#6B1724] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>

              <div className="space-y-3">
                {data.rsvps.map((rsvp) => (
                  <div
                    key={rsvp.id}
                    className="p-4 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/30 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <strong className="font-display text-sm text-[#6B1724]">
                          {rsvp.guestName}
                        </strong>
                        {rsvp.familyName && (
                          <span className="text-[#8C6D37]">({rsvp.familyName})</span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                            rsvp.attendance === 'attending'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {rsvp.attendance.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#8C6D37]">
                        Submitted: {new Date(rsvp.submittedAt).toLocaleString()}
                      </span>
                    </div>

                    {rsvp.attendance === 'attending' && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 p-2.5 rounded-lg bg-[#FFFDF9] border border-[#C5A059]/20 text-[11px]">
                        <div>
                          <span className="text-[#8C6D37] block">Attending Party:</span>
                          <strong>
                            {rsvp.totalAttending} ({rsvp.adultsCount}A / {rsvp.childrenCount}C)
                          </strong>
                        </div>
                        <div>
                          <span className="text-[#8C6D37] block">Dietary:</span>
                          <strong>{rsvp.dietaryPreference}</strong>
                        </div>
                        <div>
                          <span className="text-[#8C6D37] block">Contact:</span>
                          <span>{rsvp.contactPhone || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[#8C6D37] block">Token:</span>
                          <span className="font-mono">{rsvp.invitationToken || 'Public'}</span>
                        </div>
                      </div>
                    )}

                    {rsvp.messageToCouple && (
                      <p className="italic text-[#4A3E38] mt-1 text-[11px]">
                        "{rsvp.messageToCouple}"
                      </p>
                    )}
                    {rsvp.specialRequests && (
                      <p className="text-[#8C6D37] mt-1 text-[10px]">
                        Special Request: {rsvp.specialRequests}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: WISHES MODERATION */}
          {activeTab === 'wishes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-[#6B1724]">
                    Guestbook Wishes Moderation Queue ({data.wishes.length})
                  </h3>
                  <p className="text-xs text-[#6B5A51]">
                    Review well-wishes from guests before they appear publicly.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {data.wishes.map((w) => (
                  <div
                    key={w.id}
                    className="p-4 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-display text-sm text-[#6B1724]">{w.guestName}</strong>
                        {w.relationship && (
                          <span className="text-[11px] text-[#8C6D37]">({w.relationship})</span>
                        )}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            w.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : w.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {w.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="italic text-[#3E342F] mt-1 text-xs">"{w.message}"</p>
                      <span className="text-[10px] text-[#8C6D37] mt-1 block">
                        Received: {new Date(w.submittedAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {w.status !== 'approved' && (
                        <button
                          onClick={() => moderateWish(w.id, 'approved')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}
                      {w.status !== 'rejected' && (
                        <button
                          onClick={() => moderateWish(w.id, 'rejected')}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-semibold flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}
                      <button
                        onClick={() => deleteWish(w.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-[#6B1724]">
                  Photo Gallery Media ({data.galleryImages.length})
                </h3>
                <button
                  onClick={() => setShowNewPhotoModal(true)}
                  className="px-4 py-2 rounded-full bg-[#6B1724] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {data.galleryImages.map((img) => (
                  <div
                    key={img.id}
                    className="p-2 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/30 flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black/5 mb-2">
                      <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-[#8C6D37] block">
                        {img.category}
                      </span>
                      <p className="text-[11px] truncate text-[#2D241E]">{img.caption}</p>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => deleteGalleryImage(img.id)}
                        className="p-1 rounded text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Photo modal */}
              {showNewPhotoModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-[#FFFDF9] rounded-2xl p-6 max-w-md w-full border border-[#C5A059]">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-display font-bold text-[#6B1724]">Add Gallery Photograph</h4>
                      <button onClick={() => setShowNewPhotoModal(false)}>
                        <X className="w-5 h-5 text-[#6B5A51]" />
                      </button>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        addGalleryImage({
                          url: photoForm.url,
                          caption: photoForm.caption,
                          category: photoForm.category,
                          order: data.galleryImages.length + 1,
                        });
                        setShowNewPhotoModal(false);
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="block font-semibold mb-1">Image URL</label>
                        <input
                          type="url"
                          required
                          value={photoForm.url}
                          onChange={(e) => setPhotoForm({ ...photoForm, url: e.target.value })}
                          placeholder="https://..."
                          className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Caption</label>
                        <input
                          type="text"
                          required
                          value={photoForm.caption}
                          onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                          className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Category</label>
                        <select
                          value={photoForm.category}
                          onChange={(e) =>
                            setPhotoForm({
                              ...photoForm,
                              category: e.target.value as typeof photoForm.category,
                            })
                          }
                          className="w-full p-2 rounded-lg bg-[#FAF7F2] border border-[#C5A059]/40"
                        >
                          <option value="portraits">Portraits</option>
                          <option value="pre-wedding">Pre-Wedding</option>
                          <option value="haldi">Haldi</option>
                          <option value="mehendi">Mehendi</option>
                          <option value="sangeet">Sangeet</option>
                        </select>
                      </div>
                      <div className="pt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowNewPhotoModal(false)}
                          className="px-4 py-2 rounded-lg bg-[#FAF7F2]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-[#6B1724] text-white font-semibold"
                        >
                          Add Photograph
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
