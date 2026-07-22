import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReadingPaperIcon from '../../assets/reading-paper.svg';
import Chart from 'react-apexcharts';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Select,
    MenuItem,
    FormControl,
    Grid,
    Dialog,
} from '@mui/material';
import ConsultationModal from '../../Component/ConsultationModal/ConsultationModal';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BiomarkerIcon from '../../assets/Biomarker.svg';
import NotesIcon from '../../assets/notes.svg';
import CancelIcon from '../../assets/cancel.svg';
import NoFoodIcon from '../../assets/No-food.svg';
import ForkPlateIcon from '../../assets/fork-plate.svg';
import AlignIcon from '../../assets/Align.svg';
import MedicineBottleIcon from '../../assets/Medicine-Bottle.svg';
import NextDraw from '../../Component/NextDraw/NextDraw';
import LabSamples from '../../assets/lab-samples.svg';
import KitIcon from '../../assets/Kit.svg';
import { VITALITY_MAP_CONSTANTS } from './constants';
import { VITALITY_MAP_LABELS } from './labels';
import { apiUrl } from '../../config';
import { spectrumColor, spectrumTileGradient, SPECTRUM_GRADIENT } from '../../utils/spectrumColor';

interface RecommendationItem {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    iconColor: string;
    iconBg: string;
}

interface RecommendationCard {
    id: string;
    title: string;
    subtitle: string;
    items: RecommendationItem[];
    headerBg: string;
}

// Parse a recommendation label into { name, detail, sub }:
//   "Refined carbohydrates — white rice, white bread (arroz blanco)"
//     -> name: "Refined carbohydrates", detail: "white rice, white bread", sub: "arroz blanco"
//   "Walnuts (nueces)" -> name: "Walnuts", sub: "nueces"
const parseRec = (s: string): { name: string; detail: string; sub: string } => {
    let base = (s || '').trim();
    let sub = '';
    const paren = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(base);
    if (paren) { base = paren[1].trim(); sub = paren[2].trim(); }
    let name = base;
    let detail = '';
    const parts = base.split(/\s*[—–]\s*|\s+-\s+/); // em/en dash or spaced hyphen
    if (parts.length > 1) { name = parts[0].trim(); detail = parts.slice(1).join(', ').trim(); }
    return { name, detail, sub };
};

