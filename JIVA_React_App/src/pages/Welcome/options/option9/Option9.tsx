import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import JivaLogo from '../../../../assets/jiva.svg';
import { BRAND, BRAND_FONTS } from '../../brand';
import { Reveal, KineticText } from '../shared';
import { OPTION9_LABELS as L } from './labels';

const MAX_W = '1120px';
const EDITORIAL = "'Alegreya Sans', sans-serif";

const BLOB_PATHS = [
  'M421,306Q397,362,344,394Q291,426,229,420Q167,414,117,373Q67,332,64,266Q61,200,104,151Q147,102,209,82Q271,62,330,90Q389,118,417,169Q445,220,421,306Z',
  'M438,297Q400,344,357,383Q314,422,252,428Q190,434,135,396Q80,358,70,289Q60,220,95,163Q130,106,193,84Q256,62,318,82Q380,102,428,151Q476,200,438,297Z',
  'M414,289Q402,338,362,376Q322,414,262,430Q202,446,146,410Q90,374,76,297Q62,220,100,163Q138,106,201,90Q264,74,323,94Q382,114,404,167Q426,220,414,289Z',
];

/** Continuously morphing organic blob (SMIL — browsers interpolate matching paths natively). */
const MorphBlob: React.FC<{ fill: string; style?: React.CSSProperties }> = ({ fill, style }) => {
  const reduced = useReducedMotion();
  return (
    <Box component="svg" viewBox="0 0 500 500" sx={{ position: 'absolute' }} style={style}>
      <path fill={fill} d={BLOB_PATHS[0]}>
        {!reduced && (
          <animate
            attributeName="d"
            dur="16s"
            repeatCount="indefinite"
            values={`${BLOB_PATHS[0]};${BLOB_PATHS[1]};${BLOB_PATHS[2]};${BLOB_PATHS[0]}`}
            calcMode="spline"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
      </path>
    </Box>
  );
};

/** Apple-Watch style ring that draws itself as it scrolls into view. */
const ActivityRing: React.FC<{ pct: number; label: string; value: string; index: number }> = ({ pct, label, value, index }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 92%', 'start 40%'] });
  const progress = useTransform(scrollYProgress, [0, 1], [0, pct]);
  const R = 74;
  const C = 2 * Math.PI * R;
  const dash = useTransform(progress, (v) => C * (1 - v));

  return (
    <Box ref={ref} sx={{ textAlign: 'center' }}>
      <Box sx={{ position: 'relative', width: 190, height: 190, mx: 'auto' }}>
        <Box component="svg" viewBox="0 0 190 190" sx={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle cx="95" cy="95" r={R} fill="none" stroke={BRAND.SAGA} strokeWidth="16" />
          <motion.circle
            cx="95"
            cy="95"
            r={R}
            fill="none"
            stroke={index === 1 ? BRAND.LIME : BRAND.GREEN}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={C}
            style={{ strokeDashoffset: reduced ? C * (1 - pct) : dash }}
          />
        </Box>
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontFamily: EDITORIAL, fontWeight: 800, fontSize: '26px', color: BRAND.INK, lineHeight: 1 }}>
            {value}
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ mt: 2, fontFamily: BRAND_FONTS.BODY, fontWeight: 600, fontSize: '15px', color: BRAND.BODY_TEXT }}>
        {label}
      </Typography>
    </Box>
  );
};

/** Vertical timeline whose spine draws with scroll while milestones bloom in. */
const GrowingTimeline: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const spine = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <Box ref={ref} sx={{ position: 'relative', maxWidth: 640, mx: 'auto' }}>
      <Box sx={{ position: 'absolute', left: { xs: '14px', md: '50%' }, top: 0, bottom: 0, width: '3px', backgroundColor: BRAND.SAGA, borderRadius: 2 }}>
        <motion.div
          style={{ width: '100%', borderRadius: 2, background: BRAND.GREEN, height: spine }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, py: 1 }}>
        {L.TIMELINE.map((step, i) => (
          <Reveal key={step.title} delay={0.05}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: { xs: 'row', md: i % 2 === 0 ? 'row' : 'row-reverse' },
                alignItems: 'flex-start',
                gap: 3,
                pl: { xs: 5, md: 0 },
              }}
            >
              <Box sx={{ flex: 1, textAlign: { xs: 'left', md: i % 2 === 0 ? 'right' : 'left' } }}>
                <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 600, fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', color: BRAND.GREEN }}>
                  {step.season}
                </Typography>
                <Typography sx={{ mt: 0.5, fontFamily: EDITORIAL, fontWeight: 800, fontSize: '24px', color: BRAND.INK }}>
                  {step.title}
                </Typography>
                <Typography sx={{ mt: 1, fontFamily: BRAND_FONTS.BODY, fontSize: '15px', lineHeight: 1.65, color: BRAND.BODY_TEXT }}>
                  {step.desc}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: { xs: 'absolute', md: 'static' },
                  left: { xs: 6, md: 'auto' },
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: BRAND.LIME,
                  border: `4px solid ${BRAND.GREEN}`,
                  flexShrink: 0,
                  mt: 0.75,
                }}
              />
              <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
            </Box>
          </Reveal>
        ))}
      </Box>
    </Box>
  );
};

