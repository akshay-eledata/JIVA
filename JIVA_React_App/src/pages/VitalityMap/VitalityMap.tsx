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

const biomarkerData = [
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#D2F2E2' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#D2F2E2' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#D2F2E2' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#E1F2E2' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#D2F2E2' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#D2F2E2' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#E1F2E2' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#F9E2C2' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#D2F2E2' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#E1F2E2' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#F9E2C2' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#FFD7C2' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#F9E2C2' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#FFB073' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#FFB073' },
    { title: 'Auto Immunity', status: '1/4 in Range', color: '#FF8A65' },
];

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

const recommendationData: RecommendationCard[] = [
    {
        id: 'food-eat',
        title: 'Food to Eat',
        subtitle: 'For Auto Immunity',
        headerBg: 'linear-gradient(90deg, #F1FBF8 0%, #DDF4EF 100%)',
        items: [
            { id: '1', title: 'Spinach', subtitle: 'Boost your energy level to power your day...', icon: <Box component="img" src={ForkPlateIcon} sx={{ width: 18, height: 18 }} />, iconColor: '#006045', iconBg: '#F0F0F0' },
            { id: '2', title: 'Spinach', subtitle: 'Boost your energy level to power your day...', icon: <Box component="img" src={ForkPlateIcon} sx={{ width: 18, height: 18 }} />, iconColor: '#006045', iconBg: '#F0F0F0' },
            { id: '3', title: 'Spinach', subtitle: 'Boost your energy level to power your day...', icon: <Box component="img" src={ForkPlateIcon} sx={{ width: 18, height: 18 }} />, iconColor: '#006045', iconBg: '#F0F0F0' },
            { id: '4', title: 'Spinach', subtitle: 'Boost your energy level to power your day...', icon: <Box component="img" src={ForkPlateIcon} sx={{ width: 18, height: 18 }} />, iconColor: '#006045', iconBg: '#F0F0F0' },
            { id: '5', title: 'Spinach', subtitle: 'Boost your energy level to power your day...', icon: <Box component="img" src={ForkPlateIcon} sx={{ width: 18, height: 18 }} />, iconColor: '#006045', iconBg: '#F0F0F0' },
            { id: '6', title: 'Spinach', subtitle: 'Boost your energy level to power your day...', icon: <Box component="img" src={ForkPlateIcon} sx={{ width: 18, height: 18 }} />, iconColor: '#006045', iconBg: '#F0F0F0' },
        ],
    },
    {
        id: 'food-avoid',
        title: 'Food to Avoid',
        subtitle: 'For Auto Immunity',
        headerBg: 'linear-gradient(90deg, #F7F5FE 0%, #EBE9FD 100%)',
        items: [
            { id: '1', title: 'Spinach', subtitle: 'Boost your energy level to power your day...', icon: <Box component="img" src={NoFoodIcon} sx={{ width: 18, height: 18 }} />, iconColor: '#4A3AFF', iconBg: '#F0F0F0' },
            { id: '2', title: 'Spinach', subtitle: 'Boost your energy level to power your day...', icon: <Box component="img" src={NoFoodIcon} sx={{ width: 18, height: 18 }} />, iconColor: '#4A3AFF', iconBg: '#F0F0F0' },
            { id: '3', title: 'Spinach', subtitle: 'Boost your energy level to power your day...', icon: <Box component="img" src={NoFoodIcon} sx={{ width: 18, height: 18 }} />, iconColor: '#4A3AFF', iconBg: '#F0F0F0' },
            { id: '4', title: 'Spinach', subtitle: 'Boost your energy level to power your day...', icon: <Box component="img" src={NoFoodIcon} sx={{ width: 18, height: 18 }} />, iconColor: '#4A3AFF', iconBg: '#F0F0F0' },
        ],
    },
    {
        id: 'exercise',
        title: 'Exercise',
        subtitle: 'For Auto Immunity',
        headerBg: 'linear-gradient(90deg, #F4F8FE 0%, #E4EAFD 100%)',
        items: [
            { id: '1', title: 'Spinach', subtitle: 'Boost your energy level to power your day...', icon: <Box component="img" src={AlignIcon} sx={{ width: 18, height: 18 }} />, iconColor: '#2E90FA', iconBg: '#F0F0F0' },
            { id: '2', title: 'Spinach', subtitle: 'Boost your energy level to power your day...', icon: <Box component="img" src={AlignIcon} sx={{ width: 18, height: 18 }} />, iconColor: '#2E90FA', iconBg: '#F0F0F0' },
        ],
    },
    {
        id: 'supplements',
        title: 'Supplements',
        subtitle: 'For Auto Immunity',
        headerBg: 'linear-gradient(90deg, #FFF9F1 0%, #FEEDDE 100%)',
        items: [
            { id: '1', title: 'Spinach', subtitle: 'Boost your energy level to power your day...', icon: <Box component="img" src={MedicineBottleIcon} sx={{ width: 18, height: 18 }} />, iconColor: '#E08A4A', iconBg: '#F0F0F0' },
            { id: '2', title: 'Spinach', subtitle: 'Boost your energy level to power your day...', icon: <Box component="img" src={MedicineBottleIcon} sx={{ width: 18, height: 18 }} />, iconColor: '#E08A4A', iconBg: '#F0F0F0' },
        ],
    },
];

