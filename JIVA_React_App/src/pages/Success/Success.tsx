// Last screen of onboarding. Confirms the account, the payment and the lab
// visit that was just booked, then hands the user to their dashboard.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TickCircleIcon from '../../assets/TickCircle.png';
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/constants';
import { SUCCESS_LABELS } from './labels';
import { loadAppointment } from '../../onboarding/appointment';

const Success: React.FC = () => {
  const navigate = useNavigate();
  const appointment = loadAppointment();

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '620px',
        padding: { xs: '32px 20px 64px', md: '56px 32px 80px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      <Box component="img" src={TickCircleIcon} alt="Confirmed" sx={{ width: '104px', height: '104px', mb: '20px' }} />

      <Typography
        sx={{
          fontFamily: FONTS.SATOSHI,
          fontWeight: FONT_WEIGHTS.BOLD,
          fontSize: { xs: '28px', md: '34px' },
          color: COLORS.TEXT_PRIMARY,
          textAlign: 'center',
          mb: '8px',
        }}
      >
        {SUCCESS_LABELS.ACCOUNT_CREATED}
      </Typography>

      <Typography
        sx={{
          fontFamily: FONTS.SATOSHI,
          fontSize: '16px',
          color: '#667085',
          textAlign: 'center',
          mb: '32px',
        }}
      >
        {SUCCESS_LABELS.WELCOME_ABOARD}
      </Typography>

      {/* Appointment card */}
      <Box
        sx={{
          width: '100%',
          borderRadius: '16px',
          padding: '24px 26px',
          textAlign: 'left',
          mb: '24px',
          background: 'linear-gradient(135deg, #F1F8F5 0%, #FDFDF8 60%, #F1F8F5 100%)',
          border: '1px solid #D9EBE1',
        }}
      >
        <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '16px', color: '#1A212B', mb: appointment ? 2 : 1 }}>
          {SUCCESS_LABELS.APPOINTMENT_TITLE}
        </Typography>

        {appointment ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { Icon: CalendarTodayIcon, text: appointment.dateLabel },
              { Icon: AccessTimeIcon, text: appointment.time },
              { Icon: LocationOnIcon, text: `${appointment.labName}, ${appointment.labAddress}` },
            ].map(({ Icon, text }) => (
              <Box key={text} sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Icon sx={{ fontSize: '18px', color: COLORS.PRIMARY, mt: '2px' }} />
                <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '14.5px', color: '#1A212B' }}>
                  {text}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '14px', color: '#667085' }}>
            {SUCCESS_LABELS.APPOINTMENT_MISSING}
          </Typography>
        )}
      </Box>

      {/* What happens next */}
      <Box
        sx={{
          width: '100%',
          borderRadius: '16px',
          padding: '24px 26px',
          textAlign: 'left',
          mb: '32px',
          backgroundColor: '#FFFFFF',
          border: `1px solid ${COLORS.BORDER_LIGHT}`,
        }}
      >
        <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '16px', color: '#1A212B', mb: 2 }}>
          {SUCCESS_LABELS.PREP_TITLE}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(appointment
            ? [SUCCESS_LABELS.PREP_1, SUCCESS_LABELS.PREP_2, SUCCESS_LABELS.PREP_3]
            : [SUCCESS_LABELS.PREP_BOOK, SUCCESS_LABELS.PREP_2, SUCCESS_LABELS.PREP_3]
          ).map((line) => (
            <Box key={line} sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <CheckCircleIcon sx={{ fontSize: '18px', color: COLORS.PRIMARY, mt: '2px', flexShrink: 0 }} />
              <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '14.5px', color: '#667085', lineHeight: 1.5 }}>
                {line}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Button
        onClick={() => navigate('/dashboard')}
        sx={{
          minWidth: '240px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: COLORS.PRIMARY,
          color: COLORS.BACKGROUND_WHITE,
          fontFamily: FONTS.SATOSHI,
          fontWeight: FONT_WEIGHTS.BOLD,
          fontSize: '15px',
          textTransform: 'none',
          '&:hover': { backgroundColor: COLORS.PRIMARY_HOVER },
        }}
      >
        {SUCCESS_LABELS.LETS_START}
      </Button>
    </Box>
  );
};

export default Success;
