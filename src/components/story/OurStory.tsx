import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';

export const OurStory: React.FC = () => {
  const { data } = useWedding();
  const { language, t } = useLanguage();

  const sortedStories = [...data.storyEntries].sort((a, b) => a.order - b.order);

  return (
    <section id="story" className="py-20 sm:py-28 bg-[#FAF7F2] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C6D37] font-serif mb-2">
            <Heart className="w-3.5 h-3.5 text-[#6B1724]" />
            <span>{t.story.badge}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#6B1724] font-bold">
            {t.story.title}
          </h2>
          <p className="text-sm sm:text-base font-serif text-[#6B5A51] mt-2 italic">
            {t.story.subtitle}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical gold center line on desktop */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[1px] bg-[#C5A059]/40" />

          <div className="space-y-12 sm:space-y-16">
            {sortedStories.map((story, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={story.id}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image Card */}
                  <div className="w-full md:w-1/2">
                    <div className="relative group overflow-hidden rounded-2xl border border-[#C5A059]/40 bg-[#FFFDF9] p-2 shadow-md hover:shadow-xl transition-shadow duration-300">
                      <div className="overflow-hidden rounded-xl aspect-[4/3] bg-[#F5EFE6]">
                        <img
                          src={story.imageUrl}
                          alt={story.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            // Graceful fallback for unavailable image URLs
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Center Node Marker */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#C5A059] items-center justify-center text-[#6B1724] shadow-sm z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#6B1724]" />
                  </div>

                  {/* Story Text Card */}
                  <div className={`w-full md:w-1/2 text-center ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="inline-block mb-1 text-xs uppercase tracking-widest text-[#8C6D37] font-serif font-semibold">
                      {story.yearOrDate}
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl text-[#6B1724] font-bold mb-3">
                      {language === 'hi' ? story.titleHindi || story.title : story.title}
                    </h3>
                    <p className="font-serif text-sm sm:text-base text-[#4A3E38] leading-relaxed italic">
                      {language === 'hi' ? story.descriptionHindi || story.description : story.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clear placeholder disclaimer */}
        <div className="mt-16 text-center text-[11px] font-serif text-[#8C6D37]/70 italic">
          * Sample timeline moments curated for Ananya & Rohan. Fully customizable by wedding administrator.
        </div>
      </div>
    </section>
  );
};
