import React, { useState } from 'react';
import { portfolioData } from '../data/portfolioData';

/**
 * Floating frosted-glass navigation pill centered at the very top.
 * Powered by portfolioData.js for labels and availability status.
 */
export default function Navigation({ onOpenSection }) {
  const [activeTab, setActiveTab] = useState(null);

  const navItems = [
    { id: 'work', label: portfolioData.navigation.work || 'WORK' },
    { id: 'about', label: portfolioData.navigation.about || 'ABOUT' },
    { id: 'contact', label: portfolioData.navigation.contact || 'CONTACT' },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    if (onOpenSection) {
      onOpenSection(id);
    }
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-auto">
      <nav
        className="glass-pill px-3 py-2 md:px-5 md:py-2.5 rounded-full flex items-center gap-1 md:gap-3 transition-all duration-300"
        aria-label="Main Navigation"
      >
        {/* Availability Status Badge */}
        {portfolioData.availability && (
          <div className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1 border-r border-white/20 text-[11px] font-medium tracking-wider text-white/90">
            {portfolioData.availability.isAvailable && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
            )}
            <span className="uppercase text-[10px] tracking-[0.18em] text-white/80">
              {portfolioData.availability.status}
            </span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1 md:gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`relative px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs font-semibold tracking-[0.2em] transition-all duration-300 ${
                  isActive
                    ? 'text-black bg-white shadow-[0_2px_12px_rgba(255,255,255,0.4)]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                [{item.label}]
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
