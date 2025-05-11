// src/components/animated-text.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTextProps {
  texts: string[];
  duration?: number;
  className?: string;
}

export function AnimatedText({ texts, duration = 3000, className }: AnimatedTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, duration);
    return () => clearInterval(timer);
  }, [texts, duration]);

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.span
          key={texts[index]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="inline-block"
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
