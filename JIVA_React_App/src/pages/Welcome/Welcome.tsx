import React from 'react';
import { Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { BRAND, BRAND_FONTS } from './brand';
import Option1 from './options/option1/Option1';
import Option2 from './options/option2/Option2';
import Option3 from './options/option3/Option3';
import Option4 from './options/option4/Option4';
import Option5 from './options/option5/Option5';
import Option6 from './options/option6/Option6';
import Option7 from './options/option7/Option7';

const OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const;
type OptionNumber = (typeof OPTIONS)[number];

/**
 * Homepage design showcase behind a fixed switcher.
 *
 * Option 1 is the live homepage and the default anyone lands on. Options 2
 * through 7 are design explorations, kept around for review; they are not
 * wired up beyond their sign up and sign in buttons. The active option lives
 * in the ?option= query param so a specific design can be shared by URL. See
 * Data/frontend-plan.md for the design rationale.
 */
const Welcome: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const parsed = Number(searchParams.get('option'));
  const option: OptionNumber = OPTIONS.includes(parsed as OptionNumber) ? (parsed as OptionNumber) : 1;

  const selectOption = (n: OptionNumber) => {
    setSearchParams({ option: String(n) });
    window.scrollTo({ top: 0 });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
          display: 'flex',
          gap: 0.5,
          p: 0.5,
          maxWidth: 'calc(100vw - 24px)',
          overflowX: 'auto',
          borderRadius: '999px',
          backgroundColor: 'rgba(23,48,27,0.82)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        }}
      >
        {OPTIONS.map((n) => (
          <Box
            key={n}
            component="button"
            onClick={() => selectOption(n)}
            sx={{
              border: 'none',
              cursor: 'pointer',
              px: { xs: 2, md: 2.75 },
              py: 1,
              borderRadius: '999px',
              fontFamily: BRAND_FONTS.BODY,
              fontWeight: 600,
              fontSize: { xs: '13px', md: '14px' },
              whiteSpace: 'nowrap',
              backgroundColor: option === n ? BRAND.LIME : 'transparent',
              color: option === n ? BRAND.INK : 'rgba(243,249,243,0.85)',
              transition: 'all 0.25s ease',
              '&:hover': {
                backgroundColor: option === n ? BRAND.LIME : 'rgba(255,255,255,0.12)',
              },
            }}
          >
            Option {n}
          </Box>
        ))}
      </Box>

      {option === 1 && <Option1 />}
      {option === 2 && <Option2 />}
      {option === 3 && <Option3 />}
      {option === 4 && <Option4 />}
      {option === 5 && <Option5 />}
      {option === 6 && <Option6 />}
      {option === 7 && <Option7 />}
    </Box>
  );
};

export default Welcome;
