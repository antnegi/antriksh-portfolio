import React, { useRef, useState, useEffect, useCallback } from 'react';
import CharacterCanvas from './components/CharacterCanvas';
import Cursor from './components/Cursor';
import Navigation from './components/Navigation';
import HeroContent from './components/HeroContent';
import WorkModal from './components/WorkModal';
import AboutModal from './components/AboutModal';
import ContactModal from './components/ContactModal';
import ResumeModal from './components/ResumeModal';
import { portfolioData } from './data/portfolioData';

export default function App() {
  // Use a ref for pointer coordinates to bypass React render passes for true 60+ FPS
  const pointerPos = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.38,
    active: false,
  });

  const faceCenterRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.38,
  });

  const [activeModal, setActiveModal] = useState(null); // 'work' | 'about' | 'contact' | 'resume' | null
  const [isLoaded, setIsLoaded] = useState(false);
  const [logoPatchStyle, setLogoPatchStyle] = useState({ display: 'none' });

  // Sync browser document title with portfolioData
  useEffect(() => {
    if (portfolioData.name && portfolioData.professionalTitle) {
      document.title = `${portfolioData.name} — ${portfolioData.professionalTitle}`;
    }
  }, []);

  // UI Fix 3: Close any active modal immediately upon pressing the Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        setActiveModal(null);
      }
    };

    if (activeModal) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [activeModal]);

  // UI Fix 4: Calculate precise positioning for overlay covering ONLY the embedded Gemini logo
  useEffect(() => {
    const updateLogoPatch = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const canvasAspect = width / height;
      const imageAspect = 1920 / 1080;

      let renderW, renderH, offsetX, offsetY;

      if (canvasAspect > imageAspect) {
        renderW = width;
        renderH = width / imageAspect;
        offsetX = 0;
        offsetY = (height - renderH) / 2;
      } else {
        renderH = height;
        renderW = height * imageAspect;
        offsetX = (width - renderW) / 2;
        offsetY = 0;
      }

      // Exact logo bounds in 1920x1080 source image: X [1666, 1782], Y [826, 944]
      const patchLeft = offsetX + (1666 / 1920) * renderW;
      const patchTop = offsetY + (826 / 1080) * renderH;
      const patchWidth = (118 / 1920) * renderW;
      const patchHeight = (120 / 1080) * renderH;

      setLogoPatchStyle({
        position: 'absolute',
        left: `${patchLeft}px`,
        top: `${patchTop}px`,
        width: `${patchWidth}px`,
        height: `${patchHeight}px`,
        backgroundColor: '#d0211a',
        borderRadius: '6px',
        pointerEvents: 'none',
        zIndex: 2,
      });
    };

    updateLogoPatch();
    window.addEventListener('resize', updateLogoPatch, { passive: true });
    return () => window.removeEventListener('resize', updateLogoPatch);
  }, []);

  // Global Pointer Event Listeners
  useEffect(() => {
    pointerPos.current.x = window.innerWidth / 2;
    pointerPos.current.y = window.innerHeight * 0.38;

    const handlePointerMove = (e) => {
      pointerPos.current.x = e.clientX;
      pointerPos.current.y = e.clientY;
      pointerPos.current.active = true;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        pointerPos.current.x = e.touches[0].clientX;
        pointerPos.current.y = e.touches[0].clientY;
        pointerPos.current.active = true;
      }
    };

    const handleTouchEnd = () => {
      pointerPos.current.active = false;
    };

    const handleMouseLeave = () => {
      pointerPos.current.active = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleFaceCenterUpdate = useCallback((coords) => {
    faceCenterRef.current = coords;
  }, []);

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#c41b17] select-none">
      {/* 1. Ultra-Smooth Zero-Ghosting 60FPS Canvas Renderer (Untouched & Rock-Solid) */}
      <CharacterCanvas
        pointerPos={pointerPos}
        onFaceCenterUpdate={handleFaceCenterUpdate}
        onLoaded={() => setIsLoaded(true)}
      />

      {/* Solid matching red patch overlay to cover only the embedded Gemini watermark */}
      <div style={logoPatchStyle} aria-hidden="true" />

      {/* 2. Top Centered Floating Frosted Glass Header */}
      <Navigation
        onOpenSection={(section) => setActiveModal(section)}
      />

      {/* 3. Bottom-Left Hero Typography & Action Buttons */}
      <HeroContent
        onOpenResume={() => setActiveModal('resume')}
        onOpenContact={() => setActiveModal('contact')}
      />

      {/* 4. Luxury Modals */}
      <WorkModal
        isOpen={activeModal === 'work'}
        onClose={handleCloseModal}
      />
      <AboutModal
        isOpen={activeModal === 'about'}
        onClose={handleCloseModal}
      />
      <ContactModal
        isOpen={activeModal === 'contact'}
        onClose={handleCloseModal}
      />
      <ResumeModal
        isOpen={activeModal === 'resume'}
        onClose={handleCloseModal}
      />

      {/* 5. Custom Magnetic Glowing Cursor */}
      <Cursor pointerPos={pointerPos} />
    </main>
  );
}
