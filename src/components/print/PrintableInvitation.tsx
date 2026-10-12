import React from 'react';
import { Printer, X, Download, Share2, Sparkles, MapPin, Calendar, Clock } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';

interface PrintableInvitationProps {
  onClose: () => void;
}

export const PrintableInvitation: React.FC<PrintableInvitationProps> = ({ onClose }) => {
  const { data, activeInvitation } = useWedding();
  const { language, t } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `Royal Wedding Invitation: ${data.settings.coupleDisplayNames}\n${data.settings.venueName}\nView: ${window.location.origin}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Wedding Invitation - ${data.settings.coupleDisplayNames}`,
          text,
          url: window.location.origin,
        });
        return;
      } catch {
        // ignore
      }
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-4 sm:p-8 flex justify-center items-start">
      {/* Top Floating Action Bar (Hidden during print) */}
      <div className="fixed top-4 right-4 flex items-center gap-3 no-print z-50">
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-full bg-[#6B1724] hover:bg-[#801427] text-white text-xs font-serif font-semibold shadow-lg flex items-center gap-2 border border-[#C5A059]/60"
        >
          <Printer className="w-4 h-4 text-[#E5C378]" />
          <span>Print / Save as PDF</span>
        </button>
        <button
          onClick={handleShare}
          className="p-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#6B1724] shadow-md border border-[#C5A059]/40"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white shadow-md transition-colors"
          title="Close Preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Royal Card Layout for Printing & High-Resolution Display */}
      <div className="bg-[#FFFDF9] text-[#2D241E] w-full max-w-3xl rounded-3xl p-8 sm:p-14 border-4 border-double border-[#C5A059] shadow-2xl my-12 relative print:m-0 print:border-none print:shadow-none print:p-6 print:rounded-none">
        {/* Ornate Corner Accents */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#C5A059]/80 pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#C5A059]/80 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#C5A059]/80 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#C5A059]/80 pointer-events-none" />

        {/* Invocation Header */}
        <div className="text-center mb-8">
          <p className="font-hindi text-[#8C6D37] text-base font-bold tracking-widest">
            ॥ श्री गणेशाय नमः ॥
          </p>
          <p className="font-serif text-xs text-[#6B5A51] uppercase tracking-widest mt-1">
            Forever Together · Udaipur Heritage Wedding
          </p>
        </div>

        {/* Personalized Guest Label if available */}
        {activeInvitation && (
          <div className="text-center mb-6 pb-4 border-b border-[#C5A059]/20">
            <span className="text-[11px] uppercase tracking-widest text-[#8C6D37] font-serif">
              Cordially Invited In Honor Of
            </span>
            <h2 className="font-display text-2xl text-[#6B1724] font-bold mt-1">
              {activeInvitation.familyName || activeInvitation.primaryGuestName}
            </h2>
            <span className="text-xs font-serif text-[#6B5A51] italic">
              Reserved for {activeInvitation.allowedGuests} Distinguished Guests
            </span>
          </div>
        )}

        {/* Couple & Parents Announcement */}
        <div className="text-center mb-8">
          <p className="font-serif text-xs uppercase tracking-widest text-[#6B5A51] mb-3">
            With the sacred blessings of our revered elders, we request the pleasure of your company at the wedding of
          </p>

          <h1 className="font-display text-4xl sm:text-5xl text-[#6B1724] font-bold">
            {data.settings.brideName}
          </h1>
          <p className="font-serif text-xs text-[#6B5A51] italic mt-1">
            {data.settings.brideParents}
          </p>

          <div className="flex items-center justify-center gap-3 my-2">
            <span className="h-[1px] w-12 bg-[#C5A059]" />
            <span className="font-script text-3xl text-[#C5A059]">&</span>
            <span className="h-[1px] w-12 bg-[#C5A059]" />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl text-[#6B1724] font-bold">
            {data.settings.groomName}
          </h1>
          <p className="font-serif text-xs text-[#6B5A51] italic mt-1">
            {data.settings.groomParents}
          </p>
        </div>

        {/* Invitation Message */}
        <p className="font-serif text-center text-sm sm:text-base text-[#4A3E38] italic max-w-xl mx-auto mb-10 leading-relaxed">
          "{data.settings.invitationMessage}"
        </p>

        {/* Events Itinerary in Print Card */}
        <div className="mb-10">
          <div className="text-center mb-4">
            <h3 className="font-display text-lg text-[#6B1724] font-bold uppercase tracking-wider">
              Auspicious Celebrations
            </h3>
            <span className="h-[1px] w-20 bg-[#C5A059] block mx-auto mt-1" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.events.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-xl border border-[#C5A059]/30 bg-[#FAF7F2] text-xs font-serif"
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-display font-bold text-[#6B1724] text-sm">{ev.name}</h4>
                  <span className="font-semibold text-[#8C6D37] text-[11px]">{ev.date}</span>
                </div>
                <p className="text-[#4A3E38] text-[11px] mb-1">
                  <Clock className="w-3 h-3 inline mr-1 text-[#8C6D37]" />
                  {ev.startTime} - {ev.endTime}
                </p>
                <p className="text-[#6B5A51] text-[11px]">
                  <MapPin className="w-3 h-3 inline mr-1 text-[#8C6D37]" />
                  {ev.venue}
                </p>
                <p className="text-[#8C6D37] text-[10px] mt-1 italic font-medium">
                  Attire: {ev.dressCode}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Palace Destination & Coordinates */}
        <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/30 text-center mb-8">
          <h4 className="font-display text-xs font-bold text-[#6B1724] uppercase tracking-wider mb-1">
            Palace Venue
          </h4>
          <p className="font-serif text-xs text-[#2D241E] font-medium">
            {data.settings.venueName}
          </p>
          <p className="font-serif text-[11px] text-[#6B5A51]">
            {data.settings.venueAddress}
          </p>
          <p className="font-mono text-[10px] text-[#8C6D37] mt-1">
            Online Invitation Portal: {window.location.origin}
          </p>
        </div>

        {/* Footer Blessing */}
        <div className="text-center pt-4 border-t border-[#C5A059]/30 text-xs font-serif text-[#6B5A51] italic">
          With Warmest Compliments from Sharma & Malhotra Families · #AnanyaWedsRohan
        </div>
      </div>
    </div>
  );
};
