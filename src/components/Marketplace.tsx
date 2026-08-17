import React, { useState } from 'react';
import { MarketplaceProduct } from '../types';
import {
  ShoppingBag,
  Sparkles,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Eye,
  Star,
  Info
} from 'lucide-react';

interface MarketplaceProps {
  products: MarketplaceProduct[];
  onAddToCart: (product: MarketplaceProduct) => void;
  onOpen3DShowcase: (product: MarketplaceProduct) => void;
  onInstantBuy: (product: MarketplaceProduct) => void;
  language: string;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  products,
  onAddToCart,
  onOpen3DShowcase,
  onInstantBuy,
  language
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Handicrafts' },
    { id: 'dokra', label: 'Dokra Brass Metalcraft' },
    { id: 'painting', label: 'Sohrai & Kohbar Paintings' },
    { id: 'silk', label: 'Kuchai Organic Tussar Silk' },
    { id: 'bamboo', label: 'Bamboo & Wood Craft' },
    { id: 'honey', label: 'Sal Forest Raw Honey' },
    { id: 'lac', label: 'Lac Bangles & Resin Craft' }
  ];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.materials.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Marketplace Header Hero */}
      <div className="relative rounded-3xl bg-gradient-to-r from-amber-950 via-stone-900 to-emerald-950 border border-amber-500/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/80 border border-amber-400/40 text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Direct-from-Artisan Verified Fair-Trade</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-serif text-white tracking-tight">
            {language === 'hi' ? 'झारखंड जनजातीय हस्तशिल्प बाज़ार' : 'Jharkhand Tribal Artisan Marketplace'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300">
            {language === 'hi'
              ? '4000 वर्ष पुरानी ढोकरा धातु कला, सोहराई भित्ति चित्र और जैविक कुचाई टसर रेशम सीधे आदिवासी शिल्पकारों से खरीदें। प्रत्येक खरीद ब्लॉकचेन प्रमाणिकता के साथ संरक्षित है।'
              : 'Buy authentic 4,000-year-old lost-wax Dokra brass sculptures, Sohrai GI-tagged natural earth paintings, and handspun Kuchai Tussar silks directly from indigenous artisans. Each item is cryptographically stamped on the Jharkhand Tourism Blockchain.'}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-stone-900/90 p-4 rounded-2xl border border-stone-800 backdrop-blur-md">
        {/* Category Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map(c => {
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-md font-bold'
                    : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search craft, artisan, village..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="group bg-stone-900 rounded-3xl border border-stone-800 hover:border-amber-500/40 shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 text-stone-100"
          >
            <div>
              {/* Product Image */}
              <div className="relative h-60 overflow-hidden bg-stone-950">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-950/80 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                    {product.category}
                  </span>
                </div>

                {/* 3D Showcase Trigger on Card */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => onOpen3DShowcase(product)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>3D Model</span>
                  </button>
                </div>

                {/* Price pill */}
                <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between">
                  <span className="text-xl font-black font-serif text-white">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 backdrop-blur-md">
                    {product.inStock ? `${product.stockCount} in stock` : 'Made to order'}
                  </span>
                </div>
              </div>

              {/* Product Content Details */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                    {product.name}
                  </h3>
                  {product.hindiName && (
                    <p className="text-xs text-amber-400 font-medium">{product.hindiName}</p>
                  )}
                </div>

                <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Artisan & Village Provenance */}
                <div className="space-y-1 bg-stone-950/60 p-3 rounded-2xl border border-stone-800 text-xs text-stone-300">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Master Artisan:</span>
                    <span className="font-bold text-white">{product.artisanName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Village / District:</span>
                    <span className="text-emerald-300">{product.village}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Materials:</span>
                    <span className="text-amber-200 line-clamp-1">{product.materials}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-5 pt-0 grid grid-cols-2 gap-2">
              <button
                onClick={() => onAddToCart(product)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-bold text-xs border border-stone-700 transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={() => onInstantBuy(product)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Buy with Escrow</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
