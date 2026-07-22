import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { animate, stagger, svg } from 'animejs';
import JivaLogo from '../../../../assets/jiva.svg';
import { BRAND, BRAND_FONTS } from '../../brand';
import { Reveal, Counter, BODY_SYSTEMS } from '../shared';
import { OPTION12_LABELS as L } from './labels';

const MAX_W = '1140px';
const DISPLAY = "'Manrope', sans-serif";

const GRID_COLS = 20;
const GRID_ROWS = 11;
const DOTS = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => i);

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Fires a callback once when the element scrolls into view. */
const useInViewOnce = (onEnter: (el: HTMLElement) => void) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const fired = React.useRef(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !fired.current) {
          fired.current = true;
          onEnter(el);
          obs.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
};

const ECG_PATH =
  'M0,70 H120 L145,70 L162,26 L180,108 L198,70 H330 L355,70 L372,34 L390,100 L408,70 H540 L565,70 L582,26 L600,108 L618,70 H750 L775,70 L792,34 L810,100 L828,70 H960';

const Option12: React.FC = () => {
  const navigate = useNavigate();
  const gridRef = React.useRef<HTMLDivElement>(null);
  const headlineRef = React.useRef<HTMLHeadingElement>(null);

  // Entry choreography: dot-grid ripple from center + headline letter cascade.
  React.useEffect(() => {
    if (prefersReduced()) return;
    const dots = gridRef.current?.querySelectorAll('.pg-dot');
    if (dots?.length) {
      animate(dots, {
        scale: [{ from: 0, to: 1 }],
        opacity: [{ from: 0, to: 1 }],
        delay: stagger(14, { grid: [GRID_COLS, GRID_ROWS], from: 'center' }),
        duration: 700,
        ease: 'outElastic(1, .7)',
      });
    }
    const letters = headlineRef.current?.querySelectorAll('.pg-letter');
    if (letters?.length) {
      animate(letters, {
        translateY: [{ from: 46, to: 0 }],
        opacity: [{ from: 0, to: 1 }],
        delay: stagger(32, { start: 250 }),
        duration: 850,
        ease: 'outElastic(1.1, .8)',
      });
    }
  }, []);

  // Click ripple: re-pulse the grid outward from the clicked dot.
  const ripple = (e: React.MouseEvent) => {
    if (prefersReduced()) return;
    const grid = gridRef.current;
    if (!grid) return;
    const rect = grid.getBoundingClientRect();
    const col = Math.max(0, Math.min(GRID_COLS - 1, Math.floor(((e.clientX - rect.left) / rect.width) * GRID_COLS)));
    const row = Math.max(0, Math.min(GRID_ROWS - 1, Math.floor(((e.clientY - rect.top) / rect.height) * GRID_ROWS)));
    const index = row * GRID_COLS + col;
    animate(grid.querySelectorAll('.pg-dot'), {
      scale: [{ to: 1.9, duration: 160 }, { to: 1, duration: 620 }],
      delay: stagger(11, { grid: [GRID_COLS, GRID_ROWS], from: index }),
      ease: 'outElastic(1, .6)',
    });
  };

  // ECG line draws itself when scrolled into view.
  const ecgRef = useInViewOnce((el) => {
    if (prefersReduced()) return;
    const path = el.querySelector('.pg-ecg');
    if (path) {
      animate(svg.createDrawable(path as SVGPathElement), {
        draw: ['0 0', '0 1'],
        duration: 2400,
        ease: 'inOutQuad',
      });
    }
  });

  // Cards pop in with overshoot when their row enters the viewport.
  const cardsRef = useInViewOnce((el) => {
    if (prefersReduced()) return;
    animate(el.querySelectorAll('.pg-card'), {
      translateY: [{ from: 70, to: 0 }],
      opacity: [{ from: 0, to: 1 }],
      delay: stagger(110),
      duration: 800,
      ease: 'outElastic(1, .75)',
    });
  });

  // System chips arrive as a wave.
  const chipsRef = useInViewOnce((el) => {
    if (prefersReduced()) return;
    animate(el.querySelectorAll('.pg-chip'), {
      translateY: [{ from: 40, to: 0 }],
      opacity: [{ from: 0, to: 1 }],
      delay: stagger(60),
      duration: 650,
      ease: 'outBack(2)',
    });
  });

  const shiver = (index: number) => {
    if (prefersReduced()) return;
    const chips = chipsRef.current?.querySelectorAll('.pg-chip');
    if (chips?.length) {
      animate(chips, {
        translateY: [{ to: -12, duration: 140 }, { to: 0, duration: 480 }],
        delay: stagger(45, { from: index }),
        ease: 'outElastic(1, .55)',
      });
    }
  };

  const squash = (e: React.PointerEvent) => {
    if (prefersReduced()) return;
    animate(e.currentTarget, {
      scale: [{ to: 0.94, duration: 110 }, { to: 1, duration: 520 }],
      ease: 'outElastic(1, .5)',
    });
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: BRAND.DEWDROP, overflowX: 'clip', textAlign: 'left' }}>
      {/* ---------- Dot-grid hero ---------- */}
      <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'clip' }}>
        <Box
          ref={gridRef}
          onClick={ripple}
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            alignItems: 'center',
            justifyItems: 'center',
            p: 4,
            cursor: 'pointer',
          }}
        >
          {DOTS.map((i) => (
            <Box
              key={i}
              className="pg-dot"
              sx={{
                width: { xs: 5, md: 7 },
                height: { xs: 5, md: 7 },
                borderRadius: '50%',
                backgroundColor: i % 7 === 0 ? BRAND.LIME : 'rgba(42,97,48,0.22)',
                willChange: 'transform',
              }}
            />
          ))}
        </Box>

        <Box sx={{ position: 'relative', maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, textAlign: 'center', width: '100%', pointerEvents: 'none' }}>
          <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: 42, mb: 4 }} />
          <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', color: BRAND.GREEN, mb: 2 }}>
            {L.HERO_EYEBROW}
          </Typography>
          <Typography
            ref={headlineRef}
            component="h1"
            sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '42px', md: '72px' }, lineHeight: 1.05, letterSpacing: '-0.03em', color: BRAND.INK }}
          >
            {L.HERO_TITLE.split('').map((ch, i) => (
              <Box key={i} component="span" className="pg-letter" sx={{ display: 'inline-block', whiteSpace: 'pre', willChange: 'transform' }}>
                {ch}
              </Box>
            ))}
          </Typography>
          <Typography sx={{ mt: 3, mx: 'auto', maxWidth: 540, fontFamily: BRAND_FONTS.BODY, fontSize: { xs: '16px', md: '18px' }, lineHeight: 1.65, color: BRAND.BODY_TEXT }}>
            {L.HERO_SUBTITLE}
          </Typography>
          <Box sx={{ mt: 4.5, display: 'flex', justifyContent: 'center', gap: 2.5, flexWrap: 'wrap', pointerEvents: 'auto' }}>
            <Button
              onPointerDown={squash}
              onClick={() => navigate('/signup')}
              sx={{ backgroundColor: BRAND.GREEN, color: BRAND.WHITE, fontFamily: DISPLAY, fontWeight: 700, fontSize: '16px', textTransform: 'none', px: 4.5, py: 1.6, borderRadius: '999px', '&:hover': { backgroundColor: BRAND.INK } }}
            >
              {L.CTA_PRIMARY}
            </Button>
            <Button
              onPointerDown={squash}
              onClick={() => navigate('/signin')}
              sx={{ color: BRAND.GREEN, border: `1.5px solid ${BRAND.GREEN}`, fontFamily: DISPLAY, fontWeight: 700, fontSize: '16px', textTransform: 'none', px: 4, py: 1.5, borderRadius: '999px', '&:hover': { backgroundColor: BRAND.SAGA } }}
            >
              {L.CTA_SECONDARY}
            </Button>
          </Box>
          <Typography sx={{ mt: 5, fontFamily: BRAND_FONTS.BODY, fontSize: '13px', color: BRAND.BODY_TEXT }}>
            {L.HERO_HINT} ✦
          </Typography>
        </Box>
      </Box>

      {/* ---------- ECG draw ---------- */}
      <Box ref={ecgRef} sx={{ backgroundColor: BRAND.WHITE, borderTop: `1px solid ${BRAND.SAGA}`, borderBottom: `1px solid ${BRAND.SAGA}`, py: { xs: 8, md: 11 } }}>
        <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 } }}>
          <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '28px', md: '40px' }, color: BRAND.INK, textAlign: 'center' }}>
            {L.ECG_TITLE}
          </Typography>
          <Typography sx={{ mt: 2, mx: 'auto', maxWidth: 600, textAlign: 'center', fontFamily: BRAND_FONTS.BODY, fontSize: '16px', lineHeight: 1.65, color: BRAND.BODY_TEXT }}>
            {L.ECG_SUBTITLE}
          </Typography>
          <Box sx={{ mt: 5, overflow: 'hidden' }}>
            <Box component="svg" viewBox="0 0 960 140" sx={{ width: '100%', height: { xs: 90, md: 130 }, display: 'block' }}>
              <path className="pg-ecg" d={ECG_PATH} fill="none" stroke={BRAND.GREEN} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ---------- Elastic cards ---------- */}
      <Box ref={cardsRef} sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 8, md: 12 } }}>
        <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '30px', md: '44px' }, color: BRAND.INK, mb: 6 }}>
          {L.CARDS_TITLE}
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {L.CARDS.map((card, i) => (
            <Box
              key={card.title}
              className="pg-card"
              onPointerEnter={squash}
              sx={{
                opacity: 0,
                p: 4,
                borderRadius: '24px',
                backgroundColor: i % 2 === 0 ? BRAND.SAGA : BRAND.WHITE,
                border: `1px solid ${i % 2 === 0 ? 'transparent' : BRAND.SAGA}`,
                cursor: 'default',
                willChange: 'transform',
              }}
            >
              <Typography sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: '34px', color: BRAND.LIME, WebkitTextStroke: `1.5px ${BRAND.GREEN}` }}>
                {String(i + 1).padStart(2, '0')}
              </Typography>
              <Typography sx={{ mt: 2, fontFamily: DISPLAY, fontWeight: 800, fontSize: '22px', color: BRAND.INK }}>
                {card.title}
              </Typography>
              <Typography sx={{ mt: 1, fontFamily: BRAND_FONTS.BODY, fontSize: '14.5px', lineHeight: 1.6, color: BRAND.BODY_TEXT }}>
                {card.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ---------- Chip wave ---------- */}
      <Box sx={{ backgroundColor: BRAND.SAGA, py: { xs: 8, md: 10 } }}>
        <Box ref={chipsRef} sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, textAlign: 'center' }}>
          <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '28px', md: '38px' }, color: BRAND.INK }}>
            {L.CHIPS_TITLE}
          </Typography>
          <Typography sx={{ mt: 1, mb: 4, fontFamily: BRAND_FONTS.BODY, fontSize: '14px', color: BRAND.BODY_TEXT }}>
            {L.CHIPS_HINT}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            {BODY_SYSTEMS.map((system, i) => (
              <Box
                key={system}
                className="pg-chip"
                onClick={() => shiver(i)}
                sx={{
                  opacity: 0,
                  px: 3.25,
                  py: 1.6,
                  borderRadius: '999px',
                  backgroundColor: BRAND.WHITE,
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: '15.5px',
                  color: BRAND.GREEN,
                  cursor: 'pointer',
                  userSelect: 'none',
                  willChange: 'transform',
                  '&:hover': { backgroundColor: BRAND.LIME },
                  transition: 'background-color 0.25s ease',
                }}
              >
                {system}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ---------- Stats ---------- */}
      <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 8, md: 11 }, display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 4, textAlign: 'center' }}>
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

      {/* ---------- CTA + footer ---------- */}
      <Box sx={{ px: { xs: 3, md: 6 }, pb: { xs: 8, md: 10 } }}>
        <Box sx={{ maxWidth: MAX_W, mx: 'auto', borderRadius: '32px', backgroundColor: BRAND.GREEN, px: { xs: 4, md: 8 }, py: { xs: 7, md: 9 }, textAlign: 'center' }}>
          <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '30px', md: '46px' }, color: BRAND.WHITE }}>
            {L.CTA_TITLE}
          </Typography>
          <Typography sx={{ mt: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '17px', color: BRAND.SAGA }}>
            {L.CTA_SUBTITLE}
          </Typography>
          <Button
            onPointerDown={squash}
            onClick={() => navigate('/signup')}
            sx={{ mt: 4, backgroundColor: BRAND.LIME, color: BRAND.GREEN, fontFamily: DISPLAY, fontWeight: 700, fontSize: '16px', textTransform: 'none', px: 5, py: 1.6, borderRadius: '999px', '&:hover': { backgroundColor: BRAND.WHITE } }}
          >
            {L.CTA_PRIMARY}
          </Button>
        </Box>
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

export default Option12;
