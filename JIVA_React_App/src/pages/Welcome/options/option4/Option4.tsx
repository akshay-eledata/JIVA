import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import JivaLogo from '../../../../assets/jiva.svg';
import { BRAND, BRAND_FONTS } from '../../brand';
import { Reveal, KineticText, Counter, Marquee, BODY_SYSTEMS, BIOMARKER_TICKER } from '../shared';
import { OPTION4_LABELS as L } from './labels';

const MAX_W = '1160px';
const DISPLAY = "'Manrope', sans-serif";

const gaugeOptions: ApexOptions = {
  chart: { type: 'radialBar', sparkline: { enabled: true } },
  plotOptions: {
    radialBar: {
      hollow: { size: '66%' },
      track: { background: BRAND.SAGA },
      dataLabels: {
        name: { show: true, fontSize: '13px', fontFamily: BRAND_FONTS.BODY, color: BRAND.BODY_TEXT, offsetY: 24 },
        value: {
          show: true,
          fontSize: '46px',
          fontFamily: DISPLAY,
          fontWeight: 800,
          color: BRAND.GREEN,
          offsetY: -12,
          formatter: () => String(L.VISUAL_GAUGE_VALUE),
        },
      },
    },
  },
  fill: { colors: [BRAND.GREEN] },
  stroke: { lineCap: 'round' },
  labels: [L.VISUAL_GAUGE_LABEL],
};

const areaOptions: ApexOptions = {
  chart: { type: 'area', sparkline: { enabled: true }, animations: { enabled: true, speed: 1600 } },
  stroke: { curve: 'smooth', width: 3, colors: [BRAND.GREEN] },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 0.6, opacityFrom: 0.35, opacityTo: 0.02, colorStops: [] },
    colors: [BRAND.GREEN],
  },
  tooltip: { enabled: false },
};

const areaSeries = [{ name: 'Ferritin', data: [18, 22, 21, 26, 31, 38, 44, 52] }];

