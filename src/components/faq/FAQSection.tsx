import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';

export const FAQSection: React.FC = () => {
  const { data } = useWedding();
  const { language, t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(data.faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#FFFDF9] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C6D37] font-serif mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#6B1724]" />
            <span>{t.faq.badge}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#6B1724] font-bold">
            {t.faq.title}
          </h2>
          <p className="text-sm sm:text-base font-serif text-[#6B5A51] mt-2 italic">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {data.faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-[#FAF7F2] rounded-2xl border border-[#C5A059]/40 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-serif focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-sm sm:text-base font-semibold text-[#6B1724]">
                    {language === 'hi' ? faq.questionHindi || faq.question : faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full border border-[#C5A059]/50 flex items-center justify-center shrink-0 text-[#8C6D37] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#6B1724] text-white border-[#6B1724]' : 'bg-[#FFFDF9]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm font-serif text-[#4A3E38] leading-relaxed border-t border-[#C5A059]/15 animate-in fade-in duration-200">
                    <p className="italic">
                      {language === 'hi' ? faq.answerHindi || faq.answer : faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact organizer helpnote */}
        <div className="mt-12 text-center text-xs font-serif text-[#6B5A51]">
          {language === 'hi'
            ? 'किसी अतिरिक्त सहायता के लिए, कृपया हमारे विवाह समन्वय दल से संपर्क करें।'
            : 'For any additional inquiries or special arrangements, feel free to reach out to our wedding coordinators.'}
        </div>
      </div>
    </section>
  );
};
