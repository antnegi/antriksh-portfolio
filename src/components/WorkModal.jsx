import React from 'react';
import { X, Briefcase, MessageSquare, ExternalLink } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function WorkModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const projects = portfolioData.projects || [];
  const workConfig = portfolioData.work || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#961411]/90 border border-white/25 rounded-3xl p-6 md:p-8 text-white shadow-2xl backdrop-blur-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              {workConfig.title || 'Client Engagements'}
            </h3>
            <p className="text-xs text-white/70">
              {workConfig.subtitle || 'Selected client engagements and transformation initiatives can be discussed directly.'}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {projects.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
              <p className="text-sm text-white/90 leading-relaxed font-medium">
                Selected client engagements and transformation initiatives can be discussed directly.
              </p>
              <p className="text-xs text-white/65 leading-relaxed max-w-md mx-auto">
                Enterprise case studies, solution frameworks, and client partnership references are available upon direct discussion. Please connect via the contact form or LinkedIn.
              </p>
            </div>
          ) : (
            projects.map((proj, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300">
                      {proj.category}
                    </span>
                    <h4 className="text-base font-bold text-white group-hover:text-white/90">
                      {proj.title}
                    </h4>
                  </div>
                  {proj.link && proj.link !== '#' && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 group-hover:bg-white/15 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-white/60 group-hover:text-white" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-white/75 leading-relaxed mb-3">
                  {proj.desc}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-white/15">
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
