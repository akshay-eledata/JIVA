// Free-text condition input with ICD-11 autocomplete.
//
// The patient types anything they like ("heart attack", "sugar problem") and we
// suggest matching ICD-11 categories via the backend proxy (/api/icd/search),
// which uses WHO's synonym index. Picking a suggestion records the ICD code
// alongside the text; typing something we can't match is still accepted as
// plain free text, and the field degrades to a normal text box if the lookup
// service is unavailable.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Autocomplete, TextField, Box, Typography, CircularProgress } from '@mui/material';
import { apiUrl } from '../../config';
import { COLORS, FONTS } from '../../constants/constants';

export interface IcdSuggestion {
  code: string;
  title: string;
  matchedOn: string | null;
}

interface Props {
  label: string;
  placeholder?: string;
  /** Current free-text value. */
  value: string;
  /** Current ICD code, if one was picked. */
  code?: string;
  /** Fires with the text and the code ('' when free-typed / cleared). */
  onChange: (text: string, code: string) => void;
  sx?: object;
}

const DEBOUNCE_MS = 250;
const MIN_CHARS = 2;

const IcdConditionField: React.FC<Props> = ({ label, placeholder, value, code, onChange, sx }) => {
  const [input, setInput] = useState(value || '');
  const [options, setOptions] = useState<IcdSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  // Ignore responses for searches the user has already typed past.
  const seq = useRef(0);

  // Keep in sync when the parent resets rows.
  useEffect(() => { setInput(value || ''); }, [value]);

  useEffect(() => {
    const term = input.trim();
    if (term.length < MIN_CHARS) { setOptions([]); return; }
    // Don't re-query the exact label the user just picked.
    if (code && term === value) { setOptions([]); return; }

    const mySeq = ++seq.current;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(apiUrl(`/api/icd/search?q=${encodeURIComponent(term)}&limit=10`));
        const data = await res.json().catch(() => ({ results: [] }));
        if (mySeq !== seq.current) return; // stale
        setUnavailable(!res.ok);
        setOptions(data.results || []);
      } catch {
        if (mySeq !== seq.current) return;
        setUnavailable(true);
        setOptions([]);
      } finally {
        if (mySeq === seq.current) setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [input, code, value]);

  const helper = useMemo(() => {
    if (code) return `ICD-11 ${code}`;
    if (unavailable) return 'Condition lookup unavailable — type it in and we’ll match it later.';
    if (input.trim().length >= MIN_CHARS && !loading && options.length === 0) {
      return 'No match found — your own wording is fine.';
    }
    return ' ';
  }, [code, unavailable, input, loading, options.length]);

  return (
    <Autocomplete
      freeSolo
      fullWidth
      size="small"
      options={options}
      filterOptions={(x) => x} // server already ranked them
      loading={loading}
      inputValue={input}
      onInputChange={(_e, v, reason) => {
        setInput(v);
        // Typing after a pick invalidates the code; selection is handled below.
        if (reason === 'input') onChange(v, '');
        if (reason === 'clear') onChange('', '');
      }}
      onChange={(_e, picked) => {
        if (picked && typeof picked !== 'string') {
          setInput(picked.title);
          onChange(picked.title, picked.code);
        }
      }}
      getOptionLabel={(o) => (typeof o === 'string' ? o : o.title)}
      isOptionEqualToValue={(o, v) => o.code === (v as IcdSuggestion).code}
      renderOption={(props, o) => (
        <Box component="li" {...props} key={o.code} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '14px', color: COLORS.TEXT_PRIMARY }}>
              {o.title}
            </Typography>
            {o.matchedOn && o.matchedOn.toLowerCase() !== o.title.toLowerCase() && (
              <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '12px', color: COLORS.TEXT_SECONDARY }}>
                also known as {o.matchedOn}
              </Typography>
            )}
          </Box>
          <Typography sx={{ fontFamily: FONTS.SATOSHI, fontSize: '11px', fontWeight: 700, color: COLORS.PRIMARY, whiteSpace: 'nowrap', mt: '2px' }}>
            {o.code}
          </Typography>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          helperText={helper}
          sx={sx}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={15} sx={{ color: COLORS.PRIMARY }} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          FormHelperTextProps={{
            sx: { fontFamily: FONTS.SATOSHI, fontSize: '11px', ml: 0, color: code ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY },
          }}
        />
      )}
    />
  );
};

export default IcdConditionField;
