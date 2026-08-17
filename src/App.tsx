import React, { useState, useEffect } from 'react';
import {
  Destination,
  Provider,
  MarketplaceProduct,
  CulturalEvent,
  BookingRecord,
  UserRole
} from './types';
import {
  INITIAL_DESTINATIONS,
  INITIAL_PROVIDERS,
  INITIAL_PRODUCTS,
  INITIAL_EVENTS,
  INITIAL_BOOKINGS
} from './data/seedData';

// Components
import { Navbar } from './components/Navbar';
import { Hero3DScene } from './components/Hero3DScene';
import { DestinationCard } from './components/DestinationCard';
import { DestinationModal } from './components/DestinationModal';
import { InteractiveMap } from './components/InteractiveMap';
import { VRPanoramaViewer } from './components/VRPanoramaViewer';
import { Artifact3DShowcase } from './components/Artifact3DShowcase';
import { ItineraryPlanner } from './components/ItineraryPlanner';
import { Marketplace } from './components/Marketplace';
import { ProviderPortal } from './components/ProviderPortal';
import { OfficialDashboard } from './components/OfficialDashboard';
import { BlockchainExplorer } from './components/BlockchainExplorer';
import { VerifyCertificateModal } from './components/VerifyCertificateModal';
import { BookingModal } from './components/BookingModal';
import { JoharAIChatbot } from './components/JoharAIChatbot';
import { EventsCalendar } from './components/EventsCalendar';
import { CartModal, CartItem } from './components/CartModal';
import { FloatingLeaderboard } from './components/FloatingLeaderboard';

import {
  Compass,
  MapPin,
  Sparkles,
  Layers,
  ShoppingBag,
  ShieldCheck,
  Calendar,
  Search,
  Filter,
  Phone,
  Mail,
  Heart,
  Globe,
  Trees,
  Mountain,
  Waves,
  Sun,
  Shield,
  ArrowRight,
  Bot
} from 'lucide-react';

