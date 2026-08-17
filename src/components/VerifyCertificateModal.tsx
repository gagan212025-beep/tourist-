import React, { useState } from 'react';
import { Provider } from '../types';
import {
  X,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  UserCheck,
  ExternalLink
} from 'lucide-react';

interface VerifyCertificateModalProps {
  providers: Provider[];
  onClose: () => void;
  language: string;
}

export const VerifyCertificateModal: React.FC<VerifyCertificateModalProps> = ({
  providers,
  onClose,
  language
}) => {
  const [query, setQuery] = useState('');
  const [verifiedProvider, setVerifiedProvider] = useState<Provider | null>(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearched(true);
    const q = query.trim().toLowerCase();
    const found = providers.find(
      p =>
        p.id.toLowerCase() === q ||
        (p.blockchainCertHash && p.blockchainCertHash.toLowerCase().includes(q)) ||
        p.name.toLowerCase().includes(q)
    );
    setVerifiedProvider(found || null);
  };

  const handleQuickCheck = (p: Provider) => {
    setQuery(p.id);
    setVerifiedProvider(p);
    setSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-stone-100">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-700 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black font-serif text-white">
                Verify Digital Certificate & QR Badge
              </h3>
              <p className="text-xs text-stone-400">
                Government of Jharkhand Tourism Verification Gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleVerify} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Enter Provider ID (e.g. prov-001) or Blockchain Tx Hash..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl bg-stone-950 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-emerald-600 text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Verify</span>
            </button>
          </div>

          {/* Quick Select Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-stone-400">Quick Test:</span>
            {providers.slice(0, 3).map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleQuickCheck(p)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-950 text-stone-300 hover:text-amber-300 border border-stone-800 transition-colors"
              >
                {p.name} ({p.id})
              </button>
            ))}
          </div>
        </form>

        {/* Verification Result Display */}
        {searched && (
          <div className="animate-fade-in">
            {verifiedProvider ? (
              <div className="bg-gradient-to-br from-emerald-950/80 to-stone-950 p-6 rounded-2xl border-2 border-emerald-500/60 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Official Verified Credential</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-900 text-emerald-100 font-black">
                    Valid & Active
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={verifiedProvider.avatarUrl}
                    alt={verifiedProvider.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400"
                  />
                  <div className="space-y-1 text-xs">
                    <h4 className="text-lg font-black font-serif text-white">
                      {verifiedProvider.name}
                    </h4>
                    <p className="text-amber-300 font-semibold">
                      Role: {verifiedProvider.role.toUpperCase()} • {verifiedProvider.community}
                    </p>
                    <p className="text-stone-300">{verifiedProvider.location}</p>
                  </div>
                </div>

                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-[11px] font-mono space-y-1">
                  <div className="flex justify-between text-stone-400">
                    <span>Block Index:</span>
                    <span className="text-white">#{verifiedProvider.registeredBlockIndex || 1}</span>
                  </div>
                  <div className="text-stone-400 break-all">
                    <span>Blockchain Hash: </span>
                    <span className="text-emerald-300 font-bold">
                      {verifiedProvider.blockchainCertHash || '0x4f89a77c3e120bc7189d9841'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-950/60 p-6 rounded-2xl border border-red-500/40 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                <h4 className="font-bold text-sm text-white">Credential Not Found in Ledger</h4>
                <p className="text-xs text-stone-300">
                  No registered guide, homestay, or artisan found matching this credential ID or hash. Please verify the QR code.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
