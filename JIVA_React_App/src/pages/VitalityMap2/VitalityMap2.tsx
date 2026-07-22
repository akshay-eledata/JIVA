import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { Box, Typography, Button, IconButton, Dialog } from '@mui/material';
import CancelIcon from '../../assets/cancel.svg';
import BiomarkerIcon from '../../assets/Biomarker.svg';
import ForkPlateIcon from '../../assets/fork-plate.svg';
import NoFoodIcon from '../../assets/No-food.svg';
import AlignIcon from '../../assets/Align.svg';
import MedicineBottleIcon from '../../assets/Medicine-Bottle.svg';
import { apiUrl } from '../../config';
import { spectrumColor, spectrumTileGradient, SPECTRUM_GRADIENT } from '../../utils/spectrumColor';
import SystemCompare, { ComparePayload } from '../../Component/SystemCompare/SystemCompare';
import { VITALITY_MAP2_LABELS } from './labels';
import NextDraw from '../../Component/NextDraw/NextDraw';

const CARD_RADIUS = '32px';
const CARD_HEIGHT = '340px';

/* Parse "Walnuts (nueces)" / "Refined carbs — white rice (arroz)" for the plan cards. */
const parseRec = (s: string): { name: string; detail: string; sub: string } => {
    let base = (s || '').trim();
    let sub = '';
    const paren = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(base);
    if (paren) { base = paren[1].trim(); sub = paren[2].trim(); }
    let name = base;
    let detail = '';
    const parts = base.split(/\s*[—–]\s*|\s+-\s+/);
    if (parts.length > 1) { name = parts[0].trim(); detail = parts.slice(1).join(', ').trim(); }
    return { name, detail, sub };
};

