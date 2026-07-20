import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import JivaLogo from '../../../../assets/jiva.svg';
import { BRAND, BRAND_FONTS } from '../../brand';
import { Reveal, KineticText, Marquee, Counter } from '../shared';
import { OPTION2_LABELS as L } from './labels';

const DARK = {
  BG: '#0C1A10',
  BG_2: '#122417',
  CARD: 'rgba(255,255,255,0.05)',
  BORDER: 'rgba(213,226,116,0.18)',
  TEXT: '#F3F9F3',
  MUTED: 'rgba(243,249,243,0.62)',
} as const;

const MAX_W = '1180px';

const lineOptions: ApexOptions = {
  chart: {
    type: 'line',
    sparkline: { enabled: true },
    animations: {
      enabled: true,
      speed: 2200,
      animateGradually: { enabled: true, delay: 120 },
    },
  },
  stroke: { curve: 'smooth', width: 3, colors: [BRAND.LIME] },
  markers: { size: 0 },
  tooltip: { enabled: false },
  grid: { show: false },
};

const lineSeries = [{ name: 'hs-CRP', data: [3.1, 2.8, 2.9, 2.4, 2.0, 2.1, 1.6, 1.4, 1.1, 1.0, 0.9, 0.8] }];

const gaugeOptions: ApexOptions = {
  chart: { type: 'radialBar', sparkline: { enabled: true } },
  plotOptions: {
    radialBar: {
      hollow: { size: '64%' },
      track: { background: 'rgba(243,249,243,0.12)' },
      dataLabels: {
        name: { show: false },
        value: {
          show: true,
          fontSize: '44px',
          fontFamily: BRAND_FONTS.TECH,
          fontWeight: 700,
          color: BRAND.LIME,
          offsetY: 8,
          formatter: () => String(L.BENTO.AGE_VALUE),
        },
      },
    },
  },
  fill: { colors: [BRAND.LIME] },
  stroke: { lineCap: 'round' },
};

