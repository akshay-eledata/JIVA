import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import JivaLogo from '../../../../assets/jiva.svg';
import { BRAND, BRAND_FONTS } from '../../brand';
import { Reveal, Marquee, Counter, BODY_SYSTEMS, BIOMARKER_TICKER } from '../shared';
import { OPTION8_LABELS as L } from './labels';

const MAX_W = '1160px';
const DISPLAY = "'Plus Jakarta Sans', sans-serif";

const gaugeOptions: ApexOptions = {
  chart: { type: 'radialBar', sparkline: { enabled: true } },
  plotOptions: {
    radialBar: {
      hollow: { size: '66%' },
      track: { background: BRAND.SAGA },
      dataLabels: {
        name: { show: true, fontSize: '12.5px', fontFamily: BRAND_FONTS.BODY, color: BRAND.BODY_TEXT, offsetY: 22 },
        value: {
          show: true,
          fontSize: '46px',
          fontFamily: DISPLAY,
          fontWeight: 800,
          color: BRAND.GREEN,
          offsetY: -12,
          formatter: () => String(L.GAUGE_VALUE),
        },
      },
    },
  },
  fill: { colors: [BRAND.GREEN] },
  stroke: { lineCap: 'round' },
  labels: [L.GAUGE_LABEL],
};

/** Button that leans toward the cursor. */
const Magnetic: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  return (
    <motion.div
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onPointerMove={(e) => {
        if (reduced) return;
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.28);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.28);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
};

/** Card that tilts in 3D under the pointer with a moving glare. */
const TiltCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reduced = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 220, damping: 20 });
  const sry = useSpring(ry, { stiffness: 220, damping: 20 });
  const glare = useTransform(
    [glareX, glareY],
    (values: number[]) =>
      `radial-gradient(circle at ${values[0]}% ${values[1]}%, rgba(213,226,116,0.35) 0%, rgba(255,255,255,0) 55%)`,
  );

  return (
    <motion.div
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900, height: '100%' }}
      onPointerMove={(e) => {
        if (reduced) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        ry.set((px - 0.5) * 14);
        rx.set((0.5 - py) * 12);
        glareX.set(px * 100);
        glareY.set(py * 100);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          borderRadius: '26px',
          backgroundColor: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(12px)',
          border: `1px solid rgba(42,97,48,0.12)`,
          boxShadow: '0 20px 50px rgba(42,97,48,0.10)',
          p: 4,
          overflow: 'hidden',
        }}
      >
        <motion.div style={{ position: 'absolute', inset: 0, background: glare, pointerEvents: 'none' }} />
        {children}
      </Box>
    </motion.div>
  );
};

