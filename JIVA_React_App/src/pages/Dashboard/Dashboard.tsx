// The dashboard: draw confirmation, then what that draw buys you.
//
// This used to be a payment banner, a static scheduling card and four generic
// feature tiles that said nothing specific. The tiles are replaced by the
// engine's actual output, which the page fetches from /api/me/report-status.
// That endpoint answers in both directions: before a report exists it reports
// the panels bought and the markers they carry, and once one exists it reports
// the real figures. So the same six cards describe what is coming while you
// wait and summarise what arrived once it has, rather than the page having two
// unrelated layouts.

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/constants';
import { DASHBOARD_LABELS as L } from './labels';
import NextDraw from '../../Component/NextDraw/NextDraw';
import { fetchRetestStatus, RetestStatus } from '../../onboarding/appointment';
import { apiUrl } from '../../config';

const GREEN = COLORS.PRIMARY;
const FONT = FONTS.SATOSHI;
const CANVAS = '#EFF4EF';
const BORDER = '1px solid #DCE7DD';

interface ReportStatus {
  hasReport: boolean;
  panels: { name: string; testCount: number; type: string }[];
  expectedBiomarkers: number;
  systemCount: number;
  visit?: number;
  biologicalAge?: number | null;
  chronologicalAge?: number | null;
  totalLabsReviewed?: number;
  inRangeCount?: number;
  borderlineCount?: number;
  outOfRangeCount?: number;
  findingCount?: number;
  topFinding?: { diagnosis: string; confidence: string } | null;
  foodsToEat?: number;
  foodsToAvoid?: number;
  exerciseCount?: number;
  supplementCount?: number;
}