/** Card that flips in 3D on hover (tap on touch). */
const FlipCard: React.FC<{ front: string; back: string; index: number }> = ({ front, back, index }) => {
  const [flipped, setFlipped] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <Box
      onPointerEnter={() => setFlipped(true)}
      onPointerLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
      sx={{ perspective: '1000px', height: 230, cursor: 'pointer' }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.55, ease: [0.3, 0.9, 0.3, 1] }}
        style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            borderRadius: '24px',
            backgroundColor: index % 2 === 0 ? BRAND.SAGA : BRAND.WHITE,
            border: `1px solid ${index % 2 === 0 ? 'transparent' : BRAND.SAGA}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            p: 3,
          }}
        >
          <Box sx={{ width: 42, height: 42, borderRadius: '50%', border: `2.5px solid ${BRAND.GREEN}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: EDITORIAL, fontWeight: 800, fontSize: '18px', color: BRAND.GREEN }}>
            {index + 1}
          </Box>
          <Typography sx={{ fontFamily: EDITORIAL, fontWeight: 800, fontSize: '22px', color: BRAND.INK, textAlign: 'center' }}>
            {front}
          </Typography>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '24px',
            backgroundColor: BRAND.GREEN,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3.5,
          }}
        >
          <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '14.5px', lineHeight: 1.65, color: BRAND.DEWDROP, textAlign: 'center' }}>
            {back}
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

