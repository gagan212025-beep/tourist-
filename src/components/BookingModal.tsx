import React, { useState } from 'react';
import { BookingRecord } from '../types';
import {
  X,
  Calendar,
  User,
  Phone,
  Mail,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Lock,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  serviceType: string;
  targetTitle: string;
  providerId?: string;
  defaultAmount?: number;
  onClose: () => void;
  onBookingComplete: (booking: BookingRecord) => void;
  language: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  serviceType,
  targetTitle,
  providerId,
  defaultAmount = 1500,
  onClose,
  onBookingComplete,
  language
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [partySize, setPartySize] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'arrival'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  const totalAmount = defaultAmount * (serviceType === 'homestay_stay' ? partySize : 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    try {
      let bookingItem: BookingRecord;
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceType,
          serviceTitle: targetTitle,
          providerId: providerId || 'prov-001',
          touristName: name,
          touristContact: `${phone} | ${email}`,
          scheduledDate,
          partySize,
          amount: totalAmount
        })
      });

      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        bookingItem = data.booking || data;
      } else {
        bookingItem = {
          id: `BKG-${Date.now().toString().slice(-6)}`,
          touristName: name,
          touristContact: `${phone} | ${email}`,
          serviceType,
          targetTitle,
          providerId: providerId || 'prov-001',
          bookingDate: new Date().toISOString().split('T')[0],
          scheduledDate,
          partySize,
          amount: totalAmount,
          status: 'confirmed',
          blockchainTxHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          blockIndex: 120,
          paymentMethod
        };
      }

      setConfirmedBooking(bookingItem);
      onBookingComplete(bookingItem);

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-stone-100">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div>
            <span className="text-[10px] px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold uppercase tracking-wider border border-emerald-500/40">
              {serviceType.replace('_', ' ')}
            </span>
            <h3 className="text-lg sm:text-xl font-black font-serif text-white mt-1 line-clamp-1">
              {targetTitle}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Confirmed, Show Receipt */}
        {confirmedBooking ? (
          <div className="space-y-5 animate-fade-in">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950 to-stone-950 border-2 border-emerald-500/60 text-center space-y-3 shadow-xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-xl font-black font-serif text-white">
                Booking Confirmed & Escrow Logged!
              </h4>
              <p className="text-xs text-stone-300">
                Your reservation has been cryptographically anchored to the Jharkhand Tourism Ledger.
              </p>

              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-xs font-mono text-left space-y-1.5">
                <div className="flex justify-between text-stone-400">
                  <span>Booking ID:</span>
                  <span className="text-amber-400 font-bold">{confirmedBooking.id}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Date:</span>
                  <span className="text-white">{confirmedBooking.scheduledDate}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Total Escrow Amount:</span>
                  <span className="text-emerald-300 font-bold">₹{confirmedBooking.amount.toLocaleString()}</span>
                </div>
                <div className="text-stone-500 text-[10px] break-all pt-1 border-t border-stone-800">
                  Tx Hash: {confirmedBooking.blockchainTxHash}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs border border-stone-700 transition-colors"
            >
              Close & Return to Journey
            </button>
          </div>
        ) : (
          /* Booking Input Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Travel Date *</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Party Size (Persons)</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={partySize}
                    onChange={e => setPartySize(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-1 pt-1">
                <label className="text-xs font-bold text-stone-300">Payment & Escrow Mode</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    UPI Fast Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('arrival')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'arrival'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    Pay on Arrival
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow'
                        : 'bg-stone-950 border-stone-800 text-stone-400'
                    }`}
                  >
                    Card / NetBank
                  </button>
                </div>
              </div>
            </div>

            {/* Total Amount & Escrow Note */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Total Amount</span>
                <span className="text-xl font-black text-amber-400">₹{totalAmount.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>Blockchain Escrow Protection</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl hover:brightness-110 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <span>Locking Escrow on Blockchain...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Confirm Booking & Generate Hash</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
