import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import TickCircleIcon from '../../assets/TickCircle.png';
import { COLORS, FONTS, FONT_SIZES, FONT_WEIGHTS, LINE_HEIGHTS, SIZES, SPACING } from '../../constants/constants';
import { SUCCESS_LABELS } from './labels';
import { SUCCESS_CONSTANTS } from './constants';

const Success: React.FC = () => {
  return (
    <Box
      sx={{
        width: '600px',
        padding: '40px 120px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backgroundColor: COLORS.BACKGROUND_WHITE,
        height: '850px',
        minHeight: '850px',
        flexShrink: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Success Icon */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 'auto',
          marginBottom: '16px',
        }}
      >
        <Box
          component="img"
          src={TickCircleIcon}
          alt="Success"
          sx={{
            width: '120px',
            height: '120px',
          }}
        />
      </Box>

      {/* Account created successfully text */}
      <Typography
        sx={{
          fontFamily: FONTS.NUNITO_SANS,
          fontWeight: FONT_WEIGHTS.REGULAR,
          fontSize: '32px',
          lineHeight: LINE_HEIGHTS.NORMAL,
          letterSpacing: '0%',
          textAlign: 'center',
          color: COLORS.TEXT_PRIMARY,
          marginBottom: '8px',
          whiteSpace: 'nowrap',
        }}
      >
        {SUCCESS_LABELS.ACCOUNT_CREATED}
      </Typography>

      {/* Welcome aboard text */}
      <Typography
        sx={{
          fontFamily: FONTS.NUNITO_SANS,
          fontWeight: FONT_WEIGHTS.REGULAR,
          fontSize: '24px',
          lineHeight: LINE_HEIGHTS.NORMAL,
          letterSpacing: '0%',
          textAlign: 'center',
          color: COLORS.TEXT_SECONDARY,
          marginBottom: '32px',
        }}
      >
        {SUCCESS_LABELS.WELCOME_ABOARD}
      </Typography>

      {/* Let's Start Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '200px' }}>
        <Button
          sx={{
            width: '210px',
            height: '48px',
            borderRadius: '8px',
            backgroundColor: COLORS.PRIMARY,
            color: COLORS.BACKGROUND_WHITE,
            fontFamily: FONTS.SATOSHI,
            fontWeight: FONT_WEIGHTS.BOLD,
            fontSize: '16px',
            lineHeight: LINE_HEIGHTS.NORMAL,
            textTransform: 'none',
            padding: '10px 20px',
            gap: '8px',
            '&:hover': {
              backgroundColor: COLORS.PRIMARY_HOVER,
            },
          }}
        >
          {SUCCESS_LABELS.LETS_START}
        </Button>
      </Box>
    </Box>
  );
};

export default Success;