const Option9: React.FC = () => {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [quoteIndex, setQuoteIndex] = React.useState(0);

  React.useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setQuoteIndex((i) => (i + 1) % L.QUOTES.length), 5000);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <Box sx={{ width: '100%', backgroundColor: '#FBFDF8', overflowX: 'clip', textAlign: 'left' }}>
      {/* ---------- Morphing blob hero ---------- */}
      <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'clip' }}>
        <MorphBlob fill={BRAND.SAGA} style={{ width: '58vw', top: '-12%', right: '-14%', opacity: 0.9 }} />
        <MorphBlob fill="rgba(213,226,116,0.45)" style={{ width: '42vw', bottom: '-18%', left: '-12%' }} />

        <Box
          sx={{
            position: 'relative',
            maxWidth: MAX_W,
            mx: 'auto',
            px: { xs: 3, md: 6 },
            py: { xs: 13, md: 8 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 8, md: 10 },
            width: '100%',
          }}
        >
          <Box sx={{ flex: 1.2, minWidth: 0 }}>
            <Reveal>
              <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: 38, mb: 5 }} />
            </Reveal>
            <Reveal delay={0.08}>
              <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', color: BRAND.GREEN, mb: 2.5 }}>
                {L.HERO_EYEBROW}
              </Typography>
            </Reveal>
            <Typography
              component="h1"
              sx={{ fontFamily: EDITORIAL, fontWeight: 300, fontSize: { xs: '44px', md: '66px' }, lineHeight: 1.08, color: BRAND.INK }}
            >
              <KineticText text={L.HERO_TITLE_LIGHT} delay={0.15} />{' '}
              <Box component="span" sx={{ fontWeight: 900, color: BRAND.GREEN }}>
                <KineticText text={L.HERO_TITLE_STRONG} delay={0.5} />
              </Box>
            </Typography>
            <Reveal delay={0.6}>
              <Typography sx={{ mt: 3, maxWidth: 500, fontFamily: BRAND_FONTS.BODY, fontSize: { xs: '16px', md: '17.5px' }, lineHeight: 1.75, color: BRAND.BODY_TEXT }}>
                {L.HERO_SUBTITLE}
              </Typography>
            </Reveal>
            <Reveal delay={0.72}>
              <Box sx={{ mt: 4.5, display: 'flex', gap: 2.5, alignItems: 'center', flexWrap: 'wrap' }}>
                <motion.div
                  animate={reduced ? undefined : { scale: [1, 1.035, 1] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ display: 'inline-block' }}
                >
                  <Button
                    onClick={() => navigate('/signup')}
                    sx={{
                      backgroundColor: BRAND.GREEN,
                      color: BRAND.WHITE,
                      fontFamily: BRAND_FONTS.BODY,
                      fontWeight: 600,
                      fontSize: '16px',
                      textTransform: 'none',
                      px: 4.5,
                      py: 1.6,
                      borderRadius: '999px',
                      '&:hover': { backgroundColor: BRAND.INK },
                    }}
                  >
                    {L.CTA_PRIMARY}
                  </Button>
                </motion.div>
                <Button
                  onClick={() => navigate('/signin')}
                  sx={{
                    color: BRAND.GREEN,
                    fontFamily: BRAND_FONTS.BODY,
                    fontWeight: 600,
                    fontSize: '16px',
                    textTransform: 'none',
                    textDecoration: 'underline',
                    textUnderlineOffset: '5px',
                    '&:hover': { backgroundColor: 'transparent', color: BRAND.INK },
                  }}
                >
                  {L.CTA_SECONDARY}
                </Button>
              </Box>
            </Reveal>
          </Box>

          {/* Breathing vitality badge */}
          <Reveal delay={0.4}>
            <Box sx={{ position: 'relative', width: { xs: 260, md: 320 }, height: { xs: 260, md: 320 }, mx: 'auto' }}>
              {[0, 1, 2].map((ring) => (
                <motion.div
                  key={ring}
                  style={{
                    position: 'absolute',
                    inset: ring * -26,
                    borderRadius: '50%',
                    border: `1.5px solid rgba(42,97,48,${0.22 - ring * 0.06})`,
                  }}
                  animate={reduced ? undefined : { scale: [1, 1.06, 1], opacity: [0.9, 0.5, 0.9] }}
                  transition={{ duration: 4.5, delay: ring * 0.7, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
              <motion.div
                style={{ position: 'absolute', inset: 0 }}
                animate={reduced ? undefined : { scale: [1, 1.03, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: BRAND.WHITE,
                    boxShadow: '0 30px 70px rgba(42,97,48,0.16)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '13px', letterSpacing: '0.16em', textTransform: 'uppercase', color: BRAND.BODY_TEXT }}>
                    {L.BADGE_LABEL}
                  </Typography>
                  <Typography sx={{ fontFamily: EDITORIAL, fontWeight: 900, fontSize: { xs: '34px', md: '42px' }, color: BRAND.GREEN, lineHeight: 1 }}>
                    {L.BADGE_VALUE}
                  </Typography>
                  <Box sx={{ mt: 1, px: 2, py: 0.5, borderRadius: '999px', backgroundColor: BRAND.LIME, fontFamily: BRAND_FONTS.TECH, fontWeight: 600, fontSize: '12.5px', color: BRAND.GREEN }}>
                    8 of 10 systems in range
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Reveal>
        </Box>
      </Box>

      {/* ---------- Activity rings ---------- */}
      <Box sx={{ backgroundColor: BRAND.WHITE, borderTop: `1px solid ${BRAND.SAGA}`, borderBottom: `1px solid ${BRAND.SAGA}`, py: { xs: 8, md: 11 } }}>
        <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 } }}>
          <Reveal>
            <Typography component="h2" sx={{ fontFamily: EDITORIAL, fontWeight: 900, fontSize: { xs: '30px', md: '42px' }, color: BRAND.INK, textAlign: 'center' }}>
              {L.RINGS_TITLE}
            </Typography>
            <Typography sx={{ mt: 1.5, mb: 6, textAlign: 'center', fontFamily: BRAND_FONTS.BODY, fontSize: '16px', color: BRAND.BODY_TEXT }}>
              {L.RINGS_SUBTITLE}
            </Typography>
          </Reveal>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 5 }}>
            {L.RINGS.map((ring, i) => (
              <ActivityRing key={ring.label} pct={ring.pct} label={ring.label} value={ring.value} index={i} />
            ))}
          </Box>
        </Box>
      </Box>

      {/* ---------- Growing timeline ---------- */}
      <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 9, md: 13 } }}>
        <Reveal>
          <Typography component="h2" sx={{ fontFamily: EDITORIAL, fontWeight: 900, fontSize: { xs: '30px', md: '42px' }, color: BRAND.INK, textAlign: 'center', mb: 7 }}>
            {L.TIMELINE_TITLE}
          </Typography>
        </Reveal>
        <GrowingTimeline />
      </Box>

      {/* ---------- Flip cards ---------- */}
      <Box sx={{ backgroundColor: BRAND.SAGA, py: { xs: 8, md: 11 } }}>
        <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 } }}>
          <Reveal>
            <Typography component="h2" sx={{ fontFamily: EDITORIAL, fontWeight: 900, fontSize: { xs: '30px', md: '40px' }, color: BRAND.INK, textAlign: 'center' }}>
              {L.FLIP_TITLE}
            </Typography>
            <Typography sx={{ mt: 1, mb: 5, textAlign: 'center', fontFamily: BRAND_FONTS.BODY, fontSize: '14.5px', color: BRAND.BODY_TEXT }}>
              {L.FLIP_HINT}
            </Typography>
          </Reveal>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {L.FLIPS.map((card, i) => (
              <Reveal key={card.front} delay={i * 0.1}>
                <FlipCard front={card.front} back={card.back} index={i} />
              </Reveal>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ---------- Auto-advancing quote ---------- */}
      <Box sx={{ py: { xs: 9, md: 12 } }}>
        <Box sx={{ maxWidth: '820px', mx: 'auto', px: { xs: 3, md: 6 }, textAlign: 'center', minHeight: 200 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <Typography sx={{ fontFamily: EDITORIAL, fontWeight: 300, fontSize: { xs: '24px', md: '34px' }, lineHeight: 1.4, color: BRAND.INK }}>
                “{L.QUOTES[quoteIndex].quote}”
              </Typography>
              <Typography sx={{ mt: 3, fontFamily: BRAND_FONTS.BODY, fontWeight: 700, fontSize: '15px', color: BRAND.GREEN }}>
                {L.QUOTES[quoteIndex].name}
              </Typography>
            </motion.div>
          </AnimatePresence>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 1.25 }}>
            {L.QUOTES.map((_, i) => (
              <Box
                key={i}
                onClick={() => setQuoteIndex(i)}
                sx={{
                  width: i === quoteIndex ? 26 : 9,
                  height: 9,
                  borderRadius: '999px',
                  backgroundColor: i === quoteIndex ? BRAND.GREEN : BRAND.SAGA,
                  cursor: 'pointer',
                  transition: 'all 0.35s ease',
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* ---------- CTA + footer ---------- */}
      <Box sx={{ px: { xs: 3, md: 6 }, pb: { xs: 9, md: 11 } }}>
        <Reveal>
          <Box sx={{ position: 'relative', maxWidth: '900px', mx: 'auto', borderRadius: '40px', backgroundColor: BRAND.GREEN, px: { xs: 4, md: 9 }, py: { xs: 7, md: 9 }, textAlign: 'center', overflow: 'clip' }}>
            <MorphBlob fill="rgba(213,226,116,0.16)" style={{ width: '55%', top: '-30%', right: '-16%' }} />
            <Typography component="h2" sx={{ position: 'relative', fontFamily: EDITORIAL, fontWeight: 300, fontSize: { xs: '30px', md: '44px' }, color: BRAND.WHITE }}>
              {L.CTA_TITLE}
            </Typography>
            <Typography sx={{ position: 'relative', mt: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '16px', color: BRAND.SAGA }}>
              {L.CTA_SUBTITLE}
            </Typography>
            <motion.div
              animate={reduced ? undefined : { scale: [1, 1.04, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'inline-block', position: 'relative', marginTop: 32 }}
            >
              <Button
                onClick={() => navigate('/signup')}
                sx={{
                  backgroundColor: BRAND.LIME,
                  color: BRAND.GREEN,
                  fontFamily: BRAND_FONTS.BODY,
                  fontWeight: 700,
                  fontSize: '16px',
                  textTransform: 'none',
                  px: 5,
                  py: 1.6,
                  borderRadius: '999px',
                  '&:hover': { backgroundColor: BRAND.WHITE },
                }}
              >
                {L.CTA_PRIMARY}
              </Button>
            </motion.div>
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
  );
};

export default Option9;
