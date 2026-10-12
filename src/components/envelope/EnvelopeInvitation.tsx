import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, ChevronDown, Calendar, HeartHandshake, MapPin } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';
import { weddingAudio } from '../../services/audioPlayer';

interface EnvelopeInvitationProps {
  onEnter?: () => void;
  isOpen: boolean;
  onOpenFlap: () => void;
  isHeroMode?: boolean;
}

export const EnvelopeInvitation: React.FC<EnvelopeInvitationProps> = ({
  onEnter,
  isOpen,
  onOpenFlap,
  isHeroMode = false,
}) => {
  const { data, activeInvitation } = useWedding();
  const { language, t } = useLanguage();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSealClick = () => {
    if (!isOpen) {
      onOpenFlap();
      if (soundEnabled) {
        weddingAudio.startAudio(data.settings.musicUrl);
      }
    }
  };

  const handleEnterClick = () => {
    if (soundEnabled) {
      weddingAudio.startAudio(data.settings.musicUrl);
    }
    if (onEnter) onEnter();
    const target = document.querySelector('#countdown-section') || document.querySelector('#events');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={`relative ${isHeroMode ? 'pt-24 pb-16' : 'min-h-screen'} flex items-center justify-center p-4 sm:p-6 bg-[#1A1412] text-[#FAF7F2] overflow-hidden`}>
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.18)_0%,rgba(107,23,36,0.18)_45%,rgba(26,20,18,0.98)_100%)] pointer-events-none" />

      {/* Traditional Indian Mandala Background Motif */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
        <svg className="w-[850px] h-[850px] animate-[spin_180s_linear_infinite]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="1,2" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
          <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" stroke="#D4AF37" strokeWidth="0.3" />
        </svg>
      </div>

      <div className="relative z-20 w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Sanskrit Auspicious Invocation */}
        <div className="text-center mb-6">
          <p className="font-hindi text-[#D4AF37] text-base sm:text-lg tracking-widest font-bold">
            ॥ श्री गणेशाय नमः ॥
          </p>
          <p className="text-xs font-serif text-[#C5A059]/90 uppercase tracking-widest mt-1">
            Forever Together · Udaipur Royal Wedding Invitation
          </p>
        </div>

        {/* Envelope Container */}
        <div
          className={`relative w-full bg-[#FAF7F2] rounded-3xl shadow-2xl transition-all duration-700 border-2 border-[#C5A059]/60 p-2 sm:p-3 ${
            isOpen ? 'scale-100' : 'hover:scale-[1.01]'
          }`}
          style={{
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 45px rgba(197, 160, 89, 0.3)',
          }}
        >
          {/* Inner Golden Ornate Border */}
          <div className="relative bg-[#FFFDF9] rounded-2xl border border-[#C5A059]/40 p-6 sm:p-10 text-center text-[#2D241E]">
            {/* Top Ornamental Crest */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#C5A059]" />
              <div className="w-8 h-8 rounded-full border border-[#C5A059] flex items-center justify-center text-[#6B1724]">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
              </div>
              <span className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#C5A059]" />
            </div>

            {/* Personalized Greeting if available */}
            {activeInvitation && (
              <div className="mb-5 pb-3 border-b border-[#C5A059]/25">
                <span className="text-[11px] uppercase tracking-widest text-[#8C6D37] font-serif block font-semibold">
                  {language === 'hi' ? 'सादर आमंत्रित' : 'Personalized Royal Invitation'}
                </span>
                <h3 className="font-display text-xl text-[#6B1724] font-bold mt-0.5">
                  {activeInvitation.familyName || activeInvitation.primaryGuestName}
                </h3>
                <p className="text-xs text-[#6B5A51] font-serif italic mt-0.5">
                  {language === 'hi'
                    ? `आपके परिवार हेतु ${activeInvitation.allowedGuests} स्थान सादर आरक्षित हैं`
                    : `We have reserved ${activeInvitation.allowedGuests} seats in your family's honor`}
                </p>
              </div>
            )}

            {/* Couple Announcement */}
            <p className="text-xs sm:text-sm font-serif text-[#6B5A51] tracking-widest uppercase mb-2">
              {t.envelope.subheading}
            </p>

            <h1 className="font-display text-3xl sm:text-5xl text-[#6B1724] font-bold tracking-tight mb-1">
              {data.settings.brideName}
            </h1>
            <p className="font-script text-2xl sm:text-4xl text-[#C5A059] my-1 font-normal">
              &
            </p>
            <h1 className="font-display text-3xl sm:text-5xl text-[#6B1724] font-bold tracking-tight mb-4">
              {data.settings.groomName}
            </h1>

            {/* Invitation Message */}
            <p className="font-serif text-sm sm:text-base text-[#4A3E38] italic max-w-lg mx-auto leading-relaxed my-4">
              "{language === 'hi' ? data.settings.invitationMessageHindi : data.settings.invitationMessage}"
            </p>

            <div className="my-4 inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#8C6D37] font-serif bg-[#FAF7F2] py-1.5 px-4 rounded-full border border-[#C5A059]/30">
              <MapPin className="w-3.5 h-3.5 text-[#6B1724]" />
              <span>{data.settings.venueName} · Udaipur</span>
            </div>

            {/* Wax Seal / Interactive Action */}
            <div className="mt-6 pt-3 flex flex-col items-center">
              {!isOpen ? (
                <button
                  onClick={handleSealClick}
                  className="group relative flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
                  aria-label="Click wax seal to open invitation"
                >
                  {/* Wax Seal */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#801427] via-[#6B1724] to-[#450912] shadow-2xl border-2 border-[#D4AF37] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#D4AF37]/60 flex flex-col items-center justify-center text-[#D4AF37]">
                      <span className="font-display text-xs font-bold tracking-widest">A & R</span>
                      <span className="text-[9px] uppercase tracking-tighter opacity-80">2026</span>
                    </div>
                  </div>
                  <span className="mt-3 text-xs uppercase tracking-widest text-[#6B1724] font-serif font-semibold group-hover:text-[#801427] transition-colors flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{t.envelope.unseal}</span>
                  </span>
                </button>
              ) : (
                <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/30 max-w-md w-full mb-4 text-xs font-serif text-[#6B5A51]">
                    <p className="font-hindi text-[#6B1724] font-semibold text-center mb-1">
                      ॥ वर-वधू परिणय सूत्र में बंधने जा रहे हैं ॥
                    </p>
                    <p className="italic text-center">
                      Please join us for 3 days of royal ceremonies in Udaipur from December 16 to 18, 2026.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={handleEnterClick}
                      className="px-6 py-3 bg-[#6B1724] hover:bg-[#801427] text-[#FAF7F2] rounded-full font-serif text-xs sm:text-sm tracking-wider uppercase font-semibold shadow-lg shadow-[#6B1724]/30 border border-[#C5A059]/60 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <span>Explore Celebrations & Itinerary</span>
                      <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                    <button
                      onClick={() => scrollToSection('#rsvp')}
                      className="px-6 py-3 bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#6B1724] rounded-full font-serif text-xs sm:text-sm tracking-wider uppercase font-semibold border border-[#C5A059]/50 transition-all flex items-center justify-center gap-2"
                    >
                      <HeartHandshake className="w-4 h-4 text-[#8C6D37]" />
                      <span>RSVP Attendance</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Direct Scroll Links for Immediate Website Browsing */}
            <div className="mt-6 pt-4 border-t border-[#C5A059]/20 flex flex-wrap items-center justify-center gap-4 text-xs font-serif text-[#6B5A51]">
              <button
                onClick={() => scrollToSection('#countdown-section')}
                className="hover:text-[#6B1724] flex items-center gap-1 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#8C6D37]" />
                <span>Countdown & Vows</span>
              </button>
              <span>·</span>
              <button
                onClick={() => scrollToSection('#events')}
                className="hover:text-[#6B1724] transition-colors"
              >
                Ceremony Itinerary
              </button>
              <span>·</span>
              <button
                onClick={() => scrollToSection('#rsvp')}
                className="hover:text-[#6B1724] font-semibold text-[#6B1724] transition-colors"
              >
                Confirm RSVP
              </button>
              <span>·</span>
              <button
                onClick={() => scrollToSection('#shagun')}
                className="hover:text-[#6B1724] transition-colors"
              >
                Digital Shagun
              </button>
            </div>
          </div>
        </div>

        {/* Audio helper toggle */}
        <div className="mt-5 flex items-center gap-4 text-xs font-serif text-[#C5A059]/90">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              weddingAudio.togglePlay(data.settings.musicUrl);
            }}
            className="flex items-center gap-1.5 hover:text-[#FAF7F2] transition-colors bg-black/30 px-4 py-1.5 rounded-full border border-[#C5A059]/30"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#D4AF37]" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Shehnai Harmony: Active' : 'Sound Muted'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
