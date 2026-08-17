import React, { useState, useEffect } from 'react';
import { Provider, BookingRecord } from '../types';
import { INITIAL_PROVIDERS } from '../data/seedData';
import {
  UserCheck,
  ShieldCheck,
  QrCode,
  PlusCircle,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  FileText,
  Download,
  AlertCircle
} from 'lucide-react';
import QRCode from 'qrcode';

interface ProviderPortalProps {
  providers: Provider[];
  bookings: BookingRecord[];
  onRegisterProvider: (newProvider: Partial<Provider>) => void;
  language: string;
}

export const ProviderPortal: React.FC<ProviderPortalProps> = ({
  providers = INITIAL_PROVIDERS,
  bookings = [],
  onRegisterProvider,
  language
}) => {
  const safeProviders = Array.isArray(providers) && providers.length > 0 ? providers.filter(Boolean) : INITIAL_PROVIDERS;
  const [selectedProvider, setSelectedProvider] = useState<Provider>(safeProviders[0] || INITIAL_PROVIDERS[0]);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'certificate' | 'bookings' | 'register'>('certificate');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: 'guide',
    location: 'Netarhat, Latehar',
    bio: '',
    phone: '+91 ',
    community: 'Oraon Tribe',
    servicesOffered: 'Guided Sunrise Trek, Tribal Folklore Storytelling',
    pricing: '₹1,200 / day',
    languages: 'Hindi, Sadri, English, Kudukh'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Sync selected provider when providers list updates
  useEffect(() => {
    if (safeProviders.length > 0) {
      if (!selectedProvider || !safeProviders.some(p => p && p.id === selectedProvider?.id)) {
        setSelectedProvider(safeProviders[0]);
      }
    }
  }, [providers]);

  // Generate QR Code for the selected provider's digital blockchain certificate
  useEffect(() => {
    if (selectedProvider && selectedProvider.blockchainCertHash) {
      const verifyUrl = `${window.location.origin}/verify?certId=${selectedProvider.id}&hash=${selectedProvider.blockchainCertHash}`;
      QRCode.toDataURL(verifyUrl, {
        width: 180,
        margin: 1,
        color: { dark: '#042f2e', light: '#ffffff' }
      })
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [selectedProvider]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/providers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          location: formData.location,
          bio: formData.bio,
          phone: formData.phone,
          community: formData.community,
          servicesOffered: formData.servicesOffered.split(',').map(s => s.trim()),
          pricing: formData.pricing,
          languages: formData.languages.split(',').map(l => l.trim())
        })
      });
      const data = await res.json();
      onRegisterProvider(data.provider);
      setSelectedProvider(data.provider);
      setRegisterSuccess(true);
      setActiveTab('certificate');
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const providerBookings = Array.isArray(bookings)
    ? bookings.filter(b => b && b.providerId && selectedProvider && b.providerId === selectedProvider.id)
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-stone-100">
      {/* Portal Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-950 via-stone-900 to-emerald-950 border border-amber-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/80 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Jharkhand Tourism Provider Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Local Guide & Artisan Self-Service Portal
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Access your official blockchain-verified digital credential, accept direct tourist reservations, and register new eco-services with the Department of Tourism.
            </p>
          </div>

          {/* Provider Selector Dropdown for simulation */}
          <div className="bg-stone-950/80 p-3 rounded-2xl border border-stone-800 space-y-1">
            <label className="text-[10px] text-stone-400 uppercase font-bold block">
              Active Provider Profile:
            </label>
            <select
              value={selectedProvider?.id || ''}
              onChange={e => {
                const found = safeProviders.find(p => p && p.id === e.target.value);
                if (found) setSelectedProvider(found);
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
            >
              {safeProviders.map(p => p && (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.role?.toUpperCase() || 'GUIDE'}) - {p.location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('certificate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'certificate'
              ? 'bg-amber-700 text-white shadow'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Official Digital Certificate</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bookings'
              ? 'bg-amber-700 text-white shadow'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Tourist Bookings ({providerBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('register')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'register'
              ? 'bg-amber-700 text-white shadow'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Provider</span>
        </button>
      </div>

      {/* TAB 1: OFFICIAL DIGITAL CERTIFICATE */}
      {activeTab === 'certificate' && selectedProvider && (
        <div className="space-y-6">
          {/* Certificate Card Printable Layout */}
          <div className="relative max-w-3xl mx-auto bg-gradient-to-b from-stone-900 to-stone-950 rounded-3xl border-2 border-amber-500/60 p-8 shadow-2xl overflow-hidden text-stone-100">
            {/* Watermark Logo Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-9xl font-serif font-black text-amber-300 select-none">
              JOHAR
            </div>

            {/* Certificate Header */}
            <div className="flex items-center justify-between pb-6 border-b border-amber-500/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center font-black text-2xl text-stone-950 font-serif shadow-lg">
                  झ
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black font-serif text-amber-200 uppercase tracking-wide">
                    Government of Jharkhand
                  </h3>
                  <p className="text-[11px] text-emerald-300 font-semibold uppercase tracking-wider">
                    Department of Tourism & Cultural Affairs • Certified Provider
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-stone-400 block font-mono">Reg ID</span>
                <span className="text-xs font-mono font-bold text-amber-400">{selectedProvider.id}</span>
              </div>
            </div>

            {/* Certificate Body Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 items-center">
              {/* Photo & Badge */}
              <div className="flex flex-col items-center text-center space-y-2">
                <img
                  src={selectedProvider.avatarUrl}
                  alt={selectedProvider.name}
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-amber-400 shadow-xl"
                />
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold uppercase border border-emerald-500/40">
                  {selectedProvider.role.toUpperCase()}
                </span>
              </div>

              {/* Provider Info */}
              <div className="sm:col-span-2 space-y-3 text-xs">
                <div>
                  <h4 className="text-2xl font-black font-serif text-white">{selectedProvider.name}</h4>
                  <p className="text-amber-300 font-medium">{selectedProvider.community} • {selectedProvider.location}</p>
                </div>

                <p className="text-stone-300 leading-relaxed italic">{selectedProvider.bio}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-950/80 p-3 rounded-xl border border-stone-800">
                  <div>
                    <span className="text-stone-400 block">Languages Spoken:</span>
                    <span className="font-semibold text-white">{selectedProvider.languages.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Standard Rate:</span>
                    <span className="font-semibold text-amber-300">{selectedProvider.pricing}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Verification Proof Footnote */}
            <div className="pt-6 border-t border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-950/90 -mx-8 -mb-8 p-6">
              <div className="space-y-1 max-w-md">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Cryptographic Proof of Authenticity</span>
                </div>
                <p className="text-[10px] text-stone-400 font-mono break-all">
                  Tx Hash: {selectedProvider.blockchainCertHash || '0x4f89a77c3e120bc7189d9841'}
                </p>
                <p className="text-[10px] text-stone-500">
                  Verified on Jharkhand Smart Tourism Block #{selectedProvider.registeredBlockIndex || 1}
                </p>
              </div>

              {qrCodeDataUrl && (
                <div className="flex flex-col items-center text-center">
                  <div className="p-1.5 bg-white rounded-xl shadow-lg">
                    <img src={qrCodeDataUrl} alt="Verify QR" className="w-20 h-20" />
                  </div>
                  <span className="text-[9px] text-stone-400 mt-1 uppercase font-bold">Scan to Verify</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOURIST BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              Incoming Bookings for {selectedProvider?.name}
            </h3>
            <span className="text-xs text-stone-400">
              Total Revenue Generated: ₹
              {providerBookings
                .reduce((acc, b) => acc + (b?.amount || 0), 0)
                .toLocaleString()}
            </span>
          </div>

          <div className="space-y-3">
            {providerBookings.length > 0 ? (
              providerBookings.map(b => (
                <div
                  key={b.id}
                  className="bg-stone-900 rounded-2xl border border-stone-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">{b.id}</span>
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-white">{b.targetTitle || 'Custom Eco Tour'}</h4>
                    <div className="flex items-center gap-4 text-xs text-stone-400">
                      <span>Tourist: <strong className="text-white">{b.touristName}</strong></span>
                      <span>Date: <strong className="text-white">{b.scheduledDate || b.travelDate || b.bookingDate}</strong></span>
                      <span>Guests: <strong className="text-white">{b.partySize || 1}</strong></span>
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                    <span className="text-lg font-black text-white">₹{(b.amount || 0).toLocaleString()}</span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      Escrow: {(b.blockchainTxHash || b.transactionHash || '0x9a8b7c6d').substring(0, 10)}...
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-stone-900/50 rounded-2xl border border-stone-800 text-stone-400 text-xs">
                No active bookings found for this provider profile yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: REGISTER NEW PROVIDER */}
      {activeTab === 'register' && (
        <form
          onSubmit={handleRegisterSubmit}
          className="bg-stone-900 rounded-3xl border border-stone-800 p-6 sm:p-8 space-y-6 shadow-xl"
        >
          <div className="space-y-1 border-b border-stone-800 pb-4">
            <h3 className="text-lg font-bold text-white">Register as Certified Guide or Homestay</h3>
            <p className="text-xs text-stone-400">
              Your credentials will be minted to the simulated blockchain and issued an official verifiable QR badge.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Rameshwar Munda"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">Service Role *</label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="guide">Certified Naturalist / Trek Guide</option>
                <option value="homestay">Traditional Tribal Homestay Host</option>
                <option value="artisan">Handicraft Master Artisan</option>
                <option value="transport">Eco-Safari Vehicle Operator</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">Location / Village / District *</label>
              <input
                type="text"
                required
                placeholder="e.g. Netarhat, Latehar"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">Indigenous Community / Guild</label>
              <input
                type="text"
                placeholder="e.g. Munda, Santhal, Oraon, Asur"
                value={formData.community}
                onChange={e => setFormData({ ...formData, community: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">Mobile / WhatsApp Number *</label>
              <input
                type="text"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">Standard Pricing / Tariff *</label>
              <input
                type="text"
                required
                placeholder="e.g. ₹1,200 / day"
                value={formData.pricing}
                onChange={e => setFormData({ ...formData, pricing: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-300">Bio & Experience Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Tell tourists about your local roots, forest experience, folklore knowledge..."
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-800">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-emerald-600 text-white font-bold text-xs shadow-lg hover:brightness-110 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <span>Minting Blockchain Credential...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit & Mint Blockchain Credential</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
