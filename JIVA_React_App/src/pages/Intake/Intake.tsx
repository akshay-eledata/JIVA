// Pre-signup/pre-payment intake wizard: the 'pre' phase questions from
// Data/Questionnaire.docx as a multi-step flow with a progress bar and a
// confirmation screen. Answers autosave to a localStorage draft on every
// change and are pushed to the backend (merged into Questionnaire.data,
// which feeds the engine) on completion — or right after auth if the user
// isn't signed in yet.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, LinearProgress, Alert, Fade } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import JivaLogo from '../../assets/jiva.svg';
import QuestionField from '../../Component/QuestionnaireForm/QuestionField';
import { sectionsForPhase, isVisible } from '../../questionnaire/definition';
import { Answers, AnswerValue } from '../../questionnaire/types';
import { loadDraft, saveDraft, clearDraft, submitQuestionnaire } from '../../questionnaire/storage';
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/constants';
import { INTAKE_LABELS as L } from './labels';

const SECTIONS = sectionsForPhase('pre');

const Intake: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0..SECTIONS.length-1, then confirmation
  const [answers, setAnswers] = useState<Answers>(() => loadDraft());
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const topRef = useRef<HTMLDivElement>(null);

  const section = SECTIONS[step];
  const progress = (done ? SECTIONS.length : step) / SECTIONS.length;

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step, done]);

  const visibleQuestions = useMemo(
    () => (section ? section.questions.filter((q) => isVisible(q, answers)) : []),
    [section, answers],
  );

  const handleChange = (id: string, value: AnswerValue) => {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      saveDraft(next);
      return next;
    });
  };

  const finish = async () => {
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      // Pre-signup flow: the answers are held in the localStorage draft and
      // flushed to the server right after the account is created. Move the user
      // on to create their account.
      saveDraft(answers);
      navigate('/signup');
      return;
    }
    // Already signed in (e.g. revisiting intake): save straight away.
    setSaving(true);
    try {
      await submitQuestionnaire(answers);
      clearDraft();
      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Could not save your answers. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const next = () => {
    if (step < SECTIONS.length - 1) setStep(step + 1);
    else finish();
  };

  return (
    <Box
      ref={topRef}
      sx={{
        width: '100%',
        maxWidth: '860px',
        padding: { xs: '24px 16px 64px', md: '40px 24px 80px' },
        boxSizing: 'border-box',
        textAlign: 'left', // don't inherit the app-wide centered text
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: '28px' }}>
        <Box component="img" src={JivaLogo} alt="JIVA Health" sx={{ height: '44px', mb: '10px' }} />
        <Typography
          sx={{
            fontFamily: FONTS.SATOSHI,
            fontSize: '11px',
            letterSpacing: '2px',
            color: COLORS.TEXT_SECONDARY,
            mb: '6px',
          }}
        >
          {L.BRAND_TAGLINE}
        </Typography>
        <Typography
          sx={{
            fontFamily: FONTS.SATOSHI,
            fontWeight: FONT_WEIGHTS.BOLD,
            fontSize: '26px',
            color: COLORS.TEXT_PRIMARY,
          }}
        >
          {L.TITLE}
        </Typography>
        {!done && step === 0 && (
          <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '14px', color: COLORS.TEXT_SECONDARY, mt: '6px' }}>
            {L.SUBTITLE}
          </Typography>
        )}
      </Box>

      {/* Progress */}
      <Box sx={{ mb: '24px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '6px' }}>
          <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '13px', fontWeight: FONT_WEIGHTS.BOLD, color: COLORS.PRIMARY }}>
            {done
              ? 'Complete'
              : `${L.SECTION_PREFIX} ${step + 1} ${L.OF} ${SECTIONS.length} — ${section.title}`}
          </Typography>
          <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '13px', color: COLORS.TEXT_SECONDARY }}>
            {Math.round(progress * 100)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress * 100}
          sx={{
            height: '8px',
            borderRadius: '4px',
            backgroundColor: 'rgba(0, 96, 69, 0.12)',
            '& .MuiLinearProgress-bar': { backgroundColor: COLORS.PRIMARY, borderRadius: '4px' },
          }}
        />
      </Box>

      {done ? (
        <Fade in>
          <Box
            sx={{
              backgroundColor: COLORS.BACKGROUND_WHITE,
              border: `1px solid ${COLORS.BORDER_LIGHT}`,
              borderRadius: '16px',
              padding: '48px 32px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: '64px', color: COLORS.PRIMARY, mb: '12px' }} />
            <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '24px', color: COLORS.TEXT_PRIMARY, mb: '10px' }}>
              {L.CONFIRM_TITLE}
            </Typography>
            <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '15px', color: COLORS.TEXT_SECONDARY, maxWidth: '540px', mx: 'auto', mb: '8px' }}>
              {L.CONFIRM_BODY}
            </Typography>
            <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '13px', color: COLORS.TEXT_SECONDARY, maxWidth: '540px', mx: 'auto', mb: '24px' }}>
              {L.ANYTIME_HINT}
            </Typography>
            <Button
              onClick={() => navigate('/select-packages')}
              sx={{
                backgroundColor: COLORS.PRIMARY,
                color: COLORS.BACKGROUND_WHITE,
                fontFamily: FONTS.SATOSHI,
                fontWeight: FONT_WEIGHTS.BOLD,
                fontSize: '15px',
                textTransform: 'none',
                borderRadius: '10px',
                padding: '12px 32px',
                '&:hover': { backgroundColor: COLORS.PRIMARY_HOVER },
              }}
            >
              {L.CONFIRM_CTA}
            </Button>
          </Box>
        </Fade>
      ) : (
        <Fade in key={section.id}>
          <Box
            sx={{
              backgroundColor: COLORS.BACKGROUND_WHITE,
              border: `1px solid ${COLORS.BORDER_LIGHT}`,
              borderRadius: '16px',
              padding: { xs: '24px 20px', md: '32px 40px' },
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
            }}
          >
            <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '20px', color: COLORS.TEXT_PRIMARY }}>
              {section.title}
            </Typography>
            <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '14px', color: COLORS.TEXT_SECONDARY, mb: section.note ? '10px' : '24px' }}>
              {section.subtitle}
            </Typography>
            {section.note && (
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
                  {section.note}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {visibleQuestions.map((q) => (
                <QuestionField key={q.id} question={q} answers={answers} onChange={handleChange} />
              ))}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: '20px', borderRadius: '10px' }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '32px' }}>
              <Button
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
                sx={{
                  color: COLORS.TEXT_PRIMARY,
                  fontFamily: FONTS.SATOSHI,
                  fontWeight: FONT_WEIGHTS.BOLD,
                  textTransform: 'none',
                  borderRadius: '10px',
                  padding: '10px 24px',
                  border: `1.5px solid ${COLORS.BORDER_LIGHT}`,
                  visibility: step === 0 ? 'hidden' : 'visible',
                }}
              >
                {L.BACK}
              </Button>
              <Button
                onClick={next}
                disabled={saving}
                sx={{
                  backgroundColor: COLORS.PRIMARY,
                  color: COLORS.BACKGROUND_WHITE,
                  fontFamily: FONTS.SATOSHI,
                  fontWeight: FONT_WEIGHTS.BOLD,
                  fontSize: '15px',
                  textTransform: 'none',
                  borderRadius: '10px',
                  padding: '10px 32px',
                  '&:hover': { backgroundColor: COLORS.PRIMARY_HOVER },
                }}
              >
                {saving ? L.SUBMITTING : step === SECTIONS.length - 1 ? L.SUBMIT : L.CONTINUE}
              </Button>
            </Box>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default Intake;
