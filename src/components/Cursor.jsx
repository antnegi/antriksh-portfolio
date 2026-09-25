import React, { useEffect, useRef, useState } from 'react';

/**
 * Custom Magnetic Cursor
 * Glowing white custom cursor dot with a smooth trailing aura ring.
 * Scales up and magnetically attracts towards interactive buttons and elements.
 */
export default function Cursor({ pointerPos }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const ringPosRef = useRef({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor if fine pointer (mouse) is used
    const hasMouse = window.matchMedia('(pointer: fine)').matches;
    if (!hasMouse) return;

    let animId;

    const handlePointerOver = (e) => {
      const target = e.target;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.interactive') ||
        target.closest('[role="button"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mouseover', handlePointerOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const updateRing = () => {
      if (pointerPos.current.active) {
        setIsVisible(true);
      }

      // Smooth trailing aura lerp
      const targetX = pointerPos.current.x;
      const targetY = pointerPos.current.y;

      ringPosRef.current.x += (targetX - ringPosRef.current.x) * 0.22;
      ringPosRef.current.y += (targetY - ringPosRef.current.y) * 0.22;

      // Update dot position immediately (0 lag)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      }

      // Update aura ring position
      if (ringRef.current) {
        const scale = isHovering ? 'scale(1.85)' : 'scale(1)';
        ringRef.current.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0) translate(-50%, -50%) ${scale}`;
      }

      animId = requestAnimationFrame(updateRing);
    };

    animId = requestAnimationFrame(updateRing);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mouseover', handlePointerOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [pointerPos, isHovering]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Trailing Aura Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border border-white/60 pointer-events-none transition-[width,height,background-color,border-color] duration-200 ease-out ${
          isHovering
            ? 'w-14 h-14 bg-white/20 border-white shadow-[0_0_24px_rgba(255,255,255,0.4)] backdrop-blur-[2px]'
            : 'w-9 h-9 bg-white/5 border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.2)]'
        }`}
        style={{
          willChange: 'transform',
        }}
      />

      {/* Instant Glowing White Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-white pointer-events-none shadow-[0_0_10px_#ffffff,0_0_20px_rgba(255,255,255,0.8)] transition-transform duration-75 ease-out ${
          isHovering ? 'opacity-80 scale-125' : 'opacity-100 scale-100'
        }`}
        style={{
          willChange: 'transform',
        }}
      />
    </div>
  );
}
