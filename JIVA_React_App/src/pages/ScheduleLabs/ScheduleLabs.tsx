// Booking a blood draw: pick the day, then pick a draw site near a typed
// address. The lab network is placeholder data (see labs.ts) until the partner
// integration is connected.
//
// The same screen serves two jobs. Without a query param it is the last step of
// onboarding and books the baseline draw. With `?retest=1` it books a follow up
// draw from the dashboard (F1), which swaps the copy, offers a one tap rebook at
// the previous lab, and returns the patient to the dashboard afterwards.

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, InputAdornment, Fade } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import NoFoodOutlinedIcon from '@mui/icons-material/NoFoodOutlined';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplayIcon from '@mui/icons-material/Replay';
import DemoSkip from '../../Component/DemoSkip/DemoSkip';
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/constants';
import { SCHEDULE_LABS_LABELS as L } from './labels';
import { labsNear, DemoLab, labFromPrevious } from './labs';
import { nextStepAfter } from '../../onboarding/steps';
import { bookAppointment, fetchRetestStatus } from '../../onboarding/appointment';

const NEXT = nextStepAfter('/schedule-labs');
const GREEN = COLORS.PRIMARY;
const FONT = FONTS.SATOSHI;

/** The next 12 days, starting tomorrow, as quick-pick chips. */
function upcomingDates(): Date[] {
  const out: Date[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 1; i <= 12; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push(d);
  }
  return out;
}

const toInputValue = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const longDate = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

const cardSx = {
  backgroundColor: '#FFFFFF',
  border: `1px solid ${COLORS.BORDER_LIGHT}`,
  borderRadius: '16px',
  padding: { xs: '20px 18px', md: '28px 32px' },
  boxShadow: '0 2px 12px rgba(26, 33, 43, 0.05)',
  mb: '20px',
};