const RecommendationSection: React.FC = () => {
    const [selectedBiomarker, setSelectedBiomarkerFilter] = useState('Auto Immunity');

    const renderCard = (card: RecommendationCard, noContainer: boolean = false) => {
        const isStacked = card.id === 'exercise' || card.id === 'supplements';

        const content = (
            <>
                {/* Card Header */}
                <Box
                    sx={{
                        p: '24px',
                        backgroundColor: '#F7FAFD',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        borderBottom: '0.5px solid #B1C2DC',
                    }}
                >
                    <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1A212B', display: 'flex', alignItems: 'center', gap: 1 }}>
                        {card.title} <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#667085', fontWeight: 500, textAlign: 'left' }}>
                        {card.subtitle}
                    </Typography>

                    {/* Background Star Shape */}
                    <Box
                        component="img"
                        src={StarIcon}
                        alt="star"
                        sx={{
                            position: 'absolute',
                            right: 16,
                            top: 12,
                            width: '80px',
                            height: '80px',
                            opacity: 0.7,
                            transform: 'rotate(-15deg)',
                            pointerEvents: 'none'
                        }}
                    />
                </Box>

                {/* Items Body */}
                <Box sx={{ p: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {card.items.map((item) => (
                        <Box
                            key={item.id}
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
                                textAlign: 'left',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: item.iconBg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: item.iconColor,
                                    flexShrink: 0
                                }}
                            >
                                {item.icon}
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1A212B', mb: 0.2 }}>
                                    {item.title}
                                </Typography>
                                <Typography sx={{ fontSize: '11px', color: '#667085', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px', }}>
                                    {item.subtitle}
                                </Typography>
                            </Box>
                        </Box>
                    ))}

                    <Typography
                        sx={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#006045',
                            textAlign: 'center',
                            mt: 1,
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        Show more
                    </Typography>
                </Box>
            </>
        );

        if (noContainer) return content;

        return (
            <Box
                sx={{
                    borderRadius: '24px',
                    backgroundColor: '#F7FAFD',
                    border: '0.5px solid #B1C2DC',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: isStacked ? 'auto' : '100%',
                }}
            >
                {content}
            </Box>
        );
    };

    return (
        <Box
            sx={{
                mt: 6,
                backgroundColor: '#F1F5F9',
                borderRadius: '40px',
                p: 5,
                border: '1px solid #E2E8F0',
            }}
        >
            <Typography
                sx={{
                    textAlign: 'left',
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#000000',
                    mb: 4,
                }}
            >
                {VITALITY_MAP_LABELS.RECOMMENDED_TITLE}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 4, mb: 6 }}>
                <Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#9AA8BC', mb: 1, textAlign: 'left' }}>{VITALITY_MAP_LABELS.SELECT_BIOMARKER}</Typography>
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 380 }}>
                        <Select
                            value={selectedBiomarker}
                            onChange={(e) => setSelectedBiomarkerFilter(e.target.value as string)}
                            IconComponent={KeyboardArrowDownIcon}
                            sx={{
                                borderRadius: '12px',
                                backgroundColor: '#FFFFFF',
                                height: '48px',
                                border: '1px solid #7281971A',
                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                '& .MuiSelect-select': { py: '12px', fontSize: '16px', fontWeight: 400, color: '#728197', textAlign: 'left' }
                            }}
                        >
                            <MenuItem value="Auto Immunity">Auto Immunity</MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Button
                    variant="outlined"
                    sx={{
                        textTransform: 'none',
                        borderRadius: '12px',
                        borderColor: '#006045',
                        color: '#006045',
                        fontWeight: 700,
                        px: 4,
                        height: '48px',
                        fontSize: '16px',
                        '&:hover': {
                            borderColor: '#004d35',
                            backgroundColor: '#F3FAF7',
                        }
                    }}
                >
                    {VITALITY_MAP_LABELS.VIEW_ALL}
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                    {renderCard(recommendationData[0])}
                </Box>
                <Box sx={{ flex: 1 }}>
                    {renderCard(recommendationData[1])}
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '24px',
                        border: '0.5px solid #B1C2DC',
                        overflow: 'hidden',
                        backgroundColor: '#F7FAFD'
                    }}
                >
                    {renderCard(recommendationData[2], true)}
                    <Box sx={{ height: '0.5px', backgroundColor: '#B1C2DC' }} />
                    {renderCard(recommendationData[3], true)}
                </Box>
            </Box>
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
    const [selectedBiomarker, setSelectedBiomarker] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showBiologicalAgeTooltip, setShowBiologicalAgeTooltip] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isCompareMode, setIsCompareMode] = useState(false);

    const [categoriesData, setCategoriesData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Fetch grouped test results using HttpOnly cookies
                const resultsRes = await fetch('http://localhost:5001/api/test-results', {
                    credentials: 'include'
                });
                if (resultsRes.ok) {
                    const data = await resultsRes.json();
                    
                    const mapped = Object.keys(data).map((catName) => {
                        const tests = data[catName];
                        const total = tests.length;
                        const inRange = tests.filter((t: any) => t.isNormal).length;
                        const ratio = total > 0 ? inRange / total : 0;
                        
                        // Select color based on ratio
                        let color = '#D2F2E2'; // green
                        if (ratio >= 0.75) color = '#D2F2E2';
                        else if (ratio >= 0.5) color = '#E1F2E2';
                        else if (ratio >= 0.25) color = '#F9E2C2';
                        else color = '#FF8A65';

                        return {
                            name: catName,
                            tests,
                            statusText: `${inRange}/${total} in Range`,
                            color
                        };
                    });
                    setCategoriesData(mapped);
                }
            } catch (err) {
                console.error('Error fetching Vitality Map data:', err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    // Fallback to static data if no database results
    const activeCategories = categoriesData.length > 0 ? categoriesData : Array(16).fill(null).map((_, i) => ({
        name: 'Auto Immunity',
        statusText: '1/4 in Range',
        color: i % 4 === 0 ? '#D2F2E2' : (i % 3 === 0 ? '#E1F2E2' : (i % 2 === 0 ? '#F9E2C2' : '#FF8A65')),
        tests: [
            { isNormal: true, value: 410, biomarker: { name: 'Anti Nuclear Antibodies (ANA) Pattern', unit: 'nmol/ L' } },
            { isNormal: true, value: 410, biomarker: { name: 'Anti Nuclear Antibodies (ANA) Pattern', unit: 'nmol/ L' } },
            { isNormal: true, value: 410, biomarker: { name: 'Anti Nuclear Antibodies (ANA) Pattern', unit: 'nmol/ L' } },
            { isNormal: false, value: 1200, biomarker: { name: 'Anti Nuclear Antibodies (ANA) Pattern', unit: 'nmol/ L' } }
        ]
    }));

    return (
        <Box sx={{ width: '100%', maxWidth: VITALITY_MAP_CONSTANTS.MAX_WIDTH, margin: '0 auto', }}>
            {/* Consultation Modal */}
            <ConsultationModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

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
                        {VITALITY_MAP_LABELS.HELLO}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '16px',
                            color: '#667085',
                            mt: 0.5,
                            fontWeight: 500,
                        }}
                    >
                        {VITALITY_MAP_LABELS.DATE_STRING}
                    </Typography>
                </Box>

                {/* Search Bar */}
                <TextField
                    placeholder={VITALITY_MAP_LABELS.SEARCH_PLACEHOLDER}
                    size="small"
                    sx={{
                        width: VITALITY_MAP_CONSTANTS.SEARCH_WIDTH,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '24px',
                            backgroundColor: '#FFFFFF',
                            height: VITALITY_MAP_CONSTANTS.SEARCH_HEIGHT,
                            '& fieldset': {
                                borderColor: '#E2E8F0',
                            },
                        },
                        '& .MuiOutlinedInput-input': {
                            padding: '10px 14px',
                            color: '#667085',
                            fontSize: '16px'
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#98A2B3', fontSize: '22px' }} />
                            </InputAdornment>
                        ),
                    }}
                />
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
                            series={[75]}
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
                                <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>{VITALITY_MAP_LABELS.CALENDAR_AGE_VALUE}</Typography>
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
                                {VITALITY_MAP_LABELS.BIOLOGICAL_AGE_VALUE}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 2, textAlign: 'left', width: '100%', px: 1 }}>
                        <Box sx={{ width: '100%', height: '1.5px', backgroundColor: '#C8D0DB', mb: 3 }} />
                        <Typography sx={{ fontSize: '16px', color: '#475467', lineHeight: '24px', mb: 2 }}>
                            Your Biological Age <span style={{ color: '#101828', fontWeight: 700 }}>is 7.2 years younger than you calendar age.</span> This result is based on the lab test from January 2025
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
                        <svg width="100%" height="240" viewBox="0 0 400 240" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="rangeGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#81FDCA" />
                                    <stop offset="100%" stopColor="#54AD88" />
                                </linearGradient>
                                <linearGradient id="rangeGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#81FDCA" />
                                    <stop offset="100%" stopColor="#55AF8A" />
                                </linearGradient>
                                <linearGradient id="rangeGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#90DCCE" />
                                    <stop offset="100%" stopColor="#58968A" />
                                </linearGradient>
                                <pattern id="preciseStripes" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(-45)">
                                    <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(0,0,0,0.15)" strokeWidth="3" />
                                </pattern>
                            </defs>

                            {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map((y) => (
                                <line
                                    key={y}
                                    x1="20"
                                    y1={200 - y}
                                    x2="380"
                                    y2={200 - y}
                                    stroke="#F2F4F7"
                                    strokeWidth="1.5"
                                />
                            ))}

                            <text x="140" y="78" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 600, fill: '#6B7280', fontFamily: 'Source Sans Pro' }}>88</text>
                            <rect x="122" y="86" width="36" height="114" rx="8" fill="url(#rangeGrad1)" />
                            <rect x="126" y="92" width="28" height="103" rx="4" fill="url(#preciseStripes)" />
                            <circle cx="140" cy="96" r="4.5" fill="#4B5563" stroke="#fff" strokeWidth="1.5" />
                            <text x="140" y="220" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 400, fill: '#1A212B', fontFamily: 'Source Sans Pro' }}>IN RANGE</text>

                            <text x="200" y="38" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 400, fill: '#5B5B5B', fontFamily: 'Source Sans Pro' }}>88</text>
                            <rect x="182" y="48" width="36" height="152" rx="8" fill="url(#rangeGrad2)" />
                            <rect x="186" y="54" width="28" height="141" rx="4" fill="url(#preciseStripes)" />
                            <circle cx="200" cy="58" r="4.5" fill="#4B5563" stroke="#fff" strokeWidth="1.5" />
                            <text x="200" y="220" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 400, fill: '#1A212B', fontFamily: 'Source Sans Pro' }}>OUT OF RANGE</text>

                            <text x="260" y="105" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 600, fill: '#6B7280', fontFamily: 'Source Sans Pro' }}>16</text>
                            <rect x="242" y="115" width="36" height="85" rx="8" fill="url(#rangeGrad3)" />
                            <rect x="246" y="121" width="28" height="75" rx="4" fill="url(#preciseStripes)" />
                            <circle cx="260" cy="125" r="4.5" fill="#4B5563" stroke="#fff" strokeWidth="1.5" />
                            <text x="260" y="220" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 400, fill: '#1A212B', fontFamily: 'Source Sans Pro' }}>ABNORMAL</text>

                            <line x1="20" y1="200" x2="380" y2="200" stroke="#F2F4F7" strokeWidth="1.5" />
                        </svg>
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
                        Clinical Notes
                    </Typography>

                    <Typography sx={{ fontSize: '14px', color: '#475467', lineHeight: '24px', mb: 'auto' }}>
                        Autoimmunity is when your immune system attacks your body's own tissues rather than harmful pathogens. You may be left with more questions than answers. And that's ok. Education is the first step.
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 3, borderTop: '1px solid #F2F4F7', }}>
                        <Button
                            variant="outlined"
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
                                        background: 'linear-gradient(90deg, #A6E4D0 0%, #FFB073 100%)',
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
                                {activeCategories[selectedBiomarker]?.name || 'Auto Immunity'}
                            </Typography>
                            <Typography sx={{ fontSize: '16px', color: '#667085', fontWeight: 500, textAlign: 'left', pr: 4.5 }}>
                                {isExpanded ? 'All Biomarkers' : `${activeCategories[selectedBiomarker]?.tests?.length || 0} Biomarkers`}
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
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: '16px',
                                }}
                            >
                                {activeCategories.map((item, index) => (
                                    <Box
                                        key={index}
                                        onClick={() => setSelectedBiomarker(index)}
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
                                            border: selectedBiomarker === index ? '1px solid rgba(0,0,0,0.1)' : 'none',
                                            zIndex: selectedBiomarker === index ? 1 : 0,
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0px 4px 12px rgba(0,0,0,0.05)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box>
                                                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1A212B', mb: 0.2 }}>
                                                    {item.name}
                                                </Typography>
                                                <Typography sx={{ fontSize: '11px', fontWeight: 500, color: '#475467' }}>
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
                                        '&::-webkit-scrollbar': {
                                            width: '4px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: '#475467',
                                            borderRadius: '2px',
                                        },
                                    }}
                                >
                                    {((isExpanded ? activeCategories[selectedBiomarker]?.tests : activeCategories[selectedBiomarker]?.tests?.slice(0, 3)) || []).map((item: any, idx: number) => (
                                        <Box 
                                            key={idx} 
                                            onClick={() => {
                                                if (rescheduleIntent) {
                                                    navigate('/auto-immunity');
                                                } else {
                                                    navigate('/rheumatoid-factor');
                                                }
                                            }}
                                            sx={{ 
                                                display: 'flex', 
                                                gap: 2, 
                                                alignItems: 'flex-start', 
                                                pr: 4.5,
                                                cursor: 'pointer',
                                                transition: 'opacity 0.2s',
                                                '&:hover': { opacity: 0.7 }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: '4px',
                                                    height: '46px',
                                                    backgroundColor: item.isNormal ? '#BAEBD7' : '#FFD2C2',
                                                    borderRadius: '2px',
                                                    flexShrink: 0,
                                                    mt: 0.5
                                                }}
                                            />
                                            <Box>
                                                <Typography sx={{ fontSize: '16px', fontFamily: 'source sans pro', fontWeight: 600, color: '#1A212B', mb: 0.5, lineHeight: '1.2' }}>
                                                    {item.biomarker?.name}
                                                </Typography>
                                                <Typography sx={{ fontSize: '15px', color: '#728197' }}>
                                                    <span style={{ color: item.isNormal ? '#006045' : '#D92D20', fontWeight: 600 }}>{item.isNormal ? 'In Range' : 'Out of range'}</span> {item.value} {item.biomarker?.unit || ''}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

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
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Biomarker Section Container */}
            <RecommendationSection />
        </Box>
    );
};

export default VitalityMap;
