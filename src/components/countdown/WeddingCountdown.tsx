import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';

export const WeddingCountdown: React.FC = () => {
  const { data } = useWedding();
  const { language, t } = useLanguage();

  interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }

  const calculateTimeLeft = (): TimeLeft => {
    try {
      const target = new Date(data.settings?.weddingDate || '2026-12-18T10:30:00').getTime();
      if (isNaN(target)) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
      }
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, isPast: false };
    } catch {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
    }
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [data.settings.weddingDate]);

  const weddingDateFormatted = (() => {
    try {
      const d = new Date(data.settings.weddingDate);
      return d.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return data.settings.weddingDate;
    }
  })();

  return (
    <section id="countdown-section" className="relative pt-24 pb-20 sm:pt-28 sm:pb-28 overflow-hidden text-center">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FAF7F2] via-[#F5EFE6] to-[#FAF7F2] -z-10" />

      {/* Decorative Traditional Arch Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none opacity-40 -z-10">
        <svg viewBox="0 0 1000 600" className="w-full h-full" fill="none" stroke="#C5A059" strokeWidth="0.7">
          <path d="M 200,600 C 200,250 350,100 500,100 C 650,100 800,250 800,600" />
          <path d="M 250,600 C 250,300 375,150 500,150 C 625,150 750,300 750,600" strokeDasharray="3,3" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Sacred Sanskrit Invocation */}
        <p className="font-hindi text-[#8C6D37] text-sm tracking-widest font-semibold uppercase mb-3">
          ॥ ॐ श्री गणेशाय नमः ॥
        </p>

        {/* Hero Tagline */}
        <p className="font-serif text-xs sm:text-sm tracking-widest text-[#6B5A51] uppercase mb-4">
          {language === 'hi'
            ? 'हम सस्नेह आपको हमारे पावन विवाह में आमंत्रित करते हैं'
            : 'We cordially invite you to celebrate the royal wedding of'}
        </p>

        {/* Couple Names */}
        <div className="mb-6">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl text-[#6B1724] font-bold tracking-tight">
            {data.settings.brideName}
          </h1>
          <div className="flex items-center justify-center gap-4 my-2">
            <span className="h-[1px] w-16 bg-[#C5A059]/50" />
            <span className="font-script text-3xl sm:text-5xl text-[#C5A059] font-normal">&</span>
            <span className="h-[1px] w-16 bg-[#C5A059]/50" />
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl text-[#6B1724] font-bold tracking-tight">
            {data.settings.groomName}
          </h1>
        </div>

        {/* Wedding Date & Venue Overview */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#4A3E38] font-serif mb-10 py-2.5 px-6 rounded-full border border-[#C5A059]/30 bg-[#FFFDF9]/80 shadow-sm">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-4 h-4 text-[#8C6D37]" />
            {weddingDateFormatted}
          </span>
          <span className="text-[#C5A059]" aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-[#8C6D37]" />
            {data.settings.venueName}
          </span>
        </div>

        {/* Invitation Paragraph */}
        <p className="font-serif text-base sm:text-lg text-[#3E342F] max-w-2xl mx-auto italic leading-relaxed mb-12">
          "{language === 'hi' ? data.settings.invitationMessageHindi : data.settings.invitationMessage}"
        </p>

        {/* Countdown Box */}
        <div className="bg-[#FFFDF9] rounded-2xl p-6 sm:p-10 border border-[#C5A059]/40 shadow-xl shadow-[#6B1724]/5 max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="font-display text-lg sm:text-xl text-[#6B1724] font-semibold">
              {timeLeft.isPast ? t.countdown.weddingDay : t.countdown.heading}
            </h2>
            <p className="text-xs sm:text-sm font-serif text-[#6B5A51] mt-1 italic">
              {timeLeft.isPast ? t.countdown.weddingDaySub : t.countdown.subheading}
            </p>
          </div>

          {!timeLeft.isPast ? (
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {[
                { label: t.countdown.days, value: timeLeft.days },
                { label: t.countdown.hours, value: timeLeft.hours },
                { label: t.countdown.minutes, value: timeLeft.minutes },
                { label: t.countdown.seconds, value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF7F2] rounded-xl p-3 sm:p-5 border border-[#C5A059]/30 flex flex-col items-center justify-center shadow-sm"
                >
                  <span className="font-display text-2xl sm:text-4xl font-bold text-[#6B1724] tabular-nums">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#8C6D37] font-serif mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-[#6B1724] flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
              <span className="font-display text-lg font-bold">
                {language === 'hi' ? 'शुभ विवाह संपन्न' : 'Sacred Celebrations In Progress'}
              </span>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-[#C5A059]/20 flex flex-wrap items-center justify-center gap-4 text-xs font-serif text-[#6B5A51]">
            <a
              href="#rsvp"
              className="px-6 py-2.5 rounded-full bg-[#6B1724] hover:bg-[#801427] text-[#FAF7F2] font-semibold transition-all shadow-sm"
            >
              {language === 'hi' ? 'उपस्थिति दर्ज करें (RSVP)' : 'Confirm Attendance (RSVP)'}
            </a>
            <a
              href="#events"
              className="px-6 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#6B1724] border border-[#C5A059]/40 font-semibold transition-all"
            >
              {language === 'hi' ? 'कार्यक्रम देखें' : 'View Itinerary'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
