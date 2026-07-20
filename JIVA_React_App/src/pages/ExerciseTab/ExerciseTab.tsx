import React, { useMemo, useState } from 'react';
import { Box, Typography, Dialog, IconButton, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayIcon from '../../assets/play.svg';
import CancelIcon from '../../assets/cancel.svg';
import Dumbell from '../../assets/Dumbell.svg';
import {
  MOVEMENT_CATEGORIES,
  MOVEMENT_LIBRARY,
  type MovementCategory,
  type MovementItem,
} from './movementContent';

// "Resistance training — squats and deadlifts" -> "Resistance training"
// Splits only on em/en dashes or a spaced hyphen, never an intra-word hyphen
// ("Post-meal walks" stays intact).
const shortTitle = (s: string): string => (s || '').split(/\s*[—–]\s*|\s+-\s+/)[0].trim() || s;

// Map an engine exercise_recommendation into the shared MovementItem shape so it
// renders in the Exercise subsection alongside placeholder cards.
const mapEngineExercise = (e: any, i: number): MovementItem => ({
  id: `engine-ex-${i}`,
  category: 'exercise',
  title: shortTitle(e.exerciseType),
  short: [e.frequency, e.intensity].filter(Boolean).join(' · ') || 'Recommended for you',
  media: { type: 'video', poster: Dumbell },
  why: e.whyItHelps || 'Recommended based on your lab findings.',
  how: [e.duration && `About ${e.duration} per session.`, e.safetyNotes].filter(Boolean).join(' ')
    || 'Follow the frequency and intensity below.',
  frequency: [e.frequency, e.duration, e.intensity].filter(Boolean).join(' · ') || '—',
  duration: e.duration,
});

interface MovementProps {
  exercise?: any[];
  /**
   * Which subsections this instance shows. Movement passes ['exercise'];
   * Therapeutic Yoga passes ['yoga', 'breathwork', 'meditation'].
   */
  categories?: MovementCategory[];
}

const ExerciseTab: React.FC<MovementProps> = ({ exercise = [], categories = ['exercise'] }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState<MovementCategory>(categories[0]);
  const [selected, setSelected] = useState<MovementItem | null>(null);

  // Exercise subsection = real engine recommendations first, then placeholders.
  const engineItems = useMemo(() => exercise.map(mapEngineExercise), [exercise]);
  const items: MovementItem[] =
    active === 'exercise' ? [...engineItems, ...MOVEMENT_LIBRARY.exercise] : MOVEMENT_LIBRARY[active];

  const visibleCategories = MOVEMENT_CATEGORIES.filter((c) => categories.includes(c.id));
  const activeMeta = MOVEMENT_CATEGORIES.find((c) => c.id === active)!;

  return (
    <Box sx={{ width: '100%', textAlign: 'left' }}>
      {/* Category pills (hidden when the section houses a single category) */}
      {visibleCategories.length > 1 && (
      <Box sx={{ display: 'flex', gap: '12px', mb: 4, flexWrap: 'wrap' }}>
        {visibleCategories.map((c) => {
          const isActive = active === c.id;
          return (
            <Box
              key={c.id}
              onClick={() => setActive(c.id)}
              sx={{
                px: '20px', py: '10px', borderRadius: '999px', cursor: 'pointer',
                border: isActive ? '2px solid #2F5C3E' : '1px solid #E0E0E0',
                backgroundColor: isActive ? '#F1F8F5' : '#FFFFFF',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#2F5C3E' },
              }}
            >
              <Typography sx={{ fontSize: '15px', fontWeight: isActive ? 700 : 600, color: isActive ? '#153226' : '#475467' }}>
                {c.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
      )}

      {/* Section blurb */}
      <Typography sx={{ fontSize: '14px', color: '#667085', mb: 4, maxWidth: 620 }}>
        {activeMeta.blurb}
      </Typography>

      {/* Card grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: '24px', mb: 6,
      }}>
        {items.map((item) => (
          <Box
            key={item.id}
            onClick={() => setSelected(item)}
            sx={{
              backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E4E7EC',
              overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s ease',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
            }}
          >
            {/* Media strip */}
            <Box sx={{
              position: 'relative', height: 150, backgroundColor: '#F1F5F9',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            }}>
              {item.media.poster || item.media.src ? (
                <Box component="img" src={item.media.poster || item.media.src} alt={item.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'contain', p: item.media.type === 'image' ? 3 : 0 }} />
              ) : (
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#98A2B3', letterSpacing: '0.08em' }}>
                  GUIDED AUDIO
                </Typography>
              )}
              {/* media-type badge */}
              <Box sx={{
                position: 'absolute', top: 10, right: 10, px: 1.2, py: 0.3, borderRadius: '999px',
                backgroundColor: 'rgba(26,33,43,0.75)', display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                {item.media.type === 'video' && <Box component="img" src={PlayIcon} alt="" sx={{ width: 9, height: 9, filter: 'brightness(0) invert(1)' }} />}
                <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {item.media.type}
                </Typography>
              </Box>
            </Box>
            {/* Text */}
            <Box sx={{ p: 2.5 }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 800, color: '#1A212B', mb: 0.5 }}>{item.title}</Typography>
              <Typography sx={{ fontSize: '13px', color: '#667085', fontWeight: 500 }}>{item.short}</Typography>
            </Box>
          </Box>
        ))}
        {items.length === 0 && (
          <Typography sx={{ fontSize: '14px', color: '#98A2B3' }}>No sessions yet.</Typography>
        )}
      </Box>

      {/* Detail popup */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
        {selected && (
          <Box sx={{ p: 4, textAlign: 'left' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1A212B' }}>{selected.title}</Typography>
                <Typography sx={{ fontSize: '13px', color: '#667085', mt: 0.5 }}>{selected.short}</Typography>
              </Box>
              <IconButton onClick={() => setSelected(null)} sx={{ p: 0, mt: 0.5 }}>
                <Box component="img" src={CancelIcon} alt="Close" sx={{ width: 20, height: 20 }} />
              </IconButton>
            </Box>

            {/* Media */}
            {selected.media.type === 'audio' ? (
              <Box sx={{ borderRadius: '14px', backgroundColor: '#F1F8F5', border: '1px solid #D9EBE1', p: 2.5, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#2F5C3E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Box component="img" src={PlayIcon} alt="Play" sx={{ width: 14, height: 14, filter: 'brightness(0) invert(1)' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1A212B' }}>Guided audio session</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#667085' }}>{selected.duration || 'Audio'}</Typography>
                </Box>
              </Box>
            ) : (
              <Box
                onClick={() => selected.media.type === 'video' && navigate('/video-player')}
                sx={{
                  position: 'relative', height: 200, borderRadius: '14px', backgroundColor: '#F1F5F9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', mb: 3,
                  cursor: selected.media.type === 'video' ? 'pointer' : 'default',
                }}
              >
                {(selected.media.poster || selected.media.src) && (
                  <Box component="img" src={selected.media.poster || selected.media.src} alt={selected.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain', p: selected.media.type === 'image' ? 3 : 0 }} />
                )}
                {selected.media.type === 'video' && (
                  <Box sx={{ position: 'absolute', width: 52, height: 52, borderRadius: '50%', backgroundColor: 'rgba(47,92,62,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box component="img" src={PlayIcon} alt="Play" sx={{ width: 18, height: 18, filter: 'brightness(0) invert(1)' }} />
                  </Box>
                )}
              </Box>
            )}

            {/* Breathwork steps */}
            {selected.steps && selected.steps.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 1.5 }}>How to do it</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {selected.steps.map((s, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box sx={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#F1F8F5', color: '#2F5C3E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                        {i + 1}
                      </Box>
                      <Typography sx={{ fontSize: '14px', color: '#475467', lineHeight: '22px' }}>{s.caption}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Why / How / How often */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { label: "Why it's important", value: selected.why },
                { label: 'How it works', value: selected.how },
                { label: 'How often', value: selected.frequency },
              ].map((r) => (
                <Box key={r.label}>
                  <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.3 }}>{r.label}</Typography>
                  <Typography sx={{ fontSize: '14px', color: '#475467', lineHeight: '21px' }}>{r.value}</Typography>
                </Box>
              ))}
            </Box>

            {selected.media.type === 'video' && (
              <Button
                onClick={() => navigate('/video-player')}
                variant="outlined"
                sx={{
                  mt: 3, borderRadius: '12px', textTransform: 'none', borderColor: '#256111', color: '#256111',
                  px: 3, py: 1, fontSize: '14px', fontWeight: 700,
                  '&:hover': { borderColor: '#1a430c', backgroundColor: '#F1F5F9' },
                }}
              >
                Open full player
              </Button>
            )}
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default ExerciseTab;
