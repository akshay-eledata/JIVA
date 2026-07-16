// Renders one questionnaire question in the JIVA visual language:
// pill groups for selects, Yes/No segmented toggles, searchable tag inputs,
// repeatable rows, and a stress slider. Shared by the pre-signup intake
// wizard and the post-login questionnaire page.

import React, { useMemo, useState } from 'react';
import {
  Box, Typography, TextField, Slider, IconButton, MenuItem, Button, Autocomplete,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/constants';
import IcdConditionField from './IcdConditionField';
import {
  Question, Answers, AnswerValue, RepeatRow, RowsQuestion,
} from '../../questionnaire/types';

const OTHER_LABEL = 'Other';

const pillSx = (selected: boolean) => ({
  border: `1.5px solid ${selected ? COLORS.PRIMARY : COLORS.BORDER_LIGHT}`,
  backgroundColor: selected ? COLORS.PRIMARY : COLORS.BACKGROUND_WHITE,
  color: selected ? COLORS.BACKGROUND_WHITE : COLORS.TEXT_PRIMARY,
  borderRadius: '999px',
  padding: '8px 18px',
  fontFamily: FONTS.SATOSHI,
  fontSize: '14px',
  fontWeight: selected ? FONT_WEIGHTS.BOLD : FONT_WEIGHTS.MEDIUM,
  textTransform: 'none' as const,
  lineHeight: 1.4,
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: selected ? COLORS.PRIMARY_HOVER : 'rgba(0, 96, 69, 0.06)',
    borderColor: COLORS.PRIMARY,
  },
});

const cardSx = (selected: boolean) => ({
  border: `1.5px solid ${selected ? COLORS.PRIMARY : COLORS.BORDER_LIGHT}`,
  backgroundColor: selected ? 'rgba(0, 96, 69, 0.06)' : COLORS.BACKGROUND_WHITE,
  borderRadius: '12px',
  padding: '10px 14px',
  textAlign: 'left' as const,
  textTransform: 'none' as const,
  display: 'block',
  '&:hover': { borderColor: COLORS.PRIMARY, backgroundColor: 'rgba(0, 96, 69, 0.04)' },
});

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: FONTS.SATOSHI,
    backgroundColor: COLORS.BACKGROUND_WHITE,
    '& fieldset': { borderColor: COLORS.BORDER_LIGHT },
    '&:hover fieldset': { borderColor: COLORS.PRIMARY },
    '&.Mui-focused fieldset': { borderColor: COLORS.PRIMARY },
  },
};

interface Props {
  question: Question;
  answers: Answers;
  onChange: (id: string, value: AnswerValue) => void;
  /** Hide the question label (used when a parent renders its own heading). */
  hideLabel?: boolean;
}

const QuestionField: React.FC<Props> = ({ question, answers, onChange, hideLabel }) => {
  const q = question;
  const value = answers[q.id];

  return (
    <Box sx={{ ml: q.sub ? '20px' : 0 }}>
      {!hideLabel && (
        <Typography
          sx={{
            fontFamily: FONTS.SATOSHI,
            fontWeight: FONT_WEIGHTS.BOLD,
            fontSize: q.sub ? '14px' : '16px',
            color: COLORS.TEXT_PRIMARY,
            mb: q.helper ? '2px' : '10px',
          }}
        >
          {q.label}
        </Typography>
      )}
      {!hideLabel && q.helper && (
        <Typography
          sx={{
            fontFamily: FONTS.SATOSHI,
            fontSize: '13px',
            color: COLORS.TEXT_SECONDARY,
            mb: '10px',
          }}
        >
          {q.helper}
        </Typography>
      )}
      <FieldInput question={q} value={value} answers={answers} onChange={onChange} />
    </Box>
  );
};