export default function App() {
  // Navigation & User State
  const [currentTab, setCurrentTab] = useState<string>('explore');
  const [userRole, setUserRole] = useState<UserRole>('tourist');
  const [language, setLanguage] = useState<string>('en');

  // Core Data with instant fallback seed
  const [destinations, setDestinations] = useState<Destination[]>(INITIAL_DESTINATIONS);
  const [providers, setProviders] = useState<Provider[]>(INITIAL_PROVIDERS);
  const [products, setProducts] = useState<MarketplaceProduct[]>(INITIAL_PRODUCTS);
  const [events, setEvents] = useState<CulturalEvent[]>(INITIAL_EVENTS);
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals & Viewers State
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selected3DArtifact, setSelected3DArtifact] = useState<MarketplaceProduct | null>(null);
  const [vrSiteId, setVrSiteId] = useState<string | null>(null);
  const [verifyModalOpen, setVerifyModalOpen] = useState<boolean>(false);
  const [cartModalOpen, setCartModalOpen] = useState<boolean>(false);
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Booking Modal State
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    serviceType: string;
    targetTitle: string;
    providerId?: string;
    defaultAmount?: number;
  }>({
    isOpen: false,
    serviceType: 'guide_tour',
    targetTitle: 'Tour Package'
  });

  // Helper for safe JSON fetching
  const safeFetchJson = async <T,>(url: string, fallback: T): Promise<T> => {
    try {
      const res = await fetch(url);
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        return await res.json();
      }
      return fallback;
    } catch {
      return fallback;
    }
  };

  // Fetch live synchronized data from Express API
  useEffect(() => {
    async function loadData() {
      try {
        const [destRes, provRes, prodRes, evRes, bookRes] = await Promise.all([
          safeFetchJson<Destination[]>('/api/destinations', INITIAL_DESTINATIONS),
          safeFetchJson<Provider[]>('/api/providers', INITIAL_PROVIDERS),
          safeFetchJson<MarketplaceProduct[]>('/api/marketplace', INITIAL_PRODUCTS),
          safeFetchJson<CulturalEvent[]>('/api/events', INITIAL_EVENTS),
          safeFetchJson<BookingRecord[]>('/api/bookings', INITIAL_BOOKINGS)
        ]);

        if (Array.isArray(destRes) && destRes.length > 0) setDestinations(destRes);
        if (Array.isArray(provRes) && provRes.length > 0) setProviders(provRes);
        if (Array.isArray(prodRes) && prodRes.length > 0) setProducts(prodRes);
        if (Array.isArray(evRes) && evRes.length > 0) setEvents(evRes);
        if (Array.isArray(bookRes) && bookRes.length > 0) setBookings(bookRes);
      } catch (err) {
        console.warn('API sync warning, using local state:', err);
      }
    }
    loadData();
  }, []);

  // Cart Handlers
  const handleAddToCart = (product: MarketplaceProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartModalOpen(true);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCartCheckout = () => {
    setCartModalOpen(false);
    const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const itemNames = cart.map(i => `${i.product.name} (x${i.quantity})`).join(', ');
    setBookingModal({
      isOpen: true,
      serviceType: 'marketplace_order',
      targetTitle: `Tribal Crafts: ${itemNames}`,
      providerId: cart[0]?.product.artisanName || 'prov-003',
      defaultAmount: totalAmount
    });
  };

  const handleBookService = (
    serviceType: string,
    targetTitle: string,
    providerId?: string,
    amount?: number
  ) => {
    setBookingModal({
      isOpen: true,
      serviceType,
      targetTitle,
      providerId: providerId || 'prov-001',
      defaultAmount: amount || 1500
    });
  };

  const handleRegisterProvider = (newProv: Partial<Provider>) => {
    setProviders(prev => [newProv as Provider, ...prev]);
  };

  const handleBookingComplete = (newBooking: BookingRecord) => {
    setBookings(prev => [newBooking, ...prev]);
    if (bookingModal.serviceType === 'marketplace_order') {
      setCart([]);
    }
  };

  // Filtered Destinations for Explorer
  const filteredDestinations = destinations.filter(d => {
    const matchesCat = categoryFilter === 'all' || d.category === categoryFilter;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const categories = [
    { id: 'all', label: language === 'hi' ? 'सभी गंतव्य' : 'All Gems', icon: Compass },
    { id: 'eco', label: language === 'hi' ? 'वन एवं वन्यजीव' : 'Eco Forests', icon: Trees },
    { id: 'waterfalls', label: language === 'hi' ? 'जलप्रपात' : 'Waterfalls (320ft+)', icon: Waves },
    { id: 'adventure', label: language === 'hi' ? 'घाटियां एवं झीलें' : 'Valley Ghats & Dams', icon: Mountain },
    { id: 'cultural', label: language === 'hi' ? 'जनजातीय संस्कृति' : 'Tribal Heritage', icon: Sun },
    { id: 'spiritual', label: language === 'hi' ? 'पवित्र तीर्थ' : 'Sacred Shrines', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-700 selection:text-white">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        openCart={() => setCartModalOpen(true)}
        openChat={() => setChatbotOpen(true)}
        openVerifyModal={() => setVerifyModalOpen(true)}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1">
        {/* ROLE VIEW: PROVIDER PORTAL */}
        {currentTab === 'provider_portal' || userRole === 'provider' ? (
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <ProviderPortal
              providers={providers}
              bookings={bookings}
              onRegisterProvider={handleRegisterProvider}
              language={language}
            />
          </div>
        ) : currentTab === 'official_dashboard' || userRole === 'official' ? (
          /* ROLE VIEW: OFFICIAL / ADMIN DASHBOARD */
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <OfficialDashboard language={language} />
          </div>
        ) : (
          /* TOURIST MAIN EXPERIENCES */
          <div>
            {/* 1. HERO 3D SCENE (Shown on Explore view) */}
            {currentTab === 'explore' && (
              <Hero3DScene
                onSelectDestination={destId => {
                  const dest = destinations.find(d => d.id === destId);
                  if (dest) setSelectedDestination(dest);
                }}
                onExploreClick={() => {
                  const el = document.getElementById('destinations-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                onPlanTripClick={() => setCurrentTab('itinerary')}
                language={language}
              />
            )}

            {/* TAB: 3D MAP & GEO-DISCOVERY */}
            {currentTab === 'map' && (
              <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="space-y-1">
                  <span className="text-[11px] px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold uppercase tracking-wider border border-emerald-500/40">
                    Geospatial Intelligence
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-serif text-white">
                    {language === 'hi'
                      ? '3D चोतानागपुर भू-अन्वेषण मानचित्र'
                      : 'Interactive Chotanagpur Plateau & Distance Router'}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400">
                    Calculate real-time road distances, airport hops, and railway junctions from your current GPS location.
                  </p>
                </div>

                <InteractiveMap
                  destinations={destinations}
                  onSelectDestination={d => setSelectedDestination(d)}
                  onOpenVR={siteId => setVrSiteId(siteId)}
                  language={language}
                />
              </div>
            )}

            {/* TAB: 360° VR PANORAMIC PREVIEWS */}
            {currentTab === 'vr' && (
              <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="space-y-1">
                  <span className="text-[11px] px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 font-bold uppercase tracking-wider border border-amber-500/40">
                    Immersive VR Tech
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black font-serif text-white">
                    {language === 'hi' ? '360° गोलाकार वीआर पूर्वावलोकन' : '360° Spherical Panoramic Viewers'}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-400">
                    Experience Netarhat sunset lookouts, Hundru plunge pools, and Betla jungle trails in full 360° WebGL perspective with ambient procedural nature audio.
                  </p>
                </div>

                <VRPanoramaViewer
                  initialSite={vrSiteId || 'netarhat_sunset'}
                  language={language}
                />
              </div>
            )}

            {/* TAB: AI ITINERARY PLANNER */}
            {currentTab === 'itinerary' && (
              <div className="py-8 px-4 sm:px-6 lg:px-8">
                <ItineraryPlanner
                  language={language}
                  onBookService={handleBookService}
                />
              </div>
            )}

            {/* TAB: ARTISAN MARKETPLACE */}
            {currentTab === 'marketplace' && (
              <div className="py-8 px-4 sm:px-6 lg:px-8">
                <Marketplace
                  products={products}
                  onAddToCart={handleAddToCart}
                  onOpen3DShowcase={p => setSelected3DArtifact(p)}
                  onInstantBuy={p => {
                    handleAddToCart(p);
                    handleCartCheckout();
                  }}
                  language={language}
                />
              </div>
            )}

            {/* TAB: CULTURAL EVENTS & FESTIVALS */}
            {currentTab === 'events' && (
              <div className="py-8 px-4 sm:px-6 lg:px-8">
                <EventsCalendar
                  events={events}
                  onBookService={handleBookService}
                  language={language}
                />
              </div>
            )}

            {/* TAB: BLOCKCHAIN LEDGER EXPLORER */}
            {currentTab === 'blockchain' && (
              <div className="py-8 px-4 sm:px-6 lg:px-8">
                <BlockchainExplorer language={language} />
              </div>
            )}

            {/* TAB: EXPLORE DESTINATIONS (Default Homepage View) */}
            {currentTab === 'explore' && (
              <div id="destinations-grid" className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Search & Category Filter Header */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-stone-900/90 p-4 rounded-3xl border border-stone-800 backdrop-blur-md shadow-lg">
                  {/* Category Buttons Carousel */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                    {categories.map(c => {
                      const Icon = c.icon;
                      const isSelected = categoryFilter === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setCategoryFilter(c.id)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            isSelected
                              ? 'bg-emerald-700 text-white shadow-md font-bold border border-emerald-500'
                              : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{c.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Bar Input */}
                  <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={
                        language === 'hi'
                          ? 'गंतव्य, जिला या आकर्षण खोजें...'
                          : 'Search destinations, districts...'
                      }
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-950 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Section Title */}
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      Curated Experiences
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
                      {language === 'hi' ? 'झारखंड के प्रमुख पर्यटन स्थल' : 'Featured Eco & Heritage Gems'}
                    </h2>
                  </div>
                  <span className="text-xs text-stone-400 hidden sm:inline">
                    Showing {filteredDestinations.length} Verified Sites
                  </span>
                </div>

                {/* Destinations Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDestinations.map(dest => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      onSelect={d => setSelectedDestination(d)}
                      onOpenVR={siteId => {
                        setVrSiteId(siteId);
                        setCurrentTab('vr');
                      }}
                      language={language}
                    />
                  ))}
                </div>

                {/* Banner Callout for AI Trip Planning */}
                <div className="mt-12 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-amber-950 border border-emerald-500/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                  <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gemini-Powered Engine</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black font-serif text-white">
                      Need a customized tour plan tailored to your budget?
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Let our Johar AI build a complete timetable with certified local naturalist guides, authentic Santhal/Munda homestays, and sunrise viewpoints.
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentTab('itinerary')}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-xl hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
                  >
                    <span>Launch AI Trip Planner</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Eco-Explorers Leaderboard (Explorer View) */}
      {currentTab === 'explore' && (
        <FloatingLeaderboard
          language={language}
          onNavigateToTab={tab => setCurrentTab(tab)}
          onOpenVerifyModal={() => setVerifyModalOpen(true)}
          onOpenVR={siteId => {
            setVrSiteId(siteId);
            setCurrentTab('vr');
          }}
        />
      )}

      {/* Floating Johar AI Chat Trigger Button */}
      {!chatbotOpen && (
        <button
          onClick={() => setChatbotOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 text-white font-bold text-xs shadow-2xl shadow-emerald-950 hover:scale-105 active:scale-95 transition-all border border-emerald-400/40"
        >
          <Bot className="w-5 h-5 text-amber-200 animate-bounce" />
          <span className="font-serif tracking-wide">Ask Johar AI</span>
        </button>
      )}

      {/* Johar AI Multilingual Chatbot Modal */}
      <JoharAIChatbot
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        language={language}
      />

      {/* Destination Detail Modal */}
      {selectedDestination && (
        <DestinationModal
          destination={selectedDestination}
          providers={providers}
          onClose={() => setSelectedDestination(null)}
          onOpenVR={siteId => {
            setSelectedDestination(null);
            setVrSiteId(siteId);
            setCurrentTab('vr');
          }}
          onBookService={handleBookService}
          language={language}
        />
      )}

      {/* 3D Artifact Showcase Modal */}
      {selected3DArtifact && (
        <Artifact3DShowcase
          product={selected3DArtifact}
          onAddToCart={handleAddToCart}
          onClose={() => setSelected3DArtifact(null)}
          language={language}
        />
      )}

      {/* QR Certificate Verification Modal */}
      {verifyModalOpen && (
        <VerifyCertificateModal
          providers={providers}
          onClose={() => setVerifyModalOpen(false)}
          language={language}
        />
      )}

      {/* Cart Modal */}
      {cartModalOpen && (
        <CartModal
          cart={cart}
          onUpdateQuantity={handleUpdateCartQty}
          onRemoveItem={handleRemoveCartItem}
          onCheckout={handleCartCheckout}
          onClose={() => setCartModalOpen(false)}
          language={language}
        />
      )}

      {/* Booking & Blockchain Escrow Checkout Modal */}
      {bookingModal.isOpen && (
        <BookingModal
          serviceType={bookingModal.serviceType}
          targetTitle={bookingModal.targetTitle}
          providerId={bookingModal.providerId}
          defaultAmount={bookingModal.defaultAmount}
          onClose={() => setBookingModal({ ...bookingModal, isOpen: false })}
          onBookingComplete={handleBookingComplete}
          language={language}
        />
      )}

      {/* Footer */}
      <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 text-xs py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center font-serif text-white font-bold text-sm">
                जो
              </div>
              <span className="font-bold text-stone-100 font-serif text-base">Johar Jharkhand</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Official Smart Digital Tourism & Eco-Heritage Platform, Government of Jharkhand. Dedicated to indigenous community empowerment and sustainable biodiversity conservation.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-100 uppercase text-[11px] tracking-wider mb-3">
              Emergency & Helplines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-emerald-300">
                <Phone className="w-3.5 h-3.5" />
                <span>Tourist Helpline: 1363 / 1800-11-1363</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" />
                <span>JTDC Headquarters: 0651-2400493</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                <span>tourism-jharkhand@gov.in</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-100 uppercase text-[11px] tracking-wider mb-3">
              Platform Features
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li className="hover:text-white cursor-pointer" onClick={() => setCurrentTab('map')}>
                3D Terrain & Geolocation Router
              </li>
              <li className="hover:text-white cursor-pointer" onClick={() => setCurrentTab('itinerary')}>
                Gemini AI Day-by-Day Itinerary Builder
              </li>
              <li className="hover:text-white cursor-pointer" onClick={() => setCurrentTab('vr')}>
                360° Spherical VR Previews
              </li>
              <li className="hover:text-white cursor-pointer" onClick={() => setCurrentTab('marketplace')}>
                Direct Dokra & Tussar Artisan Marketplace
              </li>
              <li className="hover:text-white cursor-pointer" onClick={() => setCurrentTab('blockchain')}>
                SHA-256 Blockchain Ledger
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-100 uppercase text-[11px] tracking-wider mb-3">
              Eco-Tourism Code
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              "Leave only footprints, take only memories, preserve sacred Sarna groves, support local tribal livelihoods."
            </p>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Community Escrow</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Department of Tourism, Art, Culture, Sports & Youth Affairs, Government of Jharkhand.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-400 cursor-pointer">Privacy & Data Security</span>
            <span className="hover:text-stone-400 cursor-pointer">Responsible Travel Charter</span>
            <span className="hover:text-stone-400 cursor-pointer">Blockchain Ledger Explorer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
