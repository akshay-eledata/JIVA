import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSchedule } from '../../context/ScheduleContext';
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
import BiomarkerCompare from '../../Component/BiomarkerCompare/BiomarkerCompare';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import BiomarkerIcon from '../../assets/Biomarker.svg';
import NotesIcon from '../../assets/notes.svg';
import CancelIcon from '../../assets/cancel.svg';
import NoFoodIcon from '../../assets/No-food.svg';
import ForkPlateIcon from '../../assets/fork-plate.svg';
import StarIcon from '../../assets/Star.svg';
import AlignIcon from '../../assets/Align.svg';
import MedicineBottleIcon from '../../assets/Medicine-Bottle.svg';
import LabSamples from '../../assets/lab-samples.svg';
import CheckCircleIcon from '../../assets/Check-circle.svg';
import KitIcon from '../../assets/Kit.svg';
import { VITALITY_MAP_CONSTANTS } from './constants';
import { VITALITY_MAP_LABELS } from './labels';
import { apiUrl } from '../../config';
import { spectrumColor, SPECTRUM_GRADIENT } from '../../utils/spectrumColor';

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
    if (parts.length > 1) { name = parts[0].trim(); detail = parts.slice(1).join(' — ').trim(); }
    return { name, detail, sub };
};

const RecommendationSection: React.FC<{ report: any }> = ({ report }) => {
    // Top-N per column (D: 5 eat / 5 avoid / 2 exercise / 3 supplements).
    const eat = (report?.foods_to_eat || []).slice(0, 5);
    const avoid = (report?.foods_to_avoid || []).slice(0, 5);
    const exercise = (report?.exercise_recommendations || []).slice(0, 2);
    const supplements = (report?.supplement_recommendations || []).slice(0, 3);

    const [selected, setSelected] = useState<{ kind: string; data: any } | null>(null);
    const mkIcon = (src: string) => <Box component="img" src={src} sx={{ width: 18, height: 18 }} />;

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

    const cards = [
        { id: 'food-eat', title: 'Food to Eat', kind: 'eat', data: eat, icon: ForkPlateIcon, iconColor: '#006045' },
        { id: 'food-avoid', title: 'Food to Avoid', kind: 'avoid', data: avoid, icon: NoFoodIcon, iconColor: '#4A3AFF' },
        { id: 'exercise', title: 'Exercise', kind: 'exercise', data: exercise, icon: AlignIcon, iconColor: '#2E90FA' },
        { id: 'supplements', title: 'Supplements', kind: 'supplement', data: supplements, icon: MedicineBottleIcon, iconColor: '#E08A4A' },
    ];

    const renderCard = (card: (typeof cards)[number], noContainer: boolean = false) => {
        const content = (
            <>
                {/* Card Header */}
                <Box
                    sx={{
                        p: '20px 24px',
                        backgroundColor: '#F7FAFD',
                        position: 'relative',
                        borderBottom: '0.5px solid #B1C2DC',
                    }}
                >
                    <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1A212B', textAlign: 'left' }}>
                        {card.title}
                    </Typography>
                    <Box
                        component="img"
                        src={StarIcon}
                        alt="star"
                        sx={{ position: 'absolute', right: 16, top: 12, width: '70px', height: '70px', opacity: 0.7, transform: 'rotate(-15deg)', pointerEvents: 'none' }}
                    />
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
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #F2F4F7',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0px 4px 12px rgba(0,0,0,0.08)' },
                            }}
                        >
                            <Box
                                sx={{
                                    width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F0F0F0',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.iconColor, flexShrink: 0,
                                }}
                            >
                                {mkIcon(card.icon)}
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
            <Box sx={{ borderRadius: '24px', backgroundColor: '#F7FAFD', border: '0.5px solid #B1C2DC', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {content}
            </Box>
        );
    };

    return (
        <Box sx={{ mt: 6, backgroundColor: '#F1F5F9', borderRadius: '40px', p: 5, border: '1px solid #E2E8F0' }}>
            <Typography sx={{ textAlign: 'left', fontSize: '28px', fontWeight: 700, color: '#000000', mb: 4 }}>
                {VITALITY_MAP_LABELS.RECOMMENDED_TITLE}
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 3, alignItems: 'stretch' }}>
                <Box sx={{ minWidth: 0 }}>{renderCard(cards[0])}</Box>
                <Box sx={{ minWidth: 0 }}>{renderCard(cards[1])}</Box>
                <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', borderRadius: '24px', border: '0.5px solid #B1C2DC', overflow: 'hidden', backgroundColor: '#F7FAFD' }}>
                    {renderCard(cards[2], true)}
                    <Box sx={{ height: '0.5px', backgroundColor: '#B1C2DC' }} />
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
    const { isRescheduled, resetReschedule } = useSchedule();
    const [demoToggle, setDemoToggle] = useState(false);
    const rescheduleIntent = location.state?.rescheduleIntent !== undefined ? location.state.rescheduleIntent : (!demoToggle);
    const [showAlert, setShowAlert] = useState(!rescheduleIntent);
    const [selectedBiomarker, setSelectedBiomarker] = useState<number | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showBiologicalAgeTooltip, setShowBiologicalAgeTooltip] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCompareMode, setIsCompareMode] = useState(false);
    const [clinicalOpen, setClinicalOpen] = useState(false);

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
        biomarkers: s.biomarkers || [],
    }));

    // No system selected (null) → show overall totals + overall summary.
    const selectedSystem = selectedBiomarker != null ? activeSystems[selectedBiomarker] : null;
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
    // Biological age placeholder: calendar age minus 2 years (D — provisional).
    const bioAge = report?.patient?.age != null ? report.patient.age - 2 : null;

    // Header greeting: use the patient's real first + last name, else a
    // sex-based default. Live date underneath.
    const rawName: string = ((report?.patient?.name as string) || '').trim();
    const nameParts: string[] = rawName.split(/\s+/).filter(Boolean);
    const hasRealName = nameParts.length >= 2 && nameParts.every((p) => /[a-zA-Z]/.test(p) && !/^\d+$/.test(p));
    const displayName = hasRealName ? rawName : (report?.patient?.sex === 'Male' ? 'Juan Martinez' : 'Preetha Narayanan');
    const greeting = `Hello ${displayName}`;
    const todayStr = `It's ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;

    return (
        <Box sx={{ width: '100%', maxWidth: VITALITY_MAP_CONSTANTS.MAX_WIDTH, margin: '0 auto', }}>
            {/* Consultation Modal */}
            <ConsultationModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

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
                        onClick={() => setDemoToggle(!demoToggle)}
                        sx={{
                            fontSize: '44px',
                            fontWeight: 800,
                            color: '#1A212B',
                            lineHeight: '52px',
                            letterSpacing: '-0.02em',
                            cursor: 'pointer',
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
                        }}
                    >
                        {todayStr}
                    </Typography>
                </Box>
            </Box>

            {/* Notification Alert, Retest Banner, or Post-Reschedule Scheduled Card */}
            {false && isRescheduled ? (
                <Box
                    sx={{
                        width: '100%',
                        minHeight: VITALITY_MAP_CONSTANTS.BANNER_MIN_HEIGHT,
                        background: 'linear-gradient(90deg, #F1F5F9 0%, rgba(249, 249, 249, 0.75) 75.48%, #F9F9F9 100%)',
                        borderRadius: VITALITY_MAP_CONSTANTS.BANNER_RADIUS,
                        padding: VITALITY_MAP_CONSTANTS.BANNER_PADDING,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 4,
                        boxSizing: 'border-box',
                        position: 'relative',
                        overflow: 'visible',
                    }}
                >
                    <Box sx={{ width: '60%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', mb: 4 }}>
                            <Box
                                sx={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '8px',
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #EAECF0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <img src={CheckCircleIcon} alt="Scheduled" style={{ width: '24px', height: '24px' }} />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#101828', lineHeight: '28px', textAlign: 'left' }}>
                                    {VITALITY_MAP_LABELS.SCHEDULED_LAB_VISIT}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mt: '4px' }}>
                                    <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1447E6', cursor: 'pointer' }}>
                                        {VITALITY_MAP_LABELS.VISIT_1}
                                    </Typography>
                                    <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#475467' }}>
                                        {VITALITY_MAP_LABELS.VISIT_TIME}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ width: '2px', height: '43px', backgroundColor: '#B1C2DC80' }} />
                            <Button
                                onClick={() => {
                                    resetReschedule();
                                    navigate('/vitality-map', { state: { rescheduleIntent: false } });
                                }}
                                sx={{
                                    ml: 2,
                                    backgroundColor: '#006045',
                                    color: '#FFFFFF',
                                    border: '1px solid #256111',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    height: '36px',
                                    '&:hover': { backgroundColor: '#004d35' },
                                }}
                            >
                                {VITALITY_MAP_LABELS.BUTTON_RESCHEDULE}
                            </Button>
                        </Box>

                        {/* Steps Timeline */}
                        <Box sx={{ display: 'flex', alignItems: 'center', width: VITALITY_MAP_CONSTANTS.STEPS_TIMELINE_WIDTH, position: 'relative' }}>
                            <Box sx={{ position: 'absolute', width: '100%', top: '8.5px', left: '0', right: '0', height: '3px', background: 'linear-gradient(90deg, #484848 0%, rgba(72, 72, 72, 0.5) 25.96%, rgba(72, 72, 72, 0.25) 100%)', zIndex: 0 }} />
                            <Box sx={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                                <Box sx={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '4px solid #98A2B3' }} />
                                <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#344054' }}>{VITALITY_MAP_LABELS.STEPS_VISIT_1}</Typography>
                            </Box>
                            <Box sx={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                                <Box sx={{ width: '14px', height: '14px', mt: '3px', borderRadius: '50%', backgroundColor: '#667085' }} />
                                <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#344054' }}>{VITALITY_MAP_LABELS.STEPS_RESULTS}</Typography>
                            </Box>
                            <Box sx={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                                <Box sx={{ width: '14px', height: '14px', mt: '3px', borderRadius: '50%', backgroundColor: '#667085' }} />
                                <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#344054' }}>{VITALITY_MAP_LABELS.STEPS_SUMMARY}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        component="img"
                        src={ReadingPaperIcon}
                        alt="Reading Paper"
                        sx={{
                            position: 'absolute',
                            right: '30px',
                            top: '-20px',
                            height: '280px',
                            width: 'auto',
                            objectFit: 'contain',
                            pointerEvents: 'none',
                        }}
                    />
                </Box>
            ) : rescheduleIntent ? (
                <Box
                    sx={{
                        background: 'linear-gradient(90deg, #F2F2F2 36.27%, #F1F5F9 100%)',
                        borderRadius: VITALITY_MAP_CONSTANTS.RETEST_BANNER_RADIUS,
                        p: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 4,
                        border: '1px solid #7281971A',
                        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
                        position: 'relative',
                        minHeight: VITALITY_MAP_CONSTANTS.RETEST_BANNER_MIN_HEIGHT,
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 0, flex: 1 }}>
                        <Box sx={{ width: VITALITY_MAP_CONSTANTS.RETEST_IMAGE_WIDTH, height: '200px', flexShrink: 0 }}>
                            <Box
                                component="img"
                                src={LabSamples}
                                alt="Lab Samples"
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>
                        <Box sx={{ textAlign: 'left', pl: 10, flex: 1 }}>
                            <Typography sx={{ fontSize: '36px', fontWeight: 600, color: '#525E6F', fontFamily: 'Source Sans Pro', mb: 1 }}>
                                {VITALITY_MAP_LABELS.RETEST_TITLE}
                            </Typography>
                            <Typography sx={{ fontSize: '16px', color: '#202020', fontFamily: 'Source Sans Pro', fontWeight: 400 }}>
                                {VITALITY_MAP_LABELS.RETEST_SUBTITLE}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2.5, pr: 8, borderLeft: '1.5px solid #EAECF0', pl: 6, py: 2 }}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                <Box component="img" src={CheckCircleIcon} sx={{ width: 18, height: 18 }} />
                                <Typography sx={{ fontSize: '16px', fontWeight: 400, color: '#1A212B', fontFamily: 'Source Sans Pro' }}>
                                    {VITALITY_MAP_LABELS.READY_RETEST}
                                </Typography>
                            </Box>
                            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                                {['Luteinzing Harmone', 'Prostate specific Antigen (PSA)', 'Lipase'].map((item, idx) => (
                                    <Box component="li" key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#101828' }} />
                                        <Typography sx={{ fontSize: '12px', color: '#1A212B', fontFamily: 'Source Sans Pro', fontWeight: 400 }}>{item}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        <Button
                            variant="outlined"
                            startIcon={<Box component="img" src={KitIcon} sx={{ width: 18, height: 16 }} />}
                            onClick={() => navigate('/personal-info', { state: { isReschedule: true } })}
                            sx={{
                                border: '1px solid #256111',
                                borderRadius: '8px',
                                bgcolor: '#FFFFFF',
                                color: '#256111',
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 2.5,
                                py: '4px',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                            }}
                        >
                            {VITALITY_MAP_LABELS.BUTTON_GET_TEST}
                        </Button>
                    </Box>
                </Box>
            ) : (
                showAlert && (
                    <Box
                        sx={{
                            backgroundColor: '#F1F5F9',
                            borderRadius: VITALITY_MAP_CONSTANTS.ALERT_BORDER_RADIUS,
                            p: VITALITY_MAP_CONSTANTS.ALERT_PADDING,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: '1px solid #7281971A',
                            boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <Box
                                sx={{
                                    width: VITALITY_MAP_CONSTANTS.ALERT_ICON_SIZE,
                                    height: '50px',
                                    backgroundColor: '#E2E8F0',
                                    borderRadius: VITALITY_MAP_CONSTANTS.ALERT_ICON_BG_RADIUS,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    p: VITALITY_MAP_CONSTANTS.ALERT_ICON_PADDING,
                                    boxSizing: 'border-box'
                                }}
                            >
                                <Box
                                    component="img"
                                    src={NotesIcon}
                                    alt="Notes"
                                    sx={{ width: '100%', height: '100%' }}
                                />
                            </Box>

                            <Box sx={{ textAlign: 'left' }}>
                                <Typography
                                    sx={{
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        color: '#003366',
                                        mb: 0.5,
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    {VITALITY_MAP_LABELS.ALERT_HEADER}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '13px',
                                        color: '#475467',
                                        fontWeight: 400,
                                        lineHeight: '20px'
                                    }}
                                >
                                    {VITALITY_MAP_LABELS.ALERT_BODY}
                                </Typography>
                            </Box>
                        </Box>

                        <IconButton
                            onClick={() => setShowAlert(false)}
                            sx={{ p: 0, color: '#98A2B3' }}
                        >
                            <Box
                                component="img"
                                src={CancelIcon}
                                alt="Close"
                                sx={{ width: '20px', height: '20px' }}
                            />
                        </IconButton>
                    </Box>
                )
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
                        border: '1px solid #E2E8F0',
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
                                        gradientToColors: ['rgba(114, 226, 180, 0.7)'],
                                        stops: [0, 36],
                                        colorStops: [
                                            { offset: 0, color: 'rgba(96, 164, 151, 0.7)', opacity: 1 },
                                            { offset: 36, color: 'rgba(114, 226, 180, 0.7)', opacity: 1 }
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
                            Your Biological Age is <span style={{ color: '#101828', fontWeight: 700 }}>{bioAge != null ? `${bioAge} years` : '—'}</span>{report?.patient?.age != null ? `, about 2 years younger than your calendar age of ${report.patient.age}.` : '.'}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: 700,
                                color: '#101828',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                '&:hover': { opacity: 0.7 }
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
                        border: '1px solid #E2E8F0',
                        height: VITALITY_MAP_CONSTANTS.CARD_HEIGHT,
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1A212B', mb: 1.5, textAlign: 'left', fontFamily: 'Source Sans Pro' }}>
                        What is the Range ?
                    </Typography>

                    <Box sx={{ flexGrow: 1, position: 'relative', mt: 3, width: '100%' }}>
                        {(() => {
                            const bars = [
                                { label: 'IN RANGE', count: rangeCounts.inRange, c1: '#81FDCA', c2: '#54AD88' },
                                { label: 'OUT OF RANGE', count: rangeCounts.out, c1: '#FFC48A', c2: '#F0955A' },
                                { label: 'BORDERLINE', count: rangeCounts.borderline, c1: '#FDE68A', c2: '#E8B14C' },
                                { label: 'CRITICAL', count: rangeCounts.critical, c1: '#FDA4A4', c2: '#EF5C5C' },
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
                                                    '&::after': { content: '""', position: 'absolute', top: '6px', left: '6px', right: '6px', bottom: '4px', borderRadius: '4px', backgroundImage: 'repeating-linear-gradient(-45deg, rgba(0,0,0,0.14) 0, rgba(0,0,0,0.14) 3px, transparent 3px, transparent 6px)' },
                                                }}>
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

                {/* 3. Clinical Notes Card */}
                <Box
                    sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: VITALITY_MAP_CONSTANTS.CARD_RADIUS,
                        p: 3,
                        border: '1px solid #E2E8F0',
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
                                borderColor: '#256111',
                                color: '#256111',
                                fontWeight: 600,
                                px: 4,
                                height: '44px',
                                '&:hover': {
                                    borderColor: '#004d35',
                                    backgroundColor: '#F3FAF7',
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
                    pr: isCompareMode ? 4.5 : 0,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.05)',
                }}
            >
                {/* Header for Biomarker Section */}
                <Box sx={{ mb: 5, display: 'flex', gap: isCompareMode ? 0 : 5, pr: isCompareMode ? 0 : 4.5, alignItems: 'flex-start' }}>
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

                            {/* Toggle - Only show if NOT the first test */}
                            {!rescheduleIntent && (
                                <Box sx={{ display: 'flex', borderRadius: '10px', p: '2px', alignItems: 'center', backgroundColor: '#C8D0DB' }}>
                                    <Box
                                        onClick={() => setIsCompareMode(false)}
                                        sx={{
                                            px: 3, py: '6px',
                                            borderRadius: '10px',
                                            backgroundColor: !isCompareMode ? '#F9FAFB' : 'transparent',
                                            cursor: 'pointer',
                                        }}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 400, fontFamily: 'Lexend', color: '#1A212B' }}>
                                            Heat Map
                                        </Typography>
                                    </Box>
                                    <Box
                                        onClick={() => setIsCompareMode(true)}
                                        sx={{
                                            px: 3, py: '6px',
                                            borderRadius: '10px',
                                            backgroundColor: isCompareMode ? '#F9FAFB' : 'transparent',
                                            cursor: 'pointer'
                                        }}>
                                        <Typography sx={{ fontSize: '12px', fontWeight: 400, fontFamily: 'Lexend', color: '#1A212B' }}>
                                            Compare
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        {/* Legend */}
                        {!isCompareMode && (
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
                    {!isCompareMode && (
                        <Box sx={{ width: '420px', display: 'flex', flexDirection: 'column', pt: 0.5 }}>
                            <Typography sx={{ fontSize: '24px', fontWeight: 600, color: '#1A212B', mb: 0.5, textAlign: 'left', pr: 4.5, lineHeight: 1.2 }}>
                                {selectedSystem ? selectedSystem.name : 'Select a system'}
                            </Typography>
                            <Typography sx={{ fontSize: '16px', color: '#667085', fontWeight: 500, textAlign: 'left', pr: 4.5 }}>
                                {selectedSystem ? `${selectedSystem.biomarkers?.length || 0} Biomarkers` : 'Tap a tile to view its biomarkers'}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {isCompareMode ? (
                    <BiomarkerCompare />
                ) : (
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
                                            backgroundColor: item.color,
                                            borderRadius: '16px',
                                            p: '16px',
                                            height: '90px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            position: 'relative',
                                            boxShadow: selectedBiomarker === index ? '0px 10px 20px rgba(0,0,0,0.15), 0px 4px 6px rgba(0,0,0,0.1)' : 'none',
                                            border: selectedBiomarker === index ? '1.5px solid rgba(0,0,0,0.35)' : '1px solid rgba(0,0,0,0.15)',
                                            zIndex: selectedBiomarker === index ? 1 : 0,
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0px 6px 16px rgba(0,0,0,0.14)'
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
                                                    width: '28px',
                                                    height: '28px',
                                                    backgroundColor: '#FFFFFF33',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
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
                                    {((isExpanded ? selectedSystem?.biomarkers : selectedSystem?.biomarkers?.slice(0, 3)) || []).map((item: any, idx: number) => {
                                        const isIn = item.status === 'in_range';
                                        const isBord = item.status === 'borderline';
                                        const barColor = isIn ? '#BAEBD7' : isBord ? '#FCE4B0' : '#FFD2C2';
                                        const txtColor = isIn ? '#006045' : isBord ? '#B7791F' : '#D92D20';
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
                                                <Box>
                                                    <Typography sx={{ fontSize: '16px', fontFamily: 'source sans pro', fontWeight: 600, color: '#1A212B', mb: 0.5, lineHeight: '1.2' }}>
                                                        {item.biomarkerName || item.testName}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '15px', color: '#728197' }}>
                                                        <span style={{ color: txtColor, fontWeight: 600 }}>{label}</span> {item.value} {item.unit || ''}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                    {!selectedSystem && (
                                        <Typography sx={{ fontSize: '15px', color: '#98A2B3', pr: 4.5 }}>
                                            Select a system tile on the left to see its biomarkers here.
                                        </Typography>
                                    )}
                                </Box>

                                {selectedSystem && (
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
                                                borderColor: '#256111',
                                                color: '#256111',
                                                fontWeight: 500,
                                                px: 4,
                                                height: '50px',
                                                fontSize: '16px',
                                                '&:hover': {
                                                    borderColor: '#004d35',
                                                    backgroundColor: '#F3FAF7',
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
                )}
            </Box>

            {/* Biomarker Section Container */}
            <RecommendationSection report={report} />
        </Box>
    );
};

export default VitalityMap;
