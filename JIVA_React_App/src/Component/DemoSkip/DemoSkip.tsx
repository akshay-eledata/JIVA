// Demo-only escape hatch.
//
// While we are walking people through the product, every onboarding screen
// needs to be reachable without filling anything in. This pill sits in the
// bottom right corner and jumps straight to the next step in the flow.
// Remove it (or gate it behind an env flag) before a real launch.

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { FONTS, FONT_WEIGHTS } from '../../constants/constants';

interface DemoSkipProps {
  /** Route to jump to. */
  to: string;
  /** Overrides the default wording, e.g. "Skip payment". */
  label?: string;
  /**
   * Runs before navigating. Use it when the next screens need some state to
   * exist, such as the throwaway account the signup screen creates.
   */
  beforeSkip?: () => Promise<void> | void;
  /** Lift the pill clear of a page's own sticky footer. */
  bottomOffset?: string;
}

const DemoSkip: React.FC<DemoSkipProps> = ({
  to,
  label = 'Skip this step',
  beforeSkip,
  bottomOffset = '28px',
}) => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (beforeSkip) await beforeSkip();
    } catch {
      // A demo skip should never dead-end the walkthrough, so move on either way.
    } finally {
      setBusy(false);
      navigate(to);
    }
  };

  return (
    <Box
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
      sx={{
        position: 'fixed',
        right: { xs: '16px', md: '28px' },
        bottom: { xs: bottomOffset, md: bottomOffset },
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px',
        borderRadius: '999px',
        cursor: busy ? 'default' : 'pointer',
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0, 96, 69, 0.25)',
        boxShadow: '0 6px 20px rgba(26, 33, 43, 0.12)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 10px 26px rgba(26, 33, 43, 0.16)',
        },
      }}
    >
      <Box
        sx={{
          fontFamily: FONTS.SATOSHI,
          fontSize: '10px',
          fontWeight: FONT_WEIGHTS.BOLD,
          letterSpacing: '1px',
          color: '#006045',
          backgroundColor: 'rgba(0, 96, 69, 0.08)',
          borderRadius: '6px',
          padding: '3px 7px',
        }}
      >
        DEMO
      </Box>
      <Typography
        sx={{
          fontFamily: FONTS.SATOSHI,
          fontSize: '13px',
          fontWeight: FONT_WEIGHTS.BOLD,
          color: '#1A212B',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>
      {busy ? (
        <CircularProgress size={14} sx={{ color: '#006045' }} />
      ) : (
        <ArrowForwardIcon sx={{ fontSize: '16px', color: '#006045' }} />
      )}
    </Box>
  );
};

export default DemoSkip;
