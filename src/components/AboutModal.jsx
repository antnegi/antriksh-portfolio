import React from 'react';
import { X, User } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { about } = portfolioData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#961411]/90 border border-white/25 rounded-3xl p-6 md:p-8 text-white shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              About {portfolioData.fullName || portfolioData.name}
            </h3>
            <p className="text-xs text-white/70">
              {about.subtitle || portfolioData.professionalTitle}
            </p>
          </div>
        </div>

        <div className="space-y-3.5 my-5 text-xs md:text-sm text-white/85 leading-relaxed">
          {about.bioParagraphs && about.bioParagraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}

          {about.highlights && about.highlights.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5 pt-3">
              {about.highlights.map((item, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/60 block mb-0.5">
                    {item.label}
                  </span>
                  <span className="font-semibold text-xs text-white leading-tight block">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-white/15">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
