import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import GoogleIcon from '../../assets/Google.png';
import AppleIcon from '../../assets/Apple.png';
import { COLORS, FONTS, FONT_SIZES, FONT_WEIGHTS, LINE_HEIGHTS, SIZES, SPACING } from '../../constants/constants';
import { SIGNIN_LABELS } from './labels';
import { SIGNIN_CONSTANTS } from './constants';
import { apiUrl } from '../../config';

import AuthLeftSide from '../../Component/AuthLeftSide/AuthLeftSide';

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed.');
      }
      // Smart redirection based on role
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/select-packages');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

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
        marginTop: '40px', // Center vertically roughly
        marginBottom: '40px',
      }}
    >
      <AuthLeftSide />
      <Box
        sx={{
          width: '550px',
          padding: '80px 80px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: COLORS.BACKGROUND_WHITE,
          minHeight: '680px',
          height: 'auto',
          flexShrink: 0,
          boxSizing: 'border-box',
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
          {SIGNIN_LABELS.WELCOME_TITLE}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <Box sx={{ marginBottom: '12px' }}>
          <Typography
            sx={{
              fontFamily: FONTS.SATOSHI,
              fontWeight: FONT_WEIGHTS.MEDIUM,
              fontSize: '16px',
              lineHeight: LINE_HEIGHTS.NORMAL,
              color: COLORS.TEXT_PRIMARY,
              marginBottom: '8px',
              textAlign: 'left',
            }}
          >
            {SIGNIN_LABELS.EMAIL_ID}
          </Typography>
          <TextField
            fullWidth
            placeholder={SIGNIN_LABELS.ENTER}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <Box sx={{ marginBottom: '12px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIGNIN_CONSTANTS.LABEL_MARGIN_BOTTOM }}>
            <Typography
              sx={{
                fontFamily: FONTS.SATOSHI,
                fontWeight: FONT_WEIGHTS.MEDIUM,
                fontSize: '16px',
                lineHeight: LINE_HEIGHTS.NORMAL,
                color: COLORS.TEXT_PRIMARY,
                textAlign: 'left',
              }}
            >
              {SIGNIN_LABELS.PASSWORD}
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.SATOSHI,
                fontWeight: FONT_WEIGHTS.REGULAR,
                fontSize: '12px',
                lineHeight: LINE_HEIGHTS.NORMAL,
                color: COLORS.TEXT_SECONDARY,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {SIGNIN_LABELS.FORGOT_PASSWORD}
            </Typography>
          </Box>
          <TextField
            fullWidth
            placeholder={SIGNIN_LABELS.ENTER}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          onClick={handleSignin}
          disabled={loading}
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
            marginTop: '4px',
            '&:hover': {
              backgroundColor: COLORS.PRIMARY_HOVER,
            },
          }}
        >
          {loading ? 'Signing in...' : SIGNIN_LABELS.BUTTON_TEXT}
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
            {SIGNIN_LABELS.OR}
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
              alt={SIGNIN_LABELS.GOOGLE}
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
              {SIGNIN_LABELS.GOOGLE}
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
              alt={SIGNIN_LABELS.APPLE}
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
              {SIGNIN_LABELS.APPLE}
            </Typography>
          </Button>
        </Box>

        <Typography
          sx={{
            fontFamily: FONTS.SATOSHI,
            fontSize: '14px',
            color: COLORS.TEXT_PRIMARY,
            textAlign: 'center',
            marginTop: '32px',
          }}
        >
          {SIGNIN_LABELS.SIGN_UP_LINK}{' '}
          <Typography
            component={Link}
            to="/signup"
            sx={{
              color: COLORS.PRIMARY,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {SIGNIN_LABELS.SIGN_UP}
          </Typography>
        </Typography>

        <Box
          sx={{
            marginTop: 'auto',
            paddingTop: '40px',
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
            }}
          >
            {SIGNIN_LABELS.TERMS_TEXT}
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
              {SIGNIN_LABELS.TERMS_LINK}
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Signin;
