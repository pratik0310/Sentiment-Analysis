// components/PageTransition.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        {/* Scan-line wipe — enters from top, exits down */}
        <motion.div
          initial={{ scaleY: 1, originY: 0 }}
          animate={{ scaleY: 0, originY: 0 }}
          exit={{ scaleY: 1, originY: 1 }}
          transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#050905',
            zIndex: 999,
            pointerEvents: 'none',
            borderBottom: '1px solid #c8ff0033',
          }}
        />

        {/* Content fade-up */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, delay: 0.25, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}