const FieldInput: React.FC<{
  question: Question;
  value: AnswerValue | undefined;
  answers: Answers;
  onChange: (id: string, value: AnswerValue) => void;
}> = ({ question: q, value, answers, onChange }) => {
  switch (q.kind) {
    case 'yesno': {
      return (
        <Box sx={{ display: 'flex', gap: '10px' }}>
          {['Yes', 'No'].map((opt) => (
            <Button key={opt} onClick={() => onChange(q.id, opt)} sx={{ ...pillSx(value === opt), px: '28px' }}>
              {opt}
            </Button>
          ))}
        </Box>
      );
    }

    case 'single': {
      const otherText = (answers[`${q.id}_other`] as string) || '';
      const isOther = value === OTHER_LABEL;
      return (
        <Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {q.options.map((opt) => (
              <Button key={opt} onClick={() => onChange(q.id, opt)} sx={pillSx(value === opt)}>
                {opt}
              </Button>
            ))}
            {q.allowOther && (
              <Button onClick={() => onChange(q.id, OTHER_LABEL)} sx={pillSx(isOther)}>
                {OTHER_LABEL}
              </Button>
            )}
          </Box>
          {q.allowOther && isOther && (
            <TextField
              fullWidth
              size="small"
              placeholder="Please specify"
              value={otherText}
              onChange={(e) => onChange(`${q.id}_other`, e.target.value)}
              sx={{ ...textFieldSx, mt: '10px' }}
            />
          )}
        </Box>
      );
    }

    case 'multi': {
      const selected = Array.isArray(value) ? (value as string[]) : [];
      const toggle = (opt: string) => {
        const next = selected.includes(opt)
          ? selected.filter((v) => v !== opt)
          : [...selected, opt];
        onChange(q.id, next);
      };
      const otherText = (answers[`${q.id}_other`] as string) || '';
      const hasDescriptions = !!q.optionDescriptions;
      return (
        <Box>
          <Box
            sx={
              hasDescriptions
                ? { display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '10px' }
                : { display: 'flex', flexWrap: 'wrap', gap: '10px' }
            }
          >
            {q.options.map((opt) =>
              hasDescriptions ? (
                <Button key={opt} onClick={() => toggle(opt)} sx={cardSx(selected.includes(opt))}>
                  <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: FONT_WEIGHTS.BOLD, fontSize: '14px', color: COLORS.TEXT_PRIMARY }}>
                    {opt}
                  </Typography>
                  <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '12px', color: COLORS.TEXT_SECONDARY }}>
                    {q.optionDescriptions![opt]}
                  </Typography>
                </Button>
              ) : (
                <Button key={opt} onClick={() => toggle(opt)} sx={pillSx(selected.includes(opt))}>
                  {opt}
                </Button>
              ),
            )}
            {q.allowOther && (
              <Button onClick={() => toggle(OTHER_LABEL)} sx={pillSx(selected.includes(OTHER_LABEL))}>
                {OTHER_LABEL}
              </Button>
            )}
          </Box>
          {q.allowOther && selected.includes(OTHER_LABEL) && (
            <TextField
              fullWidth
              size="small"
              placeholder="Please specify"
              value={otherText}
              onChange={(e) => onChange(`${q.id}_other`, e.target.value)}
              sx={{ ...textFieldSx, mt: '10px' }}
            />
          )}
        </Box>
      );
    }

    case 'text': {
      return (
        <TextField
          fullWidth
          size="small"
          multiline={q.multiline}
          minRows={q.multiline ? 3 : undefined}
          placeholder={q.placeholder || 'Type here…'}
          value={(value as string) || ''}
          onChange={(e) => onChange(q.id, e.target.value)}
          sx={textFieldSx}
        />
      );
    }

    case 'slider': {
      const current = typeof value === 'number' ? value : q.defaultValue;
      return (
        <Box sx={{ px: '8px', maxWidth: '480px' }}>
          <Slider
            value={current}
            min={q.min}
            max={q.max}
            step={1}
            marks
            valueLabelDisplay="auto"
            onChange={(_, v) => onChange(q.id, v as number)}
            sx={{
              color: COLORS.PRIMARY,
              '& .MuiSlider-valueLabel': { backgroundColor: COLORS.PRIMARY },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <SliderLabel text={`${q.minLabel} (${q.min})`} />
            {q.midLabel && <SliderLabel text={q.midLabel} />}
            <SliderLabel text={`${q.maxLabel} (${q.max})`} />
          </Box>
        </Box>
      );
    }

    case 'tags': {
      const selected = Array.isArray(value) ? (value as string[]) : [];
      return (
        <Autocomplete
          multiple
          freeSolo
          options={q.options}
          value={selected}
          onChange={(_, v) => onChange(q.id, v as string[])}
          renderTags={(tags, getTagProps) =>
            tags.map((tag, index) => (
              <Chip
                label={tag}
                {...getTagProps({ index })}
                key={tag}
                sx={{
                  backgroundColor: 'rgba(0, 96, 69, 0.08)',
                  color: COLORS.PRIMARY,
                  fontFamily: FONTS.SATOSHI,
                  fontWeight: FONT_WEIGHTS.MEDIUM,
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} size="small" placeholder={q.placeholder || 'Search…'} sx={textFieldSx} />
          )}
        />
      );
    }

    case 'rows': {
      return <RowsField question={q} value={value} onChange={onChange} />;
    }

    default:
      return null;
  }
};

const RowsField: React.FC<{
  question: RowsQuestion;
  value: AnswerValue | undefined;
  onChange: (id: string, value: AnswerValue) => void;
}> = ({ question: q, value, onChange }) => {
  const rows = useMemo(
    () => (Array.isArray(value) ? (value as RepeatRow[]) : []),
    [value],
  );
  const setRows = (next: RepeatRow[]) => onChange(q.id, next);
  const emptyRow = (): RepeatRow =>
    Object.fromEntries(q.columns.map((c) => [c.id, '']));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {rows.map((row, i) => (
        <Box key={i} sx={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          {q.columns.map((col) => {
            const patchRow = (patch: RepeatRow) =>
              setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));

            // ICD-11 autocomplete: stores the text plus its code on the row.
            if (col.type === 'icd') {
              return (
                <IcdConditionField
                  key={col.id}
                  label={col.label}
                  placeholder={col.placeholder}
                  value={row[col.id] || ''}
                  code={row[`${col.id}_icd_code`] || ''}
                  onChange={(text, code) => patchRow({ [col.id]: text, [`${col.id}_icd_code`]: code })}
                  sx={textFieldSx}
                />
              );
            }

            return (
              <TextField
                key={col.id}
                select={col.type === 'select'}
                size="small"
                fullWidth
                label={col.label}
                placeholder={col.placeholder}
                value={row[col.id] || ''}
                onChange={(e) => patchRow({ [col.id]: e.target.value })}
                sx={textFieldSx}
              >
                {col.type === 'select' &&
                  (col.options || []).map((opt) => (
                    <MenuItem key={opt} value={opt} sx={{ fontSize: '14px' }}>
                      {opt}
                    </MenuItem>
                  ))}
              </TextField>
            );
          })}
          <IconButton size="small" onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label="Remove row">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={() => setRows([...rows, emptyRow()])}
        sx={{
          alignSelf: 'flex-start',
          color: COLORS.PRIMARY,
          fontFamily: FONTS.SATOSHI,
          fontWeight: FONT_WEIGHTS.BOLD,
          textTransform: 'none',
        }}
      >
        {q.addLabel}
      </Button>
    </Box>
  );
};

const SliderLabel: React.FC<{ text: string }> = ({ text }) => (
  <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '12px', color: COLORS.TEXT_SECONDARY }}>
    {text}
  </Typography>
);

export default QuestionField;
