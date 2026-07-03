import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);
  
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button') || target.closest('.group')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      style={{
        x: smoothX,
        y: smoothY,
      }}
      className="fixed top-0 left-0 pointer-events-none z-50 hidden md:flex items-center justify-center mix-blend-difference"
    >
      <motion.div 
        animate={{ 
          width: isHovering ? 22 : 8, 
          height: isHovering ? 22 : 8,
        }}
        transition={{ type: "tween", ease: "circOut", duration: 0.2 }}
        className="bg-white rounded-full translate-x-[-50%] translate-y-[-50%]"
      />
    </motion.div>
  );
}
