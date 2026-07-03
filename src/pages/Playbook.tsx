import { motion, useMotionValue, animate, useAnimationFrame } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

import { content } from '../content';

const pages = content.playbook.pages;

// Duplicate to have enough items to form a nice cylinder
const cylinderItems = [...pages, ...pages]; 
const theta = 360 / cylinderItems.length;

function CurveSlideshow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotation = useMotionValue(0);
  
  const isDraggingRef = useRef(false);
  const lastInteractionTimeRef = useRef(0);
  const targetRotation = useRef(0);
  
  const dragStartPointerXRef = useRef(0);
  const dragStartRotationRef = useRef(0);

  const [dimensions, setDimensions] = useState({ itemWidth: 320, radius: 500 });

  useEffect(() => {
    const updateDimensions = () => {
      let width = 280;
      if (window.innerWidth >= 1024) width = 600;
      else if (window.innerWidth >= 768) width = 450;
      else if (window.innerWidth >= 640) width = 350;
      
      // Calculate radius of the regular polygon
      const r = Math.round((width / 2) / Math.tan(Math.PI / cylinderItems.length)) + 40; 
      setDimensions({ itemWidth: width, radius: r });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Autoplay
  useAnimationFrame((time, delta) => {
    const dt = delta / 1000;
    const now = Date.now();
    const timeSinceInteraction = now - lastInteractionTimeRef.current;

    // Slide automatically when not interacting
    if (!isDraggingRef.current && timeSinceInteraction > 1500) {
      const speed = 10; // degrees per second
      const nextRotation = rotation.get() - speed * dt;
      rotation.set(nextRotation);
      targetRotation.current = nextRotation;
    }
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      lastInteractionTimeRef.current = Date.now();
      
      const isHorizontalDrag = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontalDrag ? e.deltaX : e.deltaY;
      
      targetRotation.current = targetRotation.current - delta * 0.1;
      
      e.preventDefault();
      rotation.stop();

      animate(rotation, targetRotation.current, {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.4,
        restDelta: 0.05
      });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [rotation]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    rotation.stop();
    isDraggingRef.current = true;
    lastInteractionTimeRef.current = Date.now();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartPointerXRef.current = e.clientX;
    dragStartRotationRef.current = rotation.get();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    lastInteractionTimeRef.current = Date.now();

    const deltaX = e.clientX - dragStartPointerXRef.current;
    let newRotation = dragStartRotationRef.current + deltaX * 0.25;

    rotation.set(newRotation);
    targetRotation.current = newRotation;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    lastInteractionTimeRef.current = Date.now();

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {
      // Ignore
    }

    const velocity = rotation.getVelocity();
    targetRotation.current = rotation.get() + velocity * 0.15;

    rotation.stop();

    animate(rotation, targetRotation.current, {
      type: "spring",
      stiffness: 80,
      damping: 25,
      mass: 0.5,
      velocity: velocity,
      restDelta: 0.05
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="overflow-hidden w-full h-full select-none flex items-center justify-center cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none', perspective: '2000px' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div style={{ transform: `translateZ(${dimensions.radius * 0.8}px)`, transformStyle: 'preserve-3d' }} className="w-full h-full flex items-center justify-center">
        <motion.div 
          style={{ rotateY: rotation, transformStyle: 'preserve-3d' }}
          className="relative flex items-center justify-center w-full h-full"
        >
          {cylinderItems.map((image, i) => (
            <div 
              key={i}
              className="absolute flex-shrink-0 origin-center pointer-events-none"
              style={{ 
                width: dimensions.itemWidth,
                transform: `rotateY(${i * theta}deg) translateZ(${-dimensions.radius}px)`,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              <div className="w-full aspect-[16/9] bg-[#e5e5e5] overflow-hidden shadow-xl pointer-events-none">
                <img 
                  src={image} 
                  alt={`Playbook page ${i}`} 
                  className="w-full h-full object-cover pointer-events-none" 
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function Playbook() {
  return (
    <main className="flex-1 overflow-hidden relative flex flex-col items-center justify-center bg-white">
      <div className="absolute top-12 md:top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <span className="text-neutral-900 select-none">{content.playbook.label}</span>
      </div>
      <CurveSlideshow />
    </main>
  );
}
