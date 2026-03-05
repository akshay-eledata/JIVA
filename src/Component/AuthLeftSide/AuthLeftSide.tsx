import React from 'react';
import { Box, Typography } from '@mui/material';
import LogInLeftImage from '../../assets/LogInLeft.png';
import { FONTS, FONT_WEIGHTS } from '../../constants/constants';
import { AUTH_LEFT_LABELS } from './labels';
import { AUTH_LEFT_CONSTANTS } from './constants';

const AuthLeftSide: React.FC = () => {
  return (
    <Box
      sx={{
        width: AUTH_LEFT_CONSTANTS.CONTAINER_WIDTH,
        height: 'auto',
        minHeight: AUTH_LEFT_CONSTANTS.CONTAINER_MIN_HEIGHT,
        backgroundImage: `url(${LogInLeftImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: AUTH_LEFT_CONSTANTS.CONTAINER_PADDING,
        boxSizing: 'border-box',
        flexShrink: 0,
        overflow: 'visible',
        borderRadius: AUTH_LEFT_CONSTANTS.CONTAINER_BORDER_RADIUS,
      }}
    >
      <Box
        sx={{
          width: '550px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Poltawski Nowy, serif',
            fontWeight: FONT_WEIGHTS.MEDIUM,
            fontSize: '64px',
            lineHeight: '76px',
            color: AUTH_LEFT_CONSTANTS.TEXT_COLOR,
            textAlign: 'center',
            width: '550px',
            marginLeft: '-65px',
          }}
        >
          {AUTH_LEFT_LABELS.TOP_TEXT_LINE1}
          <br />
          {AUTH_LEFT_LABELS.TOP_TEXT_LINE2}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: AUTH_LEFT_CONSTANTS.BOTTOM_SECTION_GAP,
        }}
      >
        <Typography
          sx={{
            fontFamily: FONTS.SATOSHI,
            fontWeight: FONT_WEIGHTS.BOLD,
            fontSize: '40px',
            lineHeight: '40px',
            color: AUTH_LEFT_CONSTANTS.TEXT_COLOR,
            textAlign: 'center',
            width: '550px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {AUTH_LEFT_LABELS.COLLABORATION_TEXT}
        </Typography>

        <Typography
          sx={{
            fontFamily: FONTS.NUNITO_SANS,
            fontWeight: FONT_WEIGHTS.REGULAR,
            fontSize: '24px',
            lineHeight: '24px',
            color: AUTH_LEFT_CONSTANTS.TEXT_COLOR,
            textAlign: 'center',
            width: '550px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {AUTH_LEFT_LABELS.DESCRIPTION_LINE1}
          <br />
          {AUTH_LEFT_LABELS.DESCRIPTION_LINE2}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: AUTH_LEFT_CONSTANTS.PAGINATION_GAP,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: AUTH_LEFT_CONSTANTS.PAGINATION_MARGIN_TOP,
          }}
        >
          <Box
            sx={{
              width: AUTH_LEFT_CONSTANTS.ACTIVE_INDICATOR_WIDTH,
              height: AUTH_LEFT_CONSTANTS.ACTIVE_INDICATOR_HEIGHT,
              borderRadius: AUTH_LEFT_CONSTANTS.ACTIVE_INDICATOR_BORDER_RADIUS,
              backgroundColor: AUTH_LEFT_CONSTANTS.TEXT_COLOR,
            }}
          />
          <Box
            sx={{
              width: AUTH_LEFT_CONSTANTS.INACTIVE_INDICATOR_SIZE,
              height: AUTH_LEFT_CONSTANTS.INACTIVE_INDICATOR_SIZE,
              borderRadius: '50%',
              backgroundColor: AUTH_LEFT_CONSTANTS.INACTIVE_INDICATOR_COLOR,
            }}
          />
          <Box
            sx={{
              width: AUTH_LEFT_CONSTANTS.INACTIVE_INDICATOR_SIZE,
              height: AUTH_LEFT_CONSTANTS.INACTIVE_INDICATOR_SIZE,
              borderRadius: '50%',
              backgroundColor: AUTH_LEFT_CONSTANTS.INACTIVE_INDICATOR_COLOR,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AuthLeftSide;