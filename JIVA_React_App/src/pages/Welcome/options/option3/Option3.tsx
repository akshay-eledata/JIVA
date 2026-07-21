import React from 'react';
import { Box, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import JivaLogo from '../../../../assets/jiva.svg';
import AIImg1 from '../../../../assets/AI img(1).svg';
import AIImg2 from '../../../../assets/AI img(2).svg';
import AIImg3 from '../../../../assets/AI img(3).svg';
import { BRAND, BRAND_FONTS } from '../../brand';
import { Reveal, KineticText } from '../shared';
import { OPTION3_LABELS as L } from './labels';

const PAPER = '#FAFBF7';
const MAX_W = '1120px';

const EDITORIAL = "'Alegreya Sans', sans-serif";

/** Lime underline that draws itself on when scrolled into view. */
const DrawnUnderline: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reduced = useReducedMotion();
  return (
    <Box component="span" sx={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' }}>
      {children}
      <motion.span
        initial={reduced ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '0.04em',
          height: '0.18em',
          background: BRAND.LIME,
          borderRadius: 4,
          transformOrigin: 'left center',
          zIndex: -1,
        }}
      />
    </Box>
  );
};

/** Sticky chapter rail; the visible chapter card drives the highlighted nav item. */
const CareChapters: React.FC = () => {
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
          sx={{
            fontFamily: BRAND_FONTS.BODY,
            fontSize: '13px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: BRAND.GREEN,
            mb: 5,
          }}
        >
          {L.CHAPTERS_KICKER}
        </Typography>
      </Reveal>
      <Box sx={{ display: 'flex', gap: { xs: 0, md: 10 } }}>
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            width: 220,
            position: 'sticky',
            top: 140,
            alignSelf: 'flex-start',
          }}
        >
          {L.CHAPTERS.map((ch, i) => (
            <Typography
              key={ch.id}
              sx={{
                py: 1.25,
                fontFamily: EDITORIAL,
                fontWeight: i === active ? 900 : 300,
                fontSize: '20px',
                color: i === active ? BRAND.GREEN : 'rgba(23,48,27,0.4)',
                borderLeft: `3px solid ${i === active ? BRAND.LIME : 'transparent'}`,
                pl: 2,
                transition: 'all 0.35s ease',
              }}
            >
              {ch.nav}
            </Typography>
          ))}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: 5, md: 14 } }}>
          {L.CHAPTERS.map((ch, i) => (
            <Box key={ch.id} ref={refs[i]}>
              <Reveal>
                <Box
                  sx={{
                    p: { xs: 4, md: 6 },
                    borderRadius: '28px',
                    backgroundColor: i % 2 === 0 ? BRAND.SAGA : BRAND.WHITE,
                    border: i % 2 === 0 ? 'none' : `1px solid ${BRAND.SAGA}`,
                  }}
                >
                  <Typography
                    sx={{ fontFamily: EDITORIAL, fontWeight: 900, fontSize: { xs: '26px', md: '34px' }, color: BRAND.INK, lineHeight: 1.2 }}
                  >
                    {ch.title}
                  </Typography>
                  <Typography
                    sx={{ mt: 2.5, fontFamily: BRAND_FONTS.BODY, fontSize: '16.5px', lineHeight: 1.75, color: BRAND.BODY_TEXT, maxWidth: 560 }}
                  >
                    {ch.desc}
                  </Typography>
                </Box>
              </Reveal>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const QuoteCarousel: React.FC = () => {
  const [[index, direction], setIndex] = React.useState<[number, number]>([0, 0]);
  const reduced = useReducedMotion();
  const quote = L.QUOTES[index];

  const paginate = (dir: number) => {
    setIndex(([i]) => [(i + dir + L.QUOTES.length) % L.QUOTES.length, dir]);
  };

  return (
    <Box sx={{ backgroundColor: BRAND.SAGA, py: { xs: 9, md: 13 } }}>
      <Box sx={{ maxWidth: '880px', mx: 'auto', px: { xs: 3, md: 6 }, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', minHeight: { xs: 300, md: 260 } }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={reduced ? false : { opacity: 0, x: direction >= 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: direction >= 0 ? -60 : 60 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              drag={reduced ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) paginate(1);
                else if (info.offset.x > 80) paginate(-1);
              }}
              style={{ cursor: 'grab' }}
            >
              <Typography sx={{ fontFamily: EDITORIAL, fontWeight: 300, fontSize: { xs: '26px', md: '38px' }, lineHeight: 1.35, color: BRAND.INK }}>
                “{quote.quote}”
              </Typography>
              <Typography sx={{ mt: 4, fontFamily: BRAND_FONTS.BODY, fontWeight: 700, fontSize: '15px', color: BRAND.GREEN }}>
                {quote.name}
              </Typography>
              <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '13.5px', color: BRAND.BODY_TEXT }}>
                {quote.role}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Box>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          {[
            { icon: <ArrowBackIcon fontSize="small" />, dir: -1, label: 'Previous quote' },
            { icon: <ArrowForwardIcon fontSize="small" />, dir: 1, label: 'Next quote' },
          ].map((btn) => (
            <Button
              key={btn.dir}
              aria-label={btn.label}
              onClick={() => paginate(btn.dir)}
              sx={{
                minWidth: 0,
                width: 46,
                height: 46,
                borderRadius: '50%',
                border: `1.5px solid ${BRAND.GREEN}`,
                color: BRAND.GREEN,
                '&:hover': { backgroundColor: BRAND.GREEN, color: BRAND.WHITE },
              }}
            >
              {btn.icon}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const Option3: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const reduced = useReducedMotion();

  return (
    <Box sx={{ width: '100%', backgroundColor: PAPER, overflowX: 'clip', textAlign: 'left' }}>
      {/* ---------- Editorial hero ---------- */}
      <Box ref={heroRef} sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, pt: { xs: 12, md: 15 }, pb: { xs: 8, md: 12 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 7, md: 10 }, alignItems: 'center' }}>
          <Box sx={{ flex: 1.15, minWidth: 0 }}>
            <Reveal>
              <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: 38, mb: 5 }} />
            </Reveal>
            <Reveal delay={0.1}>
              <Typography
                sx={{
                  fontFamily: BRAND_FONTS.BODY,
                  fontSize: '13px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: BRAND.GREEN,
                  mb: 2.5,
                }}
              >
                {L.HERO_KICKER}
              </Typography>
            </Reveal>
            <Reveal delay={0.18}>
              <Typography
                component="h1"
                sx={{
                  fontFamily: EDITORIAL,
                  fontWeight: 300,
                  fontSize: { xs: '40px', md: '58px' },
                  lineHeight: 1.12,
                  color: BRAND.INK,
                }}
              >
                {L.HERO_TITLE_LIGHT}{' '}
                <Box component="span" sx={{ fontWeight: 900, display: 'block' }}>
                  <DrawnUnderline>{L.HERO_TITLE_STRONG}</DrawnUnderline>
                </Box>
              </Typography>
            </Reveal>
            <Reveal delay={0.3}>
              <Typography
                sx={{
                  mt: 3.5,
                  maxWidth: 470,
                  fontFamily: BRAND_FONTS.BODY,
                  fontSize: { xs: '16px', md: '17.5px' },
                  lineHeight: 1.75,
                  color: BRAND.BODY_TEXT,
                }}
              >
                {L.HERO_MANIFESTO}
              </Typography>
            </Reveal>
            <Reveal delay={0.4}>
              <Box sx={{ mt: 4.5, display: 'flex', gap: 2.5, alignItems: 'center', flexWrap: 'wrap' }}>
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
                    '&:hover': { backgroundColor: BRAND.INK, transform: 'translateY(-2px)' },
                    transition: 'all 0.25s ease',
                  }}
                >
                  {L.CTA_PRIMARY}
                </Button>
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

          {/* Arched portrait collage with parallax */}
          <Reveal delay={0.25}>
            <Box sx={{ position: 'relative', width: { xs: 280, md: 380 } }}>
              <motion.div style={reduced ? undefined : { y: imgY }}>
                <Box
                  sx={{
                    borderRadius: '190px 190px 28px 28px',
                    overflow: 'hidden',
                    backgroundColor: BRAND.SAGA,
                    height: { xs: 380, md: 500 },
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                >
                  <Box component="img" src={AIImg1} alt="Jiva physician" sx={{ width: '92%', display: 'block' }} />
                </Box>
              </motion.div>
              <motion.div
                style={{ position: 'absolute', bottom: -28, left: -44 }}
                animate={reduced ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Box
                  sx={{
                    width: 108,
                    height: 108,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `5px solid ${PAPER}`,
                    backgroundColor: BRAND.LIME,
                    boxShadow: '0 16px 36px rgba(42,97,48,0.18)',
                  }}
                >
                  <Box component="img" src={AIImg2} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              </motion.div>
              <motion.div
                style={{ position: 'absolute', top: 48, right: -48 }}
                animate={reduced ? undefined : { y: [0, -12, 0] }}
                transition={{ duration: 6.5, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Box
                  sx={{
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: `5px solid ${PAPER}`,
                    backgroundColor: BRAND.SAGA,
                    boxShadow: '0 16px 36px rgba(42,97,48,0.18)',
                  }}
                >
                  <Box component="img" src={AIImg3} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              </motion.div>
            </Box>
          </Reveal>
        </Box>
      </Box>

      {/* ---------- Manifesto line ---------- */}
      <Box sx={{ backgroundColor: BRAND.WHITE, borderTop: `1px solid ${BRAND.SAGA}`, borderBottom: `1px solid ${BRAND.SAGA}`, py: { xs: 8, md: 11 } }}>
        <Typography
          sx={{
            maxWidth: '900px',
            mx: 'auto',
            px: { xs: 3, md: 6 },
            textAlign: 'center',
            fontFamily: EDITORIAL,
            fontWeight: 300,
            fontSize: { xs: '30px', md: '48px' },
            lineHeight: 1.25,
            color: BRAND.GREEN,
          }}
        >
          <KineticText text={L.MANIFESTO_LINE} stagger={0.14} />
        </Typography>
      </Box>

      {/* ---------- Sticky care chapters ---------- */}
      <CareChapters />

      {/* ---------- Services bento ---------- */}
      <Box sx={{ maxWidth: MAX_W, mx: 'auto', px: { xs: 3, md: 6 }, pb: { xs: 9, md: 13 } }}>
        <Reveal>
          <Typography
            component="h2"
            sx={{ fontFamily: EDITORIAL, fontWeight: 900, fontSize: { xs: '30px', md: '40px' }, color: BRAND.INK, mb: 5 }}
          >
            {L.SERVICES_TITLE}
          </Typography>
        </Reveal>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {L.SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <Box
                sx={{
                  height: '100%',
                  p: 4,
                  borderRadius: '24px',
                  backgroundColor: i % 2 === 0 ? BRAND.SAGA : BRAND.DEWDROP,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 18px 40px rgba(42,97,48,0.12)' },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: `2px solid ${BRAND.GREEN}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: EDITORIAL,
                    fontWeight: 900,
                    color: BRAND.GREEN,
                    mb: 2.5,
                  }}
                >
                  {i + 1}
                </Box>
                <Typography sx={{ fontFamily: EDITORIAL, fontWeight: 900, fontSize: '21px', color: BRAND.INK }}>
                  {s.title}
                </Typography>
                <Typography sx={{ mt: 1, fontFamily: BRAND_FONTS.BODY, fontSize: '14.5px', lineHeight: 1.6, color: BRAND.BODY_TEXT }}>
                  {s.desc}
                </Typography>
              </Box>
            </Reveal>
          ))}
        </Box>
      </Box>

      {/* ---------- Pull-quote carousel ---------- */}
      <QuoteCarousel />

      {/* ---------- FAQ ---------- */}
      <Box sx={{ maxWidth: '840px', mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 9, md: 12 } }}>
        <Reveal>
          <Typography
            component="h2"
            sx={{ fontFamily: EDITORIAL, fontWeight: 900, fontSize: { xs: '30px', md: '40px' }, color: BRAND.INK, mb: 5, textAlign: 'center' }}
          >
            {L.FAQ_TITLE}
          </Typography>
        </Reveal>
        {L.FAQS.map((faq, i) => (
          <Reveal key={faq.q} delay={i * 0.08}>
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                backgroundColor: 'transparent',
                borderBottom: `1px solid ${BRAND.SAGA}`,
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: BRAND.GREEN }} />} sx={{ py: 1 }}>
                <Typography sx={{ fontFamily: EDITORIAL, fontWeight: 700, fontSize: '19px', color: BRAND.INK }}>
                  {faq.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pb: 3 }}>
                <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '15.5px', lineHeight: 1.7, color: BRAND.BODY_TEXT }}>
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Reveal>
        ))}
      </Box>

      {/* ---------- Arched CTA ---------- */}
      <Box sx={{ px: { xs: 3, md: 6 }, pb: { xs: 9, md: 12 } }}>
        <Reveal>
          <Box
            sx={{
              maxWidth: '900px',
              mx: 'auto',
              borderRadius: { xs: '120px 120px 28px 28px', md: '220px 220px 32px 32px' },
              backgroundColor: BRAND.GREEN,
              px: { xs: 4, md: 10 },
              pt: { xs: 10, md: 13 },
              pb: { xs: 7, md: 9 },
              textAlign: 'center',
            }}
          >
            <Typography
              component="h2"
              sx={{ fontFamily: EDITORIAL, fontWeight: 300, fontSize: { xs: '30px', md: '44px' }, lineHeight: 1.2, color: BRAND.WHITE }}
            >
              {L.CTA_TITLE}
            </Typography>
            <Typography sx={{ mt: 2.5, fontFamily: BRAND_FONTS.BODY, fontSize: '16px', color: BRAND.SAGA }}>
              {L.CTA_SUBTITLE}
            </Typography>
            <Button
              onClick={() => navigate('/signup')}
              sx={{
                mt: 4.5,
                backgroundColor: BRAND.LIME,
                color: BRAND.GREEN,
                fontFamily: BRAND_FONTS.BODY,
                fontWeight: 700,
                fontSize: '16px',
                textTransform: 'none',
                px: 5,
                py: 1.6,
                borderRadius: '999px',
                '&:hover': { backgroundColor: BRAND.WHITE, transform: 'translateY(-2px)' },
                transition: 'all 0.25s ease',
              }}
            >
              {L.CTA_PRIMARY}
            </Button>
          </Box>
        </Reveal>
      </Box>

      {/* ---------- Footer ---------- */}
      <Box sx={{ borderTop: `1px solid ${BRAND.SAGA}`, py: 5, textAlign: 'center' }}>
        <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: 28, opacity: 0.85 }} />
        <Typography sx={{ mt: 1.5, fontFamily: BRAND_FONTS.BODY, fontSize: '13px', color: BRAND.BODY_TEXT }}>
          {L.FOOTER_COPYRIGHT}
        </Typography>
      </Box>
    </Box>
  );
};

export default Option3;
