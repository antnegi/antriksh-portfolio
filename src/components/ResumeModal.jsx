import React from 'react';
import { X, Download, FileText, CheckCircle2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function ResumeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { resume } = portfolioData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#961411]/90 border border-white/25 rounded-3xl p-6 md:p-8 text-white shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">{resume.title || 'Curriculum Vitae'}</h3>
            <p className="text-xs text-white/70">{resume.subtitle || portfolioData.professionalTitle}</p>
          </div>
        </div>

        <div className="space-y-4 my-6 text-sm text-white/85">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-semibold text-white mb-1.5 text-xs uppercase tracking-wider text-white/90">
              Core Competencies
            </h4>
            <p className="text-xs text-white/75 leading-relaxed">
              {resume.skillsSummary}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{resume.statusNote}</span>
            </div>
            {resume.philosophyNote && (
              <p className="text-xs text-white/70 leading-relaxed">
                {resume.philosophyNote}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/15">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            Close
          </button>
          <a
            href={resume.filename ? `./${resume.filename}` : '#download'}
            download={resume.downloadFilename || 'Antriksh-Negi-CV.pdf'}
            className="glass-btn-primary flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-neutral-900"
          >
            <Download className="w-4 h-4" />
            <span>Download CV</span>
          </a>
        </div>
      </div>
    </div>
  );
}
