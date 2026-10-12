/**
 * Forever Together - Luxury Indian Wedding Invitation & Guest Management Platform
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { WeddingProvider } from './context/WeddingContext';
import { PetalsAndSparkles } from './components/common/PetalsAndSparkles';
import { FloatingAudioPlayer } from './components/common/FloatingAudioPlayer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/common/Navbar';
import { EnvelopeInvitation } from './components/envelope/EnvelopeInvitation';
import { WeddingCountdown } from './components/countdown/WeddingCountdown';
import { FamilyIntroductions } from './components/family/FamilyIntroductions';
import { OurStory } from './components/story/OurStory';
import { EventSchedule } from './components/events/EventSchedule';
import { WeddingGallery } from './components/gallery/WeddingGallery';
import { RSVPSection } from './components/rsvp/RSVPSection';
import { ShagunSection } from './components/shagun/ShagunSection';
import { GuestWishesSection } from './components/wishes/GuestWishesSection';
import { VenueSection } from './components/venue/VenueSection';
import { FAQSection } from './components/faq/FAQSection';
import { Footer } from './components/common/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PrintableInvitation } from './components/print/PrintableInvitation';

function WeddingAppContent() {
  const [isEnvelopeFlapOpen, setIsEnvelopeFlapOpen] = useState<boolean>(false);
  const [burstCounter, setBurstCounter] = useState<number>(0);
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  const [showPrint, setShowPrint] = useState<boolean>(false);

  const handleOpenFlap = () => {
    setIsEnvelopeFlapOpen(true);
    setBurstCounter((prev) => prev + 1);
  };

  const handleEnterCelebration = () => {
    setBurstCounter((prev) => prev + 1);
    const target = document.querySelector('#countdown-section') || document.querySelector('#events');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReopenEnvelope = () => {
    setIsEnvelopeFlapOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D241E] relative selection:bg-[#C5A059]/20 selection:text-[#6B1724]">
      {/* Rose Petals & Gold Sparkles Floating Canvas */}
      <PetalsAndSparkles burstTrigger={burstCounter} />

      {/* Floating Audio Player (Persists across views, starts only after user interaction) */}
      <FloatingAudioPlayer />

      {/* Sticky Luxury Navigation Bar */}
      <Navbar
        onOpenAdmin={() => setShowAdmin(true)}
        onOpenPrint={() => setShowPrint(true)}
      />

      <main>
        {/* Grand Opening Cinematic Wax Seal Royal Invitation Section */}
        <EnvelopeInvitation
          isOpen={isEnvelopeFlapOpen}
          onOpenFlap={handleOpenFlap}
          onEnter={handleEnterCelebration}
          isHeroMode={true}
        />

        {/* Hero & Live Wedding Countdown Timer */}
        <WeddingCountdown />

        {/* Bride & Groom Family Introductions */}
        <FamilyIntroductions />

        {/* Couple Story & Relationship Milestones */}
        <OurStory />

        {/* Complete Wedding Events Itinerary with .ICS & Google Maps */}
        <EventSchedule />

        {/* Pre-Wedding Photo & Video Gallery with Lightbox */}
        <WeddingGallery />

        {/* RSVP Attendance Confirmation & Personalized Invitation Greeting */}
        <RSVPSection />

        {/* Traditional Digital Shagun & Verified UPI QR Code */}
        <ShagunSection />

        {/* Guest Wishes & Blessings Guestbook with Host Moderation */}
        <GuestWishesSection />

        {/* Venue, Interactive Map, Parking & Travel Guide */}
        <VenueSection />

        {/* Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* Footer with Sanskrit Shloka and Hashtag */}
      <Footer
        onOpenAdmin={() => setShowAdmin(true)}
        onOpenPrint={() => setShowPrint(true)}
        onReopenEnvelope={handleReopenEnvelope}
      />

      {/* Admin Management Modal Portal */}
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}

      {/* Printable / Downloadable PDF Royal Invitation View */}
      {showPrint && <PrintableInvitation onClose={() => setShowPrint(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <WeddingProvider>
          <WeddingAppContent />
        </WeddingProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