const ScheduleLabs: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dates = useMemo(upcomingDates, []);

  // Retest mode books a follow up draw from the dashboard rather than the
  // baseline draw at the end of onboarding.
  const isRetest = searchParams.get('retest') === '1';
  const destination = isRetest ? '/dashboard' : NEXT;

  const [selectedDate, setSelectedDate] = useState<Date>(dates[0]);
  const [address, setAddress] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<DemoLab[] | null>(null);
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previousLab, setPreviousLab] = useState<{ name: string; address: string | null } | null>(null);

  // Offer the previous draw site so a retest is one tap rather than a search.
  useEffect(() => {
    if (!isRetest) return;
    let live = true;
    fetchRetestStatus().then((status) => {
      if (live && status?.lastLab) setPreviousLab(status.lastLab);
    });
    return () => { live = false; };
  }, [isRetest]);

  const selectedLab = results?.find((l) => l.id === selectedLabId) || null;
  const ready = Boolean(selectedLab && selectedSlot);

  const search = () => {
    if (!address.trim()) return;
    setSearching(true);
    // A short pause so the demo reads like a real lookup.
    setTimeout(() => {
      setResults(labsNear(address));
      setSelectedLabId(null);
      setSelectedSlot(null);
      setSearching(false);
    }, 450);
  };

  const usePreviousLab = () => {
    if (!previousLab) return;
    const lab = labFromPrevious(previousLab.name, previousLab.address);
    setResults([lab]);
    setSelectedLabId(lab.id);
    setSelectedSlot(null);
  };

  const confirm = async () => {
    if (!selectedLab || !selectedSlot) return;
    setSaving(true);
    await bookAppointment({
      date: toInputValue(selectedDate),
      dateLabel: longDate(selectedDate),
      time: selectedSlot,
      labName: selectedLab.name,
      labAddress: selectedLab.street,
    });
    setSaving(false);
    navigate(destination);
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          px: { xs: 2.5, md: 4 },
          pt: { xs: 3, md: 5 },
          pb: '120px',
          boxSizing: 'border-box',
          textAlign: 'left',
        }}
      >
        {/* Retest mode is reached from inside the app, so it needs a way back. */}
        {isRetest && (
          <Button
            onClick={() => navigate('/dashboard')}
            startIcon={<ArrowBackIcon sx={{ fontSize: '18px' }} />}
            sx={{
              mb: 2,
              px: 0,
              color: '#667085',
              fontFamily: FONT,
              fontSize: '14px',
              fontWeight: FONT_WEIGHTS.MEDIUM,
              textTransform: 'none',
              '&:hover': { backgroundColor: 'transparent', color: GREEN },
            }}
          >
            {L.RETEST_BACK}
          </Button>
        )}

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: { xs: '28px', md: '36px' }, color: '#1A212B', letterSpacing: '-0.02em', mb: 1 }}>
            {isRetest ? L.RETEST_TITLE : L.TITLE}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: { xs: '15px', md: '16px' }, color: '#667085', maxWidth: '620px', mx: 'auto', lineHeight: 1.5 }}>
            {isRetest ? L.RETEST_SUBTITLE : L.SUBTITLE}
          </Typography>
        </Box>

        {/* One tap rebooking at the previous draw site */}
        {isRetest && previousLab && (
          <Box sx={{ ...cardSx, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: '40px',
                  height: '40px',
                  flexShrink: 0,
                  borderRadius: '12px',
                  backgroundColor: '#DCFAE6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ReplayIcon sx={{ fontSize: '20px', color: GREEN }} />
              </Box>
              <Box>
                <Typography sx={{ fontFamily: FONT, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '15px', color: '#1A212B' }}>
                  {L.RETEST_AGAIN_TITLE}
                </Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: '13.5px', color: '#667085' }}>
                  {L.RETEST_AGAIN_BODY} {previousLab.name}
                  {previousLab.address ? `, ${previousLab.address}` : ''}
                </Typography>
              </Box>
            </Box>
            <Button
              onClick={usePreviousLab}
              sx={{
                flexShrink: 0,
                height: '42px',
                px: 3,
                borderRadius: '12px',
                border: `1.5px solid ${GREEN}`,
                color: GREEN,
                fontFamily: FONT,
                fontWeight: FONT_WEIGHTS.BOLD,
                fontSize: '14px',
                textTransform: 'none',
                '&:hover': { backgroundColor: 'rgba(0, 96, 69, 0.06)' },
              }}
            >
              {L.RETEST_AGAIN_BUTTON}
            </Button>
          </Box>
        )}

        {/* Preparation guidance */}
        <Box
          sx={{
            ...cardSx,
            background: 'linear-gradient(135deg, #F1F8F5 0%, #FDFDF8 60%, #F1F8F5 100%)',
            border: '1px solid #D9EBE1',
          }}
        >
          <Typography sx={{ fontFamily: FONT, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '17px', color: '#1A212B', mb: 2 }}>
            {L.GUIDANCE_TITLE}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {[
              { Icon: NoFoodOutlinedIcon, title: L.GUIDANCE_FAST_TITLE, body: L.GUIDANCE_FAST_BODY },
              { Icon: WbTwilightIcon, title: L.GUIDANCE_MORNING_TITLE, body: L.GUIDANCE_MORNING_BODY },
            ].map(({ Icon, title, body }) => (
              <Box key={title} sx={{ display: 'flex', gap: '14px', flex: 1, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: '40px',
                    height: '40px',
                    flexShrink: 0,
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D9EBE1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon sx={{ fontSize: '20px', color: GREEN }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: FONT, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '14px', color: '#1A212B', mb: 0.5 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: '13.5px', color: '#667085', lineHeight: 1.5 }}>
                    {body}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Step 1: date */}
        <Box sx={cardSx}>
          <Typography sx={{ fontFamily: FONT, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '18px', color: '#1A212B' }}>
            {L.DATE_TITLE}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: '13.5px', color: '#667085', mb: 2.5 }}>
            {isRetest ? L.RETEST_DATE_HELPER : L.DATE_HELPER}
          </Typography>

          <Box sx={{ display: 'flex', gap: '10px', overflowX: 'auto', pb: 1, mb: 2.5 }}>
            {dates.map((d) => {
              const active = toInputValue(d) === toInputValue(selectedDate);
              return (
                <Box
                  key={toInputValue(d)}
                  onClick={() => setSelectedDate(d)}
                  sx={{
                    flexShrink: 0,
                    minWidth: '74px',
                    textAlign: 'center',
                    padding: '12px 10px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    border: `1.5px solid ${active ? GREEN : COLORS.BORDER_LIGHT}`,
                    backgroundColor: active ? 'rgba(0, 96, 69, 0.06)' : '#FFFFFF',
                    transition: 'border-color 0.15s ease, background-color 0.15s ease',
                  }}
                >
                  <Typography sx={{ fontFamily: FONT, fontSize: '11px', letterSpacing: '0.5px', color: active ? GREEN : '#667085', textTransform: 'uppercase' }}>
                    {d.toLocaleDateString(undefined, { weekday: 'short' })}
                  </Typography>
                  <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '20px', color: active ? GREEN : '#1A212B', lineHeight: 1.2 }}>
                    {d.getDate()}
                  </Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: '11px', color: active ? GREEN : '#667085' }}>
                    {d.toLocaleDateString(undefined, { month: 'short' })}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          <Typography sx={{ fontFamily: FONT, fontSize: '13px', fontWeight: FONT_WEIGHTS.MEDIUM, color: '#101828', mb: 1 }}>
            {L.DATE_OTHER}
          </Typography>
          <TextField
            type="date"
            size="small"
            value={toInputValue(selectedDate)}
            onChange={(e) => {
              const [y, m, d] = e.target.value.split('-').map(Number);
              if (y && m && d) setSelectedDate(new Date(y, m - 1, d));
            }}
            sx={{
              width: { xs: '100%', md: '280px' },
              '& .MuiOutlinedInput-root': { borderRadius: '12px', height: '44px', fontFamily: FONT },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ fontSize: '16px', color: '#667085' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Step 2: address */}
        <Box sx={cardSx}>
          <Typography sx={{ fontFamily: FONT, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '18px', color: '#1A212B' }}>
            {L.ADDRESS_TITLE}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: '13.5px', color: '#667085', mb: 2.5 }}>
            {L.ADDRESS_HELPER}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '12px' }}>
            <TextField
              fullWidth
              size="small"
              value={address}
              placeholder={L.ADDRESS_PLACEHOLDER}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') search();
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', height: '46px', fontFamily: FONT } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon sx={{ fontSize: '18px', color: '#667085' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              onClick={search}
              disabled={searching || !address.trim()}
              sx={{
                flexShrink: 0,
                height: '46px',
                px: 3,
                borderRadius: '12px',
                backgroundColor: GREEN,
                color: '#FFFFFF',
                fontFamily: FONT,
                fontWeight: FONT_WEIGHTS.BOLD,
                fontSize: '14px',
                textTransform: 'none',
                '&:hover': { backgroundColor: COLORS.PRIMARY_HOVER },
                '&.Mui-disabled': { backgroundColor: 'rgba(0, 96, 69, 0.3)', color: '#FFFFFF' },
              }}
            >
              {searching ? L.ADDRESS_SEARCHING : L.ADDRESS_BUTTON}
            </Button>
          </Box>
        </Box>

        {/* Step 3: results */}
        <Box sx={cardSx}>
          <Typography sx={{ fontFamily: FONT, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '18px', color: '#1A212B' }}>
            {L.RESULTS_TITLE}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: '13px', color: '#667085', mb: 2.5 }}>
            {L.RESULTS_DEMO_NOTE}
          </Typography>

          {!results ? (
            <Box
              sx={{
                border: `1px dashed ${COLORS.BORDER_LIGHT}`,
                borderRadius: '12px',
                padding: '32px 20px',
                textAlign: 'center',
              }}
            >
              <ScienceOutlinedIcon sx={{ fontSize: '32px', color: '#C4CBD4', mb: 1 }} />
              <Typography sx={{ fontFamily: FONT, fontSize: '14px', color: '#667085' }}>
                {L.RESULTS_EMPTY}
              </Typography>
            </Box>
          ) : (
            <Fade in>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {results.map((lab) => {
                  const active = lab.id === selectedLabId;
                  return (
                    <Box
                      key={lab.id}
                      onClick={() => {
                        setSelectedLabId(lab.id);
                        setSelectedSlot(null);
                      }}
                      sx={{
                        border: `1.5px solid ${active ? GREEN : COLORS.BORDER_LIGHT}`,
                        borderRadius: '14px',
                        padding: '18px 20px',
                        cursor: 'pointer',
                        backgroundColor: active ? 'rgba(0, 96, 69, 0.04)' : '#FFFFFF',
                        transition: 'border-color 0.15s ease, background-color 0.15s ease',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                          <Box
                            sx={{
                              width: '40px',
                              height: '40px',
                              flexShrink: 0,
                              borderRadius: '50%',
                              backgroundColor: active ? GREEN : '#DCFAE6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {active ? (
                              <CheckCircleIcon sx={{ fontSize: '22px', color: '#FFFFFF' }} />
                            ) : (
                              <ScienceOutlinedIcon sx={{ fontSize: '20px', color: GREEN }} />
                            )}
                          </Box>
                          <Box>
                            <Typography sx={{ fontFamily: FONT, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '15px', color: '#1A212B' }}>
                              {lab.name}
                            </Typography>
                            <Typography sx={{ fontFamily: FONT, fontSize: '13px', color: '#667085' }}>
                              {lab.street}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <LocationOnIcon sx={{ fontSize: '16px', color: '#667085' }} />
                          <Typography sx={{ fontFamily: FONT, fontSize: '13px', fontWeight: FONT_WEIGHTS.MEDIUM, color: '#667085', whiteSpace: 'nowrap' }}>
                            {lab.distanceKm} {L.KM_AWAY}
                          </Typography>
                        </Box>
                      </Box>

                      {active && (
                        <Box sx={{ mt: 2.5, pl: { xs: 0, sm: '54px' } }}>
                          <Typography sx={{ fontFamily: FONT, fontSize: '12px', fontWeight: FONT_WEIGHTS.BOLD, letterSpacing: '0.5px', color: '#667085', textTransform: 'uppercase', mb: 1 }}>
                            {L.RESULTS_SLOTS}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {lab.slots.map((slot) => {
                              const slotActive = slot === selectedSlot;
                              return (
                                <Box
                                  key={slot}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSlot(slot);
                                  }}
                                  sx={{
                                    padding: '8px 16px',
                                    borderRadius: '999px',
                                    cursor: 'pointer',
                                    fontFamily: FONT,
                                    fontSize: '13px',
                                    fontWeight: FONT_WEIGHTS.BOLD,
                                    color: slotActive ? '#FFFFFF' : '#1A212B',
                                    backgroundColor: slotActive ? GREEN : '#FFFFFF',
                                    border: `1.5px solid ${slotActive ? GREEN : COLORS.BORDER_LIGHT}`,
                                  }}
                                >
                                  {slot}
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Fade>
          )}
        </Box>

        {/* Confirm */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, mt: 1 }}>
          {ready && (
            <Typography sx={{ fontFamily: FONT, fontSize: '14px', color: '#1A212B', textAlign: 'center' }}>
              {longDate(selectedDate)} at {selectedSlot}, {selectedLab!.name}
            </Typography>
          )}
          <Button
            onClick={confirm}
            disabled={!ready || saving}
            sx={{
              minWidth: '260px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: GREEN,
              color: '#FFFFFF',
              fontFamily: FONT,
              fontWeight: FONT_WEIGHTS.BOLD,
              fontSize: '15px',
              textTransform: 'none',
              '&:hover': { backgroundColor: COLORS.PRIMARY_HOVER },
              '&.Mui-disabled': { backgroundColor: 'rgba(0, 96, 69, 0.3)', color: '#FFFFFF' },
            }}
          >
            {L.CONFIRM}
          </Button>
          {!ready && (
            <Typography sx={{ fontFamily: FONT, fontSize: '13px', color: '#667085' }}>
              {L.CONFIRM_HINT}
            </Typography>
          )}
        </Box>
      </Box>

      <DemoSkip to={destination} label="Skip scheduling" />
    </>
  );
};

export default ScheduleLabs;
