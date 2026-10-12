import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Share2, Sparkles, Navigation, Check } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';
import { downloadEventIcs, getWhatsAppShareUrl } from '../../utils/calendar';

export const EventSchedule: React.FC = () => {
  const { data } = useWedding();
  const { language, t } = useLanguage();
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

  const sortedEvents = [...data.events].sort((a, b) => a.order - b.order);

  const handleShare = async (e: React.MouseEvent, event: typeof data.events[0]) => {
    e.preventDefault();
    const shareUrl = `${window.location.origin}/#events`;
    const shareText = `Wedding Event: ${event.name} (${event.date} at ${event.startTime}) - ${data.settings.coupleDisplayNames}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard or whatsapp
      }
    }

    // Fallback: Copy link
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setCopiedEventId(event.id);
        setTimeout(() => setCopiedEventId(null), 2500);
      } else {
        const a = document.createElement('a');
        a.href = getWhatsAppShareUrl(event, data.settings.coupleDisplayNames);
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch {
      const a = document.createElement('a');
      a.href = getWhatsAppShareUrl(event, data.settings.coupleDisplayNames);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <section id="events" className="py-20 sm:py-28 bg-[#FFFDF9] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C6D37] font-serif mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#6B1724]" />
            <span>{t.events.badge}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#6B1724] font-bold">
            {t.events.title}
          </h2>
          <p className="text-sm sm:text-base font-serif text-[#6B5A51] mt-2 italic">
            {t.events.subtitle}
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedEvents.map((event) => {
            const formattedDate = (() => {
              try {
                const [y, m, d] = event.date.split('-');
                const dt = new Date(Number(y), Number(m) - 1, Number(d));
                return dt.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
              } catch {
                return event.date;
              }
            })();

            return (
              <div
                key={event.id}
                className="bg-[#FAF7F2] rounded-2xl border border-[#C5A059]/40 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Event Photo */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F4EFE6]">
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] uppercase tracking-widest text-[#E5C378] font-serif block">
                      {formattedDate}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-bold tracking-wide text-white">
                      {language === 'hi' ? event.nameHindi || event.name : event.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Time & Venue */}
                    <div className="space-y-2 mb-4 text-xs font-serif text-[#4A3E38]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#8C6D37] shrink-0" />
                        <span className="font-medium">
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#8C6D37] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold block text-[#6B1724]">{event.venue}</span>
                          <span className="text-[#6B5A51] text-[11px]">{event.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="font-serif text-xs sm:text-sm text-[#4A3E38] leading-relaxed italic mb-4">
                      "{language === 'hi' ? event.descriptionHindi || event.description : event.description}"
                    </p>

                    {/* Dress code */}
                    <div className="py-2.5 px-3 rounded-xl bg-[#FFFDF9] border border-[#C5A059]/20 mb-5">
                      <span className="text-[10px] uppercase tracking-wider text-[#8C6D37] font-serif block font-semibold">
                        {t.events.dressCode}
                      </span>
                      <span className="text-xs font-serif text-[#6B1724] font-medium block mt-0.5">
                        {language === 'hi' ? event.dressCodeHindi || event.dressCode : event.dressCode}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Add to Cal, Directions, Share */}
                  <div className="pt-3 border-t border-[#C5A059]/20 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadEventIcs(event, data.settings.coupleDisplayNames)}
                        className="flex-1 py-2 px-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#C5A059]/40 text-xs font-serif text-[#6B1724] font-semibold transition-colors flex items-center justify-center gap-1.5"
                        title={t.events.addToCalendar}
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#8C6D37]" />
                        <span>{language === 'hi' ? 'कैलेंडर में जोड़ें' : 'Add to Calendar'}</span>
                      </button>

                      <a
                        href={event.directionsUrl || data.settings.venueDirectionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#C5A059]/40 text-xs font-serif text-[#6B1724] font-semibold transition-colors flex items-center justify-center gap-1"
                        title={t.events.getDirections}
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#8C6D37]" />
                        <span>{language === 'hi' ? 'मार्ग' : 'Map'}</span>
                      </a>

                      <button
                        onClick={(e) => handleShare(e, event)}
                        className="p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#C5A059]/40 text-[#6B5A51] hover:text-[#6B1724] transition-colors"
                        title={t.events.shareEvent}
                      >
                        {copiedEventId === event.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {copiedEventId === event.id && (
                      <span className="text-[10px] text-emerald-700 text-center font-serif">
                        Event invitation copied to clipboard!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chronological Summary Banner */}
        <div className="mt-14 p-6 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/30 text-center max-w-2xl mx-auto">
          <p className="font-serif text-xs text-[#8C6D37] uppercase tracking-widest font-semibold mb-1">
            {language === 'hi' ? 'अतिथि सेवा एवं स्वागत' : 'Royal Hospitality Concierge'}
          </p>
          <p className="font-serif text-xs sm:text-sm text-[#4A3E38] italic">
            {language === 'hi'
              ? 'प्रत्येक उत्सव स्थल पर गोल्फ बग्गी, साफा एवं दुपट्टा सज्जा, और राजस्थानी स्वागत की व्यवस्था रहेगी।'
              : 'Dedicated luxury buggies, traditional turban & dupatta styling, and refreshing imperial welcome drinks available at all venues.'}
          </p>
        </div>
      </div>
    </section>
  );
};
