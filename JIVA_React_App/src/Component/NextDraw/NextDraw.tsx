// The retest loop made visible (F1).
//
// One card, four states, driven by /api/me/appointments/retest-status:
//   booked   a draw is on the calendar, so count down to it
//   due      the cadence has elapsed, so prompt to rebook
//   waiting  a draw has happened but the next one is not due yet
//   none     nothing drawn yet, so prompt to book a baseline
//
// The card renders nothing until the status resolves, so the dashboard does not
// flash a "book your first visit" prompt at somebody who already has one booked.

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/constants';
import { fetchRetestStatus, RetestStatus } from '../../onboarding/appointment';
import { NEXT_DRAW_LABELS as L, fill } from './labels';

const GREEN = COLORS.PRIMARY;
const FONT = FONTS.SATOSHI;
const BOOK_RETEST = '/schedule-labs?retest=1';

/** yyyy-mm-dd rendered without the timezone shift a bare Date parse would add. */
const longDate = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
};

const shortDate = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
};

const countdown = (days: number | null): string => {
  if (days == null) return '';
  if (days <= 0) return L.BOOKED_TODAY;
  if (days === 1) return L.BOOKED_TOMORROW;
  return fill(L.BOOKED_IN_DAYS, { n: days });
};

interface NextDrawProps {
  /**
   * Fires once the status resolves, reporting whether this card took over the
   * "book a draw" job. The dashboard uses it to stand down its own static
   * scheduling block rather than telling somebody to book a visit they already
   * have on the calendar.
   */
  onResolved?: (rendered: boolean) => void;
}

