import React, { useState, useEffect } from 'react';
import { X, Send, Mail, Phone, Linkedin, MessageSquare } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

const WEB3FORMS_ACCESS_KEY = '18c91766-4470-4831-97eb-bcc1e02b9f98';

export default function ContactModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const { contact } = portfolioData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          subject: `Portfolio Inquiry from ${formData.name.trim()}`,
          from_name: formData.name.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setErrorMessage(result.message || 'Unable to submit your message. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Network error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#961411]/90 border border-white/25 rounded-3xl p-6 md:p-8 text-white shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              {contact.modalTitle || 'Connect & Collaborate'}
            </h3>
            <p className="text-xs text-white/70">
              {contact.modalSubtitle || 'Reach out directly for enterprise partnerships or digital transformation discussions.'}
            </p>
          </div>
        </div>

        {/* Verified Direct Contact Chips (All Clickable) */}
        <div className="flex flex-wrap gap-2 my-4">
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/95 text-xs font-mono transition-colors"
              title="Send email"
            >
              <Mail className="w-3.5 h-3.5 text-white/70" />
              <span>{contact.email}</span>
            </a>
          )}
          {contact.phone && (
            <a
              href={`tel:${contact.phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/95 text-xs font-mono transition-colors"
              title="Call phone"
            >
              <Phone className="w-3.5 h-3.5 text-white/70" />
              <span>{contact.phone}</span>
            </a>
          )}
          {contact.linkedinUrl && (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/95 text-xs font-mono transition-colors"
              title="View LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5 text-white/70" />
              <span>LinkedIn</span>
            </a>
          )}
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="inline-flex p-4 rounded-full bg-white/20 text-white mb-2">
              <Send className="w-8 h-8 animate-bounce" />
            </div>
            <h4 className="text-lg font-semibold">Message Dispatched</h4>
            <p className="text-xs text-white/70">Thank you for reaching out. I will get back to you promptly.</p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 my-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/75 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                disabled={isSubmitting}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/80 text-sm disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/75 mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                disabled={isSubmitting}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@enterprise.com"
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/80 text-sm disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/75 mb-1.5">
                Discussion Topic or Business Need
              </label>
              <textarea
                rows={3}
                name="message"
                required
                disabled={isSubmitting}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Brief description of your business needs, technology challenges, or partnership opportunities..."
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/80 text-sm resize-none disabled:opacity-60"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-black/30 border border-white/20 text-xs text-red-200">
                {errorMessage}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="glass-btn-primary flex items-center gap-2 px-7 py-3 rounded-full text-xs font-bold text-neutral-900 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
