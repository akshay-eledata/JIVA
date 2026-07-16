// Post-login questionnaire page (the "Questioner" navbar button).
// Surfaces the 'anytime' questions from the intake doc — answerable or
// editable whenever the user logs in — plus the Mind & Body Constitution
// quiz. Answers merge into the same Questionnaire record that feeds the
// engine, so diet/restriction changes immediately shape food recommendations.

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Typography, Button, Alert, Snackbar, CircularProgress, Chip,
} from '@mui/material';
import QuestionField from '../../Component/QuestionnaireForm/QuestionField';
import {
  sectionsForPhase, isVisible, CONSTITUTION_QUESTIONS,
} from '../../questionnaire/definition';
import { Answers, AnswerValue } from '../../questionnaire/types';
import { fetchSavedQuestionnaire, submitQuestionnaire } from '../../questionnaire/storage';
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/constants';
import { HQ_LABELS as L } from './labels';

const SECTIONS = sectionsForPhase('anytime');

const cardSx = {
  backgroundColor: COLORS.BACKGROUND_WHITE,
  border: `1px solid ${COLORS.BORDER_LIGHT}`,
  borderRadius: '16px',
  padding: { xs: '20px 16px', md: '28px 32px' },
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
  mb: '20px',
};

const HealthQuestionnaire: React.FC = () => {
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedOpen, setSavedOpen] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await fetchSavedQuestionnaire();
        if (saved) setAnswers(saved);
      } catch {
        setLoadError(L.LOAD_ERROR);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const constitution = useMemo(
    () => (answers.constitution && typeof answers.constitution === 'object'
      ? (answers.constitution as Record<string, string>)
      : {}),
    [answers],
  );

  const handleChange = (id: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setDirty(true);
  };

  const handleConstitution = (id: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      constitution: { ...constitution, [id]: option },
    }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    setSaveError('');
    try {
      await submitQuestionnaire(answers);
      setDirty(false);
      setSavedOpen(true);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const constitutionGroups = useMemo(() => {
    const groups: { name: string; questions: typeof CONSTITUTION_QUESTIONS }[] = [];
    for (const q of CONSTITUTION_QUESTIONS) {
      const g = groups.find((x) => x.name === q.group);
      if (g) g.questions.push(q);
      else groups.push({ name: q.group, questions: [q] });
    }
    return groups;
  }, []);

  const answeredConstitution = CONSTITUTION_QUESTIONS.filter((q) => constitution[q.id]).length;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: '80px' }}>
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '900px',
        padding: { xs: '24px 16px 120px', md: '36px 24px 120px' },
        boxSizing: 'border-box',
        textAlign: 'left', // don't inherit the app-wide centered text
      }}
    >
      <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '26px', color: COLORS.TEXT_PRIMARY, mb: '6px' }}>
        {L.TITLE}
      </Typography>
      <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '14px', color: COLORS.TEXT_SECONDARY, mb: '24px', maxWidth: '680px' }}>
        {L.SUBTITLE}
      </Typography>

      {loadError && (
        <Alert severity="warning" sx={{ mb: '16px', borderRadius: '10px' }}>
          {loadError}
        </Alert>
      )}

      {SECTIONS.map((section) => {
        const visible = section.questions.filter((q) => isVisible(q, answers));
        if (!visible.length) return null;
        return (
          <Box key={section.id} sx={cardSx}>
            <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '18px', color: COLORS.TEXT_PRIMARY, mb: '18px' }}>
              {section.title}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {visible.map((q) => (
                <QuestionField key={q.id} question={q} answers={answers} onChange={handleChange} />
              ))}
            </Box>
          </Box>
        );
      })}

      {/* Mind & Body Constitution quiz */}
      <Box sx={cardSx}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: '4px' }}>
          <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '18px', color: COLORS.TEXT_PRIMARY }}>
            {L.CONSTITUTION_TITLE}
          </Typography>
          <Chip
            label={`${answeredConstitution}/${CONSTITUTION_QUESTIONS.length} ${L.ANSWERED}`}
            size="small"
            sx={{
              backgroundColor: answeredConstitution === CONSTITUTION_QUESTIONS.length
                ? 'rgba(0, 96, 69, 0.1)'
                : COLORS.BACKGROUND_GRAY,
              color: answeredConstitution === CONSTITUTION_QUESTIONS.length
                ? COLORS.PRIMARY
                : COLORS.TEXT_SECONDARY,
              fontFamily: FONTS.SATOSHI,
              fontWeight: FONT_WEIGHTS.BOLD,
            }}
          />
        </Box>
        <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '13px', color: COLORS.TEXT_SECONDARY, mb: '20px', maxWidth: '640px' }}>
          {L.CONSTITUTION_SUBTITLE}
        </Typography>

        {constitutionGroups.map((group) => (
          <Box key={group.name} sx={{ mb: '24px' }}>
            <Typography
              sx={{
                fontFamily: FONTS.SATOSHI,
                fontWeight: FONT_WEIGHTS.BOLD,
                fontSize: '12px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: COLORS.PRIMARY,
                mb: '12px',
              }}
            >
              {group.name}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {group.questions.map((q) => (
                <Box key={q.id}>
                  <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '15px', color: COLORS.TEXT_PRIMARY, mb: '10px' }}>
                    {q.label}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {q.options.map((opt) => {
                      const selected = constitution[q.id] === opt;
                      return (
                        <Button
                          key={opt}
                          onClick={() => handleConstitution(q.id, opt)}
                          sx={{
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            textTransform: 'none',
                            border: `1.5px solid ${selected ? COLORS.PRIMARY : COLORS.BORDER_LIGHT}`,
                            backgroundColor: selected ? 'rgba(0, 96, 69, 0.06)' : COLORS.BACKGROUND_WHITE,
                            color: COLORS.TEXT_PRIMARY,
                            borderRadius: '10px',
                            padding: '10px 16px',
                            fontFamily: FONTS.SATOSHI,
                            fontSize: '14px',
                            fontWeight: selected ? FONT_WEIGHTS.BOLD : FONT_WEIGHTS.REGULAR,
                            '&:hover': { borderColor: COLORS.PRIMARY, backgroundColor: 'rgba(0, 96, 69, 0.04)' },
                          }}
                        >
                          {opt}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {saveError && (
        <Alert severity="error" sx={{ mb: '16px', borderRadius: '10px' }}>
          {saveError}
        </Alert>
      )}

      {/* Sticky save bar */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTop: `1px solid ${COLORS.BORDER_LIGHT}`,
          backdropFilter: 'blur(6px)',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <Button
          onClick={save}
          disabled={saving || !dirty}
          sx={{
            backgroundColor: COLORS.PRIMARY,
            color: COLORS.BACKGROUND_WHITE,
            fontFamily: FONTS.SATOSHI,
            fontWeight: FONT_WEIGHTS.BOLD,
            fontSize: '15px',
            textTransform: 'none',
            borderRadius: '10px',
            padding: '10px 48px',
            '&:hover': { backgroundColor: COLORS.PRIMARY_HOVER },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(0, 96, 69, 0.25)',
              color: COLORS.BACKGROUND_WHITE,
            },
          }}
        >
          {saving ? L.SAVING : L.SAVE}
        </Button>
      </Box>

      <Snackbar
        open={savedOpen}
        autoHideDuration={4000}
        onClose={() => setSavedOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ borderRadius: '10px' }} onClose={() => setSavedOpen(false)}>
          {L.SAVED}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HealthQuestionnaire;
