import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';
import JivaLogo from '../../../../assets/jiva.svg';
import { BRAND, BRAND_FONTS } from '../../brand';
import { Reveal, Marquee, Counter } from '../shared';
import { OPTION10_LABELS as L } from './labels';

const MAX_W = '1180px';
const DISPLAY = "'Lexend', sans-serif";

/** Types, holds, deletes, and retypes each word in turn. */
const Typewriter: React.FC<{ words: readonly string[] }> = ({ words }) => {
  const reduced = useReducedMotion();
  const [wordIndex, setWordIndex] = React.useState(0);
  const [text, setText] = React.useState(reduced ? words[0] : '');
  const [phase, setPhase] = React.useState<'typing' | 'holding' | 'deleting'>('typing');

  React.useEffect(() => {
    if (reduced) return;
    const word = words[wordIndex];
    let delay = 90;
    if (phase === 'typing') {
      if (text.length < word.length) {
        delay = 75;
      } else {
        setPhase('holding');
        return;
      }
    } else if (phase === 'holding') {
      delay = 1700;
    } else {
      delay = 42;
    }
    const id = setTimeout(() => {
      if (phase === 'typing') setText(word.slice(0, text.length + 1));
      else if (phase === 'holding') setPhase('deleting');
      else if (text.length > 0) setText(text.slice(0, -1));
      else {
        setWordIndex((i) => (i + 1) % words.length);
        setPhase('typing');
      }
    }, delay);
    return () => clearTimeout(id);
  }, [text, phase, wordIndex, words, reduced]);

  return (
    <Box component="span" sx={{ color: BRAND.GREEN }}>
      {text}
      {!reduced && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ display: 'inline-block', width: '3px', height: '0.85em', background: BRAND.LIME, marginLeft: 4, verticalAlign: '-0.05em' }}
        />
      )}
    </Box>
  );
};

/** Card with a radial glow that follows the pointer. */
const SpotlightCard: React.FC<{ title: string; desc: string }> = ({ title, desc }) => {
  const reduced = useReducedMotion();
  const px = useMotionValue(50);
  const py = useMotionValue(50);
  const glow = useTransform(
    [px, py],
    (values: number[]) =>
      `radial-gradient(340px circle at ${values[0]}% ${values[1]}%, rgba(213,226,116,0.30), transparent 65%)`,
  );

  return (
    <Box
      onPointerMove={(e) => {
        if (reduced) return;
        const rect = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - rect.left) / rect.width) * 100);
        py.set(((e.clientY - rect.top) / rect.height) * 100);
      }}
      sx={{
        position: 'relative',
        height: '100%',
        borderRadius: '22px',
        backgroundColor: BRAND.WHITE,
        border: `1px solid rgba(42,97,48,0.12)`,
        p: 3.5,
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 18px 40px rgba(42,97,48,0.12)' },
      }}
    >
      <motion.div style={{ position: 'absolute', inset: 0, background: glow, pointerEvents: 'none' }} />
      <Typography sx={{ position: 'relative', fontFamily: DISPLAY, fontWeight: 700, fontSize: '19px', color: BRAND.INK }}>
        {title}
      </Typography>
      <Typography sx={{ position: 'relative', mt: 1, fontFamily: BRAND_FONTS.BODY, fontSize: '14.5px', lineHeight: 1.6, color: BRAND.BODY_TEXT }}>
        {desc}
      </Typography>
    </Box>
  );
};

/* --- App-frame screens for the product tour --- */