/* ── Updated plan (maintenance) — same card language as the original map ───── */
const PlanSection: React.FC<{ report: any }> = ({ report }) => {
    const eat = (report?.foods_to_eat || []).slice(0, 5);
    const avoid = (report?.foods_to_avoid || []).slice(0, 5);
    const exercise = (report?.exercise_recommendations || []).slice(0, 2);
    const supplements = (report?.supplement_recommendations || []).slice(0, 3);
    const [selected, setSelected] = useState<{ kind: string; data: any } | null>(null);
    // Monochrome SVG through a CSS mask so it takes the category accent color.
    // The url() MUST be quoted: Vite inlines small SVGs as data: URIs containing
    // single quotes, and an unquoted url() with quotes in it is invalid CSS —
    // the browser silently drops mask-image and the icon renders as a square.
    const mkIcon = (src: string, color: string, size: number = 18) => (
        <Box
            style={{
                width: size,
                height: size,
                backgroundColor: color,
                maskImage: `url("${src}")`,
                maskSize: 'contain',
                maskPosition: 'center',
                maskRepeat: 'no-repeat',
            }}
        />
    );

    const rawName = (kind: string, d: any): string =>
        kind === 'exercise' ? d.exerciseType : kind === 'supplement' ? d.supplementName : d.food;
    const nameFor = (kind: string, d: any): string => parseRec(rawName(kind, d)).name;
    const detailRows = (kind: string, d: any): { label: string; value: string }[] => {
        const rows = kind === 'eat' ? [
            { label: 'How much', value: d.quantityFrequency }, { label: 'Why it helps', value: d.rationale },
        ] : kind === 'avoid' ? [
            { label: 'Action', value: d.avoidanceLevel }, { label: 'Target', value: d.reductionTarget }, { label: 'Why avoid', value: d.rationale },
        ] : kind === 'exercise' ? [
            { label: 'Frequency', value: d.frequency }, { label: 'Duration', value: d.duration }, { label: 'Intensity', value: d.intensity },
            { label: 'Why it helps', value: d.whyItHelps }, { label: 'Safety', value: d.safetyNotes },
        ] : [
            { label: 'Dosage', value: d.dosageRange }, { label: 'Timing', value: d.timing }, { label: 'Why it helps', value: d.whyItHelps },
            { label: 'Safety', value: d.safetyNote }, { label: 'Availability', value: d.localAvailabilityNote }, { label: 'Tier', value: d.startTier },
        ];
        return rows.filter((r) => r.value);
    };

    // Same brand-family category accents as VitalityMap's recommendations.
    const cards = [
        { id: 'food-eat', title: 'Food to Eat', kind: 'eat', data: eat, icon: ForkPlateIcon, accent: '#2A6130', tint: '#E7F2E8', headerTint: '#F0F7F0' },
        { id: 'food-avoid', title: 'Food to Avoid', kind: 'avoid', data: avoid, icon: NoFoodIcon, accent: '#B0492C', tint: '#FAE8E2', headerTint: '#FBF1ED' },
        { id: 'exercise', title: 'Movement', kind: 'exercise', data: exercise, icon: AlignIcon, accent: '#1F5C50', tint: '#E3EFEB', headerTint: '#EFF6F4' },
        { id: 'supplements', title: 'Supplements', kind: 'supplement', data: supplements, icon: MedicineBottleIcon, accent: '#A16B15', tint: '#F9F0DC', headerTint: '#FBF6EA' },
    ];

    const renderCard = (card: (typeof cards)[number], noContainer = false) => {
        const content = (
            <>
                <Box sx={{ p: '16px 24px', backgroundColor: card.headerTint, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, borderBottom: '1px solid #DCE7DD' }}>
                    <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1A212B', textAlign: 'left' }}>{card.title}</Typography>
                    <Box sx={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: card.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {mkIcon(card.icon, card.accent, 18)}
                    </Box>
                </Box>
                <Box sx={{ p: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {card.data.map((d: any, i: number) => (
                        <Box key={i} onClick={() => setSelected({ kind: card.kind, data: d })}
                            sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '12px', borderRadius: '36px', backgroundColor: '#FFFFFF', border: '1px solid #EEF4EE', cursor: 'pointer', transition: 'all 0.2s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0px 4px 12px rgba(23,48,27,0.10)' } }}>
                            <Box sx={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: card.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {mkIcon(card.icon, card.accent, 16)}
                            </Box>
                            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1A212B', textAlign: 'left', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {nameFor(card.kind, d)}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </>
        );
        if (noContainer) return content;
        return <Box sx={{ borderRadius: '24px', backgroundColor: '#FFFFFF', border: '1px solid #DCE7DD', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>{content}</Box>;
    };

    return (
        <Box sx={{ mt: 6, backgroundColor: '#F3F9F3', borderRadius: '40px', p: 5, border: '1px solid #DCE7DD' }}>
            <Typography sx={{ textAlign: 'left', fontSize: '28px', fontWeight: 700, color: '#000000', mb: 1 }}>{VITALITY_MAP2_LABELS.RECOMMENDED_TITLE}</Typography>
            <Typography sx={{ textAlign: 'left', fontSize: '15px', color: '#667085', mb: 4 }}>Your plan now shifts toward maintaining the gains you've made.</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 3, alignItems: 'stretch' }}>
                <Box sx={{ minWidth: 0 }}>{renderCard(cards[0])}</Box>
                <Box sx={{ minWidth: 0 }}>{renderCard(cards[1])}</Box>
                <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', borderRadius: '24px', border: '1px solid #DCE7DD', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
                    {renderCard(cards[2], true)}
                    <Box sx={{ height: '0.5px', backgroundColor: '#DCE7DD' }} />
                    {renderCard(cards[3], true)}
                </Box>
            </Box>
            <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
                {selected && (() => {
                    const { name, detail, sub } = parseRec(rawName(selected.kind, selected.data));
                    const rows = detail ? [{ label: 'Includes', value: detail }, ...detailRows(selected.kind, selected.data)] : detailRows(selected.kind, selected.data);
                    return (
                        <Box sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1A212B' }}>{name}</Typography>
                                <IconButton onClick={() => setSelected(null)} sx={{ p: 0, mt: 0.5 }}><Box component="img" src={CancelIcon} alt="Close" sx={{ width: 20, height: 20 }} /></IconButton>
                            </Box>
                            {sub && <Typography sx={{ fontSize: '14px', fontStyle: 'italic', color: '#667085', mb: 2 }}>{sub}</Typography>}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                {rows.map((r) => (
                                    <Box key={r.label} sx={{ textAlign: 'left' }}>
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

/* ── Small stat tile for the progress strip ───────────────────────────────── */
const StatTile: React.FC<{ label: string; value: React.ReactNode; sub?: string; accent: string; bg: string }> = ({ label, value, sub, accent, bg }) => (
    <Box sx={{ flex: 1, backgroundColor: bg, borderRadius: '20px', p: '20px 22px', border: '1px solid #E2E8F0', textAlign: 'left' }}>
        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>{label}</Typography>
        <Typography sx={{ fontSize: '32px', fontWeight: 800, color: accent, lineHeight: 1.05, fontFamily: 'Source Sans Pro' }}>{value}</Typography>
        {sub && <Typography sx={{ fontSize: '13px', color: '#667085', mt: 0.5 }}>{sub}</Typography>}
    </Box>
);

const VitalityMap2: React.FC = () => {
    const navigate = useNavigate();
    const [systems, setSystems] = useState<any[]>([]);
    const [report, setReport] = useState<any>(null);
    const [compare, setCompare] = useState<ComparePayload | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSys, setSelectedSys] = useState<number | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [mode, setMode] = useState<'compare' | 'heatmap'>('compare');
    const [clinicalOpen, setClinicalOpen] = useState(false);
    const [bioAgeOpen, setBioAgeOpen] = useState(false);

    // Drill into a biomarker's detail page in trend mode (two-test graph + explainer).
    const openBiomarker = (testName: string) => navigate(`/biomarker/${encodeURIComponent(testName)}?trend=1`);

    useEffect(() => {
        const load = async () => {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/signin'); return; }
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const [bmRes, repRes, cmpRes] = await Promise.all([
                    fetch(apiUrl('/api/me/biomarkers?groupBy=system&visit=2'), { headers }),
                    fetch(apiUrl('/api/me/report/latest?visit=2'), { headers }),
                    fetch(apiUrl('/api/me/compare?from=1&to=2'), { headers }),
                ]);
                if (bmRes.ok) { const d = await bmRes.json(); setSystems(d.systems || []); }
                if (repRes.ok) { setReport(await repRes.json()); }
                if (cmpRes.ok) { setCompare(await cmpRes.json()); }
            } catch (err) {
                console.error('Error fetching Vitality Map 2 data:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const SHORT: Record<string, string> = { 'Immune/Inflammatory': 'Immunity', 'Hormonal/Reproductive': 'Hormonal' };
    const activeSystems = systems.map((s: any) => ({
        name: SHORT[s.name] || s.displayName || s.name,
        systemName: s.name,
        counts: s.counts,
        statusText: `${s.counts.inRange}/${s.counts.total} in Range`,
        color: spectrumColor(s.spectrumP),
        gradient: spectrumTileGradient(s.spectrumP),
        biomarkers: s.biomarkers || [],
    }));
    const selectedSystem = selectedSys != null ? activeSystems[selectedSys] : null;
    const displayedBiomarkers = selectedSystem ? (selectedSystem.biomarkers || []) : activeSystems.flatMap((s: any) => s.biomarkers || []);

    const la = report?.lab_analysis;
    const rangeCounts = selectedSystem
        ? { inRange: selectedSystem.counts.inRange || 0, out: selectedSystem.counts.outOfRange || 0, borderline: selectedSystem.counts.borderline || 0, critical: selectedSystem.counts.critical || 0 }
        : { inRange: la?.inRangeCount || 0, out: la?.outOfRangeCount || 0, borderline: la?.borderlineCount || 0, critical: la?.criticalCount || 0 };

    // Biological age + delta vs first test.
    const bioAge = report?.biological_age ?? null;
    const bioAgeExplanation = report?.biological_age_explanation || '';
    const bioAgePrev = compare?.from?.biologicalAge ?? null;
    const bioAgeChange = bioAge != null && bioAgePrev != null ? Math.round((bioAge - bioAgePrev) * 10) / 10 : null;
    const calAge = report?.patient?.age;
    const bioTrendWord = bioAgeChange == null ? 'From' : bioAgeChange < 0 ? 'Down from' : bioAgeChange > 0 ? 'Up from' : 'Unchanged at';
    const yrs = (n: number) => `${n} year${n === 1 ? '' : 's'}`;
    const bioVsCal =
        bioAge == null || calAge == null ? ''
            : Math.abs(bioAge - calAge) < 0.5 ? `now matched to your calendar age of ${calAge}`
                : bioAge > calAge ? `now about ${yrs(Math.round((bioAge - calAge) * 10) / 10)} above your calendar age of ${calAge}`
                    : `now about ${yrs(Math.round((calAge - bioAge) * 10) / 10)} below your calendar age of ${calAge}`;

    const systemSummary = selectedSystem
        ? ((report?.system_summaries || []).find((ss: any) => ss.systemName === selectedSystem.systemName)?.summary || '')
        : '';
    const overallSummary = report?.overall_summary || report?.patient_summary || '';
    const clinicalTitle = selectedSystem ? `Clinical Notes: ${selectedSystem.name}` : 'Clinical Notes: What Changed';
    const clinicalBody = selectedSystem ? systemSummary : overallSummary;

    const headline = compare?.headline;
    const outPrev = compare?.from?.counts?.outOfRange ?? null;
    const outNow = la?.outOfRangeCount ?? null;
    const todayStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    // Declines drive the follow-up-test upsell — surface them prominently.
    const declinedCount = headline?.worsened || 0;
    const decliningSystemNames = (compare?.systemDeltas || [])
        .filter((s: any) => s.deltaSpectrum > 0.001)
        .sort((a: any, b: any) => b.deltaSpectrum - a.deltaSpectrum)
        .map((s: any) => SHORT[s.name] || s.displayName || s.name);
    const joinNames = (arr: string[]) => (arr.length <= 1 ? (arr[0] || '') : `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}`);

    if (loading) {
        return <Box sx={{ width: '100%', maxWidth: '1300px', margin: '0 auto', p: 8, textAlign: 'center', color: '#98A2B3' }}>Loading your retest…</Box>;
    }

    return (
        <Box sx={{ width: '100%', maxWidth: '1300px', margin: '0 auto' }}>
            {/* Bio age detail dialog */}
            <Dialog open={bioAgeOpen} onClose={() => setBioAgeOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
                <Box sx={{ p: 4, textAlign: 'left', fontFamily: 'Source Sans Pro' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Biological Age</Typography>
                            <Typography sx={{ fontSize: '30px', fontWeight: 700, color: '#1A212B', lineHeight: 1.1 }}>
                                {bioAge != null ? `${bioAge} years` : '—'}{bioAgePrev != null ? ` (was ${bioAgePrev})` : ''}
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setBioAgeOpen(false)} sx={{ p: 0, mt: 0.5 }}><Box component="img" src={CancelIcon} alt="Close" sx={{ width: 20, height: 20 }} /></IconButton>
                    </Box>
                    <Typography sx={{ fontSize: '15px', color: '#475467', lineHeight: '24px' }}>{bioAgeExplanation}</Typography>
                </Box>
            </Dialog>

            {/* Clinical notes dialog */}
            <Dialog open={clinicalOpen} onClose={() => setClinicalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
                <Box sx={{ p: 4, textAlign: 'left', fontFamily: 'Source Sans Pro' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1A212B' }}>{clinicalTitle}</Typography>
                        <IconButton onClick={() => setClinicalOpen(false)} sx={{ p: 0, mt: 0.5 }}><Box component="img" src={CancelIcon} alt="Close" sx={{ width: 20, height: 20 }} /></IconButton>
                    </Box>
                    <Typography sx={{ fontSize: '15px', color: '#475467', lineHeight: '24px' }}>{clinicalBody}</Typography>
                </Box>
            </Dialog>

            {/* Header */}
            <Box sx={{ mb: 4, mt: 2 }}>
                <Typography variant="h1" sx={{ fontSize: '44px', fontWeight: 800, color: '#1A212B', lineHeight: '52px', letterSpacing: '-0.02em', textAlign: 'left' }}>
                    Your Progress
                </Typography>
                <Typography sx={{ fontSize: '16px', color: '#667085', mt: 0.5, fontWeight: 500, textAlign: 'left' }}>{todayStr}</Typography>
            </Box>

            {/* Next blood draw, scoped to this visit. The first Vitality Map
                shows the second draw as booked; here the third has not been
                scheduled yet, so this shows the countdown to when it is due. */}
            <Box sx={{ mb: 4 }}>
                <NextDraw afterVisit={2} />
            </Box>

            {/* Retest banner */}
            <Box sx={{ backgroundColor: '#ECFDF3', borderRadius: '24px', p: '24px 32px', display: 'flex', alignItems: 'center', gap: 3, border: '1px solid #ABEFC6', mb: 4 }}>
                <Box sx={{ width: 56, height: 56, borderRadius: '14px', backgroundColor: '#FFFFFF', border: '1px solid #D1FADF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Box component="img" src={BiomarkerIcon} sx={{ width: 26, height: 26 }} />
                </Box>
                <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#027A48', mb: 0.5, letterSpacing: '0.05em' }}>{VITALITY_MAP2_LABELS.BANNER_HEADER}</Typography>
                    <Typography sx={{ fontSize: '13.5px', color: '#475467', fontWeight: 400, lineHeight: '20px' }}>{VITALITY_MAP2_LABELS.BANNER_BODY}</Typography>
                </Box>
            </Box>

            {/* Progress strip */}
            {headline && (
                <Box sx={{ mb: 5 }}>
                    <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1A212B', mb: 2, textAlign: 'left' }}>{VITALITY_MAP2_LABELS.PROGRESS_TITLE}</Typography>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <StatTile label="Biomarkers Improved" value={headline.improved} sub={`${headline.enteredRange} moved back into range`} accent="#027A48" bg="#F6FEF9" />
                        <StatTile label="Biomarkers Declined" value={headline.worsened} sub={headline.leftRange ? `${headline.leftRange} moved out of range` : 'need a closer look'} accent="#D92D20" bg="#FEF3F2" />
                        <StatTile label="Out Of Range" value={outPrev != null && outNow != null ? <>{outPrev}<span style={{ color: '#98A2B3', fontWeight: 700 }}> to </span>{outNow}</> : (outNow ?? '—')} sub={outPrev != null && outNow != null ? (outNow < outPrev ? `${outPrev - outNow} fewer flagged markers` : outNow > outPrev ? `${outNow - outPrev} more flagged markers` : 'no change in flagged markers') : 'flagged markers'} accent="#1A212B" bg="#FFFFFF" />
                        <StatTile label="Biological Age" value={bioAge != null ? <>{bioAge}</> : '—'} sub={bioAgeChange != null ? `${bioAgeChange < 0 ? '▼' : bioAgeChange > 0 ? '▲' : ''} ${Math.abs(bioAgeChange)} yrs vs first test` : ''} accent={bioAgeChange != null && bioAgeChange < 0 ? '#027A48' : '#D92D20'} bg="#F6FEF9" />
                    </Box>
                </Box>
            )}

            {/* Follow-up test CTA — surfaced when markers have declined */}
            {declinedCount > 0 && (
                <Box sx={{ mb: 5, borderRadius: '20px', p: { xs: '16px 18px', md: '18px 24px' }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.05)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: '280px' }}>
                        <Box sx={{ width: 42, height: 42, borderRadius: '12px', backgroundColor: '#FFFAEB', border: '1px solid #FEDF89', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Box component="img" src={BiomarkerIcon} sx={{ width: 20, height: 20 }} />
                        </Box>
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography sx={{ fontSize: '17px', fontWeight: 700, color: '#B54708', mb: 0.25 }}>
                                {declinedCount} biomarker{declinedCount === 1 ? '' : 's'} moved out of range, worth a closer look
                            </Typography>
                            <Typography sx={{ fontSize: '13.5px', color: '#667085', lineHeight: '19px', maxWidth: '700px' }}>
                                {decliningSystemNames.length > 0
                                    ? `Your ${joinNames(decliningSystemNames)} ${decliningSystemNames.length === 1 ? 'system' : 'systems'} declined since your first test. A targeted follow-up test confirms these findings and tracks whether they're resolving.`
                                    : `Some markers declined since your first test. A targeted follow-up test confirms these findings and tracks whether they're resolving.`}
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        onClick={() => navigate('/select-packages?mode=addon&basis=change&visit=2')}
                        sx={{ backgroundColor: '#006045', color: '#FFFFFF', borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '14px', px: 3, height: '38px', whiteSpace: 'nowrap', flexShrink: 0, '&:hover': { backgroundColor: '#004d35' } }}
                    >
                        Add targeted tests
                    </Button>
                </Box>
            )}

            {/* Three cards: bio age / range / clinical */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
                {/* Biological Age */}
                <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: CARD_RADIUS, p: 3, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', height: CARD_HEIGHT }}>
                    <Box sx={{ position: 'relative', width: '200px', height: '100px', mt: 2, mb: 3, display: 'flex', justifyContent: 'center' }}>
                        <Chart
                            options={{
                                chart: { type: 'radialBar', offsetY: -30, sparkline: { enabled: true } },
                                plotOptions: { radialBar: { startAngle: -85, endAngle: 85, hollow: { size: '65%' }, track: { background: 'rgba(242, 244, 247, 1)', strokeWidth: '100%' }, dataLabels: { show: false } } },
                                fill: { type: 'gradient', gradient: { shade: 'dark', type: 'vertical', gradientToColors: ['rgba(114, 226, 180, 0.85)'], stops: [0, 36], colorStops: [{ offset: 0, color: 'rgba(84, 173, 136, 0.9)', opacity: 1 }, { offset: 36, color: 'rgba(114, 226, 180, 0.9)', opacity: 1 }] } },
                                stroke: { lineCap: 'round' },
                            }}
                            series={[bioAge != null ? 78 : 0]}
                            type="radialBar"
                            height={250}
                        />
                        <Box sx={{ position: 'absolute', top: '75%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%', pointerEvents: 'none' }}>
                            <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#6B7280', letterSpacing: '0.08em', mb: 0.2, textTransform: 'uppercase' }}>Biological Age</Typography>
                            <Typography sx={{ fontSize: '28px', fontWeight: 700, color: '#1A212B', lineHeight: 1, fontFamily: 'Source Sans Pro' }}>{bioAge != null ? bioAge : '—'}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 2, textAlign: 'left', width: '100%', px: 1 }}>
                        <Box sx={{ width: '100%', height: '1.5px', backgroundColor: '#C8D0DB', mb: 2 }} />
                        {bioAgeChange != null && bioAgePrev != null && (
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.25, py: '4px', borderRadius: '8px', backgroundColor: bioAgeChange < 0 ? '#E7F7F0' : bioAgeChange > 0 ? '#FEECEA' : '#F2F4F7', mb: 1.5 }}>
                                <Typography sx={{ fontSize: '13px', fontWeight: 800, color: bioAgeChange < 0 ? '#027A48' : bioAgeChange > 0 ? '#D92D20' : '#667085' }}>
                                    {bioAgeChange < 0 ? '▼' : bioAgeChange > 0 ? '▲' : ''} {Math.abs(bioAgeChange)} yr{Math.abs(bioAgeChange) === 1 ? '' : 's'} {bioAgeChange < 0 ? 'younger' : bioAgeChange > 0 ? 'older' : ''} than first test
                                </Typography>
                            </Box>
                        )}
                        <Typography sx={{ fontSize: '15px', color: '#475467', lineHeight: '22px', mb: 1.5 }}>
                            {bioTrendWord} <span style={{ fontWeight: 700, color: '#101828' }}>{bioAgePrev ?? '—'}</span> to <span style={{ fontWeight: 700, color: '#101828' }}>{bioAge ?? '—'}</span>{bioVsCal ? `, ${bioVsCal}.` : '.'}
                        </Typography>
                        <Typography onClick={() => bioAgeExplanation && setBioAgeOpen(true)} sx={{ fontSize: '15px', fontWeight: 700, color: bioAgeExplanation ? '#101828' : '#98A2B3', textDecoration: 'underline', cursor: bioAgeExplanation ? 'pointer' : 'default' }}>View More</Typography>
                    </Box>
                </Box>

                {/* Range card */}
                <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: CARD_RADIUS, p: 3, border: '1px solid #E2E8F0', height: CARD_HEIGHT, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                    <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1A212B', mb: 0.5, textAlign: 'left', fontFamily: 'Source Sans Pro' }}>Your New Ranges</Typography>
                    <Typography sx={{ fontSize: '13px', color: '#667085', textAlign: 'left' }}>{selectedSystem ? selectedSystem.name : 'All systems'} · retest</Typography>
                    <Box sx={{ flexGrow: 1, position: 'relative', mt: 1, width: '100%' }}>
                        {(() => {
                            const bars = [
                                { label: 'IN RANGE', count: rangeCounts.inRange, c1: '#81FDCA', c2: '#54AD88' },
                                { label: 'OUT OF RANGE', count: rangeCounts.out, c1: '#FFC48A', c2: '#F0955A' },
                                { label: 'BORDERLINE', count: rangeCounts.borderline, c1: '#FDE68A', c2: '#E8B14C' },
                                { label: 'CRITICAL', count: rangeCounts.critical, c1: '#FDA4A4', c2: '#EF5C5C' },
                            ];
                            const maxV = Math.max(1, ...bars.map((b) => b.count));
                            const MAX_H = 140, MIN_H = 20;
                            return (
                                <Box sx={{ position: 'relative', width: '100%', height: '230px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, pb: '40px', boxSizing: 'border-box' }}>
                                    <Box sx={{ position: 'absolute', top: 0, left: 20, right: 20, bottom: '40px', backgroundImage: 'repeating-linear-gradient(to top, #F2F4F7 0, #F2F4F7 1.5px, transparent 1.5px, transparent 18px)', pointerEvents: 'none' }} />
                                    <Box sx={{ position: 'absolute', left: 20, right: 20, bottom: '40px', height: '1.5px', backgroundColor: '#F2F4F7' }} />
                                    {bars.map((b) => {
                                        const h = Math.max(MIN_H, (b.count / maxV) * MAX_H);
                                        return (
                                            <Box key={b.label} sx={{ position: 'relative', width: '34px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Box sx={{ width: '34px', height: `${h}px`, borderRadius: '8px', position: 'relative', background: `linear-gradient(180deg, ${b.c1} 0%, ${b.c2} 100%)`, transition: 'height 0.7s cubic-bezier(0.22, 1, 0.36, 1)', '&::after': { content: '""', position: 'absolute', top: '6px', left: '6px', right: '6px', bottom: '4px', borderRadius: '4px', backgroundImage: 'repeating-linear-gradient(-45deg, rgba(0,0,0,0.14) 0, rgba(0,0,0,0.14) 3px, transparent 3px, transparent 6px)' } }}>
                                                    <Typography sx={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', fontWeight: 600, color: '#6B7280', fontFamily: 'Source Sans Pro' }}>{b.count}</Typography>
                                                    <Box sx={{ position: 'absolute', top: '9px', left: '50%', transform: 'translateX(-50%)', width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#4B5563', border: '1.5px solid #FFFFFF' }} />
                                                </Box>
                                                <Typography sx={{ position: 'absolute', bottom: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '8px', fontWeight: 600, color: '#475467', whiteSpace: 'nowrap', letterSpacing: '0.02em', fontFamily: 'Source Sans Pro' }}>{b.label}</Typography>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            );
                        })()}
                    </Box>
                </Box>

                {/* Clinical notes */}
                <Box sx={{ backgroundColor: '#FFFFFF', borderRadius: CARD_RADIUS, p: 3, border: '1px solid #E2E8F0', height: CARD_HEIGHT, display: 'flex', flexDirection: 'column', textAlign: 'left', fontFamily: 'Source Sans Pro' }}>
                    <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1A212B', mb: 3 }}>{clinicalTitle}</Typography>
                    <Typography sx={{ fontSize: '14px', color: '#475467', lineHeight: '24px', mb: 'auto', display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {clinicalBody || 'Your clinical notes will appear here.'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 3, borderTop: '1px solid #F2F4F7' }}>
                        <Button variant="outlined" onClick={() => setClinicalOpen(true)} disabled={!clinicalBody} sx={{ textTransform: 'none', borderRadius: '12px', fontFamily: 'lexend', borderColor: '#256111', color: '#256111', fontWeight: 600, px: 4, height: '44px', '&:hover': { borderColor: '#004d35', backgroundColor: '#F3FAF7' } }}>Read More</Button>
                    </Box>
                </Box>
            </Box>

            {/* Compare Biomarkers section */}
            <Box sx={{ mt: 6, backgroundColor: '#FFFFFF', borderRadius: '40px', p: 4.5, border: '1px solid #E2E8F0', boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.05)' }}>
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <Typography sx={{ fontSize: '24px', fontWeight: 600, color: '#1A212B', fontFamily: 'Source Sans Pro' }}>{VITALITY_MAP2_LABELS.COMPARE_TITLE}</Typography>
                    <Box sx={{ display: 'flex', borderRadius: '10px', p: '2px', alignItems: 'center', backgroundColor: '#C8D0DB' }}>
                        <Box onClick={() => setMode('compare')} sx={{ px: 3, py: '6px', borderRadius: '10px', backgroundColor: mode === 'compare' ? '#F9FAFB' : 'transparent', cursor: 'pointer' }}>
                            <Typography sx={{ fontSize: '12px', fontFamily: 'Lexend', color: '#1A212B' }}>Compare</Typography>
                        </Box>
                        <Box onClick={() => setMode('heatmap')} sx={{ px: 3, py: '6px', borderRadius: '10px', backgroundColor: mode === 'heatmap' ? '#F9FAFB' : 'transparent', cursor: 'pointer' }}>
                            <Typography sx={{ fontSize: '12px', fontFamily: 'Lexend', color: '#1A212B' }}>Heat Map</Typography>
                        </Box>
                    </Box>
                </Box>

                {mode === 'compare' ? (
                    <SystemCompare compare={compare} onSelectBiomarker={openBiomarker} />
                ) : (
                    <Box sx={{ display: 'flex', gap: 5 }}>
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }}>
                                {activeSystems.map((item, index) => (
                                    <Box key={index} onClick={() => setSelectedSys(selectedSys === index ? null : index)}
                                        sx={{ background: item.gradient, borderRadius: '22px', p: '16px 18px', height: '96px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)', border: 'none', boxShadow: selectedSys === index ? '0px 16px 28px rgba(23,48,27,0.26), 0px 4px 8px rgba(23,48,27,0.14), inset 0 0 0 1.5px rgba(23,48,27,0.30)' : '0px 6px 16px rgba(23,48,27,0.10), 0px 1px 3px rgba(23,48,27,0.06)', transform: selectedSys === index ? 'translateY(-3px)' : 'none', '&:hover': { transform: 'translateY(-3px)', boxShadow: selectedSys === index ? '0px 16px 28px rgba(23,48,27,0.26), 0px 4px 8px rgba(23,48,27,0.14), inset 0 0 0 1.5px rgba(23,48,27,0.30)' : '0px 12px 24px rgba(23,48,27,0.16), 0px 3px 6px rgba(23,48,27,0.08)' } }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box sx={{ minWidth: 0, flex: 1, pr: 1 }}>
                                                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1A212B', mb: 0.5, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</Typography>
                                                <Typography sx={{ fontSize: '11px', fontWeight: 500, color: '#475467', textAlign: 'left' }}>{item.statusText}</Typography>
                                            </Box>
                                            <Box sx={{ width: '30px', height: '30px', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0px 2px 6px rgba(23,48,27,0.10)' }}>
                                                <Box component="img" src={BiomarkerIcon} alt="biomarker" sx={{ width: '16px', height: '16px' }} />
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        <Box sx={{ width: '1.5px', backgroundColor: '#EDF2F7', alignSelf: 'stretch', mx: 2 }} />
                        <Box sx={{ width: '420px', pt: 1 }}>
                            <Typography sx={{ fontSize: '20px', fontWeight: 600, color: '#1A212B', mb: 2, textAlign: 'left' }}>{selectedSystem ? selectedSystem.name : 'All Biomarkers'} · {displayedBiomarkers.length}</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxHeight: '420px', overflowY: isExpanded ? 'auto' : 'hidden' }}>
                                {(isExpanded ? displayedBiomarkers : displayedBiomarkers.slice(0, 4)).map((item: any, idx: number) => {
                                    const isIn = item.status === 'in_range';
                                    const isBord = item.status === 'borderline';
                                    const barColor = isIn ? '#BAEBD7' : isBord ? '#FCE4B0' : '#FFD2C2';
                                    const txtColor = isIn ? '#006045' : isBord ? '#B7791F' : '#D92D20';
                                    const label = isIn ? 'In Range' : isBord ? 'Borderline' : 'Out of range';
                                    return (
                                        <Box key={idx} onClick={() => openBiomarker(item.testName)} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', cursor: 'pointer', borderRadius: '8px', py: 0.5, '&:hover': { backgroundColor: '#F8FAFC' } }}>
                                            <Box sx={{ width: '4px', height: '46px', backgroundColor: barColor, borderRadius: '2px', flexShrink: 0, mt: 0.5 }} />
                                            <Box sx={{ textAlign: 'left' }}>
                                                <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1A212B', mb: 0.5, textAlign: 'left' }}>{item.biomarkerName || item.testName}</Typography>
                                                <Typography sx={{ fontSize: '15px', color: '#728197', textAlign: 'left' }}><span style={{ color: txtColor, fontWeight: 600 }}>{label}</span> {item.value} {item.unit || ''}</Typography>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                            {displayedBiomarkers.length > 4 && (
                                <Button variant="outlined" onClick={() => setIsExpanded(!isExpanded)} sx={{ mt: 3, textTransform: 'none', borderRadius: '14px', fontFamily: 'lexend', borderColor: '#256111', color: '#256111', fontWeight: 500, px: 4, height: '46px' }}>{isExpanded ? 'View Less' : 'Read More'}</Button>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Updated plan */}
            <PlanSection report={report} />
        </Box>
    );
};

export default VitalityMap2;
