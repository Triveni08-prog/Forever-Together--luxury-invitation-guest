import React from 'react';
import { MapPin, Navigation, Car, Hotel, Plane, ShieldCheck, Compass } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';

export const VenueSection: React.FC = () => {
  const { data } = useWedding();
  const { language, t } = useLanguage();

  return (
    <section id="venue" className="py-20 sm:py-28 bg-[#FAF7F2] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C6D37] font-serif mb-2">
            <Compass className="w-3.5 h-3.5 text-[#6B1724]" />
            <span>{t.venue.badge}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#6B1724] font-bold">
            {t.venue.title}
          </h2>
          <p className="text-sm sm:text-base font-serif text-[#6B5A51] mt-2 italic">
            {t.venue.subtitle}
          </p>
        </div>

        {/* Venue Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          {/* Palace Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#C5A059]/40 shadow-md">
              <span className="text-[11px] uppercase tracking-widest text-[#8C6D37] font-serif font-semibold">
                {language === 'hi' ? 'शाही परिणय स्थल' : 'Official Wedding Venue'}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-[#6B1724] font-bold mt-1 mb-2">
                {data.settings.venueName}
              </h3>
              <p className="font-serif text-xs sm:text-sm text-[#4A3E38] leading-relaxed mb-6 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#8C6D37] shrink-0 mt-0.5" />
                <span>{data.settings.venueAddress}</span>
              </p>

              <div className="pt-4 border-t border-[#C5A059]/20 flex flex-wrap items-center gap-4">
                <a
                  href={data.settings.venueDirectionsUrl || 'https://maps.google.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-[#6B1724] hover:bg-[#801427] text-[#FAF7F2] text-xs font-serif font-semibold transition-all flex items-center gap-2 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#E5C378]" />
                  <span>{t.venue.openMaps}</span>
                </a>
                <span className="text-xs font-serif text-[#8C6D37] italic">
                  Coordinates: {data.settings.venueCoordinates?.lat ?? 24.5764}° N, {data.settings.venueCoordinates?.lng ?? 73.6738}° E
                </span>
              </div>
            </div>

            {/* Parking & Buggy Services */}
            <div className="bg-[#FFFDF9] rounded-2xl p-5 sm:p-6 border border-[#C5A059]/30 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#C5A059] flex items-center justify-center shrink-0 text-[#6B1724]">
                <Car className="w-5 h-5 text-[#8C6D37]" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-[#6B1724] mb-1">
                  {t.venue.parking}
                </h4>
                <p className="font-serif text-xs text-[#4A3E38] leading-relaxed">
                  {data.settings.parkingInfo}
                </p>
              </div>
            </div>

            {/* Accommodation Details */}
            <div className="bg-[#FFFDF9] rounded-2xl p-5 sm:p-6 border border-[#C5A059]/30 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#C5A059] flex items-center justify-center shrink-0 text-[#6B1724]">
                <Hotel className="w-5 h-5 text-[#8C6D37]" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-[#6B1724] mb-1">
                  {t.venue.accommodation}
                </h4>
                <p className="font-serif text-xs text-[#4A3E38] leading-relaxed">
                  {data.settings.accommodationInfo}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Embed Frame */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border-2 border-[#C5A059]/40 shadow-xl bg-[#FFFDF9] p-2">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#E8E1D5] relative">
                <iframe
                  title="Wedding Venue Location Map"
                  src={`https://maps.google.com/maps?q=${data.settings.venueCoordinates?.lat ?? 24.5764},${data.settings.venueCoordinates?.lng ?? 73.6738}&z=15&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
              <div className="p-3 text-center text-[11px] font-serif text-[#8C6D37] italic">
                * Click map or "Open in Google Maps" for turn-by-turn navigation and airport arrival routes.
              </div>
            </div>
          </div>
        </div>

        {/* Airport & Railway Station Transportation Notice */}
        <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#C5A059]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-serif text-[#4A3E38]">
          <div className="flex items-center gap-3">
            <Plane className="w-5 h-5 text-[#8C6D37] shrink-0" />
            <span>{t.venue.airportInfo}</span>
          </div>
          <a
            href={data.settings.venueDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6B1724] font-semibold hover:underline shrink-0"
          >
            Calculate Travel Time →
          </a>
        </div>
      </div>
    </section>
  );
};
