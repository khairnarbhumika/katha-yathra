import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { StoreItem } from '@shared/schema';
import { StoreGrid } from '../components/StoreGrid';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Coins, Sparkles, Rocket, Atom, Cpu, Layers } from 'lucide-react';

export const ScienceStore: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<StoreItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await api.getStoreItems();
        setItems(res.items);
      } catch (err) {
        console.error('Failed to load store items:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const handleItemUnlocked = (updatedItem: StoreItem) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? { ...updatedItem, isUnlocked: true } : item));
  };

  const categories = ['All', 'Space', 'Quantum & Physics', 'Robotics', 'Applied Science'];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(i => i.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/20 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-xs uppercase tracking-wider mb-3">
              <Rocket className="w-3.5 h-3.5" />
              <span>STEM & Space Video Marketplace</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
              Redeem XP for Frontier Science!
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Bridge the wisdom of ancient civilizations with modern space exploration and physics! Spend your earned Katha XP to unlock premium, high-definition educational science modules.
            </p>
          </div>

          {/* User Points Badge Card */}
          <div className="w-full md:w-auto p-5 rounded-2xl bg-slate-950/80 border border-amber-500/40 shadow-xl flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">
              <Coins className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Balance</span>
              <div className="text-2xl font-bold font-serif text-amber-300">
                {user?.points.toLocaleString()} <span className="text-sm font-normal">XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              selectedCategory === category
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <StoreGrid items={filteredItems} onItemUnlocked={handleItemUnlocked} />
    </div>
  );
};
