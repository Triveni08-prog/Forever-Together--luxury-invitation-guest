import React, { useState, useEffect, useCallback } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Eye, Image as ImageIcon } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';

export const WeddingGallery: React.FC = () => {
  const { data } = useWedding();
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', label: t.gallery.all },
    { id: 'portraits', label: t.gallery.portraits },
    { id: 'pre-wedding', label: t.gallery.preWedding },
    { id: 'haldi', label: t.gallery.haldi },
    { id: 'mehendi', label: t.gallery.mehendi },
    { id: 'sangeet', label: t.gallery.sangeet },
  ];

  const filteredImages = data.galleryImages
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((img) => selectedCategory === 'all' || img.category === selectedCategory);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredImages.length - 1));
  }, [lightboxIndex, filteredImages.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! < filteredImages.length - 1 ? prev! + 1 : 0));
  }, [lightboxIndex, filteredImages.length]);

  const handleClose = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleClose, handlePrev, handleNext]);

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-[#FAF7F2] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C6D37] font-serif mb-2">
            <Camera className="w-3.5 h-3.5 text-[#6B1724]" />
            <span>{t.gallery.badge}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#6B1724] font-bold">
            {t.gallery.title}
          </h2>
          <p className="text-sm sm:text-base font-serif text-[#6B5A51] mt-2 italic">
            {t.gallery.subtitle}
          </p>
        </div>

        {/* Clean Segmented Category Tabs (Following Frontend Design Guidelines) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-[#F4EFE6] rounded-xl max-w-xl mx-auto mb-12 border border-[#C5A059]/30">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-serif rounded-lg transition-colors font-medium ${
                selectedCategory === cat.id
                  ? 'bg-[#6B1724] text-[#FAF7F2] shadow-sm font-semibold'
                  : 'text-[#6B5A51] hover:text-[#2D241E] hover:bg-[#FAF7F2]/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#FFFDF9] border border-[#C5A059]/40 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#F4EFE6] relative">
                {imageErrors[img.id] ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-[#8C6D37] bg-[#F5EFE6] text-center">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs font-serif italic">Sample photo placeholder</span>
                  </div>
                ) : (
                  <img
                    src={img.url}
                    alt={img.caption}
                    loading="lazy"
                    onError={() => setImageErrors((prev) => ({ ...prev, [img.id]: true }))}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="text-white">
                    <p className="font-serif text-xs italic">{img.caption}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#E5C378] uppercase tracking-wider font-serif mt-1">
                      <Eye className="w-3 h-3" /> {t.gallery.viewPhoto}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Top Bar */}
            <div
              className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-xs font-serif text-[#C5A059] tracking-widest">
                {lightboxIndex + 1} / {filteredImages.length}
              </span>
              <button
                onClick={handleClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={t.gallery.close}
                aria-label={t.gallery.close}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Lightbox Content */}
            <div
              className="relative max-w-4xl max-h-[80vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[lightboxIndex].url}
                alt={filteredImages[lightboxIndex].caption}
                className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
              <p className="text-center text-sm font-serif text-[#FAF7F2] mt-4 italic max-w-lg">
                {filteredImages[lightboxIndex].caption}
              </p>
            </div>

            {/* Navigation Controls */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              title={t.gallery.prev}
              aria-label={t.gallery.prev}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
              title={t.gallery.next}
              aria-label={t.gallery.next}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