/** Sticky scene: a lime beam sweeps the ten systems as you scroll. */
const ScanBeam: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [lit, setLit] = React.useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const beamTop = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%']);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setLit(Math.min(BODY_SYSTEMS.length, Math.floor(v * (BODY_SYSTEMS.length + 1))));
  });

  return (
    <Box ref={ref} sx={{ height: { xs: 'auto', md: '300vh' }, position: 'relative', backgroundColor: BRAND.SAGA }}>
      <Box
        sx={{
          position: { xs: 'static', md: 'sticky' },
          top: 0,
          minHeight: { md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          py: { xs: 8, md: 0 },
        }}
      >
        <Box sx={{ maxWidth: '860px', mx: 'auto', px: { xs: 3, md: 6 }, width: '100%' }}>
          <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '30px', md: '42px' }, color: BRAND.INK, textAlign: 'center' }}>
            {L.SCAN_TITLE}
          </Typography>
          <Typography sx={{ mt: 1, mb: 5, textAlign: 'center', fontFamily: BRAND_FONTS.BODY, fontSize: '15.5px', color: BRAND.BODY_TEXT }}>
            {L.SCAN_SUBTITLE}
          </Typography>
          <Box sx={{ position: 'relative' }}>
            <motion.div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: beamTop,
                height: 3,
                background: `linear-gradient(90deg, transparent, ${BRAND.LIME}, transparent)`,
                boxShadow: `0 0 24px ${BRAND.LIME}`,
                borderRadius: 3,
                zIndex: 2,
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {BODY_SYSTEMS.map((system, i) => {
                const on = i < lit;
                return (
                  <Box
                    key={system}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 3,
                      py: 1.9,
                      borderRadius: '16px',
                      backgroundColor: on ? BRAND.WHITE : 'rgba(255,255,255,0.42)',
                      border: `1px solid ${on ? BRAND.LIME : 'transparent'}`,
                      boxShadow: on ? '0 10px 26px rgba(42,97,48,0.12)' : 'none',
                      transform: on ? 'scale(1)' : 'scale(0.985)',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: on ? BRAND.GREEN : 'rgba(42,97,48,0.25)',
                          boxShadow: on ? `0 0 10px ${BRAND.LIME}` : 'none',
                          transition: 'all 0.4s ease',
                        }}
                      />
                      <Typography sx={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '17px', color: on ? BRAND.INK : 'rgba(23,48,27,0.45)', transition: 'color 0.4s ease' }}>
                        {system}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 600, fontSize: '13.5px', color: on ? BRAND.GREEN : 'rgba(23,48,27,0.35)', transition: 'color 0.4s ease' }}>
                      {L.SCAN_COUNTS[i]} markers
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const Option8: React.FC = () => {
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  // Cursor parallax for the hero layers.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const blobX = useTransform(smx, (v) => v * 40);
  const blobY = useTransform(smy, (v) => v * 30);
  const blob2X = useTransform(smx, (v) => v * -28);
  const blob2Y = useTransform(smy, (v) => v * -22);
  const cardX = useTransform(smx, (v) => v * 14);
  const cardY = useTransform(smy, (v) => v * 10);
  const chipsX = useTransform(smx, (v) => v * 24);
  const chipsY = useTransform(smy, (v) => v * 18);

  return (
    <Box
      sx={{ width: '100%', backgroundColor: BRAND.DEWDROP, overflowX: 'clip', textAlign: 'left' }}
      onPointerMove={(e) => {
        if (reduced) return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      {/* ---------- Mouse-parallax hero ---------- */}
      <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'clip' }}>
        <motion.div
          style={{
            position: 'absolute',
            width: '46vw',
            height: '46vw',
            borderRadius: '50%',
            top: '-14%',
            right: '-8%',
            background: `radial-gradient(circle, rgba(213,226,116,0.55) 0%, transparent 62%)`,
            filter: 'blur(46px)',
            x: blobX,
            y: blobY,
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            width: '38vw',
            height: '38vw',
            borderRadius: '50%',
            bottom: '-16%',
            left: '-10%',
            background: `radial-gradient(circle, rgba(221,238,222,0.95) 0%, transparent 62%)`,
            filter: 'blur(40px)',
            x: blob2X,
            y: blob2Y,
          }}
        />

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
            gap: { xs: 8, md: 9 },
            width: '100%',
          }}
        >
          <Box sx={{ flex: 1.15, minWidth: 0 }}>
            <Reveal>
              <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: 40, mb: 5 }} />
            </Reveal>
            <Reveal delay={0.08}>
              <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', color: BRAND.GREEN, mb: 2 }}>
                {L.HERO_EYEBROW}
              </Typography>
            </Reveal>
            <Reveal delay={0.15}>
              <Typography
                component="h1"
                sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '42px', md: '62px' }, lineHeight: 1.06, letterSpacing: '-0.02em', color: BRAND.INK }}
              >
                {L.HERO_TITLE_1}
                <br />
                <Box
                  component="span"
                  sx={{
                    backgroundImage: `linear-gradient(100deg, ${BRAND.GREEN} 20%, #79a53f 40%, ${BRAND.LIME} 50%, #79a53f 60%, ${BRAND.GREEN} 80%)`,
                    backgroundSize: '220% 100%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    animation: 'jivaShimmer 5s linear infinite',
                    '@keyframes jivaShimmer': {
                      '0%': { backgroundPosition: '120% 0' },
                      '100%': { backgroundPosition: '-120% 0' },
                    },
                  }}
                >
                  {L.HERO_TITLE_SHIMMER}
                </Box>
              </Typography>
            </Reveal>
            <Reveal delay={0.25}>
              <Typography sx={{ mt: 3, maxWidth: 480, fontFamily: BRAND_FONTS.BODY, fontSize: { xs: '16px', md: '18px' }, lineHeight: 1.65, color: BRAND.BODY_TEXT }}>
                {L.HERO_SUBTITLE}
              </Typography>
            </Reveal>
            <Reveal delay={0.35}>
              <Box sx={{ mt: 4.5, display: 'flex', gap: 2.5, alignItems: 'center', flexWrap: 'wrap' }}>
                <Magnetic>
                  <Button
                    onClick={() => navigate('/signup')}
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
                      '&:hover': { backgroundColor: BRAND.INK, boxShadow: '0 16px 36px rgba(42,97,48,0.30)' },
                      transition: 'background-color 0.25s ease, box-shadow 0.25s ease',
                    }}
                  >
                    {L.CTA_PRIMARY}
                  </Button>
                </Magnetic>
                <Button
                  onClick={() => navigate('/signin')}
                  sx={{
                    color: BRAND.GREEN,
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: '16px',
                    textTransform: 'none',
                    px: 3.5,
                    py: 1.5,
                    borderRadius: '999px',
                    border: `1.5px solid ${BRAND.GREEN}`,
                    '&:hover': { backgroundColor: BRAND.SAGA },
                  }}
                >
                  {L.CTA_SECONDARY}
                </Button>
              </Box>
            </Reveal>
          </Box>

          {/* Parallax gauge card + chips */}
          <Reveal delay={0.3}>
            <Box sx={{ position: 'relative' }}>
              <motion.div style={{ x: cardX, y: cardY }}>
                <Box
                  sx={{
                    width: { xs: 300, md: 360 },
                    borderRadius: '30px',
                    backgroundColor: 'rgba(255,255,255,0.78)',
                    backdropFilter: 'blur(14px)',
                    border: `1px solid rgba(42,97,48,0.12)`,
                    boxShadow: '0 30px 70px rgba(42,97,48,0.16)',
                    p: 3,
                  }}
                >
                  <Box sx={{ height: { xs: 240, md: 290 } }}>
                    <Chart options={gaugeOptions} series={[76]} type="radialBar" height="100%" width="100%" />
                  </Box>
                </Box>
              </motion.div>
              <motion.div style={{ position: 'absolute', inset: 0, x: chipsX, y: chipsY, pointerEvents: 'none' }}>
                {L.HERO_CHIPS.map((chip, i) => (
                  <motion.div
                    key={chip}
                    animate={reduced ? undefined : { y: [0, -9, 0] }}
                    transition={{ duration: 4.5 + i * 0.8, delay: i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      top: `${[6, 26, 66, 86][i]}%`,
                      left: i % 2 === 0 ? '-18%' : undefined,
                      right: i % 2 === 1 ? '-16%' : undefined,
                    }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 0.9,
                        borderRadius: '999px',
                        backgroundColor: BRAND.WHITE,
                        border: `1px solid rgba(42,97,48,0.12)`,
                        boxShadow: '0 10px 24px rgba(42,97,48,0.14)',
                        fontFamily: BRAND_FONTS.TECH,
                        fontWeight: 600,
                        fontSize: '13px',
                        color: BRAND.GREEN,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {chip}
                    </Box>
                  </motion.div>
                ))}
              </motion.div>
            </Box>
          </Reveal>
        </Box>
      </Box>

      {/* ---------- Biomarker marquee ---------- */}
      <Box sx={{ borderTop: `1px solid ${BRAND.SAGA}`, borderBottom: `1px solid ${BRAND.SAGA}`, py: 2.5, backgroundColor: BRAND.WHITE }}>
        <Marquee duration={34}>
          {BIOMARKER_TICKER.map((m) => (
            <Typography
              key={m}
              sx={{ px: 3, fontFamily: BRAND_FONTS.TECH, fontSize: '15px', fontWeight: 500, color: BRAND.GREEN, whiteSpace: 'nowrap', '&::after': { content: '"•"', pl: 6, color: BRAND.LIME } }}
            >
              {m}
            </Typography>
          ))}
        </Marquee>
      </Box>

      {/* ---------- 3D tilt service cards ---------- */}
      <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 8, md: 12 } }}>
        <Reveal>
          <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '30px', md: '44px' }, color: BRAND.INK, mb: 6 }}>
            {L.SERVICES_TITLE}
          </Typography>
        </Reveal>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {L.SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <TiltCard>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    backgroundColor: i % 2 === 0 ? BRAND.LIME : BRAND.SAGA,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: DISPLAY,
                    fontWeight: 800,
                    fontSize: '18px',
                    color: BRAND.GREEN,
                    mb: 2.5,
                  }}
                >
                  {i + 1}
                </Box>
                <Typography sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: '20px', color: BRAND.INK }}>
                  {s.title}
                </Typography>
                <Typography sx={{ mt: 1.25, fontFamily: BRAND_FONTS.BODY, fontSize: '14.5px', lineHeight: 1.6, color: BRAND.BODY_TEXT }}>
                  {s.desc}
                </Typography>
              </TiltCard>
            </Reveal>
          ))}
        </Box>
      </Box>

      {/* ---------- Scan beam ---------- */}
      <ScanBeam />

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
        <Reveal>
          <Box sx={{ maxWidth: MAX_W, mx: 'auto', borderRadius: '32px', backgroundColor: BRAND.GREEN, px: { xs: 4, md: 8 }, py: { xs: 7, md: 9 }, textAlign: 'center' }}>
            <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: { xs: '30px', md: '46px' }, color: BRAND.WHITE }}>
              {L.CTA_TITLE}
            </Typography>
            <Typography sx={{ mt: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '17px', color: BRAND.SAGA }}>
              {L.CTA_SUBTITLE}
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Magnetic>
                <Button
                  onClick={() => navigate('/signup')}
                  sx={{
                    backgroundColor: BRAND.LIME,
                    color: BRAND.GREEN,
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: '16px',
                    textTransform: 'none',
                    px: 5,
                    py: 1.6,
                    borderRadius: '999px',
                    '&:hover': { backgroundColor: BRAND.WHITE },
                    transition: 'background-color 0.25s ease',
                  }}
                >
                  {L.CTA_PRIMARY}
                </Button>
              </Magnetic>
            </Box>
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

export default Option8;
