import React from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import {
  motion,
  animate,
  useInView,
  useReducedMotion,
} from 'framer-motion';

/** Fades and slides content in the first time it scrolls into view. */
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, y = 28, style }) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.6, 0.35, 1] }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

/** Reveals a headline one word at a time. */
export const KineticText: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
}> = ({ text, delay = 0, stagger = 0.08 }) => {
  const reduced = useReducedMotion();
  const words = text.split(' ');
  if (reduced) return <>{text}</>;
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: '0.6em' }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.55,
            delay: delay + i * stagger,
            ease: [0.21, 0.6, 0.35, 1],
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </>
  );
};

/** Counts from 0 to `value` when scrolled into view. */
export const Counter: React.FC<{
  value: number;
  suffix?: string;
  duration?: number;
}> = ({ value, suffix = '', duration = 1.6 }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = useReducedMotion();
  const [display, setDisplay] = React.useState(reduced ? value : 0);

  React.useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
};

/** Infinite horizontal ticker. Content is duplicated for a seamless loop. */
export const Marquee: React.FC<{
  children: React.ReactNode;
  duration?: number;
  reverse?: boolean;
  sx?: SxProps<Theme>;
}> = ({ children, duration = 30, reverse = false, sx }) => {
  const reduced = useReducedMotion();
  return (
    <Box sx={{ overflow: 'hidden', width: '100%', ...sx }}>
      <motion.div
        style={{ display: 'flex', width: 'max-content' }}
        animate={reduced ? undefined : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>{children}</Box>
        <Box aria-hidden sx={{ display: 'flex', alignItems: 'center' }}>
          {children}
        </Box>
      </motion.div>
    </Box>
  );
};

/** Slow vertical bobbing loop for floating decorative elements. */
export const Floating: React.FC<{
  children: React.ReactNode;
  duration?: number;
  distance?: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, duration = 5, distance = 12, delay = 0, style }) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      style={style}
      animate={reduced ? undefined : { y: [0, -distance, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

export const BODY_SYSTEMS = [
  'Blood',
  'Metabolic',
  'Heart',
  'Liver',
  'Kidney',
  'Electrolytes',
  'Thyroid',
  'Nutrients',
  'Immune',
  'Hormonal',
] as const;

export const BIOMARKER_TICKER = [
  'ApoB',
  'HbA1c',
  'hs-CRP',
  'Ferritin',
  'Vitamin D',
  'TSH',
  'LDL-C',
  'Testosterone',
  'Cortisol',
  'eGFR',
  'Homocysteine',
  'Insulin',
  'Omega-3 Index',
  'ALT',
  'B12',
] as const;
