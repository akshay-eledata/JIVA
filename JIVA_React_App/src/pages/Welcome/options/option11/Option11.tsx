import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import JivaLogo from '../../../../assets/jiva.svg';
import { BRAND, BRAND_FONTS } from '../../brand';
import { OPTION11_LABELS as L } from './labels';

gsap.registerPlugin(ScrollTrigger);

const DARK = {
  BG: '#0A1710',
  BG_2: '#10221610',
  CARD: 'rgba(255,255,255,0.05)',
  BORDER: 'rgba(213,226,116,0.20)',
  TEXT: '#F3F9F3',
  MUTED: 'rgba(243,249,243,0.62)',
} as const;

const DISPLAY = "'Lexend', sans-serif";

/**
 * "Sequence": a GSAP + ScrollTrigger scroll-film. Every scene is scrubbed by
 * the scrollbar: the title card scales down, the four acts travel sideways,
 * the biological age rewinds, and the reviews stack up.
 */
const Option11: React.FC = () => {
  const navigate = useNavigate();
  const root = React.useRef<HTMLDivElement>(null);
  const magnetRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // --- Scene 1: title card scales from 9x to 1x, tagline chars cascade in.
      gsap.fromTo(
        '.seq-title',
        { scale: 9, opacity: 0.25 },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.seq-hero', start: 'top top', end: '+=160%', scrub: 0.6, pin: true },
        },
      );
      gsap.from('.seq-char', {
        yPercent: 120,
        opacity: 0,
        stagger: 0.02,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.seq-hero', start: 'top top', end: '+=160%', toggleActions: 'play none none reverse' },
      });

      // --- Scene 2: horizontal act strip.
      const track = document.querySelector('.seq-track');
      if (track) {
        gsap.to('.seq-track', {
          xPercent: -75,
          ease: 'none',
          scrollTrigger: { trigger: '.seq-acts', start: 'top top', end: '+=300%', scrub: 0.5, pin: true },
        });
      }

      // --- Scene 3: biological-age countdown scrubbed by scroll.
      const counter = { value: L.COUNTDOWN_FROM };
      const numEl = document.querySelector('.seq-count');
      const ringEl = document.querySelector<HTMLElement>('.seq-ring');
      gsap.to(counter, {
        value: L.COUNTDOWN_TO,
        ease: 'none',
        scrollTrigger: { trigger: '.seq-countdown', start: 'top top', end: '+=180%', scrub: 0.4, pin: true },
        onUpdate: () => {
          if (numEl) numEl.textContent = String(Math.round(counter.value));
          if (ringEl) {
            const p = (L.COUNTDOWN_FROM - counter.value) / (L.COUNTDOWN_FROM - L.COUNTDOWN_TO);
            ringEl.style.background = `conic-gradient(${'#D5E274'} ${p * 360}deg, rgba(243,249,243,0.10) 0deg)`;
          }
        },
      });

      // --- Scene 4: card stack — each earlier card recedes as the next arrives.
      const cards = gsap.utils.toArray<HTMLElement>('.seq-card');
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card, {
          scale: 0.9,
          opacity: 0.45,
          ease: 'none',
          scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 25%', scrub: true },
        });
      });

    }, root);

    // --- Magnetic CTA (outside the context so its cleanup runs with the effect's).
    let removeMove: (() => void) | undefined;
    const magnet = magnetRef.current;
    if (magnet) {
      const qx = gsap.quickTo(magnet, 'x', { duration: 0.35, ease: 'power3.out' });
      const qy = gsap.quickTo(magnet, 'y', { duration: 0.35, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = magnet.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        if (Math.hypot(dx, dy) < 180) {
          qx(dx * 0.3);
          qy(dy * 0.3);
        } else {
          qx(0);
          qy(0);
        }
      };
      window.addEventListener('pointermove', move);
      removeMove = () => window.removeEventListener('pointermove', move);
    }

    return () => {
      removeMove?.();
      ctx.revert();
    };
  }, []);

  const taglineChars = L.TITLE_TAGLINE.split('').map((ch, i) => (
    <Box key={i} component="span" className="seq-char" sx={{ display: 'inline-block', whiteSpace: 'pre' }}>
      {ch}
    </Box>
  ));

  return (
    <Box ref={root} sx={{ width: '100%', backgroundColor: DARK.BG, overflowX: 'clip', textAlign: 'left' }}>
      {/* ---------- Scene 1: title card ---------- */}
      <Box className="seq-hero" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'clip' }}>
        <Box sx={{ position: 'absolute', top: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: 34, filter: 'brightness(0) invert(1)', opacity: 0.9, mt: 6 }} />
        </Box>
        <Box sx={{ textAlign: 'center', px: 3 }}>
          <Typography
            className="seq-title"
            sx={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: { xs: '18vw', md: '11vw' },
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: DARK.TEXT,
              willChange: 'transform',
            }}
          >
            {L.TITLE_WORD}
            <Box component="span" sx={{ color: BRAND.LIME }}>.</Box>
          </Typography>
          <Typography sx={{ mt: 3, fontFamily: BRAND_FONTS.BODY, fontSize: { xs: '16px', md: '20px' }, color: DARK.MUTED, overflow: 'hidden' }}>
            {taglineChars}
          </Typography>
          <Typography sx={{ mt: 1.5, fontFamily: BRAND_FONTS.TECH, fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', color: BRAND.LIME }}>
            {L.HERO_SUB}
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              onClick={() => navigate('/signup')}
              sx={{ backgroundColor: BRAND.LIME, color: DARK.BG, fontFamily: DISPLAY, fontWeight: 700, fontSize: '15px', textTransform: 'none', px: 4, py: 1.4, borderRadius: '12px', '&:hover': { backgroundColor: '#E4EF97' } }}
            >
              {L.CTA_PRIMARY}
            </Button>
            <Button
              onClick={() => navigate('/signin')}
              sx={{ color: DARK.TEXT, border: '1px solid rgba(243,249,243,0.25)', fontFamily: DISPLAY, fontWeight: 500, fontSize: '15px', textTransform: 'none', px: 3, py: 1.3, borderRadius: '12px', '&:hover': { borderColor: BRAND.LIME, color: BRAND.LIME } }}
            >
              {L.CTA_SECONDARY}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ---------- Scene 2: horizontal acts ---------- */}
      <Box className="seq-acts" sx={{ height: '100vh', overflow: 'clip', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography sx={{ px: { xs: 3, md: 8 }, mb: 4, fontFamily: BRAND_FONTS.TECH, fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', color: BRAND.LIME }}>
          {L.ACTS_KICKER}
        </Typography>
        <Box className="seq-track" sx={{ display: 'flex', width: '400%', willChange: 'transform' }}>
          {L.ACTS.map((act) => (
            <Box key={act.num} sx={{ width: '100vw', flexShrink: 0, px: { xs: 3, md: 12 }, display: 'flex', alignItems: 'center', gap: { xs: 3, md: 8 } }}>
              <Typography sx={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: { xs: '18vw', md: '13vw' }, lineHeight: 1, color: 'transparent', WebkitTextStroke: `2px ${BRAND.LIME}`, opacity: 0.85, flexShrink: 0 }}>
                {act.title}
              </Typography>
              <Box sx={{ maxWidth: 380 }}>
                <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontWeight: 600, fontSize: '14px', letterSpacing: '0.18em', textTransform: 'uppercase', color: BRAND.LIME }}>
                  {act.num}
                </Typography>
                <Typography sx={{ mt: 1.5, fontFamily: BRAND_FONTS.BODY, fontSize: { xs: '15.5px', md: '17px' }, lineHeight: 1.7, color: DARK.MUTED }}>
                  {act.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ---------- Scene 3: scrubbed countdown ---------- */}
      <Box className="seq-countdown" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
        <Typography sx={{ fontFamily: BRAND_FONTS.TECH, fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', color: BRAND.LIME }}>
          {L.COUNTDOWN_KICKER}
        </Typography>
        <Box
          className="seq-ring"
          sx={{
            width: { xs: 260, md: 340 },
            height: { xs: 260, md: 340 },
            borderRadius: '50%',
            background: 'conic-gradient(rgba(243,249,243,0.10) 0deg, rgba(243,249,243,0.10) 360deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: '10px',
          }}
        >
          <Box sx={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: DARK.BG, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography className="seq-count" sx={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: { xs: '84px', md: '120px' }, lineHeight: 1, color: DARK.TEXT }}>
              {L.COUNTDOWN_FROM}
            </Typography>
            <Typography sx={{ fontFamily: BRAND_FONTS.BODY, fontSize: '14px', color: DARK.MUTED }}>{L.COUNTDOWN_LABEL}</Typography>
          </Box>
        </Box>
        <Typography sx={{ maxWidth: 480, textAlign: 'center', px: 3, fontFamily: BRAND_FONTS.BODY, fontSize: '15px', lineHeight: 1.65, color: DARK.MUTED }}>
          {L.COUNTDOWN_NOTE}
        </Typography>
      </Box>

      {/* ---------- Scene 4: card stack ---------- */}
      <Box sx={{ maxWidth: '760px', mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 8, md: 12 } }}>
        <Typography sx={{ mb: 6, fontFamily: BRAND_FONTS.TECH, fontSize: '13px', letterSpacing: '0.22em', textTransform: 'uppercase', color: BRAND.LIME }}>
          {L.STACK_KICKER}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18vh' }}>
          {L.STACK_CARDS.map((card, i) => (
            <Box
              key={card.name}
              className="seq-card"
              sx={{
                position: 'sticky',
                top: `${14 + i * 5}vh`,
                borderRadius: '26px',
                border: `1px solid ${DARK.BORDER}`,
                backgroundColor: '#132619',
                p: { xs: 4, md: 6 },
                boxShadow: '0 -18px 50px rgba(0,0,0,0.35)',
                willChange: 'transform',
              }}
            >
              <Typography sx={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: { xs: '22px', md: '30px' }, lineHeight: 1.35, color: DARK.TEXT }}>
                “{card.quote}”
              </Typography>
              <Typography sx={{ mt: 3, fontFamily: BRAND_FONTS.TECH, fontWeight: 600, fontSize: '14px', color: BRAND.LIME }}>
                {card.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ---------- CTA + footer ---------- */}
      <Box sx={{ py: { xs: 10, md: 14 }, textAlign: 'center', px: 3 }}>
        <Typography component="h2" sx={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: { xs: '34px', md: '54px' }, color: DARK.TEXT }}>
          {L.CTA_TITLE}
        </Typography>
        <Typography sx={{ mt: 2, fontFamily: BRAND_FONTS.BODY, fontSize: '16.5px', color: DARK.MUTED }}>
          {L.CTA_SUB}
        </Typography>
        <Box ref={magnetRef} sx={{ display: 'inline-block', mt: 5 }}>
          <Button
            onClick={() => navigate('/signup')}
            sx={{
              backgroundColor: BRAND.LIME,
              color: DARK.BG,
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: '17px',
              textTransform: 'none',
              px: 6,
              py: 1.9,
              borderRadius: '999px',
              boxShadow: '0 0 50px rgba(213,226,116,0.35)',
              '&:hover': { backgroundColor: '#E4EF97' },
            }}
          >
            {L.CTA_PRIMARY}
          </Button>
        </Box>
        <Box sx={{ mt: 10 }}>
          <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: 24, filter: 'brightness(0) invert(1)', opacity: 0.65 }} />
          <Typography sx={{ mt: 1.5, fontFamily: BRAND_FONTS.BODY, fontSize: '13px', color: 'rgba(243,249,243,0.4)' }}>
            {L.FOOTER_COPYRIGHT}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Option11;
