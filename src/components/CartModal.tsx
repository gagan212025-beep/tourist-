import React from 'react';
import { MarketplaceProduct } from '../types';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
}

interface CartModalProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onClose: () => void;
  language: string;
}

export const CartModal: React.FC<CartModalProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onClose,
  language
}) => {
  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-stone-100">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-700 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black font-serif text-white">Your Artisan Cart</h3>
              <p className="text-xs text-stone-400">
                {cart.length} unique handcrafted items
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

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {cart.length > 0 ? (
            cart.map(item => (
              <div
                key={item.product.id}
                className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800 flex items-center justify-between gap-3"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-xl object-cover border border-stone-700"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                  <p className="text-[10px] text-amber-400">{item.product.artisanName}</p>
                  <p className="text-xs font-black text-white mt-0.5">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-stone-900 border border-stone-700 rounded-lg">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="p-1 text-stone-400 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="p-1 text-stone-400 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1.5 text-stone-500 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-stone-400 text-xs">
              Your cart is empty. Explore our authentic Dokra, Sohrai, and Tussar crafts!
            </div>
          )}
        </div>

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-stone-800 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span>Artisan Direct Subtotal</span>
                <span className="text-white font-bold">₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-400">
                <span>Government Fair-Trade Commission</span>
                <span>0% (Zero platform fee)</span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-white pt-2 border-t border-stone-800">
                <span>Total Amount:</span>
                <span className="text-xl text-amber-400">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>Includes Digital Certificate of Authenticity logged to Blockchain</span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Proceed to Blockchain Escrow Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
