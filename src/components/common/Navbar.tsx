import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Printer, Heart, Share2, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useWedding } from '../../context/WeddingContext';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenPrint }) => {
  const { language, setLanguage, t } = useLanguage();
  const { data, isAdmin } = useWedding();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.story, href: '#story' },
    { label: t.nav.events, href: '#events' },
    { label: t.nav.gallery, href: '#gallery' },
    { label: t.nav.venue, href: '#venue' },
    { label: t.nav.shagun, href: '#shagun' },
    { label: t.nav.wishes, href: '#wishes' },
    { label: t.nav.rsvp, href: '#rsvp', highlight: true },
    { label: t.nav.faq, href: '#faq' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 no-print ${
        scrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#C5A059]/30 shadow-sm py-2.5'
          : 'bg-gradient-to-b from-[#FAF7F2]/90 via-[#FAF7F2]/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Monogram / Brand */}
        <a
          href="#top"
          onClick={(e) => handleLinkClick(e, '#top')}
          className="flex items-center gap-2 group text-left"
        >
          <div className="w-9 h-9 rounded-full border border-[#C5A059] flex items-center justify-center bg-[#FAF7F2] text-[#6B1724] font-display font-bold text-sm tracking-widest shadow-sm group-hover:border-[#6B1724] transition-colors">
            A&R
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm tracking-wider uppercase text-[#2D241E] group-hover:text-[#6B1724] transition-colors font-semibold">
              {data.settings.coupleDisplayNames || 'Ananya & Rohan'}
            </span>
            <span className="text-[10px] tracking-widest text-[#8C6D37] uppercase font-serif">
              Forever Together
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-serif">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={`transition-colors py-1 ${
                link.highlight
                  ? 'text-[#6B1724] font-semibold border-b-2 border-[#6B1724]'
                  : 'text-[#4A3E38] hover:text-[#6B1724]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions: Lang Switcher, Print, Admin */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-[#F4EFE6] border border-[#C5A059]/40 rounded-full p-0.5 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-colors font-serif ${
                language === 'en'
                  ? 'bg-[#6B1724] text-[#FAF7F2] font-semibold'
                  : 'text-[#6B5A51] hover:text-[#2D241E]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-full transition-colors font-serif ${
                language === 'hi'
                  ? 'bg-[#6B1724] text-[#FAF7F2] font-semibold'
                  : 'text-[#6B5A51] hover:text-[#2D241E]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Share Wedding Link Button */}
          <button
            onClick={() => {
              const url = window.location.origin;
              if (navigator.share) {
                navigator.share({
                  title: `${data.settings.coupleDisplayNames} Wedding`,
                  text: `Royal Wedding Invitation of ${data.settings.coupleDisplayNames}`,
                  url,
                }).catch(() => {});
              } else if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).catch(() => {});
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2500);
              } else {
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2500);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif transition-colors shadow-sm ${
              copiedLink
                ? 'bg-emerald-800 text-white'
                : 'bg-[#6B1724] text-white hover:bg-[#801427]'
            }`}
            title="Share wedding invitation link"
          >
            {copiedLink ? (
              <Check className="w-3.5 h-3.5 text-emerald-300" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-[#E5C378]" />
            )}
            <span>
              {copiedLink
                ? (language === 'hi' ? 'लिंक कॉपी हो गई!' : 'Link Copied!')
                : (language === 'hi' ? 'शेयर करें' : 'Share Link')}
            </span>
          </button>

          {/* Printable invitation view */}
          <button
            onClick={onOpenPrint}
            className="p-2 rounded-full text-[#6B5A51] hover:text-[#6B1724] hover:bg-[#F4EFE6] transition-colors"
            title={t.nav.printable}
            aria-label={t.nav.printable}
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Admin link */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif transition-colors border ${
              isAdmin
                ? 'bg-[#6B1724]/10 text-[#6B1724] border-[#6B1724]/40 font-semibold'
                : 'bg-transparent text-[#6B5A51] border-[#C5A059]/40 hover:text-[#6B1724] hover:border-[#6B1724]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'Admin' : t.nav.admin}</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex items-center bg-[#F4EFE6] border border-[#C5A059]/40 rounded-full p-0.5 text-xs">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2 py-0.5 text-[11px] font-semibold text-[#6B1724]"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#2D241E] hover:bg-[#F4EFE6]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#C5A059]/30 px-6 py-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-4 text-base font-serif">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`py-1 text-left ${
                  link.highlight
                    ? 'text-[#6B1724] font-semibold text-lg'
                    : 'text-[#4A3E38] hover:text-[#6B1724]'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-[#C5A059]/30 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPrint();
                }}
                className="flex items-center gap-2 text-sm text-[#4A3E38] hover:text-[#6B1724]"
              >
                <Printer className="w-4 h-4" />
                <span>{t.nav.printable}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#6B1724] text-white"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'Admin Active' : t.nav.admin}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
