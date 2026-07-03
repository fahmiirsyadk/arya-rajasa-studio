import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoaderProps {
  onComplete: () => void;
  key?: string;
}

const TARGET_TEXT = "(arya rajasa © 2026)";
const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789©()[]{}<>@#$%&*+-=";

export default function Loader({ onComplete }: LoaderProps) {
  const [displayText, setDisplayText] = useState<string>("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [blurVal, setBlurVal] = useState(12);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in text initially with blur
    const fadeInTimeout = setTimeout(() => {
      setOpacity(1);
    }, 100);

    let frame = 0;
    const totalDuration = 2400; // 2.4 seconds loading sequence
    const intervalTime = 40; // 25 frames per second
    const totalFrames = totalDuration / intervalTime;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      // Gradually decrease blur from 12px to 0px
      const currentBlur = Math.max(0, 12 * (1 - progress * 1.2));
      setBlurVal(currentBlur);

      // Decryption effect
      const currentText = TARGET_TEXT.split("").map((char, index) => {
        // Spaces remain spaces
        if (char === " ") return " ";

        // Determine if this character is resolved
        // We resolve characters progressively from left to right with some random jitter
        const resolveThreshold = (index / TARGET_TEXT.length) * 0.85;
        
        if (progress >= resolveThreshold) {
          // If we are in the last phase, show the true character
          return char;
        }

        // Otherwise show a randomized character
        const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
        return randomChar;
      }).join("");

      setDisplayText(currentText);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayText(TARGET_TEXT);
        setIsRevealed(true);
        setBlurVal(0);

        // Wait a moment after fully forming before fading out completely
        const fadeOutTimeout = setTimeout(() => {
          onComplete();
        }, 1000);

        return () => clearTimeout(fadeOutTimeout);
      }
    }, intervalTime);

    return () => {
      clearTimeout(fadeInTimeout);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
      className="fixed inset-0 bg-white z-[9999] flex items-center justify-center pointer-events-auto"
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <motion.div
          style={{
            filter: `blur(${blurVal}px)`,
            opacity: opacity,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="font-mono text-base md:text-xl tracking-[0.2em] text-neutral-900 select-none text-center px-4"
        >
          {displayText}
        </motion.div>
        
        {/* Minimal progress line indicator */}
        <div className="w-16 h-[1px] bg-neutral-100 overflow-hidden relative">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={isRevealed ? { left: "100%" } : { left: "0%" }}
            transition={{ 
              duration: isRevealed ? 1 : 2.4, 
              ease: isRevealed ? [0.85, 0, 0.15, 1] : "easeInOut" 
            }}
            className="absolute top-0 bottom-0 left-0 w-full bg-neutral-400"
          />
        </div>
      </div>
    </motion.div>
  );
}
