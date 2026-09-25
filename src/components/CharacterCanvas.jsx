import React, { useEffect, useRef, useState } from 'react';

/**
 * CharacterCanvas
 * High-performance, zero-ghosting, 60+ FPS canvas renderer.
 * Strictly avoids CSS 3D transforms.
 * Preloads 64 WebP directional frames and center.webp for eye contact deadzone.
 */
export default function CharacterCanvas({ pointerPos, onFaceCenterUpdate, onLoaded }) {
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const centerImageRef = useRef(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Animation & Lerp references
  const smoothedAngleRef = useRef(0);
  const isInDeadzoneRef = useRef(true);
  const lastActiveImageRef = useRef(null);

  // Preload all 64 directional frames + center.webp
  useEffect(() => {
    let loadedCount = 0;
    const totalCount = 65; // 64 frames + 1 center
    const images = new Array(64);

    const onImageLoaded = () => {
      loadedCount++;
      const pct = Math.round((loadedCount / totalCount) * 100);
      setLoadProgress(pct);
      if (loadedCount === totalCount) {
        framesRef.current = images;
        setIsReady(true);
        if (onLoaded) onLoaded();
      }
    };

    // Load 64 frames
    for (let i = 0; i < 64; i++) {
      const img = new Image();
      // Try root frames/ or public/frames/
      img.src = `frames/frame_${i}.webp`;
      img.onload = onImageLoaded;
      img.onerror = () => {
        // Fallback to /frames/
        img.src = `/frames/frame_${i}.webp`;
        img.onload = onImageLoaded;
      };
      images[i] = img;
    }

    // Load center frame
    const centerImg = new Image();
    centerImg.src = 'frames/center.webp';
    centerImg.onload = () => {
      centerImageRef.current = centerImg;
      lastActiveImageRef.current = centerImg;
      onImageLoaded();
    };
    centerImg.onerror = () => {
      centerImg.src = '/frames/center.webp';
      centerImg.onload = () => {
        centerImageRef.current = centerImg;
        lastActiveImageRef.current = centerImg;
        onImageLoaded();
      };
    };

    return () => {
      // Cleanup image handlers
      for (let i = 0; i < 64; i++) {
        if (images[i]) images[i].onload = null;
      }
      if (centerImg) centerImg.onload = null;
    };
  }, [onLoaded]);

  // Main 60 FPS Render Loop
  useEffect(() => {
    if (!isReady) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId;

    // Shortest-path circular angular lerp
    function lerpAngle(current, target, factor) {
      let diff = (target - current) % (2 * Math.PI);
      if (diff < -Math.PI) diff += 2 * Math.PI;
      if (diff > Math.PI) diff -= 2 * Math.PI;
      return current + diff * factor;
    }

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Ensure canvas pixel dimensions match display resolution
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Seamless background fill matching video background #c41b17
      ctx.fillStyle = '#c41b17';
      ctx.fillRect(0, 0, width, height);

      // 2. Compute object-fit: cover for 1920x1080 source image
      const sourceW = 1920;
      const sourceH = 1080;
      const canvasAspect = width / height;
      const imageAspect = sourceW / sourceH;

      let renderW, renderH, offsetX, offsetY;

      if (canvasAspect > imageAspect) {
        // Viewport is wider than 16:9
        renderW = width;
        renderH = width / imageAspect;
        offsetX = 0;
        offsetY = (height - renderH) / 2;
      } else {
        // Viewport is taller or equal to 16:9
        renderH = height;
        renderW = height * imageAspect;
        offsetX = (width - renderW) / 2;
        offsetY = 0;
      }

      // 3. Exact character face coordinates in screen space
      // Face center is horizontally centered (50%) and at ~38% height
      const faceScreenX = offsetX + renderW * 0.50;
      const faceScreenY = offsetY + renderH * 0.38;

      if (onFaceCenterUpdate) {
        onFaceCenterUpdate({ x: faceScreenX, y: faceScreenY });
      }

      // 4. Cursor position relative to face
      const px = pointerPos.current.x;
      const py = pointerPos.current.y;
      const dx = px - faceScreenX;
      const dy = py - faceScreenY;
      const dist = Math.hypot(dx, dy);

      // Center Eye Contact Deadzone: within ~12% of screen dimension
      const screenRadius = Math.min(width, height);
      const deadzoneRadius = screenRadius * 0.12;

      let chosenImage;

      // Hysteresis deadzone to avoid boundary flickering
      const threshold = isInDeadzoneRef.current ? deadzoneRadius * 1.15 : deadzoneRadius;

      if (dist < threshold || !pointerPos.current.active) {
        isInDeadzoneRef.current = true;
        chosenImage = centerImageRef.current;
      } else {
        isInDeadzoneRef.current = false;
        
        // Calculate angle relative to face center: atan2(dy, dx)
        let targetAngle = Math.atan2(dy, dx);
        if (targetAngle < 0) targetAngle += 2 * Math.PI;

        // Circular angular lerp with ~0.26 factor (~35ms zero-lag response)
        smoothedAngleRef.current = lerpAngle(smoothedAngleRef.current, targetAngle, 0.26);

        // Normalize smoothed angle to [0, 2*PI)
        let normAngle = smoothedAngleRef.current % (2 * Math.PI);
        if (normAngle < 0) normAngle += 2 * Math.PI;

        // Map to nearest frame index 0..63
        const frameIndex = Math.round((normAngle / (2 * Math.PI)) * 64) % 64;
        chosenImage = framesRef.current[frameIndex] || centerImageRef.current;
      }

      // Fallback if image not ready
      if (!chosenImage) {
        chosenImage = centerImageRef.current || framesRef.current[0];
      }

      // 5. Draw EXACTLY ONE crisp frame at 100% opacity (NO ghosting, NO alpha blending)
      if (chosenImage && chosenImage.complete && chosenImage.naturalWidth !== 0) {
        ctx.globalAlpha = 1.0;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(chosenImage, offsetX, offsetY, renderW, renderH);
        lastActiveImageRef.current = chosenImage;
      } else if (lastActiveImageRef.current) {
        ctx.drawImage(lastActiveImageRef.current, offsetX, offsetY, renderW, renderH);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isReady, onFaceCenterUpdate]);

  return (
    <div className="canvas-wrapper">
      {/* Loading Overlay */}
      {!isReady && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#c41b17] text-white">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-t-white border-transparent animate-spin" />
          </div>
          <p className="text-sm font-light tracking-[0.2em] uppercase text-white/90">
            Initializing Studio Experience
          </p>
          <span className="text-xs font-mono text-white/60 mt-2">{loadProgress}%</span>
        </div>
      )}

      {/* Rock-solid motionless canvas - strictly zero 3D transform */}
      <canvas
        ref={canvasRef}
        className="hero-canvas"
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#c41b17',
          display: 'block',
        }}
      />
    </div>
  );
}
