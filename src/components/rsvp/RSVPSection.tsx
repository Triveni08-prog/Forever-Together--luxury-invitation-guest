import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, HeartHandshake, Loader2, Sparkles, Send } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';
import { AttendanceStatus, DietaryPreference } from '../../types/wedding';

export const RSVPSection: React.FC = () => {
  const { data, activeInvitation, submitRSVP } = useWedding();
  const { language, t } = useLanguage();

  const [guestName, setGuestName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [invitationToken, setInvitationToken] = useState('');
  const [attendance, setAttendance] = useState<AttendanceStatus>('attending');
  const [totalAttending, setTotalAttending] = useState(2);
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('vegetarian');
  const [foodAllergies, setFoodAllergies] = useState('');
  const [attendingEvents, setAttendingEvents] = useState<string[]>([]);
  const [contactPhone, setContactPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [messageToCouple, setMessageToCouple] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ message: string; rsvpId?: string } | null>(null);

  // Prefill if an active invitation was detected
  useEffect(() => {
    if (activeInvitation) {
      setGuestName(activeInvitation.primaryGuestName);
      setFamilyName(activeInvitation.familyName || '');
      setInvitationToken(activeInvitation.token);
      setTotalAttending(Math.min(2, activeInvitation.allowedGuests));
      setAdultsCount(Math.min(2, activeInvitation.allowedGuests));
      setAttendingEvents(activeInvitation.assignedEvents);
      if (activeInvitation.contactPhone) setContactPhone(activeInvitation.contactPhone);
    } else {
      // Default select all events
      setAttendingEvents(data.events.map((e) => e.id));
    }
  }, [activeInvitation, data.events]);

  // Adjust total when adults or children change
  const handleAdultsChange = (val: number) => {
    const adults = Math.max(1, val);
    setAdultsCount(adults);
    setTotalAttending(adults + childrenCount);
  };

  const handleChildrenChange = (val: number) => {
    const children = Math.max(0, val);
    setChildrenCount(children);
    setTotalAttending(adultsCount + children);
  };

  const toggleEvent = (eventId: string) => {
    if (attendingEvents.includes(eventId)) {
      setAttendingEvents(attendingEvents.filter((id) => id !== eventId));
    } else {
      setAttendingEvents([...attendingEvents, eventId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!guestName.trim() || guestName.trim().length < 2) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please provide your full name.');
      return;
    }

    if (attendance === 'attending') {
      if (attendingEvents.length === 0) {
        setErrorMessage(
          language === 'hi'
            ? 'कृपया कम से कम एक समारोह चुनें जिसमें आप उपस्थित होंगे।'
            : 'Please select at least one celebration you plan to attend.'
        );
        return;
      }

      if (activeInvitation && totalAttending > activeInvitation.allowedGuests) {
        setErrorMessage(
          language === 'hi'
            ? `आपके आमंत्रण पर अधिकतम ${activeInvitation.allowedGuests} सदस्य अनुमत हैं।`
            : `Your invitation allows a maximum of ${activeInvitation.allowedGuests} guests.`
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Genuine submission to persistent store
      const result = submitRSVP({
        guestName: guestName.trim(),
        familyName: familyName.trim() || undefined,
        invitationToken: invitationToken.trim() || undefined,
        attendance,
        totalAttending: attendance === 'attending' ? totalAttending : 0,
        adultsCount: attendance === 'attending' ? adultsCount : 0,
        childrenCount: attendance === 'attending' ? childrenCount : 0,
        dietaryPreference,
        foodAllergies: foodAllergies.trim() || undefined,
        attendingEvents: attendance === 'attending' ? attendingEvents : [],
        contactPhone: contactPhone.trim() || undefined,
        specialRequests: specialRequests.trim() || undefined,
        messageToCouple: messageToCouple.trim() || undefined,
      });

      if (result.success) {
        setSuccessInfo({
          message: result.message,
          rsvpId: result.rsvpId,
        });
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setErrorMessage(
        language === 'hi'
          ? 'उत्तर दर्ज करने में असमर्थ। कृपया पुनः प्रयास करें।'
          : 'Unable to save response. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-20 sm:py-28 bg-[#FFFDF9] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C6D37] font-serif mb-2">
            <HeartHandshake className="w-3.5 h-3.5 text-[#6B1724]" />
            <span>{t.rsvp.badge}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#6B1724] font-bold">
            {t.rsvp.title}
          </h2>
          <p className="text-sm sm:text-base font-serif text-[#6B5A51] mt-2 italic">
            {t.rsvp.subtitle}
          </p>
        </div>

        {/* Personalized Banner if active invitation token is present */}
        {activeInvitation && (
          <div className="mb-8 p-5 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#8C6D37] font-serif font-semibold">
                {t.rsvp.personalizedFor}
              </span>
              <h3 className="font-display text-lg text-[#6B1724] font-bold">
                {activeInvitation.familyName || activeInvitation.primaryGuestName}
              </h3>
              <p className="text-xs text-[#6B5A51] font-serif mt-0.5">
                Token: <code className="font-mono text-[#8C6D37]">{activeInvitation.token}</code> · Max Guests:{' '}
                <strong className="text-[#6B1724]">{activeInvitation.allowedGuests}</strong>
              </p>
            </div>
            <div className="text-xs text-[#8C6D37] font-serif italic bg-[#FFFDF9] py-1.5 px-3 rounded-full border border-[#C5A059]/30">
              Verified Royal Invitation
            </div>
          </div>
        )}

        {/* Success Confirmation Card */}
        {successInfo ? (
          <div className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-12 border-2 border-[#C5A059]/50 shadow-xl text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-[#6B1724] font-bold mb-2">
              {t.rsvp.successTitle}
            </h3>
            <p className="font-serif text-base text-[#4A3E38] max-w-lg mx-auto italic mb-4 leading-relaxed">
              {successInfo.message}
            </p>
            {successInfo.rsvpId && (
              <p className="text-xs font-mono text-[#8C6D37] mb-6">
                Confirmation ID: {successInfo.rsvpId}
              </p>
            )}
            <p className="text-xs font-serif text-[#6B5A51] max-w-md mx-auto mb-8">
              {t.rsvp.updateNotice}
            </p>
            <button
              onClick={() => setSuccessInfo(null)}
              className="px-6 py-2.5 rounded-full bg-[#6B1724] hover:bg-[#801427] text-white text-xs font-serif font-semibold transition-colors"
            >
              {language === 'hi' ? 'विवरण में बदलाव करें' : 'Update or Review Submission'}
            </button>
          </div>
        ) : (
          /* RSVP Form */
          <form
            onSubmit={handleSubmit}
            className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-10 border border-[#C5A059]/40 shadow-xl shadow-[#6B1724]/5"
          >
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-serif flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Guest & Family Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-serif font-semibold text-[#6B1724] uppercase tracking-wider mb-2">
                    {t.rsvp.guestName}
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Dr. Alok Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#C5A059]/40 text-sm font-serif text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B1724]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-semibold text-[#6B5A51] uppercase tracking-wider mb-2">
                    {t.rsvp.familyName}
                  </label>
                  <input
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder="e.g. Sharma Family"
                    className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#C5A059]/40 text-sm font-serif text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B1724]/40"
                  />
                </div>
              </div>

              {/* Attendance Choice */}
              <div>
                <label className="block text-xs font-serif font-semibold text-[#6B1724] uppercase tracking-wider mb-2">
                  {t.rsvp.attendanceStatus}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'attending', label: t.rsvp.attending, desc: 'Joyfully joining' },
                    { value: 'declined', label: t.rsvp.declined, desc: 'Sending blessings from afar' },
                    { value: 'tentative', label: t.rsvp.tentative, desc: 'Finalizing schedule' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setAttendance(option.value as AttendanceStatus)}
                      className={`p-3.5 rounded-xl border text-left transition-all font-serif ${
                        attendance === option.value
                          ? 'bg-[#6B1724] text-[#FAF7F2] border-[#6B1724] shadow-sm'
                          : 'bg-[#FFFDF9] text-[#4A3E38] border-[#C5A059]/40 hover:border-[#6B1724]/60'
                      }`}
                    >
                      <span className="font-semibold text-xs sm:text-sm block">{option.label}</span>
                      <span
                        className={`text-[11px] block mt-0.5 ${
                          attendance === option.value ? 'text-[#E5C378]' : 'text-[#8C6D37]'
                        }`}
                      >
                        {option.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional attending details */}
              {attendance === 'attending' && (
                <div className="space-y-6 pt-4 border-t border-[#C5A059]/20 animate-in fade-in duration-300">
                  {/* Headcount */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-serif font-semibold text-[#6B1724] uppercase tracking-wider mb-2">
                        {t.rsvp.adultsCount}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min={1}
                          max={activeInvitation ? activeInvitation.allowedGuests : 12}
                          value={adultsCount}
                          onChange={(e) => handleAdultsChange(parseInt(e.target.value) || 1)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#C5A059]/40 text-sm font-serif text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B1724]/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-serif font-semibold text-[#6B5A51] uppercase tracking-wider mb-2">
                        {t.rsvp.childrenCount}
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={childrenCount}
                        onChange={(e) => handleChildrenChange(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FFFDF9] border border-[#C5A059]/40 text-sm font-serif text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B1724]/40"
                      />
                    </div>
                  </div>

                  <div className="text-xs font-serif text-[#8C6D37] italic">
                    Total Party Count: <strong>{totalAttending} guests</strong>
                    {activeInvitation && (
                      <span> (Max allowed for this token: {activeInvitation.allowedGuests})</span>
                    )}
                  </div>

                  {/* Dietary Preferences */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-serif font-semibold text-[#6B1724] uppercase tracking-wider mb-2">
                        {t.rsvp.dietaryPreference}
                      </label>
                      <select
                        value={dietaryPreference}
                        onChange={(e) => setDietaryPreference(e.target.value as DietaryPreference)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#C5A059]/40 text-sm font-serif text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B1724]/40"
                      >
                        <option value="vegetarian">{t.rsvp.vegetarian}</option>
                        <option value="jain">{t.rsvp.jain}</option>
                        <option value="vegan">{t.rsvp.vegan}</option>
                        <option value="no_preference">{t.rsvp.noPreference}</option>
                        <option value="other">{t.rsvp.other}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-serif font-semibold text-[#6B5A51] uppercase tracking-wider mb-2">
                        {t.rsvp.foodAllergies}
                      </label>
                      <input
                        type="text"
                        value={foodAllergies}
                        onChange={(e) => setFoodAllergies(e.target.value)}
                        placeholder="e.g. Peanuts, Dairy, Gluten (if any)"
                        className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#C5A059]/40 text-sm font-serif text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B1724]/40"
                      />
                    </div>
                  </div>

                  {/* Which events attending */}
                  <div>
                    <label className="block text-xs font-serif font-semibold text-[#6B1724] uppercase tracking-wider mb-2">
                      {t.rsvp.attendingEvents}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {data.events.map((ev) => (
                        <label
                          key={ev.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                            attendingEvents.includes(ev.id)
                              ? 'bg-[#FFFDF9] border-[#6B1724] text-[#6B1724]'
                              : 'bg-[#FFFDF9]/60 border-[#C5A059]/30 text-[#6B5A51]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={attendingEvents.includes(ev.id)}
                            onChange={() => toggleEvent(ev.id)}
                            className="w-4 h-4 text-[#6B1724] rounded border-[#C5A059] focus:ring-[#6B1724]"
                          />
                          <div className="flex flex-col text-xs font-serif">
                            <span className="font-semibold text-[#2D241E]">
                              {language === 'hi' ? ev.nameHindi || ev.name : ev.name}
                            </span>
                            <span className="text-[11px] text-[#8C6D37]">
                              {ev.date} · {ev.startTime}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact phone & Special requests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-serif font-semibold text-[#6B5A51] uppercase tracking-wider mb-2">
                    {t.rsvp.contactPhone}
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#C5A059]/40 text-sm font-serif text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B1724]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif font-semibold text-[#6B5A51] uppercase tracking-wider mb-2">
                    {t.rsvp.specialRequests}
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Airport shuttle, Wheelchair"
                    className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#C5A059]/40 text-sm font-serif text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B1724]/40"
                  />
                </div>
              </div>

              {/* Message to Couple */}
              <div>
                <label className="block text-xs font-serif font-semibold text-[#6B1724] uppercase tracking-wider mb-2">
                  {t.rsvp.messageToCouple}
                </label>
                <textarea
                  rows={3}
                  value={messageToCouple}
                  onChange={(e) => setMessageToCouple(e.target.value)}
                  placeholder="Share a sweet blessing or congratulations..."
                  className="w-full px-4 py-3 rounded-xl bg-[#FFFDF9] border border-[#C5A059]/40 text-sm font-serif text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B1724]/40 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 py-4 bg-[#6B1724] hover:bg-[#801427] text-[#FAF7F2] rounded-full font-serif text-sm tracking-wider uppercase font-semibold shadow-xl shadow-[#6B1724]/20 border border-[#C5A059]/60 transition-all duration-200 flex items-center justify-center gap-2 mx-auto disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#E5C378]" />
                      <span>{t.rsvp.submitting}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.rsvp.submit}</span>
                      <Send className="w-4 h-4 text-[#E5C378]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