/** Left visual that crossfades between gauge / chart / plan as chapters scroll. */
const ChapterVisual: React.FC<{ active: number }> = ({ active }) => {
  const reduced = useReducedMotion();
  const visuals = [
    <Box key="gauge" sx={{ height: 300 }}>
      <Chart options={gaugeOptions} series={[76]} type="radialBar" height="100%" width="100%" />
    </Box>,
    <Box key="chart" sx={{ px: 1 }}>
      <Typography sx={{ mb: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '13.5px', color: BRAND.BODY_TEXT }}>
        {L.VISUAL_CHART_LABEL}
      </Typography>
      <Box sx={{ height: 240 }}>
        <Chart options={areaOptions} series={areaSeries} type="area" height="100%" width="100%" />
      </Box>
    </Box>,
    <Box key="plan" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, px: 1 }}>
      {L.VISUAL_PLAN_ITEMS.map((item, i) => (
        <Box
          key={item}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.75,
            p: 2,
            borderRadius: '14px',
            backgroundColor: i === 0 ? BRAND.LIME : BRAND.SAGA,
          }}
        >
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: BRAND.GREEN, flexShrink: 0 }} />
          <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontWeight: 600, fontSize: '15px', color: BRAND.INK }}>
            {item}
          </Typography>
        </Box>
      ))}
    </Box>,
  ];

  return (
    <Box
      sx={{
        borderRadius: '28px',
        backgroundColor: BRAND.WHITE,
        border: `1px solid ${BRAND.SAGA}`,
        boxShadow: '0 24px 60px rgba(42,97,48,0.10)',
        p: 4,
        minHeight: 360,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={reduced ? false : { opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0, y: -18, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {visuals[active]}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

/** Sticky visual on the left, chapter copy scrolling on the right. */
const StickyChapters: React.FC = () => {
  const [active, setActive] = React.useState(0);
  const refs = [
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
    React.useRef<HTMLDivElement>(null),
  ];
  const inViews = [
    useInView(refs[0], { margin: '-45% 0px -45% 0px' }),
    useInView(refs[1], { margin: '-45% 0px -45% 0px' }),
    useInView(refs[2], { margin: '-45% 0px -45% 0px' }),
  ];
  React.useEffect(() => {
    const idx = inViews.findIndex(Boolean);
    if (idx >= 0) setActive(idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViews[0], inViews[1], inViews[2]]);

  return (
    <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 8, md: 12 } }}>
      <Reveal>
        <Typography
          component="h2"
          sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '32px', md: '44px' }, color: BRAND.INK, mb: 7 }}
        >
          {L.CHAPTERS_TITLE}
        </Typography>
      </Reveal>
      <Box sx={{ display: 'flex', gap: { xs: 0, md: 9 } }}>
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            flex: 1,
            position: 'sticky',
            top: '18vh',
            alignSelf: 'flex-start',
          }}
        >
          <ChapterVisual active={active} />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: 6, md: '38vh' }, py: { md: '6vh' } }}>
          {L.CHAPTERS.map((ch, i) => (
            <Box key={ch.id} ref={refs[i]}>
              <Typography
                sx={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: '15px',
                  color: BRAND.GREEN,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                0{i + 1}
              </Typography>
              <Typography sx={{ mt: 1, fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '26px', md: '34px' }, color: BRAND.INK }}>
                {ch.title}
              </Typography>
              <Typography sx={{ mt: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '16.5px', lineHeight: 1.75, color: BRAND.BODY_TEXT }}>
                {ch.desc}
              </Typography>
              {/* Mobile fallback: show the visual inline under each chapter */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3 }}>
                <ChapterVisual active={i} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

/** Vertical scroll drives a horizontal sweep across the ten body systems. */
const HorizontalGallery: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], ['2%', '-58%']);

  return (
    <Box ref={ref} sx={{ height: { xs: 'auto', md: '280vh' }, position: 'relative', backgroundColor: BRAND.SAGA }}>
      <Box
        sx={{
          position: { xs: 'static', md: 'sticky' },
          top: 0,
          minHeight: { md: '100vh' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          py: { xs: 8, md: 0 },
        }}
      >
        <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, width: '100%', mb: 5 }}>
          <Typography
            component="h2"
            sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '30px', md: '42px' }, color: BRAND.INK }}
          >
            {L.GALLERY_TITLE}
          </Typography>
          <Typography sx={{ mt: 1, fontFamily: BRAND_FONTS.BODY, fontSize: '15px', color: BRAND.BODY_TEXT }}>
            {L.GALLERY_HINT} →
          </Typography>
        </Box>
        <motion.div style={{ x: reduced ? 0 : x, display: 'flex', gap: 20, paddingLeft: '6vw', width: 'max-content' }}>
          {BODY_SYSTEMS.map((system, i) => (
            <Box
              key={system}
              sx={{
                width: { xs: 220, md: 260 },
                flexShrink: 0,
                p: 3.5,
                borderRadius: '24px',
                backgroundColor: BRAND.WHITE,
                border: `1px solid rgba(42,97,48,0.08)`,
                boxShadow: '0 10px 30px rgba(42,97,48,0.07)',
              }}
            >
              <Typography sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: '30px', color: BRAND.LIME, WebkitTextStroke: `1.5px ${BRAND.GREEN}` }}>
                {String(i + 1).padStart(2, '0')}
              </Typography>
              <Typography sx={{ mt: 3, fontFamily: DISPLAY, fontWeight: 700, fontSize: '21px', color: BRAND.INK }}>
                {system}
              </Typography>
              <Box sx={{ mt: 2, height: 4, borderRadius: 2, backgroundColor: BRAND.SAGA, overflow: 'hidden' }}>
                <Box sx={{ width: `${45 + ((i * 13) % 50)}%`, height: '100%', backgroundColor: BRAND.GREEN, borderRadius: 2 }} />
              </Box>
            </Box>
          ))}
        </motion.div>
      </Box>
    </Box>
  );
};

