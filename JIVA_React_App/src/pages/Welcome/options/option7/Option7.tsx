import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { motion, useScroll, useReducedMotion } from 'framer-motion';
import JivaLogo from '../../../../assets/jiva.svg';
import GridBg from '../../../../assets/Vector.svg';
import { BRAND, BRAND_FONTS } from '../../brand';
import { Reveal, KineticText, Marquee, Counter, BODY_SYSTEMS } from '../shared';
import { OPTION7_LABELS as L } from './labels';

const LIGHT = {
  BG: BRAND.DEWDROP,
  BG_2: '#E9F5EA',
  CARD: '#FFFFFF',
  BORDER: 'rgba(42,97,48,0.14)',
  TEXT: BRAND.INK,
  MUTED: BRAND.BODY_TEXT,
} as const;

const MAX_W = '1200px';

/* Deterministic particle field (no Math.random so positions are stable). */
const PARTICLES = Array.from({ length: 26 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: 3 + (i % 3),
  delay: (i % 7) * 0.6,
  duration: 4 + (i % 5),
}));

const gaugeOptions: ApexOptions = {
  chart: { type: 'radialBar', sparkline: { enabled: true } },
  plotOptions: {
    radialBar: {
      hollow: { size: '62%' },
      track: { background: BRAND.SAGA },
      dataLabels: {
        name: { show: true, fontSize: '12px', fontFamily: BRAND_FONTS.TECH, color: BRAND.BODY_TEXT, offsetY: 20 },
        value: {
          show: true,
          fontSize: '42px',
          fontFamily: BRAND_FONTS.TECH,
          fontWeight: 700,
          color: BRAND.GREEN,
          offsetY: -12,
          formatter: () => String(L.ORBIT_GAUGE_VALUE),
        },
      },
    },
  },
  fill: { colors: [BRAND.GREEN] },
  stroke: { lineCap: 'round' },
  labels: [L.ORBIT_GAUGE_LABEL],
};

const areaOptions: ApexOptions = {
  chart: { type: 'area', sparkline: { enabled: true }, animations: { enabled: true, speed: 1800 } },
  stroke: { curve: 'smooth', width: 2.5, colors: [BRAND.GREEN] },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.3, opacityTo: 0.02 }, colors: [BRAND.GREEN] },
  tooltip: { enabled: false },
};
const areaSeries = [{ name: 'Ferritin', data: [18, 22, 21, 26, 31, 38, 44, 52] }];

const barOptions: ApexOptions = {
  chart: { type: 'bar', sparkline: { enabled: true }, animations: { enabled: true, speed: 1400 } },
  plotOptions: { bar: { borderRadius: 3, columnWidth: '55%' } },
  fill: { colors: [BRAND.GREEN] },
  tooltip: { enabled: false },
};
const barSeries = [{ name: 'Markers', data: [14, 9, 12, 8, 7, 6, 10, 13, 11, 10] }];

/** Heartbeat that draws itself as the section scrolls through the viewport. */
const EcgLine: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 35%'] });
  const d =
    'M0,60 H140 L165,60 L180,18 L195,96 L210,60 H340 L365,60 L380,26 L395,88 L410,60 H540 L565,60 L580,18 L595,96 L610,60 H740 L765,60 L780,26 L795,88 L810,60 H1000';

  return (
    <Box ref={ref} sx={{ width: '100%', overflow: 'hidden' }}>
      <Box component="svg" viewBox="0 0 1000 120" sx={{ width: '100%', height: { xs: 80, md: 120 }, display: 'block' }}>
        <motion.path
          d={d}
          fill="none"
          stroke={BRAND.GREEN}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={reduced ? undefined : { pathLength: scrollYProgress }}
        />
        <motion.path
          d={d}
          fill="none"
          stroke={BRAND.LIME}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.45}
          style={reduced ? undefined : { pathLength: scrollYProgress }}
        />
      </Box>
    </Box>
  );
};

