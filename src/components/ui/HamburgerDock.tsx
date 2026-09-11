'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VerticalDock, { DockItemData, VerticalDockProps } from './VerticalDock';

export interface HamburgerDockProps extends Omit<VerticalDockProps, 'items'> {
  items: DockItemData[];
  position?: 'left' | 'right';
  defaultOpen?: boolean;
  buttonLabel?: string;
}

export default function HamburgerDock({
  items,
  position = 'left',
  defaultOpen = false,
  buttonLabel = 'Toggle Dock Menu',
  magnification = 70,
  baseItemSize = 50,
  distance = 200,
  spring,
}: HamburgerDockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const isLeft = position === 'left';

  return (
    <div className="fixed top-6 z-50 flex items-start gap-3 select-none" style={{ [isLeft ? 'left' : 'right']: '1.5rem' }}>
      {/* Hamburger Action Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={buttonLabel}
        className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-xl transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/50"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #FF6B35 0%, #E85D2C 100%)'
            : 'rgba(18, 15, 23, 0.9)',
          backdropFilter: 'blur(16px)',
          border: isOpen ? '1px solid rgba(255, 107, 53, 0.8)' : '1px solid rgba(255, 107, 53, 0.3)',
          color: '#FFF8F0',
          boxShadow: isOpen
            ? '0 8px 24px rgba(255, 107, 53, 0.45)'
            : '0 8px 20px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Animated Hamburger / Close Icon */}
        <motion.span
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 7 : 0,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-5 h-[2px] bg-current rounded-full origin-center"
        />
        <motion.span
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0.5 : 1,
          }}
          transition={{ duration: 0.15 }}
          className="w-5 h-[2px] bg-current rounded-full"
        />
        <motion.span
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -7 : 0,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-5 h-[2px] bg-current rounded-full origin-center"
        />
      </motion.button>

      {/* Sliding Aside Vertical Dock */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: isLeft ? -30 : 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: isLeft ? -30 : 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="relative"
          >
            <VerticalDock
              items={items}
              magnification={magnification}
              baseItemSize={baseItemSize}
              distance={distance}
              spring={spring}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
