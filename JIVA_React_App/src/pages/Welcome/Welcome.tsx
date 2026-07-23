import React from 'react';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSearchParams } from 'react-router-dom';
import { BRAND, BRAND_FONTS } from './brand';
import { WELCOME_SWITCHER_LABELS as L } from './labels';
import Option1 from './options/option1/Option1';
import Option2 from './options/option2/Option2';
import Option3 from './options/option3/Option3';
import Option4 from './options/option4/Option4';
import Option5 from './options/option5/Option5';
import Option6 from './options/option6/Option6';
import Option7 from './options/option7/Option7';
import Option8 from './options/option8/Option8';
import Option9 from './options/option9/Option9';
import Option10 from './options/option10/Option10';
import Option11 from './options/option11/Option11';
import Option12 from './options/option12/Option12';
import Option13 from './options/option13/Option13';

const VIEWS = {
  1: Option1, 2: Option2, 3: Option3, 4: Option4, 5: Option5,
  6: Option6, 7: Option7, 8: Option8, 9: Option9, 10: Option10,
  11: Option11, 12: Option12, 13: Option13,
} as const;

type OptionNumber = keyof typeof VIEWS;

const OPTIONS = Object.keys(VIEWS).map(Number) as OptionNumber[];

/** The design we have settled on. Landing on `/` with no query shows this. */
const LIVE_OPTION: OptionNumber = 5;

/**
 * Homepage, with the design explorations kept behind a switcher.
 *
 * Option 5 is the chosen homepage and the default anyone lands on. The other
 * twelve are explorations kept for review and are not wired up beyond their
 * sign up and sign in buttons. A non live design is held in the ?option= query
 * param so it can be shared by URL, while the live design stays on the clean
 * `/` URL. See Data/frontend-plan.md for the design rationale.
 *
 * The switcher itself is a review tool. Remove it before launch.
 */
const Welcome: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const parsed = Number(searchParams.get('option'));
  const option: OptionNumber = OPTIONS.includes(parsed as OptionNumber)
    ? (parsed as OptionNumber)
    : LIVE_OPTION;

  const selectOption = (n: OptionNumber) => {
    // The live design is the canonical homepage, so it carries no query string.
    setSearchParams(n === LIVE_OPTION ? {} : { option: String(n) });
    setAnchorEl(null);
    window.scrollTo({ top: 0 });
  };

  const Active = VIEWS[option];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Pinned to the right edge at mid height: reachable during a walkthrough
          without sitting over the hero the way the old top bar did. Designs run
          light and dark, so the control carries its own contrast. */}
      <Box
        component="button"
        aria-label={L.ARIA_LABEL}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl)}
        onClick={(e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
        sx={{
          position: 'fixed',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          pl: 2,
          pr: 1.5,
          py: 1.25,
          cursor: 'pointer',
          borderRadius: '999px 0 0 999px',
          border: '1px solid rgba(243,249,243,0.22)',
          borderRight: 'none',
          // No backdrop-filter: it composites badly over the GSAP pinned heroes
          // in some designs, and the background is opaque enough without it.
          backgroundColor: 'rgba(23,48,27,0.94)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.28)',
          fontFamily: BRAND_FONTS.BODY,
          fontWeight: 600,
          fontSize: '13px',
          color: BRAND.LIME,
          opacity: anchorEl ? 1 : 0.72,
          transition: 'opacity 0.2s ease, padding-left 0.2s ease',
          '&:hover, &:focus-visible': { opacity: 1, pl: 2.5 },
        }}
      >
        {L.TRIGGER_PREFIX} {option}
        <KeyboardArrowDownIcon sx={{ fontSize: '18px' }} />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
        transformOrigin={{ vertical: 'center', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mr: 1.5,
              minWidth: '210px',
              maxHeight: '70vh',
              borderRadius: '14px',
              border: '1px solid rgba(243,249,243,0.14)',
              backgroundColor: 'rgba(23,48,27,0.97)',
              color: BRAND.DEWDROP,
            },
          },
        }}
      >
        <Typography
          sx={{
            px: 2,
            pt: 1,
            pb: 1.25,
            fontFamily: BRAND_FONTS.BODY,
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(243,249,243,0.55)',
          }}
        >
          {L.MENU_TITLE}
        </Typography>

        {OPTIONS.map((n) => {
          const active = n === option;
          return (
            <MenuItem
              key={n}
              selected={active}
              onClick={() => selectOption(n)}
              sx={{
                mx: 1,
                my: 0.25,
                borderRadius: '8px',
                gap: 1,
                fontFamily: BRAND_FONTS.BODY,
                fontSize: '14px',
                fontWeight: active ? 600 : 400,
                color: active ? BRAND.INK : 'rgba(243,249,243,0.88)',
                backgroundColor: active ? BRAND.LIME : 'transparent',
                '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: BRAND.LIME },
                '&:hover': { backgroundColor: active ? BRAND.LIME : 'rgba(255,255,255,0.1)' },
              }}
            >
              <Box sx={{ flex: 1 }}>
                {L.TRIGGER_PREFIX} {n}
              </Box>
              {n === LIVE_OPTION && (
                <Box
                  sx={{
                    px: 0.9,
                    py: 0.2,
                    borderRadius: '999px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: active ? BRAND.INK : BRAND.LIME,
                    border: `1px solid ${active ? 'rgba(23,48,27,0.35)' : 'rgba(213,226,116,0.45)'}`,
                  }}
                >
                  {L.LIVE_TAG}
                </Box>
              )}
            </MenuItem>
          );
        })}
      </Menu>

      <Active />
    </Box>
  );
};

export default Welcome;