const ScreenMap: React.FC = () => (
  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
    {L.TOUR_SYSTEMS.map((sys) => (
      <Box key={sys.name} sx={{ p: 2, borderRadius: '14px', backgroundColor: BRAND.DEWDROP, border: `1px solid ${BRAND.SAGA}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: '13.5px', color: BRAND.INK }}>{sys.name}</Typography>
          <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: '13px', color: sys.score >= 85 ? BRAND.GREEN : '#B98A00' }}>
            {sys.score}
          </Typography>
        </Box>
        <Box sx={{ mt: 1.25, height: 5, borderRadius: 3, backgroundColor: BRAND.SAGA, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${sys.score}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', borderRadius: 3, background: sys.score >= 85 ? BRAND.GREEN : BRAND.LIME }}
          />
        </Box>
      </Box>
    ))}
  </Box>
);

const trendOptions: ApexOptions = {
  chart: { type: 'area', sparkline: { enabled: true }, animations: { enabled: true, speed: 1400 } },
  stroke: { curve: 'smooth', width: 3, colors: [BRAND.GREEN] },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.32, opacityTo: 0.02 }, colors: [BRAND.GREEN] },
  tooltip: { enabled: false },
};

const ScreenTrend: React.FC = () => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
      <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '13px', color: BRAND.BODY_TEXT }}>hs-CRP, 18 months</Typography>
      <Box sx={{ px: 1.5, py: 0.4, borderRadius: '999px', backgroundColor: BRAND.LIME, fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: '12px', color: BRAND.GREEN }}>
        0.8 · Optimal
      </Box>
    </Box>
    <Box sx={{ height: 170 }}>
      <Chart options={trendOptions} series={[{ name: 'hs-CRP', data: [3.1, 2.7, 2.8, 2.2, 1.9, 1.5, 1.1, 0.8] }]} type="area" height="100%" width="100%" />
    </Box>
    <Box sx={{ mt: 1.5, p: 1.75, borderRadius: '12px', backgroundColor: BRAND.DEWDROP, border: `1px solid ${BRAND.SAGA}` }}>
      <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '12.5px', lineHeight: 1.5, color: BRAND.BODY_TEXT }}>
        Inflammation fell inside optimal range after month four. Keep the omega-3 protocol.
      </Typography>
    </Box>
  </Box>
);

const ScreenPlan: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
    {L.TOUR_PLAN.map((item, i) => (
      <motion.div
        key={item}
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.9, borderRadius: '13px', backgroundColor: i === 0 ? BRAND.LIME : BRAND.DEWDROP, border: `1px solid ${BRAND.SAGA}` }}>
          <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${BRAND.GREEN}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: BRAND.GREEN, fontWeight: 700, flexShrink: 0 }}>
            ✓
          </Box>
          <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontWeight: 600, fontSize: '13.5px', color: BRAND.INK }}>{item}</Typography>
        </Box>
      </motion.div>
    ))}
  </Box>
);

/** Sticky browser-style frame that swaps screens as tour steps scroll by. */
const ProductTour: React.FC = () => {
  const [active, setActive] = React.useState(0);
  const reduced = useReducedMotion();
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

  const screens = [<ScreenMap key="map" />, <ScreenTrend key="trend" />, <ScreenPlan key="plan" />];

  const frame = (
    <Box
      sx={{
        borderRadius: '22px',
        backgroundColor: BRAND.WHITE,
        border: `1px solid rgba(42,97,48,0.14)`,
        boxShadow: '0 30px 70px rgba(42,97,48,0.14)',
        overflow: 'hidden',
      }}
    >
      {/* Browser chrome */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.25, py: 1.5, backgroundColor: BRAND.SAGA }}>
        {[BRAND.GREEN, BRAND.LIME, BRAND.WHITE].map((c, i) => (
          <Box key={i} sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c, border: '1px solid rgba(42,97,48,0.2)' }} />
        ))}
        <Box sx={{ ml: 1.5, flex: 1, px: 1.75, py: 0.5, borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.7)', fontFamily: BRAND_FONTS.TECH, fontSize: '11.5px', color: BRAND.BODY_TEXT }}>
          app.jiva.health / vitality-map
        </Box>
      </Box>
      <Box sx={{ p: 2.5, minHeight: 300 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduced ? false : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {screens[active]}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 8, md: 12 } }}>
      <Reveal>
        <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: { xs: '30px', md: '44px' }, color: BRAND.INK, mb: 7 }}>
          {L.TOUR_TITLE}
        </Typography>
      </Reveal>
      <Box sx={{ display: 'flex', gap: { xs: 0, md: 9 } }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: 6, md: '36vh' }, py: { md: '4vh' } }}>
          {L.TOUR_STEPS.map((step, i) => (
            <Box key={step.id} ref={refs[i]}>
              <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 600, fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase', color: BRAND.GREEN }}>
                {step.step}
              </Typography>
              <Typography sx={{ mt: 1, fontFamily: DISPLAY, fontWeight: 700, fontSize: { xs: '25px', md: '32px' }, color: BRAND.INK }}>
                {step.title}
              </Typography>
              <Typography sx={{ mt: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '16px', lineHeight: 1.7, color: BRAND.BODY_TEXT, maxWidth: 440 }}>
                {step.desc}
              </Typography>
              <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3 }}>
                <Box sx={{ pointerEvents: 'none' }}>{i === active ? frame : null}</Box>
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' }, flex: 1.1, position: 'sticky', top: '16vh', alignSelf: 'flex-start' }}>
          {frame}
        </Box>
      </Box>
    </Box>
  );
};

/** Tabs with a sliding lime underline that swap a self-drawing chart. */
const ChartTabs: React.FC = () => {
  const [tab, setTab] = React.useState(0);
  const active = L.TABS[tab];

  return (
    <Box sx={{ backgroundColor: BRAND.WHITE, borderTop: `1px solid ${BRAND.SAGA}`, borderBottom: `1px solid ${BRAND.SAGA}`, py: { xs: 8, md: 11 } }}>
      <Box sx={{ maxWidth: '860px', mx: 'auto', px: { xs: 3, md: 6 } }}>
        <Reveal>
          <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: { xs: '28px', md: '40px' }, color: BRAND.INK, textAlign: 'center', mb: 5 }}>
            {L.TABS_TITLE}
          </Typography>
        </Reveal>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4 }}>
          {L.TABS.map((t, i) => (
            <Box
              key={t.key}
              onClick={() => setTab(i)}
              sx={{ position: 'relative', px: 3, py: 1.25, cursor: 'pointer' }}
            >
              <Typography sx={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: '16px', color: i === tab ? BRAND.INK : 'rgba(23,48,27,0.45)', transition: 'color 0.3s ease' }}>
                {t.label}
              </Typography>
              {i === tab && (
                <motion.div
                  layoutId="tab-underline"
                  style={{ position: 'absolute', left: 12, right: 12, bottom: 2, height: 4, borderRadius: 4, background: BRAND.LIME }}
                />
              )}
            </Box>
          ))}
        </Box>
        <Box sx={{ borderRadius: '24px', border: `1px solid ${BRAND.SAGA}`, backgroundColor: BRAND.DEWDROP, p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '13.5px', color: BRAND.BODY_TEXT }}>{active.unit}</Typography>
            <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 700, fontSize: '14px', color: BRAND.GREEN }}>
              ▲ {active.series[active.series.length - 1] - active.series[0]} pts
            </Typography>
          </Box>
          <Box sx={{ height: 220 }}>
            <Chart
              key={active.key}
              options={trendOptions}
              series={[{ name: active.label, data: [...active.series] }]}
              type="area"
              height="100%"
              width="100%"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const Option10: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', backgroundColor: BRAND.DEWDROP, overflowX: 'clip', textAlign: 'left' }}>
      {/* ---------- Typewriter hero ---------- */}
      <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, pt: { xs: 13, md: 17 }, pb: { xs: 8, md: 11 }, textAlign: 'center' }}>
        <Reveal>
          <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: 42, mb: 4 }} />
        </Reveal>
        <Reveal delay={0.08}>
          <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', color: BRAND.GREEN, mb: 2.5 }}>
            {L.HERO_EYEBROW}
          </Typography>
        </Reveal>
        <Reveal delay={0.15}>
          <Typography
            component="h1"
            sx={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: { xs: '42px', md: '68px' }, lineHeight: 1.08, letterSpacing: '-0.02em', color: BRAND.INK, minHeight: { xs: '2.3em', md: 'auto' } }}
          >
            {L.HERO_TITLE_PREFIX} <Typewriter words={L.HERO_ROTATING} />
          </Typography>
        </Reveal>
        <Reveal delay={0.25}>
          <Typography sx={{ mt: 3, mx: 'auto', maxWidth: 560, fontFamily: BRAND_FONTS.BODY, fontSize: { xs: '16px', md: '18px' }, lineHeight: 1.65, color: BRAND.BODY_TEXT }}>
            {L.HERO_SUBTITLE}
          </Typography>
        </Reveal>
        <Reveal delay={0.35}>
          <Box sx={{ mt: 4.5, display: 'flex', justifyContent: 'center', gap: 2.5, flexWrap: 'wrap' }}>
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
                borderRadius: '12px',
                transition: 'all 0.25s ease',
                '&:hover': { backgroundColor: BRAND.INK, transform: 'translateY(-2px)', boxShadow: '0 14px 30px rgba(42,97,48,0.25)' },
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
                borderRadius: '12px',
                '&:hover': { backgroundColor: BRAND.SAGA },
              }}
            >
              {L.CTA_SECONDARY}
            </Button>
          </Box>
        </Reveal>
      </Box>

      {/* ---------- Product tour ---------- */}
      <ProductTour />

      {/* ---------- Spotlight grid ---------- */}
      <Box sx={{ backgroundColor: BRAND.SAGA, py: { xs: 8, md: 11 } }}>
        <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 } }}>
          <Reveal>
            <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: { xs: '30px', md: '42px' }, color: BRAND.INK, textAlign: 'center', mb: 6 }}>
              {L.SPOTLIGHT_TITLE}
            </Typography>
          </Reveal>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {L.SPOTLIGHT_CARDS.map((card, i) => (
              <Reveal key={card.title} delay={(i % 3) * 0.1}>
                <SpotlightCard title={card.title} desc={card.desc} />
              </Reveal>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ---------- Chart tabs ---------- */}
      <ChartTabs />

      {/* ---------- Stats ---------- */}
      <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 8, md: 11 }, display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 4, textAlign: 'center' }}>
        {L.STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.1}>
            <Typography sx={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: { xs: '44px', md: '58px' }, color: BRAND.GREEN, lineHeight: 1 }}>
              <Counter value={stat.value} suffix={stat.suffix} />
            </Typography>
            <Typography sx={{ mt: 1, fontFamily: BRAND_FONTS.BODY, fontSize: '15px', color: BRAND.BODY_TEXT }}>
              {stat.label}
            </Typography>
          </Reveal>
        ))}
      </Box>

      {/* ---------- Quote marquee ---------- */}
      <Box sx={{ pb: { xs: 8, md: 11 } }}>
        <Marquee duration={40}>
          {L.QUOTES.map((q) => (
            <Box key={q} sx={{ mx: 1.5, px: 3.5, py: 2.25, borderRadius: '18px', border: `1px solid rgba(42,97,48,0.12)`, backgroundColor: BRAND.WHITE, whiteSpace: 'nowrap', boxShadow: '0 6px 18px rgba(42,97,48,0.05)' }}>
              <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '15px', color: BRAND.INK }}>“{q}”</Typography>
            </Box>
          ))}
        </Marquee>
      </Box>

      {/* ---------- CTA + footer ---------- */}
      <Box sx={{ px: { xs: 3, md: 6 }, pb: { xs: 8, md: 10 } }}>
        <Reveal>
          <Box sx={{ maxWidth: MAX_W, mx: 'auto', borderRadius: '32px', backgroundColor: BRAND.GREEN, px: { xs: 4, md: 8 }, py: { xs: 7, md: 9 }, textAlign: 'center' }}>
            <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: { xs: '30px', md: '46px' }, color: BRAND.WHITE }}>
              {L.CTA_TITLE}
            </Typography>
            <Typography sx={{ mt: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '17px', color: BRAND.SAGA }}>
              {L.CTA_SUBTITLE}
            </Typography>
            <Button
              onClick={() => navigate('/signup')}
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
                borderRadius: '12px',
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

export default Option10;
