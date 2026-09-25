import React from 'react';
import { ArrowUpRight, MessageSquareCode } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

/**
 * Hero Typography & Action Controls
 * Displays:
 * - "Hi, I'm"
 * - "Antriksh"
 * - "Client Partner | Technology & Digital Transformation"
 * - Concise enterprise bio
 * - "Download CV" & "Let's Talk" action buttons
 */
export default function HeroContent({ onOpenResume, onOpenContact }) {
  return (
    <div className="fixed bottom-6 left-6 md:bottom-12 md:left-12 lg:left-16 z-30 flex flex-col items-start pointer-events-auto">
      {/* Intro Subtitle */}
      <span className="text-xs md:text-sm uppercase tracking-[0.28em] font-medium text-white/80 pl-1 mb-1">
        {portfolioData.greeting}
      </span>

      {/* Name in elegant cursive script with soft drop shadow */}
      <h1 className="font-cursive-name text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white select-none -mt-1 md:-mt-2 mb-1">
        {portfolioData.name}
      </h1>

      {/* Professional Title */}
      <div className="text-xs md:text-sm font-semibold tracking-wider uppercase text-white/90 pl-1 mb-3">
        {portfolioData.professionalTitle}
      </div>

      {/* Concise 3-line Bio (max-width ~340px) */}
      <p className="text-white/85 text-sm md:text-[14.5px] leading-relaxed font-normal max-w-[320px] sm:max-w-[340px] pl-1 mb-6 text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        {portfolioData.heroBio}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pl-1">
        {/* Primary CTA: Download CV */}
        <button
          onClick={onOpenResume}
          className="glass-btn-primary group flex items-center gap-2 px-6 py-3 rounded-full text-xs md:text-sm font-semibold tracking-wide text-neutral-900 focus:outline-none focus:ring-2 focus:ring-white/80"
          aria-label="View or download CV"
        >
          <span>{portfolioData.resume.ctaLabel || 'Download CV'}</span>
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>

        {/* Secondary CTA: Let's Talk */}
        <button
          onClick={onOpenContact}
          className="glass-btn-secondary group flex items-center gap-2 px-6 py-3 rounded-full text-xs md:text-sm font-semibold tracking-wide text-white focus:outline-none focus:ring-2 focus:ring-white/80"
          aria-label="Contact Antriksh Negi"
        >
          <span>Let's Talk</span>
          <MessageSquareCode className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
}