const NextDraw: React.FC<NextDrawProps> = ({ onResolved }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<RetestStatus | null>(null);

  useEffect(() => {
    let live = true;
    fetchRetestStatus().then((s) => {
      if (!live) return;
      setStatus(s);
      onResolved?.(Boolean(s));
    });
    return () => { live = false; };
    // onResolved is intentionally excluded: callers pass an inline setter and
    // re-running the fetch on every dashboard render would be wasteful.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!status) return null;

  const shell = {
    width: '100%',
    borderRadius: '16px',
    padding: { xs: '20px 18px', md: '24px 28px' },
    boxSizing: 'border-box' as const,
    background: 'linear-gradient(135deg, #F1F8F5 0%, #FDFDF8 60%, #F1F8F5 100%)',
    border: '1px solid #D9EBE1',
  };

  const titleSx = {
    fontFamily: FONT,
    fontWeight: FONT_WEIGHTS.BOLD,
    fontSize: { xs: '17px', md: '18px' },
    color: '#1A212B',
  };

  const bodySx = {
    fontFamily: FONT,
    fontSize: '14px',
    color: '#667085',
    lineHeight: 1.55,
    mt: 0.5,
  };

  const primaryButtonSx = {
    flexShrink: 0,
    height: '44px',
    px: 3,
    borderRadius: '12px',
    backgroundColor: GREEN,
    color: '#FFFFFF',
    fontFamily: FONT,
    fontWeight: FONT_WEIGHTS.BOLD,
    fontSize: '14px',
    textTransform: 'none' as const,
    whiteSpace: 'nowrap' as const,
    '&:hover': { backgroundColor: COLORS.PRIMARY_HOVER },
  };

  /* ── booked: show the appointment and count down ───────────────────────── */
  if (status.state === 'booked' && status.upcoming) {
    const a = status.upcoming;
    return (
      <Box sx={shell}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography sx={titleSx}>{L.BOOKED_TITLE}</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: '13px', color: GREEN, fontWeight: FONT_WEIGHTS.BOLD, mt: 0.25 }}>
              {fill(L.VISIT_LABEL, { n: a.visit })}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              py: 0.75,
              borderRadius: '999px',
              backgroundColor: GREEN,
              color: '#FFFFFF',
              fontFamily: FONT,
              fontWeight: FONT_WEIGHTS.BOLD,
              fontSize: '13px',
              whiteSpace: 'nowrap',
            }}
          >
            {countdown(status.daysUntilAppointment)}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', mt: 2 }}>
          {[
            { Icon: CalendarTodayIcon, text: longDate(a.scheduledDate) },
            { Icon: AccessTimeIcon, text: a.timeSlot },
            { Icon: LocationOnIcon, text: `${a.labName}${a.labAddress ? `, ${a.labAddress}` : ''}` },
          ].map(({ Icon, text }) => (
            <Box key={text} sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Icon sx={{ fontSize: '18px', color: GREEN, mt: '2px' }} />
              <Typography sx={{ fontFamily: FONT, fontSize: '14.5px', color: '#1A212B' }}>{text}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mt: 2.5, flexWrap: 'wrap' }}>
          <Typography sx={{ ...bodySx, mt: 0, flex: 1, minWidth: '220px' }}>{L.BOOKED_PREP}</Typography>
          <Button
            onClick={() => navigate(BOOK_RETEST)}
            sx={{
              flexShrink: 0,
              height: '40px',
              px: 2.5,
              borderRadius: '12px',
              border: `1.5px solid ${GREEN}`,
              color: GREEN,
              fontFamily: FONT,
              fontWeight: FONT_WEIGHTS.BOLD,
              fontSize: '13.5px',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'rgba(0, 96, 69, 0.06)' },
            }}
          >
            {L.BOOKED_RESCHEDULE}
          </Button>
        </Box>
      </Box>
    );
  }

  /* ── due / waiting / none: prompt to book ──────────────────────────────── */
  //
  // A draw is only ever booked one at a time, so these three states all mean
  // "nothing on the calendar". The pill carries the timing, which is the part
  // people act on.
  const prompt = (() => {
    if (status.state === 'due') {
      const overdue = status.daysUntilDue == null ? 0 : -status.daysUntilDue;
      return {
        title: L.DUE_TITLE,
        body: fill(L.DUE_BODY, { n: Math.round(status.intervalDays / 30) }),
        button: L.DUE_BUTTON,
        pill: overdue > 0 ? fill(L.DUE_PILL_OVERDUE, { n: overdue }) : L.DUE_PILL,
        urgent: true,
      };
    }
    if (status.state === 'waiting') {
      return {
        title: L.WAITING_TITLE,
        body: fill(L.WAITING_BODY, {
          date: status.lastDrawDate ? shortDate(status.lastDrawDate) : '',
          due: status.dueDate ? shortDate(status.dueDate) : '',
        }),
        button: L.WAITING_BUTTON,
        pill: status.daysUntilDue != null ? fill(L.WAITING_PILL, { n: status.daysUntilDue }) : null,
        urgent: false,
      };
    }
    return { title: L.NONE_TITLE, body: L.NONE_BODY, button: L.NONE_BUTTON, pill: null, urgent: false };
  })();

  return (
    <Box sx={{ ...shell, display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: 'wrap' }}>
      <Box
        sx={{
          width: '44px',
          height: '44px',
          flexShrink: 0,
          borderRadius: '12px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #D9EBE1',
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ScienceOutlinedIcon sx={{ fontSize: '22px', color: GREEN }} />
      </Box>

      <Box sx={{ flex: 1, minWidth: '240px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
          <Typography sx={titleSx}>{prompt.title}</Typography>
          {prompt.pill && (
            <Box
              sx={{
                px: 1.5,
                py: 0.4,
                borderRadius: '999px',
                backgroundColor: prompt.urgent ? '#B42318' : GREEN,
                color: '#FFFFFF',
                fontFamily: FONT,
                fontWeight: FONT_WEIGHTS.BOLD,
                fontSize: '12.5px',
                whiteSpace: 'nowrap',
              }}
            >
              {prompt.pill}
            </Box>
          )}
        </Box>
        <Typography sx={bodySx}>{prompt.body}</Typography>
      </Box>

      <Button onClick={() => navigate(BOOK_RETEST)} sx={primaryButtonSx}>
        {prompt.button}
      </Button>
    </Box>
  );
};

export default NextDraw;
