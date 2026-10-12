import React from 'react';
import { Users, Heart, Sparkles } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';

export const FamilyIntroductions: React.FC = () => {
  const { data } = useWedding();
  const { language } = useLanguage();

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] relative border-t border-[#C5A059]/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C6D37] font-serif mb-2">
            <Users className="w-3.5 h-3.5 text-[#6B1724]" />
            <span>{language === 'hi' ? 'परिवार परिचय' : 'Family Introductions'}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-[#6B1724] font-bold">
            {language === 'hi' ? 'दो आदरणीय परिवारों का पावन मिलन' : 'Union of Two Revered Families'}
          </h2>
          <p className="text-xs sm:text-sm font-serif text-[#6B5A51] mt-2 italic">
            {language === 'hi'
              ? 'हमारे माता-पिता एवं कुल के बुजुर्गों के स्नेहपूर्ण आशीर्वाद से'
              : 'With the cherished blessings of our parents, grandparents, and ancestors'}
          </p>
        </div>

        {/* Two Families Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bride's Family */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#C5A059]/40 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#C5A059]/25">
                <span className="text-[11px] uppercase tracking-wider text-[#8C6D37] font-serif font-semibold">
                  {language === 'hi' ? 'वधू पक्ष' : "The Bride's Family"}
                </span>
                <span className="font-hindi text-xs text-[#6B1724]">शर्मा परिवार</span>
              </div>

              <h3 className="font-display text-xl text-[#6B1724] font-bold mb-1">
                {data.settings.brideName}
              </h3>
              <p className="font-serif text-xs text-[#8C6D37] italic mb-3">
                {data.settings.brideParents}
              </p>

              <p className="font-serif text-xs sm:text-sm text-[#4A3E38] leading-relaxed italic mb-4">
                "{data.settings.brideBio ||
                  'An architect inspired by heritage havelis and classical sitar, Ananya brings warmth, artistic grace, and profound devotion to every family bond.'}"
              </p>
            </div>

            <div className="pt-3 border-t border-[#C5A059]/20 flex items-center justify-between text-[11px] font-serif text-[#6B5A51]">
              <span>Ancestral Roots: Jaipur & Mumbai</span>
              <span className="text-[#8C6D37]">Warmly Welcoming All Guests</span>
            </div>
          </div>

          {/* Groom's Family */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#C5A059]/40 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#C5A059]/25">
                <span className="text-[11px] uppercase tracking-wider text-[#8C6D37] font-serif font-semibold">
                  {language === 'hi' ? 'वर पक्ष' : "The Groom's Family"}
                </span>
                <span className="font-hindi text-xs text-[#6B1724]">मल्होत्रा परिवार</span>
              </div>

              <h3 className="font-display text-xl text-[#6B1724] font-bold mb-1">
                {data.settings.groomName}
              </h3>
              <p className="font-serif text-xs text-[#8C6D37] italic mb-3">
                {data.settings.groomParents}
              </p>

              <p className="font-serif text-xs sm:text-sm text-[#4A3E38] leading-relaxed italic mb-4">
                "{data.settings.groomBio ||
                  'A visionary green-energy founder who cherishes Himalayan treks, family gatherings, and timeless values of humility, generosity, and respect.'}"
              </p>
            </div>

            <div className="pt-3 border-t border-[#C5A059]/20 flex items-center justify-between text-[11px] font-serif text-[#6B5A51]">
              <span>Ancestral Roots: Delhi & Punjab</span>
              <span className="text-[#8C6D37]">Awaiting Your Royal Presence</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
