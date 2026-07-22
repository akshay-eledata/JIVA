import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import JivaLogo from '../../../../assets/jiva.svg';
import { BRAND, BRAND_FONTS } from '../../brand';
import { Reveal, KineticText, Counter } from '../shared';
import { OPTION13_LABELS as L } from './labels';

const MAX_W = '1120px';
const DISPLAY = "'Plus Jakarta Sans', sans-serif";

/** Section that scales up and fades in as it crosses the viewport center. */
const ZoomSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 95%', 'start 45%'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  return (
    <motion.div ref={ref} style={reduced ? undefined : { scale, opacity }}>
      {children}
    </motion.div>
  );
};

/** Draggable stack: throw the top card aside to advance. */
const StoryDeck: React.FC = () => {
  const [top, setTop] = React.useState(0);
  const reduced = useReducedMotion();
  const count = L.DECK_CARDS.length;

  return (
    <Box sx={{ position: 'relative', width: { xs: 300, sm: 380 }, height: 300, mx: 'auto' }}>
      <AnimatePresence>
        {[2, 1, 0].map((depth) => {
          const index = (top + depth) % count;
          const card = L.DECK_CARDS[index];
          const isTop = depth === 0;
          return (
            <motion.div
              key={`${index}-${Math.floor((top + depth) / count)}`}
              initial={{ scale: 0.9, y: 26, opacity: 0 }}
              animate={{ scale: 1 - depth * 0.06, y: depth * -18, opacity: 1 - depth * 0.25, zIndex: 3 - depth }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              drag={isTop && !reduced ? true : false}
              dragSnapToOrigin
              dragElastic={0.9}
              onDragEnd={(_, info) => {
                const power = Math.abs(info.offset.x) + Math.abs(info.velocity.x) * 0.15;
                if (power > 160) setTop((t) => (t + 1) % count);
              }}
              style={{ position: 'absolute', inset: 0, cursor: isTop ? 'grab' : 'default' }}
              whileDrag={{ cursor: 'grabbing', rotate: 4 }}
            >
              <Box
                sx={{
                  height: '100%',
                  borderRadius: '26px',
                  backgroundColor: BRAND.WHITE,
                  border: `1px solid rgba(42,97,48,0.12)`,
                  boxShadow: '0 24px 60px rgba(42,97,48,0.16)',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{ alignSelf: 'flex-start', px: 1.75, py: 0.5, borderRadius: '999px', backgroundColor: BRAND.LIME, fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: '12.5px', color: BRAND.GREEN }}
                >
                  {card.tag}
                </Box>
                <Typography sx={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '20px', lineHeight: 1.4, color: BRAND.INK }}>
                  “{card.quote}”
                </Typography>
                <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontWeight: 700, fontSize: '14px', color: BRAND.GREEN }}>
                  {card.name}
                </Typography>
              </Box>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </Box>
  );
};

/** Chip grid where each chip expands in place into a full panel (shared element). */
const ExpandingChips: React.FC = () => {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const open = L.EXPAND_CHIPS.find((c) => c.id === openId);

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
        {L.EXPAND_CHIPS.map((chip) => (
          <motion.div key={chip.id} layoutId={`chip-${chip.id}`} style={{ borderRadius: 999 }}>
            <Box
              onClick={() => setOpenId(chip.id)}
              sx={{
                px: 4,
                py: 1.9,
                borderRadius: '999px',
                backgroundColor: BRAND.WHITE,
                border: `1px solid rgba(42,97,48,0.14)`,
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: '16.5px',
                color: BRAND.GREEN,
                cursor: 'pointer',
                '&:hover': { backgroundColor: BRAND.LIME },
                transition: 'background-color 0.25s ease',
              }}
            >
              {chip.label}
            </Box>
          </motion.div>
        ))}
      </Box>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenId(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(23,48,27,0.45)', backdropFilter: 'blur(6px)', zIndex: 1500 }}
            />
            <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1600, p: 3, pointerEvents: 'none' }}>
              <motion.div layoutId={`chip-${open.id}`} style={{ borderRadius: 28, pointerEvents: 'auto', maxWidth: 560, width: '100%' }}>
                <Box sx={{ borderRadius: '28px', backgroundColor: BRAND.WHITE, p: { xs: 4, md: 5 }, boxShadow: '0 40px 100px rgba(23,48,27,0.35)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ px: 1.75, py: 0.5, borderRadius: '999px', backgroundColor: BRAND.LIME, fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: '12.5px', color: BRAND.GREEN }}>
                      {open.label}
                    </Box>
                    <Box onClick={() => setOpenId(null)} sx={{ cursor: 'pointer', color: BRAND.GREEN, display: 'flex' }}>
                      <CloseIcon fontSize="small" />
                    </Box>
                  </Box>
                  <Typography sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '24px', md: '30px' }, color: BRAND.INK }}>
                    {open.title}
                  </Typography>
                  <Typography sx={{ mt: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '15.5px', lineHeight: 1.7, color: BRAND.BODY_TEXT }}>
                    {open.body}
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </>
        )}
      </AnimatePresence>
    </Box>
  );
};

