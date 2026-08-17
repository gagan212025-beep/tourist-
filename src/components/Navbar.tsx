import React from 'react';
import { UserRole } from '../types';
import {
  Compass,
  MapPin,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  BarChart3,
  Calendar,
  Layers,
  Menu,
  X,
  Languages,
  UserCheck,
  Bot
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  cartCount: number;
  openCart: () => void;
  openChat: () => void;
  openVerifyModal: () => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
  setUserRole,
  cartCount,
  openCart,
  openChat,
  openVerifyModal,
  language,
  setLanguage
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'explore', label: language === 'hi' ? 'गंतव्य' : 'Destinations', icon: Compass },
    { id: 'map', label: language === 'hi' ? '3D मानचित्र' : '3D Map & Geo', icon: MapPin },
    { id: 'itinerary', label: language === 'hi' ? 'AI यात्रा योजना' : 'AI Trip Planner', icon: Sparkles, badge: 'AI' },
    { id: 'vr', label: language === 'hi' ? '360° VR दर्शन' : '360° VR Previews', icon: Layers },
    { id: 'marketplace', label: language === 'hi' ? 'जनजातीय बाज़ार' : 'Artisan Market', icon: ShoppingBag },
    { id: 'events', label: language === 'hi' ? 'उत्सव एवं हाट' : 'Events & Festivals', icon: Calendar },
    { id: 'blockchain', label: language === 'hi' ? 'ब्लॉकचेन खाता' : 'Blockchain Ledger', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 shadow-lg">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-amber-950 px-4 py-1 text-xs text-emerald-200 text-center flex items-center justify-between border-b border-emerald-800/40">
        <div className="flex items-center gap-2 mx-auto">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>
            {language === 'hi'
              ? 'झारखंड सरकार डिजिटल पर्यटन पहल — प्रामाणिक जनजातीय संस्कृति एवं हरित पर्यावरण'
              : 'Official Smart Tourism Platform for Jharkhand — Eco-Tourism & Cultural Heritage'}
          </span>
        </div>
        <button
          onClick={openVerifyModal}
          className="hidden sm:flex items-center gap-1 text-amber-300 hover:text-amber-200 underline font-medium text-xs ml-4"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'प्रमाणपत्र जांचें' : 'Verify Certificate QR'}</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setCurrentTab('explore')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-600 flex items-center justify-center shadow-md shadow-emerald-950 border border-emerald-400/30 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black text-amber-100 font-serif tracking-tighter">जो</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl text-stone-100 tracking-tight font-serif">
                  Johar Jharkhand
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-200 font-semibold uppercase tracking-wider">
                  Smart Gov
                </span>
              </div>
              <p className="text-[10px] text-stone-400 tracking-wide font-sans">
                {language === 'hi' ? 'प्रकृति एवं जनजातीय धरोहर' : 'Nature, Waterfalls & Tribal Heritage'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-800/80 text-emerald-100 shadow-sm border border-emerald-600/50'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1 py-0.2 text-[9px] font-bold bg-amber-500 text-stone-950 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-stone-800 text-stone-300 hover:text-white border border-stone-700 hover:border-stone-600 transition-colors"
              title="Toggle Language (English / हिन्दी)"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-lg text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 transition-colors"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* AI Assistant Floating Trigger */}
            <button
              onClick={openChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-md shadow-emerald-950 hover:brightness-110 active:scale-95 transition-all"
            >
              <Bot className="w-4 h-4 text-amber-300 animate-bounce" />
              <span className="hidden sm:inline">Johar AI</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="hidden sm:flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                onClick={() => setUserRole('tourist')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  userRole === 'tourist'
                    ? 'bg-stone-800 text-emerald-300 shadow font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Tourist
              </button>
              <button
                onClick={() => {
                  setUserRole('provider');
                  setCurrentTab('provider_portal');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  userRole === 'provider'
                    ? 'bg-amber-900/60 text-amber-200 shadow font-semibold border border-amber-600/40'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <UserCheck className="w-3 h-3 text-amber-400" />
                <span>Provider</span>
              </button>
              <button
                onClick={() => {
                  setUserRole('official');
                  setCurrentTab('official_dashboard');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  userRole === 'official'
                    ? 'bg-teal-900/60 text-teal-200 shadow font-semibold border border-teal-600/40'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <BarChart3 className="w-3 h-3 text-teal-400" />
                <span>Official</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-300 hover:text-white bg-stone-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-stone-800 px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Role selector on mobile */}
          <div className="pt-3 border-t border-stone-800">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-2 font-semibold">
              Select User Portal
            </span>
            <div className="grid grid-cols-3 gap-1.5 bg-stone-900 p-1 rounded-xl">
              <button
                onClick={() => {
                  setUserRole('tourist');
                  setCurrentTab('explore');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-medium text-center ${
                  userRole === 'tourist' ? 'bg-emerald-700 text-white font-bold' : 'text-stone-400'
                }`}
              >
                Tourist
              </button>
              <button
                onClick={() => {
                  setUserRole('provider');
                  setCurrentTab('provider_portal');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-medium text-center ${
                  userRole === 'provider' ? 'bg-amber-700 text-white font-bold' : 'text-stone-400'
                }`}
              >
                Provider
              </button>
              <button
                onClick={() => {
                  setUserRole('official');
                  setCurrentTab('official_dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-lg font-medium text-center ${
                  userRole === 'official' ? 'bg-teal-700 text-white font-bold' : 'text-stone-400'
                }`}
              >
                Official
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
