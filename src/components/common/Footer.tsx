import React from 'react';
import { Heart, Sparkles, Shield, Printer } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenPrint: () => void;
  onReopenEnvelope: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenPrint, onReopenEnvelope }) => {
  const { data } = useWedding();
  const { language, t } = useLanguage();

  return (
    <footer className="bg-[#1F1714] text-[#FAF7F2] py-16 px-4 sm:px-6 border-t border-[#C5A059]/30 relative no-print">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Monogram Crest */}
        <div className="w-14 h-14 rounded-full border-2 border-[#C5A059] flex items-center justify-center font-display font-bold text-lg text-[#E5C378] mb-4 bg-[#2C211D] shadow-lg">
          A & R
        </div>

        <h3 className="font-display text-2xl sm:text-3xl text-white font-bold tracking-wide mb-1">
          {data.settings.brideName} & {data.settings.groomName}
        </h3>

        <p className="font-mono text-sm text-[#C5A059] tracking-widest mt-1 mb-6">
          {data.settings.weddingHashtag}
        </p>

        {/* Sanskrit Auspicious Shloka */}
        <div className="max-w-md mx-auto my-4 py-4 border-y border-[#C5A059]/20">
          <p className="font-hindi text-sm text-[#E5C378] leading-relaxed">
            ॥ मंगलम् भगवान विष्णुः मंगलम् गरुड़ध्वजः ।<br />
            मंगलम् पुण्डरीकाक्षः मंगलाय तनो हरिः ॥
          </p>
        </div>

        <p className="font-serif text-xs text-[#FAF7F2]/70 max-w-lg mx-auto italic mb-8">
          {data.settings.venueName} · Udaipur, Rajasthan, India
        </p>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-serif text-[#C5A059] mb-10">
          <button
            onClick={onReopenEnvelope}
            className="hover:text-white transition-colors underline underline-offset-4"
          >
            Re-Open Envelope Invitation
          </button>
          <span>·</span>
          <button
            onClick={onOpenPrint}
            className="hover:text-white transition-colors underline underline-offset-4"
          >
            {t.nav.printable}
          </button>
          <span>·</span>
          <button
            onClick={onOpenAdmin}
            className="hover:text-white transition-colors underline underline-offset-4"
          >
            {t.nav.admin}
          </button>
        </div>

        <div className="text-[11px] font-serif text-white/40 tracking-wider">
          Forever Together · Luxury Indian Wedding Platform · {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};
