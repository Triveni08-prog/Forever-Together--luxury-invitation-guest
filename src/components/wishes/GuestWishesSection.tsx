import React, { useState } from 'react';
import { MessageSquareHeart, Send, CheckCircle2, AlertCircle, Sparkles, Heart } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';

export const GuestWishesSection: React.FC = () => {
  const { data, submitWish } = useWedding();
  const { language, t } = useLanguage();

  const [guestName, setGuestName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; text: string } | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter only approved wishes for public display
  const approvedWishes = data.wishes.filter((w) => w.status === 'approved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!guestName.trim() || guestName.trim().length < 2) {
      setFeedback({ success: false, text: 'Please enter your name.' });
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setFeedback({ success: false, text: 'Please write a heartfelt message of at least 5 characters.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = submitWish({
        guestName: guestName.trim(),
        relationship: relationship.trim() || undefined,
        message: message.trim(),
      });

      if (res.success) {
        setFeedback({ success: true, text: res.message });
        setGuestName('');
        setRelationship('');
        setMessage('');
      } else {
        setFeedback({ success: false, text: res.message });
      }
    } catch {
      setFeedback({ success: false, text: 'Could not send wishes at this time.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="wishes" className="py-20 sm:py-28 bg-[#FFFDF9] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C6D37] font-serif mb-2">
            <MessageSquareHeart className="w-3.5 h-3.5 text-[#6B1724]" />
            <span>{t.wishes.badge}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#6B1724] font-bold">
            {t.wishes.title}
          </h2>
          <p className="text-sm sm:text-base font-serif text-[#6B5A51] mt-2 italic">
            {t.wishes.subtitle}
          </p>
        </div>

        {/* Wishes Form & Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Submission Form */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#C5A059]/40 shadow-md">
              <h3 className="font-display text-lg text-[#6B1724] font-bold mb-1">
                {language === 'hi' ? 'अपने शुभाशीर्वाद प्रेषित करें' : 'Pen Your Blessings'}
              </h3>
              <p className="text-xs font-serif text-[#6B5A51] italic mb-6">
                {t.wishes.moderationNotice}
              </p>

              {feedback && (
                <div
                  className={`mb-5 p-3.5 rounded-xl text-xs font-serif flex items-start gap-2.5 ${
                    feedback.success
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  {feedback.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  )}
                  <span>{feedback.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif font-semibold text-[#6B1724] uppercase tracking-wider mb-1.5">
                    {t.wishes.yourName}
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Pooja & Sameer Kapur"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#C5A059]/40 text-xs sm:text-sm font-serif text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B1724]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-semibold text-[#6B5A51] uppercase tracking-wider mb-1.5">
                    {t.wishes.relationship}
                  </label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g. Groom's Sister / College Friend"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#C5A059]/40 text-xs sm:text-sm font-serif text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B1724]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-semibold text-[#6B1724] uppercase tracking-wider mb-1.5">
                    {t.wishes.message}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="May your union be blessed with joy, laughter, and an eternity of companionship..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#C5A059]/40 text-xs sm:text-sm font-serif text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B1724]/40 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#6B1724] hover:bg-[#801427] text-[#FAF7F2] rounded-full text-xs font-serif font-semibold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span>{t.wishes.submit}</span>
                  <Send className="w-3.5 h-3.5 text-[#E5C378]" />
                </button>
              </form>
            </div>
          </div>

          {/* Approved Wishes Wall */}
          <div className="lg:col-span-7">
            {approvedWishes.length === 0 ? (
              <div className="bg-[#FAF7F2] rounded-3xl p-10 border border-[#C5A059]/30 text-center">
                <Heart className="w-8 h-8 text-[#C5A059] mx-auto mb-2 opacity-60" />
                <p className="font-serif text-sm text-[#6B5A51] italic">{t.wishes.empty}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedWishes.slice(0, visibleCount).map((wish) => (
                  <div
                    key={wish.id}
                    className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#C5A059]/35 shadow-sm hover:shadow-md transition-shadow relative"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-display text-sm sm:text-base font-bold text-[#6B1724]">
                          {wish.guestName}
                        </h4>
                        {wish.relationship && (
                          <span className="text-[11px] font-serif text-[#8C6D37] italic">
                            {wish.relationship}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-serif text-[#6B5A51]/70">
                        {new Date(wish.submittedAt).toLocaleDateString(
                          language === 'hi' ? 'hi-IN' : 'en-US',
                          { month: 'short', day: 'numeric' }
                        )}
                      </span>
                    </div>

                    <p className="font-serif text-xs sm:text-sm text-[#3E342F] leading-relaxed italic">
                      "{wish.message}"
                    </p>
                  </div>
                ))}

                {approvedWishes.length > visibleCount && (
                  <div className="text-center pt-3">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="px-6 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#C5A059]/40 text-xs font-serif text-[#6B1724] font-semibold transition-colors"
                    >
                      {language === 'hi' ? 'और संदेश देखें' : 'Load More Blessings'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