const Aurora: React.FC = () => {
  const reduced = useReducedMotion();
  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <motion.div
        style={{
          position: 'absolute',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          top: '-25%',
          left: '-12%',
          background: 'radial-gradient(circle, rgba(42,97,48,0.55) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        animate={reduced ? undefined : { x: [0, 90, 0], y: [0, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: '46vw',
          height: '46vw',
          borderRadius: '50%',
          bottom: '-30%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(213,226,116,0.20) 0%, transparent 65%)',
          filter: 'blur(70px)',
        }}
        animate={reduced ? undefined : { x: [0, -70, 0], y: [0, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </Box>
  );
};

/** Pins while scroll advances the four journey steps. */
const PinnedJourney: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const railHeight = useTransform(scrollYProgress, [0, 1], ['4%', '100%']);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(3, Math.floor(v * 4));
    setActive(idx);
  });

  return (
    <Box ref={ref} sx={{ height: { xs: 'auto', md: '320vh' }, position: 'relative' }}>
      <Box
        sx={{
          position: { xs: 'static', md: 'sticky' },
          top: 0,
          minHeight: { md: '100vh' },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 8, md: 0 }, width: '100%' }}>
          <Typography
            sx={{
              fontFamily: BRAND_FONTS.TECH,
              fontSize: '13px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: BRAND.LIME,
            }}
          >
            {L.JOURNEY_EYEBROW}
          </Typography>
          <Typography
            component="h2"
            sx={{
              mt: 1,
              fontFamily: BRAND_FONTS.TECH,
              fontWeight: 700,
              fontSize: { xs: '30px', md: '42px' },
              color: DARK.TEXT,
            }}
          >
            {L.JOURNEY_TITLE}
          </Typography>

          <Box sx={{ mt: 6, display: 'flex', gap: { xs: 3, md: 8 } }}>
            {/* Progress rail (desktop) */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                width: '3px',
                borderRadius: '3px',
                backgroundColor: 'rgba(243,249,243,0.12)',
                position: 'relative',
                alignSelf: 'stretch',
              }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  borderRadius: 3,
                  background: BRAND.LIME,
                  height: railHeight,
                }}
              />
            </Box>

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 3 } }}>
              {L.JOURNEY_STEPS.map((step, i) => (
                <Box
                  key={step.num}
                  sx={{
                    display: 'flex',
                    gap: 3,
                    alignItems: 'flex-start',
                    p: 3,
                    borderRadius: '20px',
                    border: `1px solid ${i === active ? DARK.BORDER : 'transparent'}`,
                    backgroundColor: { md: i === active ? DARK.CARD : 'transparent' },
                    opacity: { md: i === active ? 1 : 0.38 },
                    transition: 'all 0.45s ease',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: BRAND_FONTS.TECH,
                      fontWeight: 700,
                      fontSize: '15px',
                      color: BRAND.LIME,
                      pt: '5px',
                    }}
                  >
                    {step.num}
                  </Typography>
                  <Box>
                    <Typography
                      sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 600, fontSize: { xs: '20px', md: '24px' }, color: DARK.TEXT }}
                    >
                      {step.title}
                    </Typography>
                    <Typography
                      sx={{ mt: 1, maxWidth: 640, fontFamily: BRAND_FONTS.BODY, fontSize: '15.5px', lineHeight: 1.65, color: DARK.MUTED }}
                    >
                      {step.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const bentoCard = {
  borderRadius: '24px',
  border: `1px solid ${DARK.BORDER}`,
  backgroundColor: DARK.CARD,
  backdropFilter: 'blur(10px)',
  p: 4,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: BRAND.LIME,
    boxShadow: '0 0 40px rgba(213,226,116,0.12)',
    transform: 'translateY(-4px)',
  },
} as const;

const Option2: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', backgroundColor: DARK.BG, overflowX: 'clip', textAlign: 'left' }}>
      {/* ---------- Hero ---------- */}
      <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Aurora />
        <Box
          sx={{
            position: 'relative',
            maxWidth: MAX_W,
            mx: 'auto',
            px: { xs: 3, md: 6 },
            py: { xs: 14, md: 10 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 7, md: 10 },
            width: '100%',
          }}
        >
          <Box sx={{ flex: 1.2, minWidth: 0 }}>
            <Reveal>
              <Box
                component="img"
                src={JivaLogo}
                alt="Jiva"
                sx={{ height: 38, mb: 5, filter: 'brightness(0) invert(1)' }}
              />
            </Reveal>
            <Reveal delay={0.08}>
              <Typography
                sx={{
                  fontFamily: BRAND_FONTS.TECH,
                  fontSize: '13px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: BRAND.LIME,
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
                fontSize: { xs: '40px', md: '60px' },
                lineHeight: 1.08,
                color: DARK.TEXT,
                letterSpacing: '-0.02em',
              }}
            >
              <KineticText text={L.HERO_TITLE} delay={0.2} />
            </Typography>
            <Reveal delay={0.7}>
              <Typography
                sx={{
                  mt: 3,
                  maxWidth: 460,
                  fontFamily: BRAND_FONTS.BODY,
                  fontSize: { xs: '16px', md: '18px' },
                  lineHeight: 1.65,
                  color: DARK.MUTED,
                }}
              >
                {L.HERO_SUBTITLE}
              </Typography>
            </Reveal>
            <Reveal delay={0.85}>
              <Box sx={{ mt: 4.5, display: 'flex', gap: 2.5, alignItems: 'center', flexWrap: 'wrap' }}>
                <Button
                  onClick={() => navigate('/intake')}
                  sx={{
                    backgroundColor: BRAND.LIME,
                    color: DARK.BG,
                    fontFamily: BRAND_FONTS.TECH,
                    fontWeight: 700,
                    fontSize: '16px',
                    textTransform: 'none',
                    px: 4.5,
                    py: 1.6,
                    borderRadius: '12px',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      backgroundColor: '#E4EF97',
                      boxShadow: '0 0 36px rgba(213,226,116,0.45)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {L.CTA_PRIMARY}
                </Button>
                <Button
                  onClick={() => navigate('/signin')}
                  sx={{
                    color: DARK.TEXT,
                    fontFamily: BRAND_FONTS.TECH,
                    fontWeight: 500,
                    fontSize: '16px',
                    textTransform: 'none',
                    px: 3.5,
                    py: 1.5,
                    borderRadius: '12px',
                    border: '1px solid rgba(243,249,243,0.25)',
                    '&:hover': { borderColor: BRAND.LIME, color: BRAND.LIME },
                  }}
                >
                  {L.CTA_SECONDARY}
                </Button>
              </Box>
            </Reveal>
          </Box>

          {/* Self-drawing chart card */}
          <Reveal delay={0.4}>
            <Box
              sx={{
                width: { xs: '100%', md: 440 },
                borderRadius: '28px',
                border: `1px solid ${DARK.BORDER}`,
                backgroundColor: 'rgba(12,26,16,0.6)',
                backdropFilter: 'blur(14px)',
                p: 4,
                boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '13.5px', color: DARK.MUTED }}>
                  {L.CHART_CHIP_LABEL}
                </Typography>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '999px',
                    backgroundColor: 'rgba(213,226,116,0.14)',
                    fontFamily: BRAND_FONTS.TECH,
                    fontWeight: 600,
                    fontSize: '12.5px',
                    color: BRAND.LIME,
                  }}
                >
                  {L.CHART_CHIP_VALUE}
                </Box>
              </Box>
              <Box sx={{ height: 180 }}>
                <Chart options={lineOptions} series={lineSeries} type="line" height="100%" width="100%" />
              </Box>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                {['Jan', 'Apr', 'Jul', 'Oct', 'Dec'].map((m) => (
                  <Typography key={m} sx={{ fontFamily: BRAND_FONTS.TECH, fontSize: '11.5px', color: 'rgba(243,249,243,0.4)' }}>
                    {m}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Reveal>
        </Box>
      </Box>

      {/* ---------- Pinned journey ---------- */}
      <Box sx={{ backgroundColor: DARK.BG_2 }}>
        <PinnedJourney />
      </Box>

      {/* ---------- Bento grid ---------- */}
      <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 9, md: 13 } }}>
        <Reveal>
          <Typography
            component="h2"
            sx={{
              fontFamily: BRAND_FONTS.TECH,
              fontWeight: 700,
              fontSize: { xs: '30px', md: '42px' },
              color: DARK.TEXT,
              mb: 6,
              maxWidth: 640,
            }}
          >
            {L.BENTO_TITLE}
          </Typography>
        </Reveal>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gridAutoRows: 'minmax(180px, auto)',
          }}
        >
          <Reveal style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
            <Box sx={{ ...bentoCard, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ width: '100%', maxWidth: 280, height: 230 }}>
                <Chart options={gaugeOptions} series={[76]} type="radialBar" height="100%" width="100%" />
              </Box>
              <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 600, fontSize: '20px', color: DARK.TEXT }}>
                {L.BENTO.AGE_LABEL}
              </Typography>
              <Typography sx={{ mt: 0.5, fontFamily: BRAND_FONTS.BODY, fontSize: '14px', color: DARK.MUTED }}>
                {L.BENTO.AGE_NOTE}
              </Typography>
            </Box>
          </Reveal>
          {[
            { title: L.BENTO.PANELS_TITLE, desc: L.BENTO.PANELS_DESC, span: 2 },
            { title: L.BENTO.PLAN_TITLE, desc: L.BENTO.PLAN_DESC, span: 1 },
            { title: L.BENTO.PHYSICIAN_TITLE, desc: L.BENTO.PHYSICIAN_DESC, span: 1 },
            { title: L.BENTO.RETEST_TITLE, desc: L.BENTO.RETEST_DESC, span: 2 },
          ].map((tile, i) => (
            <Reveal
              key={tile.title}
              delay={0.08 * (i + 1)}
              style={{ gridColumn: `span ${tile.span}` }}
            >
              <Box sx={{ ...bentoCard, height: '100%' }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: BRAND.LIME, mb: 2.5 }} />
                <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 600, fontSize: '20px', color: DARK.TEXT }}>
                  {tile.title}
                </Typography>
                <Typography sx={{ mt: 1.25, fontFamily: BRAND_FONTS.BODY, fontSize: '14.5px', lineHeight: 1.6, color: DARK.MUTED }}>
                  {tile.desc}
                </Typography>
              </Box>
            </Reveal>
          ))}
        </Box>
      </Box>

      {/* ---------- Numbers band ---------- */}
      <Box sx={{ borderTop: `1px solid ${DARK.BORDER}`, borderBottom: `1px solid ${DARK.BORDER}` }}>
        <Box
          sx={{
            maxWidth: MAX_W,
            mx: 'auto',
            px: { xs: 3, md: 6 },
            py: { xs: 7, md: 9 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 4,
            textAlign: 'center',
          }}
        >
          {L.STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <Typography
                sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: { xs: '42px', md: '60px' }, color: BRAND.LIME, lineHeight: 1 }}
              >
                <Counter value={stat.value} suffix={stat.suffix} />
              </Typography>
              <Typography sx={{ mt: 1.25, fontFamily: BRAND_FONTS.BODY, fontSize: '14.5px', color: DARK.MUTED }}>
                {stat.label}
              </Typography>
            </Reveal>
          ))}
        </Box>
      </Box>

      {/* ---------- Testimonial marquee ---------- */}
      <Box sx={{ py: { xs: 9, md: 12 } }}>
        <Reveal>
          <Typography
            component="h2"
            sx={{
              textAlign: 'center',
              fontFamily: BRAND_FONTS.TECH,
              fontWeight: 700,
              fontSize: { xs: '28px', md: '38px' },
              color: DARK.TEXT,
              mb: 6,
            }}
          >
            {L.QUOTES_TITLE}
          </Typography>
        </Reveal>
        {[
          { quotes: L.QUOTES_ROW_A, reverse: false },
          { quotes: L.QUOTES_ROW_B, reverse: true },
        ].map((row, ri) => (
          <Marquee key={ri} duration={42} reverse={row.reverse} sx={{ mb: ri === 0 ? 3 : 0 }}>
            {row.quotes.map((q) => (
              <Box
                key={q}
                sx={{
                  mx: 1.5,
                  px: 3.5,
                  py: 2.5,
                  borderRadius: '18px',
                  border: `1px solid ${DARK.BORDER}`,
                  backgroundColor: DARK.CARD,
                  whiteSpace: 'nowrap',
                }}
              >
                <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '15px', color: DARK.TEXT }}>
                  “{q}”
                </Typography>
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
              maxWidth: MAX_W,
              mx: 'auto',
              borderRadius: '32px',
              backgroundColor: BRAND.LIME,
              px: { xs: 4, md: 8 },
              py: { xs: 7, md: 9 },
              textAlign: 'center',
            }}
          >
            <Typography
              component="h2"
              sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: { xs: '32px', md: '48px' }, color: DARK.BG }}
            >
              {L.CTA_TITLE}
            </Typography>
            <Typography sx={{ mt: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '17px', color: 'rgba(12,26,16,0.75)' }}>
              {L.CTA_SUBTITLE}
            </Typography>
            <Button
              onClick={() => navigate('/intake')}
              sx={{
                mt: 4,
                backgroundColor: DARK.BG,
                color: BRAND.LIME,
                fontFamily: BRAND_FONTS.TECH,
                fontWeight: 700,
                fontSize: '16px',
                textTransform: 'none',
                px: 5,
                py: 1.6,
                borderRadius: '12px',
                '&:hover': { backgroundColor: BRAND.GREEN, color: BRAND.WHITE },
              }}
            >
              {L.CTA_PRIMARY}
            </Button>
          </Box>
        </Reveal>
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Box
            component="img"
            src={JivaLogo}
            alt="Jiva"
            sx={{ height: 26, filter: 'brightness(0) invert(1)', opacity: 0.7 }}
          />
          <Typography sx={{ mt: 1.5, fontFamily: BRAND_FONTS.BODY, fontSize: '13px', color: 'rgba(243,249,243,0.45)' }}>
            {L.FOOTER_COPYRIGHT}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Option2;