const Option4: React.FC = () => {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const heroRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress: pageProgress } = useScroll();
  const progressScale = useSpring(pageProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(heroProgress, [0, 0.85], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.94]);
  const blobY = useTransform(heroProgress, [0, 1], ['0%', '28%']);

  return (
    <Box sx={{ width: '100%', backgroundColor: BRAND.DEWDROP, overflowX: 'clip', textAlign: 'left' }}>
      {/* Scroll progress bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: BRAND.GREEN,
          transformOrigin: 'left center',
          scaleX: reduced ? 1 : progressScale,
          zIndex: 1900,
        }}
      />

      {/* ---------- Hero (scrubs out as you scroll) ---------- */}
      <Box ref={heroRef} sx={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <motion.div style={{ position: 'absolute', inset: 0, y: reduced ? 0 : blobY, pointerEvents: 'none' }}>
          <Box
            sx={{
              position: 'absolute',
              width: '44vw',
              height: '44vw',
              borderRadius: '50%',
              top: '-16%',
              right: '-10%',
              background: `radial-gradient(circle, ${BRAND.LIME} 0%, transparent 62%)`,
              opacity: 0.5,
              filter: 'blur(50px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: '36vw',
              height: '36vw',
              borderRadius: '50%',
              bottom: '-14%',
              left: '-12%',
              background: `radial-gradient(circle, ${BRAND.SAGA} 0%, transparent 62%)`,
              opacity: 0.9,
              filter: 'blur(40px)',
            }}
          />
        </motion.div>

        <motion.div
          style={{ opacity: reduced ? 1 : heroOpacity, scale: reduced ? 1 : heroScale, width: '100%' }}
        >
          <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 14, md: 10 }, textAlign: 'center' }}>
            <Reveal>
              <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: 42, mb: 4 }} />
            </Reveal>
            <Reveal delay={0.08}>
              <Typography
                sx={{
                  fontFamily: BRAND_FONTS.BODY,
                  fontSize: '13px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: BRAND.GREEN,
                  mb: 2.5,
                }}
              >
                {L.HERO_EYEBROW}
              </Typography>
            </Reveal>
            <Typography
              component="h1"
              sx={{
                mx: 'auto',
                maxWidth: 820,
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: { xs: '44px', md: '72px' },
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: BRAND.INK,
              }}
            >
              <KineticText text={L.HERO_TITLE} delay={0.15} />
            </Typography>
            <Reveal delay={0.55}>
              <Typography
                sx={{
                  mt: 3,
                  mx: 'auto',
                  maxWidth: 540,
                  fontFamily: BRAND_FONTS.BODY,
                  fontSize: { xs: '16px', md: '18px' },
                  lineHeight: 1.65,
                  color: BRAND.BODY_TEXT,
                }}
              >
                {L.HERO_SUBTITLE}
              </Typography>
            </Reveal>
            <Reveal delay={0.7}>
              <Box sx={{ mt: 4.5, display: 'flex', justifyContent: 'center', gap: 2.5, flexWrap: 'wrap' }}>
                <Button
                  onClick={() => navigate('/intake')}
                  sx={{
                    backgroundColor: BRAND.GREEN,
                    color: BRAND.WHITE,
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: '16px',
                    textTransform: 'none',
                    px: 4.5,
                    py: 1.6,
                    borderRadius: '999px',
                    transition: 'all 0.25s ease',
                    '&:hover': { backgroundColor: BRAND.INK, transform: 'translateY(-2px)', boxShadow: '0 12px 28px rgba(42,97,48,0.25)' },
                  }}
                >
                  {L.CTA_PRIMARY}
                </Button>
                <Button
                  onClick={() => navigate('/signin')}
                  sx={{
                    color: BRAND.GREEN,
                    border: `1.5px solid ${BRAND.GREEN}`,
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: '16px',
                    textTransform: 'none',
                    px: 4,
                    py: 1.5,
                    borderRadius: '999px',
                    '&:hover': { backgroundColor: BRAND.SAGA },
                  }}
                >
                  {L.CTA_SECONDARY}
                </Button>
              </Box>
            </Reveal>
            <motion.div
              animate={reduced ? undefined : { y: [0, 10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ marginTop: 56 }}
            >
              <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '13px', color: BRAND.BODY_TEXT }}>
                {L.HERO_HINT} ↓
              </Typography>
            </motion.div>
          </Box>
        </motion.div>
      </Box>

      {/* ---------- Biomarker marquee ---------- */}
      <Box sx={{ borderTop: `1px solid ${BRAND.SAGA}`, borderBottom: `1px solid ${BRAND.SAGA}`, py: 2.5, backgroundColor: BRAND.WHITE }}>
        <Marquee duration={34}>
          {BIOMARKER_TICKER.map((m) => (
            <Typography
              key={m}
              sx={{
                px: 3,
                fontFamily: DISPLAY,
                fontSize: '15px',
                fontWeight: 600,
                color: BRAND.GREEN,
                whiteSpace: 'nowrap',
                '&::after': { content: '"•"', pl: 6, color: BRAND.LIME },
              }}
            >
              {m}
            </Typography>
          ))}
        </Marquee>
      </Box>

      {/* ---------- Sticky chapters ---------- */}
      <StickyChapters />

      {/* ---------- Horizontal gallery ---------- */}
      <HorizontalGallery />

      {/* ---------- Stats ---------- */}
      <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 8, md: 11 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 4, textAlign: 'center' }}>
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
      </Box>

      {/* ---------- CTA + footer ---------- */}
      <Box sx={{ px: { xs: 3, md: 6 }, pb: { xs: 8, md: 10 } }}>
        <Reveal>
          <Box
            sx={{
              maxWidth: MAX_W,
              mx: 'auto',
              borderRadius: '32px',
              backgroundColor: BRAND.GREEN,
              px: { xs: 4, md: 8 },
              py: { xs: 7, md: 9 },
              textAlign: 'center',
            }}
          >
            <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '30px', md: '46px' }, color: BRAND.WHITE }}>
              {L.CTA_TITLE}
            </Typography>
            <Typography sx={{ mt: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '17px', color: BRAND.SAGA }}>
              {L.CTA_SUBTITLE}
            </Typography>
            <Button
              onClick={() => navigate('/intake')}
              sx={{
                mt: 4,
                backgroundColor: BRAND.LIME,
                color: BRAND.GREEN,
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: '16px',
                textTransform: 'none',
                px: 5,
                py: 1.6,
                borderRadius: '999px',
                transition: 'all 0.25s ease',
                '&:hover': { backgroundColor: BRAND.WHITE, transform: 'translateY(-2px)' },
              }}
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
  );
};

export default Option4;