const Option13: React.FC = () => {
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  // The page's surface color flows with scroll.
  const { scrollYProgress, scrollY } = useScroll();
  const bg = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 0.85, 1],
    ['#F3F9F3', '#DDEEDE', '#EAF0CF', '#DDEEDE', '#F3F9F3'],
  );

  // Marquee shears with scroll velocity.
  const velocity = useVelocity(scrollY);
  const skewRaw = useTransform(velocity, [-2200, 0, 2200], [-14, 0, 14]);
  const skew = useSpring(skewRaw, { stiffness: 220, damping: 28 });
  const marqueeX = useTransform(scrollY, (v) => -(v * 0.4) % 1400);

  return (
    <motion.div style={{ backgroundColor: reduced ? '#F3F9F3' : bg }}>
      <Box sx={{ width: '100%', overflowX: 'clip', textAlign: 'left' }}>
        {/* ---------- Hero ---------- */}
        <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, pt: { xs: 14, md: 18 }, pb: { xs: 8, md: 10 }, textAlign: 'center' }}>
          <Reveal>
            <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: 42, mb: 4 }} />
          </Reveal>
          <Reveal delay={0.08}>
            <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', color: BRAND.GREEN, mb: 2.5 }}>
              {L.HERO_EYEBROW}
            </Typography>
          </Reveal>
          <Typography component="h1" sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '42px', md: '68px' }, lineHeight: 1.06, letterSpacing: '-0.03em', color: BRAND.INK }}>
            <KineticText text={L.HERO_TITLE_1} delay={0.15} />
            <br />
            <Box component="span" sx={{ color: BRAND.GREEN }}>
              <KineticText text={L.HERO_TITLE_2} delay={0.6} />
            </Box>
          </Typography>
          <Reveal delay={0.7}>
            <Typography sx={{ mt: 3, mx: 'auto', maxWidth: 560, fontFamily: BRAND_FONTS.BODY, fontSize: { xs: '16px', md: '18px' }, lineHeight: 1.7, color: BRAND.BODY_TEXT }}>
              {L.HERO_SUBTITLE}
            </Typography>
          </Reveal>
          <Reveal delay={0.8}>
            <Box sx={{ mt: 4.5, display: 'flex', justifyContent: 'center', gap: 2.5, flexWrap: 'wrap' }}>
              <Button
                onClick={() => navigate('/signup')}
                sx={{ backgroundColor: BRAND.GREEN, color: BRAND.WHITE, fontFamily: DISPLAY, fontWeight: 700, fontSize: '16px', textTransform: 'none', px: 4.5, py: 1.6, borderRadius: '999px', transition: 'all 0.25s ease', '&:hover': { backgroundColor: BRAND.INK, transform: 'translateY(-2px)' } }}
              >
                {L.CTA_PRIMARY}
              </Button>
              <Button
                onClick={() => navigate('/signin')}
                sx={{ color: BRAND.GREEN, border: `1.5px solid ${BRAND.GREEN}`, fontFamily: DISPLAY, fontWeight: 700, fontSize: '16px', textTransform: 'none', px: 4, py: 1.5, borderRadius: '999px', '&:hover': { backgroundColor: 'rgba(255,255,255,0.5)' } }}
              >
                {L.CTA_SECONDARY}
              </Button>
            </Box>
          </Reveal>
        </Box>

        {/* ---------- Velocity marquee ---------- */}
        <Box sx={{ py: { xs: 4, md: 6 }, overflow: 'clip' }}>
          <motion.div style={{ skewX: reduced ? 0 : skew, x: reduced ? 0 : marqueeX, whiteSpace: 'nowrap', willChange: 'transform' }}>
            {Array.from({ length: 8 }, (_, i) => (
              <Typography
                key={i}
                component="span"
                sx={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: { xs: '80px', md: '150px' },
                  letterSpacing: '-0.02em',
                  pr: 6,
                  color: i % 2 === 0 ? 'transparent' : BRAND.GREEN,
                  WebkitTextStroke: i % 2 === 0 ? `2px ${BRAND.GREEN}` : undefined,
                  opacity: i % 2 === 0 ? 0.9 : 0.16,
                }}
              >
                {L.MARQUEE_WORD}
              </Typography>
            ))}
          </motion.div>
        </Box>

        {/* ---------- Story deck ---------- */}
        <ZoomSection>
          <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 8, md: 11 }, textAlign: 'center' }}>
            <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '30px', md: '44px' }, color: BRAND.INK }}>
              {L.DECK_TITLE}
            </Typography>
            <Typography sx={{ mt: 1, mb: 6, fontFamily: BRAND_FONTS.BODY, fontSize: '14.5px', color: BRAND.BODY_TEXT }}>
              {L.DECK_HINT}
            </Typography>
            <StoryDeck />
          </Box>
        </ZoomSection>

        {/* ---------- Expanding chips ---------- */}
        <ZoomSection>
          <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 8, md: 11 }, textAlign: 'center' }}>
            <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '30px', md: '44px' }, color: BRAND.INK, mb: 5 }}>
              {L.EXPAND_TITLE}
            </Typography>
            <ExpandingChips />
          </Box>
        </ZoomSection>

        {/* ---------- Stats ---------- */}
        <ZoomSection>
          <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 8, md: 10 }, display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 4, textAlign: 'center' }}>
            {L.STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <Typography sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '44px', md: '58px' }, color: BRAND.GREEN, lineHeight: 1 }}>
                  <Counter value={stat.value} suffix={stat.suffix} />
                </Typography>
                <Typography sx={{ mt: 1, fontFamily: BRAND_FONTS.BODY, fontSize: '15px', color: BRAND.BODY_TEXT }}>
                  {stat.label}
                </Typography>
              </Reveal>
            ))}
          </Box>
        </ZoomSection>

        {/* ---------- CTA + footer ---------- */}
        <Box sx={{ px: { xs: 3, md: 6 }, pb: { xs: 8, md: 10 } }}>
          <Reveal>
            <Box sx={{ maxWidth: MAX_W, mx: 'auto', borderRadius: '32px', backgroundColor: BRAND.GREEN, px: { xs: 4, md: 8 }, py: { xs: 7, md: 9 }, textAlign: 'center' }}>
              <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '30px', md: '46px' }, color: BRAND.WHITE }}>
                {L.CTA_TITLE}
              </Typography>
              <Typography sx={{ mt: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '17px', color: BRAND.SAGA }}>
                {L.CTA_SUBTITLE}
              </Typography>
              <Button
                onClick={() => navigate('/signup')}
                sx={{ mt: 4, backgroundColor: BRAND.LIME, color: BRAND.GREEN, fontFamily: DISPLAY, fontWeight: 700, fontSize: '16px', textTransform: 'none', px: 5, py: 1.6, borderRadius: '999px', transition: 'all 0.25s ease', '&:hover': { backgroundColor: BRAND.WHITE, transform: 'translateY(-2px)' } }}
              >
                {L.CTA_PRIMARY}
              </Button>
            </Box>
          </Reveal>
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: 26, opacity: 0.85 }} />
            <Typography sx={{ mt: 1.5, fontFamily: BRAND_FONTS.BODY, fontSize: '13px', color: BRAND.BODY_TEXT }}>
              {L.FOOTER_COPYRIGHT}
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default Option13;