/** Radial gauge wrapped in two counter-rotating orbit rings carrying biomarker chips. */
const OrbitVisual: React.FC = () => {
  const reduced = useReducedMotion();
  return (
    <Box
      sx={{
        position: 'relative',
        width: 430,
        height: 430,
        mx: 'auto',
        transform: { xs: 'scale(0.72)', md: 'none' },
        transformOrigin: 'center',
      }}
    >
      {/* Outer orbit */}
      <motion.div
        style={{ position: 'absolute', inset: 0 }}
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px dashed rgba(42,97,48,0.30)' }} />
        {L.ORBIT_CHIPS.slice(0, 3).map((chip, i) => {
          const angle = i * 120;
          return (
            <Box key={chip} sx={{ position: 'absolute', top: '50%', left: '50%' }} style={{ transform: `rotate(${angle}deg) translate(0, -215px)` }}>
              <motion.div
                animate={reduced ? undefined : { rotate: [-angle, -angle - 360] }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                style={{ transform: `rotate(${-angle}deg)`, marginLeft: -34, marginTop: -14 }}
              >
                <Box
                  sx={{
                    px: 1.75,
                    py: 0.65,
                    borderRadius: '999px',
                    backgroundColor: BRAND.WHITE,
                    border: `1px solid ${LIGHT.BORDER}`,
                    fontFamily: BRAND_FONTS.TECH,
                    fontWeight: 600,
                    fontSize: '12.5px',
                    color: BRAND.GREEN,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 8px 22px rgba(42,97,48,0.16)',
                  }}
                >
                  {chip}
                </Box>
              </motion.div>
            </Box>
          );
        })}
      </motion.div>
      {/* Inner orbit, counter-rotating */}
      <motion.div
        style={{ position: 'absolute', inset: '13%' }}
        animate={reduced ? undefined : { rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      >
        <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(42,97,48,0.18)' }} />
        {L.ORBIT_CHIPS.slice(3).map((chip, i) => {
          const angle = i * 120 + 60;
          return (
            <Box key={chip} sx={{ position: 'absolute', top: '50%', left: '50%' }} style={{ transform: `rotate(${angle}deg) translate(0, -160px)` }}>
              <motion.div
                animate={reduced ? undefined : { rotate: [-angle, -angle + 360] }}
                transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                style={{ transform: `rotate(${-angle}deg)`, marginLeft: -30, marginTop: -13 }}
              >
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '999px',
                    backgroundColor: BRAND.LIME,
                    border: `1px solid rgba(42,97,48,0.12)`,
                    fontFamily: BRAND_FONTS.TECH,
                    fontWeight: 600,
                    fontSize: '11.5px',
                    color: BRAND.GREEN,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chip}
                </Box>
              </motion.div>
            </Box>
          );
        })}
      </motion.div>
      {/* Center gauge */}
      <Box
        sx={{
          position: 'absolute',
          inset: '24%',
          borderRadius: '50%',
          backgroundColor: BRAND.WHITE,
          border: `1px solid ${LIGHT.BORDER}`,
          boxShadow: '0 24px 60px rgba(42,97,48,0.16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1,
        }}
      >
        <Box sx={{ width: '100%', height: '100%' }}>
          <Chart options={gaugeOptions} series={[76]} type="radialBar" height="100%" width="100%" />
        </Box>
      </Box>
    </Box>
  );
};

const boardCard = {
  borderRadius: '22px',
  border: `1px solid ${LIGHT.BORDER}`,
  backgroundColor: LIGHT.CARD,
  p: 3.5,
  boxShadow: '0 8px 26px rgba(42,97,48,0.06)',
  transition: 'all 0.3s ease',
  '&:hover': { borderColor: BRAND.GREEN, boxShadow: '0 18px 44px rgba(42,97,48,0.14)', transform: 'translateY(-4px)' },
} as const;

const Option7: React.FC = () => {
  const navigate = useNavigate();
  const reduced = useReducedMotion();

  return (
    <Box sx={{ width: '100%', backgroundColor: LIGHT.BG, overflowX: 'clip', textAlign: 'left' }}>
      {/* ---------- Hero ---------- */}
      <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        {/* Grid + soft blobs + particles */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${GridBg})`,
            backgroundSize: '520px',
            backgroundRepeat: 'repeat',
            opacity: 0.28,
            pointerEvents: 'none',
          }}
        />
        <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <motion.div
            style={{
              position: 'absolute',
              width: '55vw',
              height: '55vw',
              borderRadius: '50%',
              top: '-22%',
              left: '-12%',
              background: 'radial-gradient(circle, rgba(221,238,222,0.95) 0%, transparent 65%)',
              filter: 'blur(50px)',
            }}
            animate={reduced ? undefined : { x: [0, 80, 0], y: [0, 46, 0] }}
            transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            style={{
              position: 'absolute',
              width: '44vw',
              height: '44vw',
              borderRadius: '50%',
              bottom: '-26%',
              right: '-8%',
              background: 'radial-gradient(circle, rgba(213,226,116,0.55) 0%, transparent 65%)',
              filter: 'blur(60px)',
            }}
            animate={reduced ? undefined : { x: [0, -60, 0], y: [0, -36, 0] }}
            transition={{ duration: 23, repeat: Infinity, ease: 'easeInOut' }}
          />
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: 'rgba(42,97,48,0.35)',
              }}
              animate={reduced ? undefined : { opacity: [0.1, 0.6, 0.1], y: [0, -14, 0] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </Box>

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
            gap: { xs: 8, md: 6 },
            width: '100%',
          }}
        >
          <Box sx={{ flex: 1.1, minWidth: 0 }}>
            <Reveal>
              <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: 38, mb: 5 }} />
            </Reveal>
            <Reveal delay={0.08}>
              <Typography
                sx={{
                  fontFamily: BRAND_FONTS.TECH,
                  fontSize: '13px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: BRAND.GREEN,
                  mb: 2,
                }}
              >
                {L.HERO_EYEBROW}
              </Typography>
            </Reveal>
            <Typography
              component="h1"
              sx={{
                fontFamily: BRAND_FONTS.TECH,
                fontWeight: 700,
                fontSize: { xs: '38px', md: '54px' },
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: LIGHT.TEXT,
              }}
            >
              <KineticText text={L.HERO_TITLE} delay={0.2} />
            </Typography>
            <Reveal delay={0.7}>
              <Typography sx={{ mt: 3, maxWidth: 470, fontFamily: BRAND_FONTS.BODY, fontSize: { xs: '16px', md: '17.5px' }, lineHeight: 1.65, color: LIGHT.MUTED }}>
                {L.HERO_SUBTITLE}
              </Typography>
            </Reveal>
            <Reveal delay={0.85}>
              <Box sx={{ mt: 4.5, display: 'flex', gap: 2.5, alignItems: 'center', flexWrap: 'wrap' }}>
                <Button
                  onClick={() => navigate('/signup')}
                  sx={{
                    backgroundColor: BRAND.GREEN,
                    color: BRAND.WHITE,
                    fontFamily: BRAND_FONTS.TECH,
                    fontWeight: 700,
                    fontSize: '16px',
                    textTransform: 'none',
                    px: 4.5,
                    py: 1.6,
                    borderRadius: '12px',
                    transition: 'all 0.25s ease',
                    '&:hover': { backgroundColor: BRAND.INK, boxShadow: '0 14px 32px rgba(42,97,48,0.28)', transform: 'translateY(-2px)' },
                  }}
                >
                  {L.CTA_PRIMARY}
                </Button>
                <Button
                  onClick={() => navigate('/signin')}
                  sx={{
                    color: BRAND.GREEN,
                    fontFamily: BRAND_FONTS.TECH,
                    fontWeight: 600,
                    fontSize: '16px',
                    textTransform: 'none',
                    px: 3.5,
                    py: 1.5,
                    borderRadius: '12px',
                    border: `1.5px solid ${BRAND.GREEN}`,
                    '&:hover': { backgroundColor: BRAND.SAGA },
                  }}
                >
                  {L.CTA_SECONDARY}
                </Button>
              </Box>
            </Reveal>
            {/* Floating status cards */}
            <Box sx={{ mt: 5, display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
              {L.HERO_CARDS.map((card, i) => (
                <motion.div
                  key={card.label}
                  animate={reduced ? undefined : { y: [0, -8, 0] }}
                  transition={{ duration: 4.5 + i, delay: i * 1.1, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Box
                    sx={{
                      px: 2.5,
                      py: 1.75,
                      borderRadius: '16px',
                      backgroundColor: 'rgba(255,255,255,0.85)',
                      border: `1px solid ${LIGHT.BORDER}`,
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 10px 26px rgba(42,97,48,0.10)',
                    }}
                  >
                    <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '12px', color: LIGHT.MUTED }}>{card.label}</Typography>
                    <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: '17px', color: LIGHT.TEXT }}>
                      {card.value}
                    </Typography>
                    <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontSize: '12px', color: BRAND.GREEN }}>{card.trend}</Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>

          <Reveal delay={0.4}>
            <OrbitVisual />
          </Reveal>
        </Box>
      </Box>

      {/* ---------- ECG interlude (scroll-scrubbed draw) ---------- */}
      <Box sx={{ backgroundColor: BRAND.WHITE, py: { xs: 8, md: 11 }, borderTop: `1px solid ${BRAND.SAGA}`, borderBottom: `1px solid ${BRAND.SAGA}` }}>
        <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 } }}>
          <Reveal>
            <Typography component="h2" sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: { xs: '28px', md: '40px' }, color: LIGHT.TEXT, textAlign: 'center' }}>
              {L.ECG_TITLE}
            </Typography>
            <Typography sx={{ mt: 2, mx: 'auto', maxWidth: 620, textAlign: 'center', fontFamily: BRAND_FONTS.BODY, fontSize: '16px', lineHeight: 1.65, color: LIGHT.MUTED }}>
              {L.ECG_SUBTITLE}
            </Typography>
          </Reveal>
          <Box sx={{ mt: 5 }}>
            <EcgLine />
          </Box>
        </Box>
      </Box>

      {/* ---------- Live systems board ---------- */}
      <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 9, md: 13 } }}>
        <Reveal>
          <Typography component="h2" sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: { xs: '30px', md: '42px' }, color: LIGHT.TEXT }}>
            {L.BOARD_TITLE}
          </Typography>
          <Typography sx={{ mt: 1.5, mb: 6, fontFamily: BRAND_FONTS.BODY, fontSize: '16px', color: LIGHT.MUTED }}>
            {L.BOARD_SUBTITLE}
          </Typography>
        </Reveal>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' } }}>
          <Reveal style={{ gridColumn: 'span 1' }}>
            <Box sx={{ ...boardCard, height: '100%', textAlign: 'center' }}>
              <Box sx={{ height: 170 }}>
                <Chart options={gaugeOptions} series={[76]} type="radialBar" height="100%" width="100%" />
              </Box>
              <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 600, fontSize: '16px', color: LIGHT.TEXT }}>
                {L.BOARD.AGE_LABEL}
              </Typography>
              <Typography sx={{ mt: 0.5, fontFamily: BRAND_FONTS.BODY, fontSize: '12.5px', color: LIGHT.MUTED }}>
                {L.BOARD.AGE_NOTE}
              </Typography>
            </Box>
          </Reveal>
          <Reveal delay={0.08} style={{ gridColumn: 'span 2' }}>
            <Box sx={{ ...boardCard, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '13.5px', color: LIGHT.MUTED }}>{L.BOARD.TREND_LABEL}</Typography>
                <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: '13.5px', color: BRAND.GREEN }}>
                  {L.BOARD.TREND_VALUE}
                </Typography>
              </Box>
              <Box sx={{ height: 150 }}>
                <Chart options={areaOptions} series={areaSeries} type="area" height="100%" width="100%" />
              </Box>
            </Box>
          </Reveal>
          <Reveal delay={0.16} style={{ gridColumn: 'span 1' }}>
            <Box sx={{ ...boardCard, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
              <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: '58px', lineHeight: 1, color: BRAND.GREEN }}>
                <Counter value={L.BOARD.SYSTEMS_VALUE} suffix={L.BOARD.SYSTEMS_SUFFIX} />
              </Typography>
              <Typography sx={{ mt: 1.5, fontFamily: BRAND_FONTS.BODY, fontSize: '14px', color: LIGHT.MUTED }}>
                {L.BOARD.SYSTEMS_LABEL}
              </Typography>
            </Box>
          </Reveal>
          <Reveal delay={0.2} style={{ gridColumn: 'span 2' }}>
            <Box sx={{ ...boardCard, height: '100%' }}>
              <Typography sx={{ mb: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '13.5px', color: LIGHT.MUTED }}>{L.BOARD.LOAD_LABEL}</Typography>
              <Box sx={{ height: 130 }}>
                <Chart options={barOptions} series={barSeries} type="bar" height="100%" width="100%" />
              </Box>
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                {['Bld', 'Met', 'Hrt', 'Liv', 'Kid', 'Ele', 'Thy', 'Nut', 'Imm', 'Hor'].map((s) => (
                  <Typography key={s} sx={{ fontFamily: BRAND_FONTS.TECH, fontSize: '10.5px', color: 'rgba(62,75,65,0.55)' }}>
                    {s}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Reveal>
          <Reveal delay={0.24} style={{ gridColumn: 'span 2' }}>
            <Box sx={{ ...boardCard, height: '100%' }}>
              <Typography sx={{ mb: 2, fontFamily: BRAND_FONTS.TECH, fontWeight: 600, fontSize: '17px', color: LIGHT.TEXT }}>
                {L.BOARD.PLAN_TITLE}
              </Typography>
              {L.BOARD.PLAN_ITEMS.map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: BRAND.GREEN, flexShrink: 0 }} />
                  <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '14.5px', color: LIGHT.MUTED }}>{item}</Typography>
                </Box>
              ))}
            </Box>
          </Reveal>
        </Box>
      </Box>

      {/* ---------- Systems ticker with mini meters ---------- */}
      <Box sx={{ borderTop: `1px solid ${BRAND.SAGA}`, borderBottom: `1px solid ${BRAND.SAGA}`, py: 4, backgroundColor: LIGHT.BG_2 }}>
        <Reveal>
          <Typography sx={{ mb: 3, textAlign: 'center', fontFamily: BRAND_FONTS.TECH, fontWeight: 600, fontSize: '15px', letterSpacing: '0.14em', textTransform: 'uppercase', color: BRAND.GREEN }}>
            {L.SYSTEMS_TITLE}
          </Typography>
        </Reveal>
        <Marquee duration={38}>
          {BODY_SYSTEMS.map((system, i) => (
            <Box key={system} sx={{ mx: 1.5, px: 3, py: 1.75, borderRadius: '14px', border: `1px solid ${LIGHT.BORDER}`, backgroundColor: BRAND.WHITE, minWidth: 150 }}>
              <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 600, fontSize: '14.5px', color: LIGHT.TEXT, whiteSpace: 'nowrap' }}>
                {system}
              </Typography>
              <Box sx={{ mt: 1, height: 3, borderRadius: 2, backgroundColor: BRAND.SAGA, overflow: 'hidden' }}>
                <Box sx={{ width: `${50 + ((i * 17) % 45)}%`, height: '100%', backgroundColor: BRAND.GREEN, borderRadius: 2 }} />
              </Box>
            </Box>
          ))}
        </Marquee>
      </Box>

      {/* ---------- Stats ---------- */}
      <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 7, md: 9 }, display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 4, textAlign: 'center' }}>
        {L.STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.1}>
            <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: { xs: '42px', md: '58px' }, color: BRAND.GREEN, lineHeight: 1 }}>
              <Counter value={stat.value} suffix={stat.suffix} />
            </Typography>
            <Typography sx={{ mt: 1.25, fontFamily: BRAND_FONTS.BODY, fontSize: '14.5px', color: LIGHT.MUTED }}>
              {stat.label}
            </Typography>
          </Reveal>
        ))}
      </Box>

      {/* ---------- Quote marquees ---------- */}
      <Box sx={{ pb: { xs: 9, md: 12 } }}>
        <Reveal>
          <Typography component="h2" sx={{ textAlign: 'center', fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: { xs: '28px', md: '38px' }, color: LIGHT.TEXT, mb: 6 }}>
            {L.QUOTES_TITLE}
          </Typography>
        </Reveal>
        {[
          { quotes: L.QUOTES_ROW_A, reverse: false },
          { quotes: L.QUOTES_ROW_B, reverse: true },
        ].map((row, ri) => (
          <Marquee key={ri} duration={42} reverse={row.reverse} sx={{ mb: ri === 0 ? 3 : 0 }}>
            {row.quotes.map((q) => (
              <Box key={q} sx={{ mx: 1.5, px: 3.5, py: 2.5, borderRadius: '18px', border: `1px solid ${LIGHT.BORDER}`, backgroundColor: BRAND.WHITE, whiteSpace: 'nowrap', boxShadow: '0 6px 20px rgba(42,97,48,0.05)' }}>
                <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '15px', color: LIGHT.TEXT }}>“{q}”</Typography>
              </Box>
            ))}
          </Marquee>
        ))}
      </Box>

      {/* ---------- CTA + footer ---------- */}
      <Box sx={{ px: { xs: 3, md: 6 }, pb: { xs: 8, md: 10 } }}>
        <Reveal>
          <Box
            sx={{
              position: 'relative',
              maxWidth: MAX_W,
              mx: 'auto',
              borderRadius: '32px',
              backgroundColor: BRAND.GREEN,
              px: { xs: 4, md: 8 },
              py: { xs: 7, md: 9 },
              textAlign: 'center',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${GridBg})`,
                backgroundSize: '420px',
                backgroundRepeat: 'repeat',
                opacity: 0.14,
                pointerEvents: 'none',
              }}
            />
            <Typography component="h2" sx={{ position: 'relative', fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: { xs: '32px', md: '48px' }, color: BRAND.WHITE }}>
              {L.CTA_TITLE}
            </Typography>
            <Typography sx={{ position: 'relative', mt: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '17px', color: BRAND.SAGA }}>
              {L.CTA_SUBTITLE}
            </Typography>
            <Button
              onClick={() => navigate('/signup')}
              sx={{
                position: 'relative',
                mt: 4,
                backgroundColor: BRAND.LIME,
                color: BRAND.GREEN,
                fontFamily: BRAND_FONTS.TECH,
                fontWeight: 700,
                fontSize: '16px',
                textTransform: 'none',
                px: 5,
                py: 1.6,
                borderRadius: '12px',
                '&:hover': { backgroundColor: BRAND.WHITE },
              }}
            >
              {L.CTA_PRIMARY}
            </Button>
          </Box>
        </Reveal>
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: 26, opacity: 0.85 }} />
          <Typography sx={{ mt: 1.5, fontFamily: BRAND_FONTS.BODY, fontSize: '13px', color: LIGHT.MUTED }}>
            {L.FOOTER_COPYRIGHT}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Option7;
