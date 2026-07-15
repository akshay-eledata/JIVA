import React, { useState, useEffect } from 'react';
import { Box, Typography, InputAdornment, TextField, Dialog, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SaladIcon from '../../assets/salad.svg';
import DumbellIcon from '../../assets/Dumbell.svg';
import MedicineIcon from '../../assets/Medicine-Bottle.svg';
import CancelIcon from '../../assets/cancel.svg';
import LotusIcon from '../../assets/Lotus.svg';
import ExerciseTab from '../ExerciseTab/ExerciseTab';
import { ACTION_PLAN_CONSTANTS } from './constants';
import { ACTION_PLAN_LABELS } from './labels';
import { apiUrl } from '../../config';

import CheckIconAsset from '../../assets/check.svg';
import BlockIconAsset from '../../assets/block.svg';

// "Refined carbohydrates — white rice (arroz blanco)" -> { name, detail, sub }
const parseRec = (s: string): { name: string; detail: string; sub: string } => {
    let base = (s || '').trim();
    let sub = '';
    const paren = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(base);
    if (paren) { base = paren[1].trim(); sub = paren[2].trim(); }
    let name = base;
    let detail = '';
    const parts = base.split(/\s*[—–]\s*|\s+-\s+/);
    if (parts.length > 1) { name = parts[0].trim(); detail = parts.slice(1).join(' — ').trim(); }
    return { name, detail, sub };
};

const rawName = (kind: string, d: any): string =>
    kind === 'exercise' ? d.exerciseType : kind === 'supplement' ? d.supplementName : d.food;

const detailRows = (kind: string, d: any): { label: string; value: string }[] => {
    const rows =
        kind === 'eat' ? [
            { label: 'How much', value: d.quantityFrequency },
            { label: 'Why it helps', value: d.rationale },
        ] : kind === 'avoid' ? [
            { label: 'Action', value: d.avoidanceLevel },
            { label: 'Target', value: d.reductionTarget },
            { label: 'Why avoid', value: d.rationale },
        ] : kind === 'exercise' ? [
            { label: 'Frequency', value: d.frequency },
            { label: 'Duration', value: d.duration },
            { label: 'Intensity', value: d.intensity },
            { label: 'Why it helps', value: d.whyItHelps },
            { label: 'Safety', value: d.safetyNotes },
        ] : [
            { label: 'Dosage', value: d.dosageRange },
            { label: 'Timing', value: d.timing },
            { label: 'Why it helps', value: d.whyItHelps },
            { label: 'Safety', value: d.safetyNote },
            { label: 'Availability', value: d.localAvailabilityNote },
            { label: 'Tier', value: d.startTier },
        ];
    return rows.filter((r) => r.value);
};

const ActionPlan: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Food');
    const [subTab, setSubTab] = useState<'Enjoy' | 'Limit'>('Enjoy');
    const [selectedAlpha, setSelectedAlpha] = useState('#');
    const [search, setSearch] = useState('');
    const [report, setReport] = useState<any>(null);
    const [selected, setSelected] = useState<{ kind: string; data: any } | null>(null);

    useEffect(() => {
        fetch(apiUrl('/api/me/report/latest'), { credentials: 'include' })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => d && setReport(d))
            .catch(() => {});
    }, []);

    const eat = report?.foods_to_eat || [];
    const avoid = report?.foods_to_avoid || [];
    const allExercises = report?.exercise_recommendations || [];
    const movementItems = allExercises.filter((e: any) => !e.exerciseType.toLowerCase().match(/(yoga|meditation|breathwork)/));
    const yogaItems = allExercises.filter((e: any) => e.exerciseType.toLowerCase().match(/(yoga|meditation|breathwork)/));
    const supplements = report?.supplement_recommendations || [];
    const flagged =
        (report?.lab_analysis?.outOfRangeCount || 0) + (report?.lab_analysis?.borderlineCount || 0);

    const alphabets = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

    const tabs = [
        { id: 'Food', label: ACTION_PLAN_LABELS.TAB_FOOD, icon: SaladIcon },
        { id: 'Exercise', label: ACTION_PLAN_LABELS.TAB_EXERCISE, icon: DumbellIcon },
        { id: 'Yoga', label: ACTION_PLAN_LABELS.TAB_YOGA, icon: LotusIcon },
        { id: 'Supplements', label: ACTION_PLAN_LABELS.TAB_SUPPLEMENTS, icon: MedicineIcon },
    ];

    // Food list for the active toggle, parsed + search-filtered + grouped by letter.
    const foodKind = subTab === 'Enjoy' ? 'eat' : 'avoid';
    const foodSource = subTab === 'Enjoy' ? eat : avoid;
    const foodItems = foodSource
        .map((f: any) => ({ data: f, name: parseRec(f.food).name }))
        .filter((x: any) => x.name.toLowerCase().includes(search.toLowerCase()));
    const groups: Record<string, any[]> = {};
    foodItems.forEach((x: any) => {
        const L = (x.name[0] || '#').toUpperCase();
        (groups[L] = groups[L] || []).push(x);
    });
    const letters =
        selectedAlpha === '#'
            ? Object.keys(groups).sort()
            : groups[selectedAlpha]
                ? [selectedAlpha]
                : [];

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: ACTION_PLAN_CONSTANTS.MAX_WIDTH,
                margin: '0 auto',
                padding: ACTION_PLAN_CONSTANTS.CONTAINER_PADDING,
                textAlign: 'center',
            }}
        >
            {/* Title */}
            <Typography variant="h1" sx={{ fontSize: '32px', fontWeight: 700, color: '#1A212B', mb: 5 }}>
                {ACTION_PLAN_LABELS.TITLE}
            </Typography>

            {/* Main Tabs (Food, Exercise, Supplements) */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: ACTION_PLAN_CONSTANTS.TABS_GAP, mb: 5, flexWrap: 'wrap' }}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <Box
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            sx={{
                                display: 'flex', alignItems: 'center', padding: '12px 24px',
                                minWidth: ACTION_PLAN_CONSTANTS.TAB_MIN_WIDTH, height: ACTION_PLAN_CONSTANTS.TAB_HEIGHT,
                                borderRadius: ACTION_PLAN_CONSTANTS.TAB_BORDER_RADIUS,
                                border: isActive ? '2px solid #2F5C3E' : '1px solid #E0E0E0',
                                backgroundColor: '#FFFFFF', cursor: 'pointer', transition: 'all 0.2s ease', gap: '16px',
                                boxShadow: isActive ? '0px 4px 12px rgba(47, 92, 62, 0.1)' : 'none',
                            }}
                        >
                            <Box sx={{
                                width: ACTION_PLAN_CONSTANTS.ICON_BG_SIZE, height: ACTION_PLAN_CONSTANTS.ICON_BG_SIZE,
                                borderRadius: ACTION_PLAN_CONSTANTS.ICON_BG_RADIUS, backgroundColor: isActive ? '#F1F8F5' : '#F9FAFB',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Box component="img" src={tab.icon} alt={tab.label} sx={{ width: ACTION_PLAN_CONSTANTS.ICON_SIZE, height: ACTION_PLAN_CONSTANTS.ICON_SIZE }} />
                            </Box>
                            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#344054' }}>{tab.label}</Typography>
                        </Box>
                    );
                })}
            </Box>

            {/* Description Text */}
            <Typography sx={{ fontSize: '16px', color: '#1A212B', lineHeight: '1.6', maxWidth: ACTION_PLAN_CONSTANTS.DESC_MAX_WIDTH, margin: '0 auto', mb: 8 }}>
                Here is your personalised action plan, targeting your{' '}
                <Box component="span" sx={{ fontWeight: 700, textDecoration: 'underline' }}>
                    {flagged} flagged biomarker{flagged === 1 ? '' : 's'}
                </Box>
                . These recommendations are specific to your lab findings.
            </Typography>

            {activeTab === 'Exercise' ? (
                <Box sx={{ width: ACTION_PLAN_CONSTANTS.FOOD_CONTAINER_WIDTH, margin: '0 auto', textAlign: 'left' }}>
                    <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#256111', mb: 2 }}>Recommended for you</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 6 }}>
                        {movementItems.map((e: any, i: number) => (
                            <Box key={i} onClick={() => setSelected({ kind: 'exercise', data: e })}
                                sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #E4E7EC', cursor: 'pointer', '&:hover': { boxShadow: '0px 4px 12px rgba(0,0,0,0.06)' } }}>
                                <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#1A212B' }}>{parseRec(e.exerciseType).name}</Typography>
                                <Typography sx={{ fontSize: '13px', color: '#667085', mt: 0.5 }}>{[e.frequency, e.duration, e.intensity].filter(Boolean).join(' · ')}</Typography>
                            </Box>
                        ))}
                        {movementItems.length === 0 && <Typography sx={{ fontSize: '14px', color: '#98A2B3' }}>No exercise recommendations yet.</Typography>}
                    </Box>
                </Box>
            ) : activeTab === 'Yoga' ? (
                <Box sx={{ width: '100%', margin: '0 auto', textAlign: 'left' }}>
                    <ExerciseTab yogaItems={yogaItems} movementItems={[]} setSelected={setSelected} />
                </Box>
            ) : activeTab === 'Supplements' ? (
                <Box sx={{ width: ACTION_PLAN_CONSTANTS.FOOD_CONTAINER_WIDTH, margin: '0 auto', textAlign: 'left' }}>
                    <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#256111', mb: 3 }}>Recommended Supplements</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {supplements.map((s: any, i: number) => (
                            <Box key={i} onClick={() => setSelected({ kind: 'supplement', data: s })}
                                sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #E4E7EC', cursor: 'pointer', '&:hover': { boxShadow: '0px 4px 12px rgba(0,0,0,0.06)' } }}>
                                <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#1A212B' }}>{parseRec(s.supplementName).name}</Typography>
                                <Typography sx={{ fontSize: '13px', color: '#667085', mt: 0.5 }}>{[s.dosageRange, s.timing].filter(Boolean).join(' · ')}</Typography>
                            </Box>
                        ))}
                        {supplements.length === 0 && <Typography sx={{ fontSize: '14px', color: '#98A2B3' }}>No supplement recommendations yet.</Typography>}
                    </Box>
                </Box>
            ) : (
                <Box sx={{ width: ACTION_PLAN_CONSTANTS.FOOD_CONTAINER_WIDTH, margin: '0 auto', textAlign: 'left' }}>
                    <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#256111', mb: 2 }}>{ACTION_PLAN_LABELS.RECOMMENDED_FOOD}</Typography>

                    <Box sx={{
                        borderTop: '1px solid #728197', borderRadius: '16px 16px 0 0', padding: ACTION_PLAN_CONSTANTS.FOOD_SECTION_PADDING,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2,
                    }}>
                        {/* Toggle Switch */}
                        <Box sx={{ display: 'flex', backgroundColor: '#D0D5DD', borderRadius: ACTION_PLAN_CONSTANTS.TOGGLE_BORDER_RADIUS, padding: ACTION_PLAN_CONSTANTS.TOGGLE_PADDING, width: 'fit-content' }}>
                            <Box onClick={() => setSubTab('Enjoy')}
                                sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: ACTION_PLAN_CONSTANTS.TOGGLE_ITEM_PADDING, borderRadius: ACTION_PLAN_CONSTANTS.TOGGLE_ITEM_RADIUS, backgroundColor: subTab === 'Enjoy' ? '#FFFFFF' : 'transparent', boxShadow: subTab === 'Enjoy' ? '0px 1px 2px rgba(16, 24, 40, 0.05)' : 'none', cursor: 'pointer', transition: 'all 0.2s ease', color: subTab === 'Enjoy' ? '#1D2939' : '#475467', fontWeight: 500 }}>
                                <Box component="img" src={CheckIconAsset} alt="Check" sx={{ width: '16px', height: '14px' }} />
                                <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{ACTION_PLAN_LABELS.ENJOY_THESE}</Typography>
                            </Box>
                            <Box onClick={() => setSubTab('Limit')}
                                sx={{ display: 'flex', alignItems: 'center', gap: '8px', padding: ACTION_PLAN_CONSTANTS.TOGGLE_ITEM_PADDING, borderRadius: ACTION_PLAN_CONSTANTS.TOGGLE_ITEM_RADIUS, backgroundColor: subTab === 'Limit' ? '#FFFFFF' : 'transparent', boxShadow: subTab === 'Limit' ? '0px 1px 2px rgba(16, 24, 40, 0.05)' : 'none', cursor: 'pointer', transition: 'all 0.2s ease', color: subTab === 'Limit' ? '#1D2939' : '#475467', fontWeight: 500 }}>
                                <Box component="img" src={BlockIconAsset} alt="Block" sx={{ width: '16px', height: '16px' }} />
                                <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{ACTION_PLAN_LABELS.LIMIT_THESE}</Typography>
                            </Box>
                        </Box>

                        {/* Search Bar */}
                        <TextField
                            placeholder={ACTION_PLAN_LABELS.SEARCH_PLACEHOLDER}
                            size="small"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{
                                width: ACTION_PLAN_CONSTANTS.SEARCH_WIDTH,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: ACTION_PLAN_CONSTANTS.TOGGLE_BORDER_RADIUS, backgroundColor: '#FFFFFF', height: ACTION_PLAN_CONSTANTS.SEARCH_HEIGHT,
                                    '& fieldset': { borderColor: '#D0D5DD' },
                                    '&:hover fieldset': { borderColor: '#D0D5DD' },
                                    '&.Mui-focused fieldset': { borderColor: '#2F5C3E' },
                                },
                            }}
                            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: '#667085', fontSize: '20px' }} /></InputAdornment>) }}
                        />
                    </Box>

                    {/* Alphabet Filter List */}
                    <Box sx={{
                        display: 'flex', gap: ACTION_PLAN_CONSTANTS.ALPHABETS_GAP, py: ACTION_PLAN_CONSTANTS.ALPHABETS_PADDING_Y, mb: 4, flexWrap: 'wrap',
                        justifyContent: 'flex-start', overflowX: 'auto', borderTop: '1px solid #7281974D', borderBottom: '1px solid #7281974D',
                        '&::-webkit-scrollbar': { height: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#E4E7EC', borderRadius: '2px' },
                    }}>
                        {alphabets.map((alpha) => (
                            <Typography key={alpha} onClick={() => setSelectedAlpha(alpha)}
                                sx={{ fontSize: '14px', fontWeight: selectedAlpha === alpha ? 800 : 600, color: selectedAlpha === alpha ? '#153226' : '#256111', cursor: 'pointer', '&:hover': { color: '#153226', transform: 'scale(1.1)' }, transition: 'all 0.1s ease' }}>
                                {alpha}
                            </Typography>
                        ))}
                    </Box>

                    {/* Food List Sections (grouped by first letter) */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: ACTION_PLAN_CONSTANTS.FOOD_LIST_GAP }}>
                        {letters.map((L) => (
                            <Box key={L}>
                                <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#101828', mb: 3 }}>{L}</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: ACTION_PLAN_CONSTANTS.FOOD_SUBSECTION_GAP }}>
                                    {groups[L].map((x: any, idx: number) => (
                                        <Typography key={idx} onClick={() => setSelected({ kind: foodKind, data: x.data })}
                                            sx={{ fontSize: '15px', fontWeight: 500, color: '#475467', cursor: 'pointer', '&:hover': { color: '#256111', textDecoration: 'underline' } }}>
                                            {x.name}
                                        </Typography>
                                    ))}
                                </Box>
                                <Box sx={{ width: '100%', height: '1px', backgroundColor: '#F2F4F7', mt: 4 }} />
                            </Box>
                        ))}
                        {letters.length === 0 && (
                            <Typography sx={{ fontSize: '14px', color: '#98A2B3' }}>
                                {report ? 'No matching foods.' : 'Sign in to see your personalised food plan.'}
                            </Typography>
                        )}
                    </Box>
                </Box>
            )}

            {/* Detail popup */}
            <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
                {selected && (() => {
                    const { name, detail, sub } = parseRec(rawName(selected.kind, selected.data));
                    const rows = detail
                        ? [{ label: 'Includes', value: detail }, ...detailRows(selected.kind, selected.data)]
                        : detailRows(selected.kind, selected.data);
                    return (
                        <Box sx={{ p: 4, textAlign: 'left' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1A212B' }}>{name}</Typography>
                                <IconButton onClick={() => setSelected(null)} sx={{ p: 0, mt: 0.5 }}>
                                    <Box component="img" src={CancelIcon} alt="Close" sx={{ width: 20, height: 20 }} />
                                </IconButton>
                            </Box>
                            {sub && <Typography sx={{ fontSize: '14px', fontStyle: 'italic', color: '#667085', mb: 2 }}>{sub}</Typography>}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                {rows.map((r) => (
                                    <Box key={r.label}>
                                        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.3 }}>{r.label}</Typography>
                                        <Typography sx={{ fontSize: '14px', color: '#475467', lineHeight: '21px' }}>{r.value}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    );
                })()}
            </Dialog>
        </Box>
    );
};

export default ActionPlan;
