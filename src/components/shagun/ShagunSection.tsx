import React, { useState } from 'react';
import { Gift, Copy, Check, ExternalLink, QrCode, ShieldCheck, AlertCircle } from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { useLanguage } from '../../context/LanguageContext';

export const ShagunSection: React.FC = () => {
  const { data } = useWedding();
  const { language, t } = useLanguage();

  const [selectedAmount, setSelectedAmount] = useState<number>(1100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  // Standard UPI URI specification
  // upi://pay?pa=recipient@bank&pn=Recipient+Name&am=1100&cu=INR&tn=Wedding+Shagun
  const upiUri = `upi://pay?pa=${data.settings.upiId}&pn=${encodeURIComponent(
    data.settings.upiRecipientName
  )}&am=${finalAmount > 0 ? finalAmount : 1100}&cu=INR&tn=${encodeURIComponent('Wedding Shagun & Blessings')}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(data.settings.upiId);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleOpenUpi = () => {
    try {
      const a = document.createElement('a');
      a.href = upiUri;
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // ignore
    }
  };

  return (
    <section id="shagun" className="py-20 sm:py-28 bg-[#FAF7F2] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C6D37] font-serif mb-2">
            <Gift className="w-3.5 h-3.5 text-[#6B1724]" />
            <span>{t.shagun.badge}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#6B1724] font-bold">
            {t.shagun.title}
          </h2>
          <p className="text-sm sm:text-base font-serif text-[#6B5A51] mt-2 italic">
            "{data.settings.shagunInstructions || t.shagun.subtitle}"
          </p>
        </div>

        {/* Shagun Card */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border border-[#C5A059]/40 shadow-xl shadow-[#6B1724]/5 max-w-2xl mx-auto">
          {/* Recipient & Verified badge */}
          <div className="text-center pb-6 border-b border-[#C5A059]/20">
            <span className="text-[11px] uppercase tracking-widest text-[#8C6D37] font-serif font-semibold">
              {t.shagun.recipient}
            </span>
            <h3 className="font-display text-xl sm:text-2xl text-[#6B1724] font-bold mt-0.5">
              {data.settings.upiRecipientName}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="font-mono text-xs text-[#2D241E] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#C5A059]/30">
                {data.settings.upiId}
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-full hover:bg-[#F4EFE6] text-[#8C6D37] transition-colors"
                title={t.shagun.copyUpi}
                aria-label={t.shagun.copyUpi}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <span className="text-[11px] text-emerald-700 font-serif block mt-1">
                {t.shagun.copied}
              </span>
            )}
          </div>

          {/* Amount selector */}
          <div className="py-6">
            <label className="block text-xs font-serif font-semibold text-[#6B1724] uppercase tracking-wider mb-3 text-center">
              {t.shagun.suggestedAmounts}
            </label>
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3 mb-4">
              {(data.settings.suggestedShagunAmounts || [501, 1100, 2100, 5100]).map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-serif font-semibold transition-all border ${
                    selectedAmount === amt && !customAmount
                      ? 'bg-[#6B1724] text-[#FAF7F2] border-[#6B1724] shadow-sm'
                      : 'bg-[#FAF7F2] text-[#4A3E38] border-[#C5A059]/40 hover:border-[#6B1724]/60'
                  }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="mt-4">
              <label className="block text-[11px] font-serif text-[#6B5A51] uppercase tracking-wider mb-1.5 text-center">
                {t.shagun.customAmount}
              </label>
              <div className="relative max-w-xs mx-auto">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-serif text-[#8C6D37] font-semibold">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  placeholder="Enter custom blessings amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#C5A059]/40 text-sm font-serif text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B1724]/40 text-center"
                />
              </div>
            </div>
          </div>

          {/* Actions: Open UPI app / Show QR Code */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleOpenUpi}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#6B1724] hover:bg-[#801427] text-[#FAF7F2] text-xs font-serif font-semibold transition-all flex items-center justify-center gap-2 shadow-md shadow-[#6B1724]/20 border border-[#C5A059]/40"
            >
              <span>{t.shagun.payWithUpi} (₹{finalAmount.toLocaleString('en-IN')})</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#E5C378]" />
            </button>

            <button
              onClick={() => setShowQrModal(!showQrModal)}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FAF7F2] hover:bg-[#F4EFE6] text-[#6B1724] border border-[#C5A059]/50 text-xs font-serif font-semibold transition-all flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4 text-[#8C6D37]" />
              <span>{showQrModal ? 'Hide QR Code' : t.shagun.scanQr}</span>
            </button>
          </div>

          {/* QR Code Reveal */}
          {showQrModal && (
            <div className="mt-6 p-6 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/40 text-center animate-in fade-in duration-300">
              <div className="inline-block p-4 bg-white rounded-2xl shadow-md border border-[#C5A059]/30">
                {/* Genuine UPI QR code representation using encoded UPI URI */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    upiUri
                  )}&color=6B1724`}
                  alt="UPI QR Code for Wedding Shagun"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-xs font-serif text-[#6B5A51] mt-3">
                Scan using Google Pay, PhonePe, Paytm, or BHIM UPI
              </p>
              <p className="text-[11px] font-mono text-[#8C6D37] mt-0.5">
                Amount: ₹{finalAmount.toLocaleString('en-IN')}
              </p>
            </div>
          )}

          {/* Honest Disclaimer */}
          <div className="mt-8 pt-4 border-t border-[#C5A059]/20 flex items-start gap-2 text-[11px] font-serif text-[#6B5A51] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[#8C6D37] shrink-0 mt-0.5" />
            <span>{t.shagun.disclaimer}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