const RecommendationSection: React.FC<{ report: any }> = ({ report }) => {
    // Top-N per column (D: 5 eat / 5 avoid / 2 exercise / 3 supplements).
    const eat = (report?.foods_to_eat || []).slice(0, 5);
    const avoid = (report?.foods_to_avoid || []).slice(0, 5);
    const exercise = (report?.exercise_recommendations || []).slice(0, 2);
    const supplements = (report?.supplement_recommendations || []).slice(0, 3);

    const [selected, setSelected] = useState<{ kind: string; data: any } | null>(null);
    // Monochrome SVG rendered through a CSS mask so it takes the category accent
    // color (an <img> keeps the asset's own baked-in green).
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

    // Raw label per kind, and the concise pill name derived from it.
    const rawName = (kind: string, d: any): string =>
        kind === 'exercise' ? d.exerciseType : kind === 'supplement' ? d.supplementName : d.food;
    const nameFor = (kind: string, d: any): string => parseRec(rawName(kind, d)).name;
    // Labeled detail rows shown in the popup.
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

    // Category accents from the brand family: Eat = Jiva green, Avoid =
    // terracotta (matches the spectrum's out-of-range end), Exercise = deep
    // teal-green, Supplements = amber. `accent` colors the icon, `tint` its chip.
    const cards = [
        { id: 'food-eat', title: 'Food to Eat', kind: 'eat', data: eat, icon: ForkPlateIcon, accent: '#2A6130', tint: '#E7F2E8', headerTint: '#F0F7F0' },
        { id: 'food-avoid', title: 'Food to Avoid', kind: 'avoid', data: avoid, icon: NoFoodIcon, accent: '#B0492C', tint: '#FAE8E2', headerTint: '#FBF1ED' },
        { id: 'exercise', title: 'Exercise', kind: 'exercise', data: exercise, icon: AlignIcon, accent: '#1F5C50', tint: '#E3EFEB', headerTint: '#EFF6F4' },
        { id: 'supplements', title: 'Supplements', kind: 'supplement', data: supplements, icon: MedicineBottleIcon, accent: '#A16B15', tint: '#F9F0DC', headerTint: '#FBF6EA' },
    ];

    const renderCard = (card: (typeof cards)[number], noContainer: boolean = false) => {
        const content = (
            <>
                {/* Card Header — category-tinted, with the category's own icon */}
                <Box
                    sx={{
                        p: '16px 24px',
                        backgroundColor: card.headerTint,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        borderBottom: '1px solid #DCE7DD',
                    }}
                >
                    <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1A212B', textAlign: 'left' }}>
                        {card.title}
                    </Typography>
                    <Box
                        sx={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '12px',
                            backgroundColor: card.tint,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        {mkIcon(card.icon, card.accent, 18)}
                    </Box>
                </Box>

                {/* Items — name only; click for full details */}
                <Box sx={{ p: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {card.data.map((d: any, i: number) => (
                        <Box
                            key={i}
                            onClick={() => setSelected({ kind: card.kind, data: d })}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                p: '12px',
                                borderRadius: '36px',
                                backgroundColor: '#F6FAF6',
                                border: '1px solid #E4EDE5',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0px 4px 12px rgba(23,48,27,0.10)' },
                            }}
                        >
                            <Box
                                sx={{
                                    width: '32px', height: '32px', borderRadius: '50%', backgroundColor: card.tint,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}
                            >
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

        return (
            <Box sx={{ borderRadius: '24px', backgroundColor: '#FFFFFF', border: '1px solid #DCE7DD', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {content}
            </Box>
        );
    };

    return (
        <Box sx={{ mt: 6, backgroundColor: '#FFFFFF', borderRadius: '40px', p: 5, border: '1px solid #DCE7DD', boxShadow: '0px 2px 12px rgba(23,48,27,0.07)' }}>
            <Typography sx={{ textAlign: 'left', fontSize: '28px', fontWeight: 700, color: '#000000', mb: 4 }}>
                {VITALITY_MAP_LABELS.RECOMMENDED_TITLE}
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 3, alignItems: 'stretch' }}>
                <Box sx={{ minWidth: 0 }}>{renderCard(cards[0])}</Box>
                <Box sx={{ minWidth: 0 }}>{renderCard(cards[1])}</Box>
                <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', borderRadius: '24px', border: '1px solid #DCE7DD', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
                    {renderCard(cards[2], true)}
                    <Box sx={{ height: '1px', backgroundColor: '#DCE7DD' }} />
                    {renderCard(cards[3], true)}
                </Box>
            </Box>

            {/* Detail popup */}
            <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
                {selected && (() => {
                    const { name, detail, sub } = parseRec(rawName(selected.kind, selected.data));
                    const rows = detail
                        ? [{ label: 'Includes', value: detail }, ...detailRows(selected.kind, selected.data)]
                        : detailRows(selected.kind, selected.data);
                    return (
                        <Box sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1A212B' }}>{name}</Typography>
                                <IconButton onClick={() => setSelected(null)} sx={{ p: 0, mt: 0.5 }}>
                                    <Box component="img" src={CancelIcon} alt="Close" sx={{ width: 20, height: 20 }} />
                                </IconButton>
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

const VitalityMap: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedBiomarker, setSelectedBiomarker] = useState<number | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showBiologicalAgeTooltip, setShowBiologicalAgeTooltip] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clinicalOpen, setClinicalOpen] = useState(false);
    const [bioAgeOpen, setBioAgeOpen] = useState(false);

    const [systems, setSystems] = useState<any[]>([]);
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/signin'); return; }
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const [bmRes, repRes] = await Promise.all([
                    fetch(apiUrl('/api/me/biomarkers?groupBy=system'), { headers }),
                    fetch(apiUrl('/api/me/report/latest'), { headers }),
                ]);
                if (bmRes.ok) { const d = await bmRes.json(); setSystems(d.systems || []); }
                if (repRes.ok) { setReport(await repRes.json()); }
            } catch (err) {
                console.error('Error fetching Vitality Map data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    // The 10 canonical systems → heat-map tiles, colored on a continuous
    // in-range → out-of-range spectrum (D14). Long names get a short tile label.
    const SHORT_SYSTEM_LABELS: Record<string, string> = {
        'Immune/Inflammatory': 'Immunity',
        'Hormonal/Reproductive': 'Hormonal',
    };
    const activeSystems = systems.map((s: any) => ({
        name: SHORT_SYSTEM_LABELS[s.name] || s.displayName || s.name,
        systemName: s.name,
        counts: s.counts,
        statusText: `${s.counts.inRange}/${s.counts.total} in Range`,
        color: spectrumColor(s.spectrumP),
        gradient: spectrumTileGradient(s.spectrumP),
        biomarkers: s.biomarkers || [],
    }));

    // No system selected (null) → show overall totals + overall summary.
    const selectedSystem = selectedBiomarker != null ? activeSystems[selectedBiomarker] : null;
    // Right-hand biomarker list: the selected system's, or ALL biomarkers when nothing is selected.
    const displayedBiomarkers = selectedSystem
        ? (selectedSystem.biomarkers || [])
        : activeSystems.flatMap((s: any) => s.biomarkers || []);
    const la = report?.lab_analysis;

    const systemSummary = selectedSystem
        ? ((report?.system_summaries || []).find((ss: any) => ss.systemName === selectedSystem.systemName)?.summary || '')
        : '';
    const overallSummary = report?.overall_summary || report?.patient_summary || '';
    const clinicalTitle = selectedSystem ? `Clinical Notes: ${selectedSystem.name}` : 'Clinical Notes: Overall Summary';
    const clinicalBody = selectedSystem ? systemSummary : overallSummary;

    // Range card: selected system's counts, or the whole-report totals when nothing is selected.
    const rangeCounts = selectedSystem
        ? {
            inRange: selectedSystem.counts.inRange || 0,
            out: selectedSystem.counts.outOfRange || 0,
            borderline: selectedSystem.counts.borderline || 0,
            critical: selectedSystem.counts.critical || 0,
        }
        : {
            inRange: la?.inRangeCount || 0,
            out: la?.outOfRangeCount || 0,
            borderline: la?.borderlineCount || 0,
            critical: la?.criticalCount || 0,
        };
    // Targeted add-on upsell. A patient can top up their next draw at any time,
    // so this is driven off the first test rather than waiting for a retest.
    // Counts come from the report we already loaded, no extra request needed.
    const flaggedTotal = (la?.outOfRangeCount || 0) + (la?.borderlineCount || 0);
    const flaggedSystemNames = activeSystems
        .map((s: any) => ({
            name: s.name,
            flagged: (s.counts?.outOfRange || 0) + (s.counts?.borderline || 0) + (s.counts?.critical || 0),
        }))
        .filter((s: any) => s.flagged > 0)
        .sort((a: any, b: any) => b.flagged - a.flagged)
        .slice(0, 3)
        .map((s: any) => s.name);
    const joinNames = (arr: string[]) =>
        arr.length <= 1 ? arr[0] || '' : `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}`;

    // Biological age (PhenoAge) from the engine.
    const bioAge = report?.biological_age != null ? report.biological_age : null;
    const bioAgeExplanation = report?.biological_age_explanation || '';
    const calAge = report?.patient?.age;
    const bioDelta = bioAge != null && calAge != null ? Math.round((bioAge - calAge) * 10) / 10 : null;
    const bioDeltaText =
        bioDelta == null ? ''
            : Math.abs(bioDelta) < 0.5 ? `about the same as your calendar age of ${calAge}`
                : `about ${Math.abs(bioDelta)} year${Math.abs(bioDelta) === 1 ? '' : 's'} ${bioDelta > 0 ? 'older' : 'younger'} than your calendar age of ${calAge}`;

    // Header greeting: use the patient's real first + last name, else a
    // sex-based default. Live date underneath.
    const rawName: string = ((report?.patient?.name as string) || '').trim();
    const nameParts: string[] = rawName.split(/\s+/).filter(Boolean);
    const hasRealName = nameParts.length >= 2 && nameParts.every((p) => /[a-zA-Z]/.test(p) && !/^\d+$/.test(p));
    const displayName = hasRealName ? rawName : (report?.patient?.sex === 'Male' ? 'Juan Martinez' : 'Preetha Narayanan');
    const greeting = `Hello ${displayName}`;
    const todayStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        // Full-bleed tinted canvas so the white cards separate from the page
        // instead of white-on-white.
        <Box sx={{ width: '100%', backgroundColor: '#EFF4EF', pb: 8 }}>
        <Box sx={{ width: '100%', maxWidth: VITALITY_MAP_CONSTANTS.MAX_WIDTH, margin: '0 auto', px: { xs: 2, xl: 0 } }}>
            {/* Consultation Modal */}
            <ConsultationModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Biological Age — how it was derived */}
            <Dialog open={bioAgeOpen} onClose={() => setBioAgeOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
                <Box sx={{ p: 4, textAlign: 'left', fontFamily: 'Source Sans Pro' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Biological Age</Typography>
                            <Typography sx={{ fontSize: '30px', fontWeight: 700, color: '#1A212B', lineHeight: 1.1 }}>
                                {bioAge != null ? `${bioAge} years` : '—'}
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setBioAgeOpen(false)} sx={{ p: 0, mt: 0.5 }}>
                            <Box component="img" src={CancelIcon} alt="Close" sx={{ width: 20, height: 20 }} />
                        </IconButton>
                    </Box>
                    <Typography sx={{ fontSize: '15px', color: '#475467', lineHeight: '24px' }}>
                        {bioAgeExplanation}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#98A2B3', mt: 3, lineHeight: '18px' }}>
                        Method: PhenoAge (Levine et al., 2018), a validated estimate derived from nine routine blood markers (albumin, creatinine, fasting glucose, hs-CRP, lymphocyte %, MCV, RDW, alkaline phosphatase, and white-cell count) together with your calendar age. Add-on panel results are used as supporting context.
                    </Typography>
                </Box>
            </Dialog>

            {/* Clinical Notes — full note popup */}
            <Dialog open={clinicalOpen} onClose={() => setClinicalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '20px' } }}>
                <Box sx={{ p: 4, textAlign: 'left', fontFamily: 'Source Sans Pro' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1A212B' }}>
                            {clinicalTitle}
                        </Typography>
                        <IconButton onClick={() => setClinicalOpen(false)} sx={{ p: 0, mt: 0.5 }}>
                            <Box component="img" src={CancelIcon} alt="Close" sx={{ width: 20, height: 20 }} />
                        </IconButton>
                    </Box>
                    <Typography sx={{ fontSize: '15px', color: '#475467', lineHeight: '24px' }}>
                        {clinicalBody}
                    </Typography>
                </Box>
            </Dialog>

            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, mt: 2 }}>
                <Box>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: '44px',
                            fontWeight: 800,
                            color: '#1A212B',
                            lineHeight: '52px',
                            letterSpacing: '-0.02em',
                            textAlign: 'left',
                        }}
                    >
                        {greeting}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '16px',
                            color: '#667085',
                            mt: 0.5,
                            fontWeight: 500,
                            textAlign: 'left',
                        }}
                    >
                        {todayStr}
                    </Typography>
                </Box>
            </Box>

            {/* Next blood draw (F1). Replaces the old results-ready alert:
                people check the Vitality Map more often than the dashboard, so
                the next draw belongs here too. One draw is booked at a time, so
                this shows either the booked visit or a prompt with the countdown
                to when the next one is due. */}
            <Box sx={{ mb: 4 }}>
                <NextDraw />
            </Box>

            {/* Targeted add-on upsell. Add-ons are not gated behind the retest:
                anything bought here is drawn at the next visit. */}
            {flaggedTotal > 0 && (
                <Box
                    sx={{
                        mb: 4,
                        borderRadius: '20px',
                        p: { xs: '16px 18px', md: '18px 24px' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        flexWrap: 'wrap',
                        // Matches the cards below it; the amber is kept as an
                        // accent on the icon and heading rather than a wash.
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #DCE7DD',
                        boxShadow: '0px 2px 10px rgba(23,48,27,0.07)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flex: 1, minWidth: '280px' }}>
                        <Box sx={{ width: 42, height: 42, borderRadius: '12px', backgroundColor: '#FFFAEB', border: '1px solid #FEDF89', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Box component="img" src={BiomarkerIcon} sx={{ width: 20, height: 20 }} />
                        </Box>
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography sx={{ fontSize: '17px', fontWeight: 700, color: '#B54708', mb: 0.25 }}>
                                {flaggedTotal} biomarker{flaggedTotal === 1 ? '' : 's'} outside your optimal range
                            </Typography>
                            <Typography sx={{ fontSize: '13.5px', color: '#667085', lineHeight: '19px', maxWidth: '700px' }}>
                                {flaggedSystemNames.length > 0
                                    ? `Most of these sit in your ${joinNames(flaggedSystemNames)} ${flaggedSystemNames.length === 1 ? 'system' : 'systems'}. Targeted panels go deeper on those areas and are drawn at your next lab visit.`
                                    : 'Targeted panels go deeper on the flagged areas and are drawn at your next lab visit.'}
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        onClick={() => navigate('/select-packages?mode=addon')}
                        sx={{ backgroundColor: '#2A6130', color: '#FFFFFF', borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '14px', px: 3, height: '38px', whiteSpace: 'nowrap', flexShrink: 0, '&:hover': { backgroundColor: '#1F4A24' } }}
                    >
                        Add targeted tests
                    </Button>
                </Box>
            )}

            {/* Health Info Cards Grid */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: VITALITY_MAP_CONSTANTS.GRID_GAP,
                    mt: 4,
                }}
            >
                {/* 1. Biological Age Card */}
                <Box
                    sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: VITALITY_MAP_CONSTANTS.CARD_RADIUS,
                        p: 3,
                        border: '1px solid #DCE7DD',
                        boxShadow: '0px 2px 10px rgba(23,48,27,0.07)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        height: VITALITY_MAP_CONSTANTS.CARD_HEIGHT,
                    }}
                >
                    <Box
                        onMouseEnter={() => setShowBiologicalAgeTooltip(true)}
                        onMouseLeave={() => setShowBiologicalAgeTooltip(false)}
                        sx={{ position: 'relative', width: '200px', height: '100px', mt: 2, mb: 3, display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                        <Chart
                            options={{
                                chart: {
                                    type: 'radialBar',
                                    offsetY: -30,
                                    sparkline: { enabled: true }
                                },
                                plotOptions: {
                                    radialBar: {
                                        startAngle: -85,
                                        endAngle: 85,
                                        hollow: { size: VITALITY_MAP_CONSTANTS.CHART_HOLLOW_SIZE },
                                        track: {
                                            background: "rgba(242, 244, 247, 1)",
                                            strokeWidth: '100%',
                                        },
                                        dataLabels: { show: false }
                                    }
                                },
                                fill: {
                                    type: 'gradient',
                                    gradient: {
                                        shade: 'dark',
                                        type: 'vertical',
                                        gradientToColors: ['rgba(139, 199, 152, 0.85)'],
                                        stops: [0, 36],
                                        colorStops: [
                                            { offset: 0, color: 'rgba(42, 97, 48, 0.75)', opacity: 1 },
                                            { offset: 36, color: 'rgba(139, 199, 152, 0.85)', opacity: 1 }
                                        ]
                                    }
                                },
                                stroke: { lineCap: 'round' }
                            }}
                            series={[bioAge != null ? 72 : 0]}
                            type="radialBar"
                            height={VITALITY_MAP_CONSTANTS.CHART_HEIGHT}
                        />

                        {/* Tooltip */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-30px',
                                backgroundColor: '#101828',
                                color: '#FFFFFF',
                                p: '12px 16px',
                                borderRadius: '8px',
                                zIndex: 10,
                                opacity: showBiologicalAgeTooltip ? 1 : 0,
                                visibility: showBiologicalAgeTooltip ? 'visible' : 'hidden',
                                transition: 'all 0.2s ease-in-out',
                                pointerEvents: 'none',
                                '&:after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-8px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    borderLeft: '8px solid transparent',
                                    borderRight: '8px solid transparent',
                                    borderTop: '8px solid #101828',
                                }
                            }}
                        >
                            <Typography sx={{ fontSize: '12px', color: '#D1D5DB', mb: 0.5, fontWeight: 500, textAlign: 'left' }}>
                                {VITALITY_MAP_LABELS.CALENDAR_AGE}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                                <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>{report?.patient?.age != null ? `${report.patient.age} Years` : '—'}</Typography>
                            </Box>
                        </Box>

                        {/* Centered Labels */}
                        <Box sx={{ position: 'absolute', top: '75%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%', pointerEvents: 'none' }}>
                            <Typography
                                sx={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: '#6B7280',
                                    letterSpacing: '0.08em',
                                    mb: 0.2,
                                    textTransform: 'uppercase'
                                }}
                            >
                                {VITALITY_MAP_LABELS.BIOLOGICAL_AGE_HEADER}
                            </Typography>
                            <Typography sx={{ fontSize: '28px', fontWeight: 700, color: '#6B7280', lineHeight: 1, fontFamily: 'Source Sans Pro' }}>
                                {bioAge != null ? bioAge : '—'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 2, textAlign: 'left', width: '100%', px: 1 }}>
                        <Box sx={{ width: '100%', height: '1.5px', backgroundColor: '#C8D0DB', mb: 3 }} />
                        <Typography sx={{ fontSize: '16px', color: '#475467', lineHeight: '24px', mb: 2 }}>
                            Your Biological Age is <span style={{ color: '#101828', fontWeight: 700 }}>{bioAge != null ? `${bioAge} years` : '—'}</span>{bioDeltaText ? `, ${bioDeltaText}.` : '.'}
                        </Typography>
                        <Typography
                            onClick={() => bioAgeExplanation && setBioAgeOpen(true)}
                            sx={{
                                fontSize: '16px',
                                fontWeight: 700,
                                color: bioAgeExplanation ? '#101828' : '#98A2B3',
                                textDecoration: 'underline',
                                cursor: bioAgeExplanation ? 'pointer' : 'default',
                                '&:hover': { opacity: bioAgeExplanation ? 0.7 : 1 }
                            }}
                        >
                            View More
                        </Typography>
                    </Box>
                </Box>

                {/* 2. What is the Range Card */}
                <Box
                    sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: VITALITY_MAP_CONSTANTS.CARD_RADIUS,
                        p: 3,
                        border: '1px solid #DCE7DD',
                        boxShadow: '0px 2px 10px rgba(23,48,27,0.07)',
                        height: VITALITY_MAP_CONSTANTS.CARD_HEIGHT,
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1A212B', mb: 1.5, textAlign: 'left', fontFamily: 'Source Sans Pro' }}>
                        Range Breakdown
                    </Typography>

                    <Box sx={{ flexGrow: 1, position: 'relative', mt: 3, width: '100%' }}>
                        {(() => {
                            // Derived from the heatmap spectrum's anchors so the
                            // whole screen shares one severity palette.
                            const bars = [
                                { label: 'IN RANGE', count: rangeCounts.inRange, c1: '#A1E4AE', c2: '#67B373' },
                                { label: 'OUT OF RANGE', count: rangeCounts.out, c1: '#ED9564', c2: '#C9683A' },
                                { label: 'BORDERLINE', count: rangeCounts.borderline, c1: '#F2B86C', c2: '#C6811C' },
                                { label: 'CRITICAL', count: rangeCounts.critical, c1: '#E37E68', c2: '#B54534' },
                            ];
                            const maxV = Math.max(1, ...bars.map((b) => b.count));
                            const MAX_H = 150, MIN_H = 20;
                            return (
                                <Box sx={{ position: 'relative', width: '100%', height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, pb: '40px', boxSizing: 'border-box' }}>
                                    {/* horizontal gridlines */}
                                    <Box sx={{ position: 'absolute', top: 0, left: 20, right: 20, bottom: '40px', backgroundImage: 'repeating-linear-gradient(to top, #F2F4F7 0, #F2F4F7 1.5px, transparent 1.5px, transparent 18px)', pointerEvents: 'none' }} />
                                    {/* baseline */}
                                    <Box sx={{ position: 'absolute', left: 20, right: 20, bottom: '40px', height: '1.5px', backgroundColor: '#F2F4F7' }} />
                                    {bars.map((b) => {
                                        const h = Math.max(MIN_H, (b.count / maxV) * MAX_H);
                                        return (
                                            <Box key={b.label} sx={{ position: 'relative', width: '34px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Box sx={{
                                                    width: '34px', height: `${h}px`, borderRadius: '8px', position: 'relative',
                                                    background: `linear-gradient(180deg, ${b.c1} 0%, ${b.c2} 100%)`,
                                                    transition: 'height 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                                                }}>
                                                    <Typography sx={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', fontWeight: 600, color: '#6B7280', fontFamily: 'Source Sans Pro' }}>{b.count}</Typography>
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

                {/* 3. Clinical Notes Card */}
                <Box
                    sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: VITALITY_MAP_CONSTANTS.CARD_RADIUS,
                        p: 3,
                        border: '1px solid #DCE7DD',
                        boxShadow: '0px 2px 10px rgba(23,48,27,0.07)',
                        height: VITALITY_MAP_CONSTANTS.CARD_HEIGHT,
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'left',
                        fontFamily: 'Source Sans Pro'
                    }}
                >
                    <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1A212B', mb: 3 }}>
                        {clinicalTitle}
                    </Typography>

                    <Typography sx={{ fontSize: '14px', color: '#475467', lineHeight: '24px', mb: 'auto', display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {clinicalBody || 'Your clinical notes will appear here.'}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 3, borderTop: '1px solid #F2F4F7', }}>
                        <Button
                            variant="outlined"
                            onClick={() => setClinicalOpen(true)}
                            disabled={!clinicalBody}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '12px',
                                fontFamily: 'lexend',
                                borderColor: '#2A6130',
                                color: '#2A6130',
                                fontWeight: 600,
                                px: 4,
                                height: '44px',
                                '&:hover': {
                                    borderColor: '#1F4A24',
                                    backgroundColor: '#F0F7F0',
                                }
                            }}
                        >
                            Read More
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Biomarker Section Container */}
            <Box
                sx={{
                    mt: 6,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '40px',
                    pt: 4.5,
                    pb: 4.5,
                    pl: 4.5,
                    pr: 0,
                    border: '1px solid #DCE7DD',
                    boxShadow: '0px 2px 12px rgba(23,48,27,0.07)',
                }}
            >
                {/* Header for Biomarker Section */}
                <Box sx={{ mb: 5, display: 'flex', gap: 5, pr: 4.5, alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Typography
                                sx={{
                                    fontSize: '24px',
                                    fontWeight: 600,
                                    color: '#1A212B',
                                    fontFamily: 'Source Sans Pro',
                                    textAlign: 'left'
                                }}
                            >
                                {VITALITY_MAP_LABELS.COMPARE_TITLE}
                            </Typography>

                        </Box>

                        {/* Legend */}
                        {(
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
                                <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em' }}>IN</Typography>
                                <Box
                                    sx={{
                                        width: '100px',
                                        height: '6px',
                                        borderRadius: '4px',
                                        background: SPECTRUM_GRADIENT,
                                    }}
                                />
                                <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#98A2B3', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>OUT OF RANGE</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Selected Category Header aligned with Biomarker */}
                    {(
                        <Box sx={{ width: '420px', display: 'flex', flexDirection: 'column', pt: 0.5 }}>
                            <Typography sx={{ fontSize: '24px', fontWeight: 600, color: '#1A212B', mb: 0.5, textAlign: 'left', pr: 4.5, lineHeight: 1.2 }}>
                                {selectedSystem ? selectedSystem.name : 'All Biomarkers'}
                            </Typography>
                            <Typography sx={{ fontSize: '16px', color: '#667085', fontWeight: 500, textAlign: 'left', pr: 4.5 }}>
                                {`${displayedBiomarkers.length} Biomarkers`}
                            </Typography>
                        </Box>
                    )}
                </Box>

                    <Box sx={{ display: 'flex', gap: 5 }}>
                        {/* Left Column */}
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {/* Cards Grid */}
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                                    gap: '16px',
                                }}
                            >
                                {activeSystems.map((item, index) => (
                                    <Box
                                        key={index}
                                        onClick={() => setSelectedBiomarker(selectedBiomarker === index ? null : index)}
                                        sx={{
                                            // Figma treatment: soft vertical gradient of the
                                            // severity color, no hard border, floating shadow.
                                            background: item.gradient,
                                            borderRadius: '22px',
                                            p: '16px 18px',
                                            height: '96px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                                            position: 'relative',
                                            border: 'none',
                                            boxShadow: selectedBiomarker === index
                                                ? '0px 16px 28px rgba(23,48,27,0.26), 0px 4px 8px rgba(23,48,27,0.14), inset 0 0 0 1.5px rgba(23,48,27,0.30)'
                                                : '0px 6px 16px rgba(23,48,27,0.10), 0px 1px 3px rgba(23,48,27,0.06)',
                                            transform: selectedBiomarker === index ? 'translateY(-3px)' : 'none',
                                            zIndex: selectedBiomarker === index ? 1 : 0,
                                            '&:hover': {
                                                transform: 'translateY(-3px)',
                                                boxShadow: selectedBiomarker === index
                                                    ? '0px 16px 28px rgba(23,48,27,0.26), 0px 4px 8px rgba(23,48,27,0.14), inset 0 0 0 1.5px rgba(23,48,27,0.30)'
                                                    : '0px 12px 24px rgba(23,48,27,0.16), 0px 3px 6px rgba(23,48,27,0.08)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box sx={{ minWidth: 0, flex: 1, pr: 1 }}>
                                                <Typography sx={{
                                                    fontSize: '13px', fontWeight: 700, color: '#1A212B', mb: 0.5, textAlign: 'left',
                                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                }}>
                                                    {item.name}
                                                </Typography>
                                                <Typography sx={{ fontSize: '11px', fontWeight: 500, color: '#475467', textAlign: 'left' }}>
                                                    {item.statusText}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    width: '30px',
                                                    height: '30px',
                                                    backgroundColor: 'rgba(255,255,255,0.85)',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    boxShadow: '0px 2px 6px rgba(23,48,27,0.10)'
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={BiomarkerIcon}
                                                    alt="biomarker"
                                                    sx={{ width: '16px', height: '16px' }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Divider Line */}
                        <Box sx={{ width: '1.5px', backgroundColor: '#EDF2F7', alignSelf: 'stretch', mx: 2 }} />

                        {/* Right Column */}
                        <Box sx={{ width: '420px', display: 'flex', flexDirection: 'column', pt: 1 }}>
                            {/* Details Panel */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '420px', pr: 0 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 4,
                                        flexGrow: 1,
                                        overflowY: isExpanded ? 'auto' : 'hidden',
                                        overflowX: 'hidden',
                                        '&::-webkit-scrollbar': {
                                            width: '4px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: '#475467',
                                            borderRadius: '2px',
                                        },
                                    }}
                                >
                                    {(isExpanded ? displayedBiomarkers : displayedBiomarkers.slice(0, 3)).map((item: any, idx: number) => {
                                        const isIn = item.status === 'in_range';
                                        const isBord = item.status === 'borderline';
                                        const barColor = isIn ? '#A1E4AE' : isBord ? '#F2B86C' : '#ED8A70';
                                        const txtColor = isIn ? '#2A6130' : isBord ? '#A16B15' : '#C24C3D';
                                        const label = isIn ? 'In Range' : isBord ? 'Borderline' : 'Out of range';
                                        return (
                                            <Box key={idx}
                                                onClick={() => navigate(`/biomarker/${encodeURIComponent(item.testName)}`)}
                                                sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', pr: 4.5, cursor: 'pointer', borderRadius: '8px', py: 0.5, transition: 'background-color 0.15s ease', '&:hover': { backgroundColor: '#F8FAFC' } }}>
                                                <Box
                                                    sx={{
                                                        width: '4px',
                                                        height: '46px',
                                                        backgroundColor: barColor,
                                                        borderRadius: '2px',
                                                        flexShrink: 0,
                                                        mt: 0.5
                                                    }}
                                                />
                                                <Box sx={{ textAlign: 'left' }}>
                                                    <Typography sx={{ fontSize: '16px', fontFamily: 'source sans pro', fontWeight: 600, color: '#1A212B', mb: 0.5, lineHeight: '1.2', textAlign: 'left' }}>
                                                        {item.biomarkerName || item.testName}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '15px', color: '#728197', textAlign: 'left' }}>
                                                        <span style={{ color: txtColor, fontWeight: 600 }}>{label}</span> {item.value} {item.unit || ''}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                </Box>

                                {displayedBiomarkers.length > 3 && (
                                <Box sx={{ pr: 4.5, display: 'flex' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        sx={{
                                            alignSelf: 'flex-start',
                                            mt: 4,
                                            textTransform: 'none',
                                            borderRadius: '14px',
                                            fontFamily: 'lexend',
                                            borderColor: '#2A6130',
                                            color: '#2A6130',
                                            fontWeight: 500,
                                            px: 4,
                                            height: '50px',
                                            fontSize: '16px',
                                            '&:hover': {
                                                borderColor: '#1F4A24',
                                                backgroundColor: '#F0F7F0',
                                            }
                                        }}
                                    >
                                        {isExpanded ? 'View Less' : 'Read More'}
                                    </Button>
                                </Box>
                                )}
                            </Box>
                        </Box>
                    </Box>
            </Box>

            {/* Biomarker Section Container */}
            <RecommendationSection report={report} />
        </Box>
        </Box>
    );
};

export default VitalityMap;
