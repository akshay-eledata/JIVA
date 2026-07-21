import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import JivaLogo from '../../../../assets/jiva.svg';
import { BRAND, BRAND_FONTS } from '../../brand';
import {
  Reveal,
  Marquee,
  Floating,
  Counter,
  BODY_SYSTEMS,
  BIOMARKER_TICKER,
} from '../shared';
import { OPTION6_LABELS as L } from './labels';

const MAX_W = '1180px';

const gaugeOptions: ApexOptions = {
  chart: { type: 'radialBar', sparkline: { enabled: true } },
  plotOptions: {
    radialBar: {
      hollow: { size: '68%' },
      track: { background: BRAND.SAGA },
      dataLabels: {
        name: {
          show: true,
          fontSize: '13px',
          fontFamily: BRAND_FONTS.BODY,
          color: BRAND.BODY_TEXT,
          offsetY: 26,
        },
        value: {
          show: true,
          fontSize: '52px',
          fontFamily: BRAND_FONTS.DISPLAY,
          fontWeight: 800,
          color: BRAND.GREEN,
          offsetY: -14,
          formatter: () => String(L.GAUGE_VALUE),
        },
      },
    },
  },
  fill: { colors: [BRAND.GREEN] },
  stroke: { lineCap: 'round' },
  labels: [L.GAUGE_LABEL],
};

const heroChips = [
  { text: 'hs-CRP · Optimal', top: '6%', left: '-6%', delay: 0 },
  { text: 'Vitamin D · 52 ng/mL', top: '20%', right: '-10%', delay: 1.2 },
  { text: 'HbA1c · 5.1%', bottom: '18%', left: '-10%', delay: 0.6 },
  { text: 'ApoB · 68 mg/dL', bottom: '4%', right: '-4%', delay: 1.8 },
] as const;

