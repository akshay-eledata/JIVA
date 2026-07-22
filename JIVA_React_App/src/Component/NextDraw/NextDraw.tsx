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
  /**
   * Scope the card to "what comes after visit N". The Vitality Maps pass the
   * visit they are rendering so each one answers for its own results. Omit on
   * the dashboard, which asks the global question.
   */
  afterVisit?: number;
}

const NextDraw: React.FC<NextDrawProps> = ({ onResolved, afterVisit }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<RetestStatus | null>(null);

  useEffect(() => {
    let live = true;
    fetchRetestStatus(afterVisit).then((s) => {
      if (!live) return;
      setStatus(s);
      onResolved?.(Boolean(s));
    });
    return () => { live = false; };
    // onResolved is intentionally excluded: callers pass an inline setter and
    // re-running the fetch on every dashboard render would be wasteful.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterVisit]);

  if (!status) return null;

  const shell = {
    width: '100%',
    borderRadius: '20px',
    padding: { xs: '16px 18px', md: '18px 24px' },
    boxSizing: 'border-box' as const,
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.05)',
  };

  const titleSx = {
    fontFamily: FONT,
    fontWeight: FONT_WEIGHTS.BOLD,
    fontSize: { xs: '16px', md: '17px' },
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
    height: '40px',
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
  //
  // Laid out as one compact band rather than stacked rows: this sits above the
  // results on the Vitality Map and should not push them down the page.
  if (status.state === 'booked' && status.upcoming) {
    const a = status.upcoming;
    const detail = [
      { Icon: CalendarTodayIcon, text: longDate(a.scheduledDate) },
      { Icon: AccessTimeIcon, text: a.timeSlot },
      { Icon: LocationOnIcon, text: `${a.labName}${a.labAddress ? `, ${a.labAddress}` : ''}` },
    ];
    return (
      <Box sx={{ ...shell, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: '260px', textAlign: 'left' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap', mb: 0.75 }}>
            <Typography sx={titleSx}>{L.BOOKED_TITLE}</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: '12.5px', color: GREEN, fontWeight: FONT_WEIGHTS.BOLD }}>
              {fill(L.VISIT_LABEL, { n: a.visit })}
            </Typography>
            <Box
              sx={{
                px: 1.5,
                py: '3px',
                borderRadius: '999px',
                backgroundColor: GREEN,
                color: '#FFFFFF',
                fontFamily: FONT,
                fontWeight: FONT_WEIGHTS.BOLD,
                fontSize: '12.5px',
                whiteSpace: 'nowrap',
              }}
            >
              {countdown(status.daysUntilAppointment)}
            </Box>
          </Box>

          {/* Date, time and place on one line, wrapping only when it has to. */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {detail.map(({ Icon, text }) => (
              <Box key={text} sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Icon sx={{ fontSize: '15px', color: GREEN, flexShrink: 0 }} />
                <Typography sx={{ fontFamily: FONT, fontSize: '13.5px', color: '#1A212B' }}>{text}</Typography>
              </Box>
            ))}
          </Box>

          <Typography sx={{ fontFamily: FONT, fontSize: '12.5px', color: '#98A2B3', mt: 0.75 }}>
            {L.BOOKED_PREP}
          </Typography>
        </Box>

        <Button
          onClick={() => navigate(BOOK_RETEST)}
          sx={{
            flexShrink: 0,
            height: '38px',
            px: 2.5,
            borderRadius: '10px',
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
