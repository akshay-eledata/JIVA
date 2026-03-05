import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import GoogleIcon from '../../assets/Google.png';
import AppleIcon from '../../assets/Apple.png';
import { COLORS, FONTS, FONT_SIZES, FONT_WEIGHTS, LINE_HEIGHTS, SIZES, SPACING } from '../../constants/constants';
import { SIGNUP_LABELS } from './labels';
import { SIGNUP_CONSTANTS } from './constants';

import AuthLeftSide from '../../Component/AuthLeftSide/AuthLeftSide';

const Signup: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
        backgroundColor: COLORS.BACKGROUND_WHITE,
        padding: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        boxSizing: 'border-box',
        marginTop: '40px',
        marginBottom: '40px',
      }}
    >
      <AuthLeftSide />
      <Box
        sx={{
          width: '550px',
          padding: '60px 80px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          backgroundColor: COLORS.BACKGROUND_WHITE,
          minHeight: '680px',
          height: 'auto',
          flexShrink: 0,
          boxSizing: 'border-box',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{
            fontFamily: FONTS.SATOSHI,
            fontWeight: FONT_WEIGHTS.BOLD,
            fontSize: '24px',
            color: COLORS.TEXT_PRIMARY,
            marginTop: '10px',
            marginBottom: '12px',
            textAlign: 'left',
          }}
        >
          {SIGNUP_LABELS.WELCOME_TITLE}
        </Typography>

        <Box sx={{ marginBottom: '8px' }}>
          <Typography
            sx={{
              fontFamily: FONTS.SATOSHI,
              fontWeight: FONT_WEIGHTS.MEDIUM,
              fontSize: '14px',
              lineHeight: LINE_HEIGHTS.NORMAL,
              color: COLORS.TEXT_PRIMARY,
              marginBottom: '4px',
              textAlign: 'left',
            }}
          >
            {SIGNUP_LABELS.EMAIL_ID}
          </Typography>
          <TextField
            fullWidth
            placeholder={SIGNUP_LABELS.ENTER}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
                borderRadius: '8px',
                fontSize: '13px',
                '& input': {
                  padding: '0 14px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                },
                '& fieldset': {
                  borderColor: COLORS.BORDER,
                  borderWidth: '1px',
                },
              },
            }}
          />
        </Box>

        <Box sx={{ marginBottom: '8px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <Typography
              sx={{
                fontFamily: FONTS.SATOSHI,
                fontWeight: FONT_WEIGHTS.MEDIUM,
                fontSize: '14px',
                lineHeight: LINE_HEIGHTS.NORMAL,
                color: COLORS.TEXT_PRIMARY,
                textAlign: 'left',
              }}
            >
              {SIGNUP_LABELS.PASSWORD}
            </Typography>
          </Box>
          <TextField
            fullWidth
            placeholder={SIGNUP_LABELS.ENTER}
            type="password"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
                borderRadius: '8px',
                fontSize: '13px',
                '& input': {
                  padding: '0 14px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                },
                '& fieldset': {
                  borderColor: COLORS.BORDER,
                  borderWidth: '1px',
                },
              },
            }}
          />
        </Box>

        <Box sx={{ marginBottom: '8px' }}>
          <Typography
            sx={{
              fontFamily: FONTS.SATOSHI,
              fontWeight: FONT_WEIGHTS.MEDIUM,
              fontSize: '14px',
              lineHeight: LINE_HEIGHTS.NORMAL,
              color: COLORS.TEXT_PRIMARY,
              marginBottom: '4px',
              textAlign: 'left',
            }}
          >
            {SIGNUP_LABELS.PHONE_NO}
          </Typography>
          <TextField
            fullWidth
            placeholder={SIGNUP_LABELS.ENTER}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
                borderRadius: '8px',
                fontSize: '13px',
                '& input': {
                  padding: '0 14px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                },
                '& fieldset': {
                  borderColor: COLORS.BORDER,
                  borderWidth: '1px',
                },
              },
            }}
          />
        </Box>



        <Button
          fullWidth
          sx={{
            height: '40px',
            borderRadius: '8px',
            backgroundColor: COLORS.PRIMARY,
            color: COLORS.BACKGROUND_WHITE,
            fontFamily: FONTS.SATOSHI,
            fontWeight: FONT_WEIGHTS.BOLD,
            fontSize: '14px',
            lineHeight: LINE_HEIGHTS.NORMAL,
            textTransform: 'none',
            padding: '8px 16px',
            marginTop: '8px',
            '&:hover': {
              backgroundColor: COLORS.PRIMARY_HOVER,
            },
          }}
        >
          {SIGNUP_LABELS.BUTTON_TEXT}
        </Button>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '12px',
            marginBottom: '12px',
          }}
        >
          <Box
            sx={{
              flex: 1,
              height: '1px',
              backgroundColor: COLORS.BORDER,
              opacity: 0.3,
            }}
          />
          <Typography
            sx={{
              fontFamily: FONTS.SATOSHI,
              fontWeight: FONT_WEIGHTS.MEDIUM,
              fontSize: '12px',
              lineHeight: LINE_HEIGHTS.NORMAL,
              color: COLORS.TEXT_SECONDARY,
              padding: '0 12px',
            }}
          >
            {SIGNUP_LABELS.OR}
          </Typography>
          <Box
            sx={{
              flex: 1,
              height: '1px',
              backgroundColor: COLORS.BORDER,
              opacity: 0.3,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'row' }}>
          <Button
            sx={{
              flex: 1,
              height: '40px',
              borderRadius: '8px',
              backgroundColor: COLORS.BACKGROUND_WHITE,
              border: `1px solid ${COLORS.BORDER_LIGHT}`,
              padding: '8px 16px',
              gap: '12px',
              textTransform: 'none',
              fontSize: '14px',
              '&:hover': {
                backgroundColor: COLORS.BACKGROUND_GRAY,
              },
            }}
          >
            <Box
              component="img"
              src={GoogleIcon}
              alt={SIGNUP_LABELS.GOOGLE}
              sx={{ width: '24px', height: '24px' }}
            />
            <Typography
              sx={{
                fontFamily: FONTS.SATOSHI,
                fontSize: '16px',
                color: COLORS.TEXT_PRIMARY,
                fontWeight: FONT_WEIGHTS.MEDIUM,
              }}
            >
              {SIGNUP_LABELS.GOOGLE}
            </Typography>
          </Button>

          <Button
            sx={{
              flex: 1,
              height: '40px',
              borderRadius: '8px',
              backgroundColor: COLORS.BACKGROUND_WHITE,
              border: `1px solid ${COLORS.BORDER_LIGHT}`,
              padding: '8px 16px', // 8px 16px
              gap: '12px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: COLORS.BACKGROUND_GRAY,
              },
            }}
          >
            <Box
              component="img"
              src={AppleIcon}
              alt={SIGNUP_LABELS.APPLE}
              sx={{ width: '24px', height: '24px' }}
            />
            <Typography
              sx={{
                fontFamily: FONTS.SATOSHI,
                fontSize: '16px',
                color: COLORS.TEXT_PRIMARY,
                fontWeight: FONT_WEIGHTS.MEDIUM,
              }}
            >
              {SIGNUP_LABELS.APPLE}
            </Typography>
          </Button>
        </Box>

        {/* Login Link */}
        <Typography
          sx={{
            fontFamily: FONTS.SATOSHI,
            fontSize: '14px',
            color: COLORS.TEXT_PRIMARY,
            textAlign: 'center',
            marginTop: '12px',
          }}
        >
          {SIGNUP_LABELS.LOGIN_LINK}{' '}
          <Typography
            component={Link}
            to="/signin"
            sx={{
              color: COLORS.PRIMARY,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {SIGNUP_LABELS.LOGIN}
          </Typography>
        </Typography>

        <Box
          sx={{
            marginTop: 'auto',
            paddingTop: '20px',
          }}
        >
          <Typography
            sx={{
              fontFamily: FONTS.SATOSHI,
              fontWeight: FONT_WEIGHTS.MEDIUM,
              fontSize: '10px',
              lineHeight: LINE_HEIGHTS.NORMAL,
              textAlign: 'center',
              color: COLORS.TEXT_SECONDARY,
              padding: '24px',
            }}
          >
            {SIGNUP_LABELS.TERMS_TEXT}
            <br />
            <Typography
              component="span"
              sx={{
                fontFamily: FONTS.SATOSHI,
                fontWeight: FONT_WEIGHTS.MEDIUM,
                fontSize: '10px',
                lineHeight: LINE_HEIGHTS.NORMAL,
                color: COLORS.TEXT_PRIMARY,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {SIGNUP_LABELS.TERMS_LINK}
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