const Option6: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', backgroundColor: BRAND.DEWDROP, overflowX: 'clip', textAlign: 'left' }}>
      {/* ---------- Hero ---------- */}
      <Box
        sx={{
          maxWidth: MAX_W,
          mx: 'auto',
          px: { xs: 3, md: 6 },
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 10 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: { xs: 6, md: 10 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Reveal>
            <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: 40, mb: 4 }} />
          </Reveal>
          <Reveal delay={0.1}>
            <Typography
              component="h1"
              sx={{
                fontFamily: BRAND_FONTS.DISPLAY,
                fontWeight: 800,
                fontSize: { xs: '42px', md: '62px' },
                lineHeight: 1.05,
                color: BRAND.INK,
              }}
            >
              {L.HERO_TITLE_1}
              <br />
              <Box
                component="span"
                sx={{
                  color: BRAND.GREEN,
                  backgroundImage: `linear-gradient(transparent 68%, ${BRAND.LIME} 68%)`,
                }}
              >
                {L.HERO_TITLE_HIGHLIGHT}
              </Box>
            </Typography>
          </Reveal>
          <Reveal delay={0.2}>
            <Typography
              sx={{
                mt: 3,
                maxWidth: 480,
                fontFamily: BRAND_FONTS.BODY,
                fontSize: { xs: '16px', md: '18px' },
                lineHeight: 1.65,
                color: BRAND.BODY_TEXT,
              }}
            >
              {L.HERO_SUBTITLE}
            </Typography>
          </Reveal>
          <Reveal delay={0.3}>
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
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
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    backgroundColor: BRAND.INK,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 24px rgba(42,97,48,0.25)',
                  },
                }}
              >
                {L.CTA_PRIMARY}
              </Button>
              <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '15px', color: BRAND.BODY_TEXT }}>
                {L.CTA_SIGNIN_PROMPT}{' '}
                <Box
                  component="span"
                  onClick={() => navigate('/signin')}
                  sx={{
                    color: BRAND.GREEN,
                    fontWeight: 700,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {L.CTA_SIGNIN}
                </Box>
              </Typography>
            </Box>
          </Reveal>
        </Box>

        {/* Gauge + floating chips */}
        <Reveal delay={0.25}>
          <Box sx={{ position: 'relative', width: { xs: 300, md: 400 }, mx: 'auto' }}>
            <Box
              sx={{
                position: 'absolute',
                inset: { xs: -28, md: -40 },
                borderRadius: '50%',
                border: `1.5px dashed rgba(42,97,48,0.25)`,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: { xs: -56, md: -80 },
                borderRadius: '50%',
                border: `1px solid rgba(42,97,48,0.12)`,
              }}
            />
            <Box
              sx={{
                borderRadius: '50%',
                backgroundColor: BRAND.WHITE,
                boxShadow: '0 24px 60px rgba(42,97,48,0.14)',
                p: { xs: 2, md: 3 },
                aspectRatio: '1 / 1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ height: { xs: 240, md: 320 } }}>
                <Chart options={gaugeOptions} series={[76]} type="radialBar" height="100%" width="100%" />
              </Box>
              <Typography
                sx={{
                  textAlign: 'center',
                  mt: -2,
                  pb: 2,
                  fontFamily: BRAND_FONTS.BODY,
                  fontSize: '13px',
                  color: BRAND.BODY_TEXT,
                }}
              >
                {L.GAUGE_CHRONO}
              </Typography>
            </Box>
            {heroChips.map((chip) => (
              <Floating
                key={chip.text}
                delay={chip.delay}
                style={{
                  position: 'absolute',
                  top: 'top' in chip ? chip.top : undefined,
                  bottom: 'bottom' in chip ? chip.bottom : undefined,
                  left: 'left' in chip ? chip.left : undefined,
                  right: 'right' in chip ? chip.right : undefined,
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${BRAND.SAGA}`,
                    boxShadow: '0 8px 20px rgba(42,97,48,0.12)',
                    fontFamily: BRAND_FONTS.BODY,
                    fontSize: '13px',
                    fontWeight: 600,
                    color: BRAND.GREEN,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chip.text}
                </Box>
              </Floating>
            ))}
          </Box>
        </Reveal>
      </Box>

      {/* ---------- Biomarker marquee ---------- */}
      <Box sx={{ borderTop: `1px solid ${BRAND.SAGA}`, borderBottom: `1px solid ${BRAND.SAGA}`, py: 2.5 }}>
        <Marquee duration={36}>
          {BIOMARKER_TICKER.map((m) => (
            <Typography
              key={m}
              sx={{
                px: 3,
                fontFamily: BRAND_FONTS.TECH,
                fontSize: '15px',
                fontWeight: 500,
                color: BRAND.GREEN,
                whiteSpace: 'nowrap',
                '&::after': { content: '"·"', pl: 6, color: BRAND.LIME },
              }}
            >
              {m}
            </Typography>
          ))}
        </Marquee>
      </Box>

      {/* ---------- How it works ---------- */}
      <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 8, md: 12 } }}>
        <Reveal>
          <Typography
            component="h2"
            sx={{
              fontFamily: BRAND_FONTS.DISPLAY,
              fontWeight: 800,
              fontSize: { xs: '32px', md: '44px' },
              color: BRAND.INK,
              textAlign: 'center',
            }}
          >
            {L.HOW_TITLE}
          </Typography>
          <Typography
            sx={{
              mt: 1.5,
              textAlign: 'center',
              fontFamily: BRAND_FONTS.BODY,
              fontSize: '17px',
              color: BRAND.BODY_TEXT,
            }}
          >
            {L.HOW_SUBTITLE}
          </Typography>
        </Reveal>
        <Box
          sx={{
            mt: 6,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {L.STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.12}>
              <Box
                sx={{
                  height: '100%',
                  p: 3.5,
                  borderRadius: '24px',
                  backgroundColor: BRAND.WHITE,
                  border: `1px solid ${BRAND.SAGA}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 18px 40px rgba(42,97,48,0.14)',
                    borderColor: BRAND.LIME,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    backgroundColor: i === 3 ? BRAND.LIME : BRAND.SAGA,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: BRAND_FONTS.DISPLAY,
                    fontWeight: 800,
                    fontSize: '18px',
                    color: BRAND.GREEN,
                  }}
                >
                  {i + 1}
                </Box>
                <Typography
                  sx={{
                    mt: 2.5,
                    fontFamily: BRAND_FONTS.DISPLAY,
                    fontWeight: 800,
                    fontSize: '22px',
                    color: BRAND.INK,
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  sx={{
                    mt: 1,
                    fontFamily: BRAND_FONTS.BODY,
                    fontSize: '14.5px',
                    lineHeight: 1.6,
                    color: BRAND.BODY_TEXT,
                  }}
                >
                  {step.desc}
                </Typography>
              </Box>
            </Reveal>
          ))}
        </Box>
      </Box>

      {/* ---------- Body systems ---------- */}
      <Box sx={{ backgroundColor: BRAND.SAGA, py: { xs: 8, md: 11 } }}>
        <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 } }}>
          <Reveal>
            <Typography
              component="h2"
              sx={{
                fontFamily: BRAND_FONTS.DISPLAY,
                fontWeight: 800,
                fontSize: { xs: '30px', md: '40px' },
                color: BRAND.INK,
                textAlign: 'center',
              }}
            >
              {L.SYSTEMS_TITLE}
            </Typography>
            <Typography
              sx={{
                mt: 1.5,
                mx: 'auto',
                maxWidth: 560,
                textAlign: 'center',
                fontFamily: BRAND_FONTS.BODY,
                fontSize: '16px',
                color: BRAND.BODY_TEXT,
              }}
            >
              {L.SYSTEMS_SUBTITLE}
            </Typography>
          </Reveal>
          <Box sx={{ mt: 5, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            {BODY_SYSTEMS.map((system, i) => (
              <Reveal key={system} delay={i * 0.06} y={16}>
                <Box
                  sx={{
                    px: 3.5,
                    py: 1.75,
                    borderRadius: '999px',
                    backgroundColor: BRAND.WHITE,
                    fontFamily: BRAND_FONTS.TECH,
                    fontWeight: 500,
                    fontSize: '16px',
                    color: BRAND.GREEN,
                    cursor: 'default',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      backgroundColor: BRAND.GREEN,
                      color: BRAND.WHITE,
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  {system}
                </Box>
              </Reveal>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ---------- Stats band ---------- */}
      <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 7, md: 10 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 4,
            textAlign: 'center',
          }}
        >
          {L.STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <Typography
                sx={{
                  fontFamily: BRAND_FONTS.DISPLAY,
                  fontWeight: 800,
                  fontSize: { xs: '44px', md: '58px' },
                  color: BRAND.GREEN,
                  lineHeight: 1,
                }}
              >
                <Counter value={stat.value} suffix={stat.suffix} />
              </Typography>
              <Typography sx={{ mt: 1, fontFamily: BRAND_FONTS.BODY, fontSize: '15px', color: BRAND.BODY_TEXT }}>
                {stat.label}
              </Typography>
            </Reveal>
          ))}
        </Box>
      </Box>

      {/* ---------- Testimonials ---------- */}
      <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, pb: { xs: 8, md: 12 } }}>
        <Reveal>
          <Typography
            component="h2"
            sx={{
              fontFamily: BRAND_FONTS.DISPLAY,
              fontWeight: 800,
              fontSize: { xs: '30px', md: '40px' },
              color: BRAND.INK,
              textAlign: 'center',
            }}
          >
            {L.TESTIMONIALS_TITLE}
          </Typography>
          <Typography
            sx={{ mt: 1.5, textAlign: 'center', fontFamily: BRAND_FONTS.BODY, fontSize: '16px', color: BRAND.BODY_TEXT }}
          >
            {L.TESTIMONIALS_SUBTITLE}
          </Typography>
        </Reveal>
        <Box
          sx={{
            mt: 6,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {L.TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.12}>
              <Box
                sx={{
                  height: '100%',
                  p: 4,
                  borderRadius: '24px',
                  backgroundColor: BRAND.WHITE,
                  border: `1px solid ${BRAND.SAGA}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 18px 40px rgba(42,97,48,0.12)' },
                }}
              >
                <Box
                  sx={{
                    alignSelf: 'flex-start',
                    px: 1.75,
                    py: 0.5,
                    borderRadius: '999px',
                    backgroundColor: BRAND.LIME,
                    fontFamily: BRAND_FONTS.BODY,
                    fontWeight: 700,
                    fontSize: '13px',
                    color: BRAND.GREEN,
                  }}
                >
                  ★ {L.RATING}
                </Box>
                <Typography
                  sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '15.5px', lineHeight: 1.65, color: BRAND.INK, flex: 1 }}
                >
                  “{t.quote}”
                </Typography>
                <Box>
                  <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontWeight: 700, fontSize: '14px', color: BRAND.GREEN }}>
                    {t.name}
                  </Typography>
                  <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '13px', color: BRAND.BODY_TEXT }}>
                    {t.role}
                  </Typography>
                </Box>
              </Box>
            </Reveal>
          ))}
        </Box>
      </Box>

      {/* ---------- CTA banner + footer ---------- */}
      <Box sx={{ backgroundColor: BRAND.GREEN }}>
        <Box
          sx={{
            maxWidth: MAX_W,
            mx: 'auto',
            px: { xs: 3, md: 6 },
            py: { xs: 8, md: 10 },
            textAlign: 'center',
          }}
        >
          <Reveal>
            <Typography
              component="h2"
              sx={{
                fontFamily: BRAND_FONTS.DISPLAY,
                fontWeight: 800,
                fontSize: { xs: '32px', md: '46px' },
                color: BRAND.WHITE,
              }}
            >
              {L.CTA_BANNER_TITLE}
            </Typography>
            <Typography sx={{ mt: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '17px', color: BRAND.SAGA }}>
              {L.CTA_BANNER_SUBTITLE}
            </Typography>
            <Button
              onClick={() => navigate('/signup')}
              sx={{
                mt: 4,
                backgroundColor: BRAND.LIME,
                color: BRAND.GREEN,
                fontFamily: BRAND_FONTS.BODY,
                fontWeight: 700,
                fontSize: '16px',
                textTransform: 'none',
                px: 5,
                py: 1.6,
                borderRadius: '999px',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: BRAND.WHITE,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {L.CTA_PRIMARY}
            </Button>
          </Reveal>
        </Box>
        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.18)',
            py: 3.5,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '13.5px', color: 'rgba(255,255,255,0.75)' }}>
            {L.FOOTER_COPYRIGHT}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Option6;