/** Trim the engine's long diagnosis strings to the part before the qualifiers. */
const shortFinding = (s: string): string => {
  const head = s.split(',')[0].trim();
  return head.length > 46 ? `${head.slice(0, 44).trim()}.` : head;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<ReportStatus | null>(null);
  const [retest, setRetest] = useState<RetestStatus | null>(null);

  useEffect(() => {
    let live = true;
    const token = localStorage.getItem('token');
    fetch(apiUrl('/api/me/report-status'), { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live) setStatus(d); })
      .catch(() => { if (live) setStatus(null); });
    fetchRetestStatus().then((s) => { if (live) setRetest(s); });
    return () => { live = false; };
  }, []);

  const ready = Boolean(status?.hasReport);
  const drawBooked = retest?.state === 'booked';

  /* ── journey ──────────────────────────────────────────────────────────────
     Five steps from purchase to report. Once a report exists the whole strip
     is complete; until then it stops at the draw, because everything after it
     is genuinely out of the patient's hands. */
  const steps = [
    { label: L.STEP_BOOKED, note: L.STEP_BOOKED_NOTE, done: true },
    {
      label: L.STEP_DRAW,
      note: drawBooked ? L.STEP_DRAW_NOTE_BOOKED : L.STEP_DRAW_NOTE_UNBOOKED,
      done: ready,
      current: !ready,
    },
    { label: L.STEP_LAB, note: L.STEP_LAB_NOTE, done: ready },
    { label: L.STEP_ENGINE, note: L.STEP_ENGINE_NOTE, done: ready },
    { label: L.STEP_REPORT, note: L.STEP_REPORT_NOTE, done: ready },
  ];

  /* ── deliverables ─────────────────────────────────────────────────────────
     One entry per thing the engine produces. `value` is the headline once the
     report exists; until then the card carries the explanation alone, so the
     wait is described in the same terms as the result. */
  const s = status;
  const markerTotal = ready ? s?.totalLabsReviewed : s?.expectedBiomarkers;
  const panelCount = s?.panels?.length || 0;

  const deliverables = [
    {
      title: L.BIO_AGE_TITLE,
      pending: L.BIO_AGE_PENDING,
      value: s?.biologicalAge != null ? `${s.biologicalAge}` : null,
      unit: 'years',
      detail:
        s?.biologicalAge != null && s?.chronologicalAge != null
          ? `${Math.abs(Math.round((s.biologicalAge - s.chronologicalAge) * 10) / 10)} years ${s.biologicalAge > s.chronologicalAge ? 'above' : 'below'} your calendar age of ${s.chronologicalAge}`
          : null,
      to: '/vitality-map',
    },
    {
      title: L.MARKERS_TITLE,
      pending: L.MARKERS_PENDING,
      value: markerTotal ? `${markerTotal}` : null,
      unit: 'markers',
      detail: ready
        ? `${s?.inRangeCount} in range, ${s?.borderlineCount} borderline, ${s?.outOfRangeCount} out of range`
        : panelCount
          ? `across ${panelCount} panel${panelCount === 1 ? '' : 's'} you have booked`
          : null,
      to: '/vitality-map',
      alwaysValue: true,
    },
    {
      title: L.SYSTEMS_TITLE,
      pending: L.SYSTEMS_PENDING,
      value: s?.systemCount ? `${s.systemCount}` : null,
      unit: 'systems',
      detail: 'Heart, hormonal, metabolic, thyroid, liver, kidney and more',
      to: '/vitality-map',
      alwaysValue: true,
    },
    {
      title: L.FINDINGS_TITLE,
      pending: L.FINDINGS_PENDING,
      value: s?.findingCount ? `${s.findingCount}` : null,
      unit: s?.findingCount === 1 ? 'finding' : 'findings',
      detail: s?.topFinding
        ? `Top: ${shortFinding(s.topFinding.diagnosis)} (${s.topFinding.confidence.toLowerCase()} confidence)`
        : null,
      to: '/vitality-map',
    },
    {
      title: L.FOOD_TITLE,
      pending: L.FOOD_PENDING,
      value: s?.foodsToEat != null ? `${s.foodsToEat}` : null,
      unit: 'foods to add',
      detail: s?.foodsToAvoid != null ? `and ${s.foodsToAvoid} to cut back on, each tied to a finding` : null,
      to: '/action-plan',
    },
    {
      title: L.PLAN_TITLE,
      pending: L.PLAN_PENDING,
      value: s?.supplementCount != null ? `${s.supplementCount}` : null,
      unit: 'supplements',
      detail: s?.exerciseCount != null ? `and ${s.exerciseCount} exercise recommendations` : null,
      to: '/action-plan',
    },
  ];

  const sectionTitleSx = {
    fontFamily: FONT,
    fontSize: '22px',
    fontWeight: FONT_WEIGHTS.BOLD,
    color: '#1A212B',
    textAlign: 'left' as const,
  };

  const sectionSubSx = {
    fontFamily: FONT,
    fontSize: '14.5px',
    color: '#667085',
    mt: 0.5,
    mb: 2.5,
    textAlign: 'left' as const,
    maxWidth: '760px',
    lineHeight: 1.55,
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: CANVAS, pb: 8, minHeight: '100vh' }}>
      <Box sx={{ width: '100%', maxWidth: '1300px', margin: '0 auto', px: { xs: 2, xl: 0 }, pt: 4 }}>
        {/* Next blood draw: the confirmation people come here to check (F1). */}
        <NextDraw />

        {/* ── journey ──────────────────────────────────────────────────── */}
        <Box sx={{ mt: 4 }}>
          <Typography sx={sectionTitleSx}>{L.JOURNEY_TITLE}</Typography>
          <Typography sx={sectionSubSx}>
            {ready ? L.JOURNEY_SUBTITLE_READY : L.JOURNEY_SUBTITLE_PENDING}
          </Typography>

          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              border: BORDER,
              borderRadius: '20px',
              p: { xs: 2.5, md: 3 },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2.5, md: 0 },
            }}
          >
            {steps.map((step, i) => (
              <Box key={step.label} sx={{ flex: 1, minWidth: 0 }}>
                {/* Marker and rail share a row of their own, so the connector
                    runs between circles instead of striking through the label
                    that sits beside it. */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.25 }}>
                  <Box
                    sx={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: step.done ? GREEN : step.current ? '#FFFFFF' : '#F2F6F2',
                      border: step.done || step.current ? `2px solid ${GREEN}` : '2px solid #DCE7DD',
                    }}
                  >
                    {step.done ? (
                      <CheckIcon sx={{ fontSize: '15px', color: '#FFFFFF' }} />
                    ) : (
                      <Box
                        sx={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: step.current ? GREEN : '#C6D6C8',
                        }}
                      />
                    )}
                  </Box>

                  {i < steps.length - 1 && (
                    <Box
                      sx={{
                        display: { xs: 'none', md: 'block' },
                        flex: 1,
                        mx: 1,
                        height: '2px',
                        backgroundColor: steps[i + 1].done ? GREEN : '#DCE7DD',
                      }}
                    />
                  )}
                </Box>

                <Box sx={{ minWidth: 0, pr: 2 }}>
                  <Typography
                    sx={{
                      fontFamily: FONT,
                      fontSize: '14px',
                      fontWeight: FONT_WEIGHTS.BOLD,
                      color: step.done || step.current ? '#1A212B' : '#98A2B3',
                      textAlign: 'left',
                      lineHeight: 1.4,
                    }}
                  >
                    {step.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONT,
                      fontSize: '12.5px',
                      color: '#98A2B3',
                      textAlign: 'left',
                      mt: 0.25,
                      lineHeight: 1.45,
                    }}
                  >
                    {step.note}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {!ready && (
            <Typography
              sx={{ fontFamily: FONT, fontSize: '13px', color: '#98A2B3', mt: 1.5, textAlign: 'left' }}
            >
              {L.WAITING_NOTE}
            </Typography>
          )}
        </Box>

        {/* ── deliverables ─────────────────────────────────────────────── */}
        <Box sx={{ mt: 5 }}>
          <Typography sx={sectionTitleSx}>
            {ready ? L.DELIVER_TITLE_READY : L.DELIVER_TITLE_PENDING}
          </Typography>
          <Typography sx={sectionSubSx}>
            {ready ? L.DELIVER_SUBTITLE_READY : L.DELIVER_SUBTITLE_PENDING}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 2.5,
            }}
          >
            {deliverables.map((d) => {
              // Numbers that are knowable before the draw (marker and system
              // counts) show either way. The rest wait for the report.
              const showValue = d.value != null && (ready || d.alwaysValue);
              return (
                <Box
                  key={d.title}
                  onClick={() => ready && navigate(d.to)}
                  sx={{
                    backgroundColor: '#FFFFFF',
                    border: BORDER,
                    borderRadius: '20px',
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'left',
                    cursor: ready ? 'pointer' : 'default',
                    transition: 'box-shadow 160ms ease, transform 160ms ease',
                    ...(ready && {
                      '&:hover': {
                        boxShadow: '0px 4px 16px rgba(23, 48, 27, 0.09)',
                        transform: 'translateY(-2px)',
                      },
                    }),
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONT,
                      fontSize: '15px',
                      fontWeight: FONT_WEIGHTS.BOLD,
                      color: '#1A212B',
                      mb: 1.25,
                    }}
                  >
                    {d.title}
                  </Typography>

                  {showValue ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                        <Typography
                          sx={{
                            fontFamily: FONT,
                            fontSize: '34px',
                            fontWeight: 800,
                            color: GREEN,
                            lineHeight: 1.1,
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {d.value}
                        </Typography>
                        <Typography sx={{ fontFamily: FONT, fontSize: '14px', color: '#667085' }}>
                          {d.unit}
                        </Typography>
                      </Box>
                      {d.detail && (
                        <Typography
                          sx={{ fontFamily: FONT, fontSize: '13px', color: '#667085', mt: 0.75, lineHeight: 1.5 }}
                        >
                          {d.detail}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Typography
                      sx={{ fontFamily: FONT, fontSize: '13.5px', color: '#667085', lineHeight: 1.6 }}
                    >
                      {d.pending}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
