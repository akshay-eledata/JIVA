// Optional two factor step. Only reached when someone gave a phone number on
// the signup screen and asked us to use it for two factor authentication.
// No SMS provider is connected yet, so the backend accepts any six digit code.

import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Alert, Snackbar } from '@mui/material';
import PhonelinkLockIcon from '@mui/icons-material/PhonelinkLock';
import AuthLeftSide from '../../Component/AuthLeftSide/AuthLeftSide';
import DemoSkip from '../../Component/DemoSkip/DemoSkip';
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/constants';
import { VERIFY_PHONE_LABELS as L } from './labels';
import { nextStepAfter } from '../../onboarding/steps';
import { apiUrl } from '../../config';

const NEXT = nextStepAfter('/verify-phone');
const DIGITS = 6;

const VerifyPhone: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = (location.state as any)?.phone as string | undefined;

  const [code, setCode] = useState<string[]>(Array(DIGITS).fill(''));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [resent, setResent] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      setCode((prev) => prev.map((d, i) => (i === index ? '' : d)));
      return;
    }
    // Handles both single keystrokes and a pasted code.
    setCode((prev) => {
      const next = [...prev];
      for (let i = 0; i < digits.length && index + i < DIGITS; i += 1) {
        next[index + i] = digits[i];
      }
      return next;
    });
    const landing = Math.min(index + digits.length, DIGITS - 1);
    inputs.current[landing]?.focus();
  };

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const submit = async () => {
    const joined = code.join('');
    if (joined.length < DIGITS) {
      setError(L.ERROR_LENGTH);
      return;
    }
    setError('');
    setBusy(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(apiUrl('/api/auth/verify-phone'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ code: joined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'We could not confirm that code.');
      }
      navigate(NEXT);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
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
            backgroundColor: COLORS.BACKGROUND_WHITE,
            minHeight: '680px',
            flexShrink: 0,
            boxSizing: 'border-box',
            textAlign: 'left',
          }}
        >
          <Box
            sx={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'rgba(0, 96, 69, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: '20px',
            }}
          >
            <PhonelinkLockIcon sx={{ fontSize: '28px', color: COLORS.PRIMARY }} />
          </Box>

          <Typography
            sx={{
              fontFamily: FONTS.SATOSHI,
              fontWeight: FONT_WEIGHTS.BOLD,
              fontSize: '24px',
              color: COLORS.TEXT_PRIMARY,
              mb: '8px',
            }}
          >
            {L.TITLE}
          </Typography>

          <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '14px', color: COLORS.TEXT_SECONDARY, mb: '4px' }}>
            {phone ? `${L.SUBTITLE} ${phone}.` : L.SUBTITLE_FALLBACK}
          </Typography>
          <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '13px', color: COLORS.TEXT_SECONDARY, mb: '24px' }}>
            {L.HELPER}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: '16px', borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: '10px', mb: '18px' }}>
            {code.map((digit, i) => (
              <Box
                key={i}
                component="input"
                ref={(el: HTMLInputElement | null) => {
                  inputs.current[i] = el;
                }}
                value={digit}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={DIGITS}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDigit(i, e.target.value)}
                onKeyDown={handleKeyDown(i)}
                sx={{
                  width: '56px',
                  height: '62px',
                  textAlign: 'center',
                  fontFamily: FONTS.SATOSHI,
                  fontSize: '24px',
                  fontWeight: FONT_WEIGHTS.BOLD,
                  color: COLORS.TEXT_PRIMARY,
                  border: `1.5px solid ${digit ? COLORS.PRIMARY : COLORS.BORDER_LIGHT}`,
                  borderRadius: '12px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  transition: 'border-color 0.15s ease',
                  '&:focus': { borderColor: COLORS.PRIMARY, boxShadow: '0 0 0 3px rgba(0, 96, 69, 0.12)' },
                }}
              />
            ))}
          </Box>

          <Box
            sx={{
              backgroundColor: 'rgba(0, 96, 69, 0.05)',
              border: '1px solid rgba(0, 96, 69, 0.15)',
              borderRadius: '10px',
              padding: '10px 14px',
              mb: '24px',
            }}
          >
            <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '13px', color: COLORS.PRIMARY }}>
              {L.DEMO_HINT}
            </Typography>
          </Box>

          <Button
            fullWidth
            onClick={submit}
            disabled={busy}
            sx={{
              height: '44px',
              borderRadius: '8px',
              backgroundColor: COLORS.PRIMARY,
              color: COLORS.BACKGROUND_WHITE,
              fontFamily: FONTS.SATOSHI,
              fontWeight: FONT_WEIGHTS.BOLD,
              fontSize: '15px',
              textTransform: 'none',
              '&:hover': { backgroundColor: COLORS.PRIMARY_HOVER },
            }}
          >
            {busy ? L.BUTTON_BUSY : L.BUTTON}
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '16px' }}>
            <Typography
              onClick={() => setResent(true)}
              sx={{
                fontFamily: FONTS.SATOSHI,
                fontSize: '13px',
                fontWeight: FONT_WEIGHTS.BOLD,
                color: COLORS.PRIMARY,
                cursor: 'pointer',
              }}
            >
              {L.RESEND}
            </Typography>
            <Typography
              onClick={() => navigate(NEXT)}
              sx={{
                fontFamily: FONTS.SATOSHI,
                fontSize: '13px',
                color: COLORS.TEXT_SECONDARY,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {L.SKIP}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={resent}
        autoHideDuration={2500}
        onClose={() => setResent(false)}
        message={L.RESENT}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />

      <DemoSkip to={NEXT} label="Skip verification" />
    </>
  );
};

export default VerifyPhone;
