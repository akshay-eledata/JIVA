import React, { useState } from 'react';
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
                border: '1px solid #E4E7EC',

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
                What’s Recommended?
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 4, mb: 6 }}>
                <Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#9AA8BC', mb: 1, textAlign: 'left' }}>Select Biomarker</Typography>
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
                    View All
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
    const [showAlert, setShowAlert] = useState(true);
    const [selectedBiomarker, setSelectedBiomarker] = useState(3); // Default to the 4th card (index 3)
    const [isExpanded, setIsExpanded] = useState(false);
    const [showBiologicalAgeTooltip, setShowBiologicalAgeTooltip] = useState(false);

    return (
        <Box sx={{ width: '100%', maxWidth: '1300px', margin: '0 auto', }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, mt: 2 }}>
                <Box>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: '44px',
                            fontWeight: 800,
                            color: '#1A212B',
                            fontFamily: 'Inter, sans-serif',
                            lineHeight: '52px',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Hello Brian!
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '16px',
                            color: '#667085',
                            fontFamily: 'Inter, sans-serif',
                            mt: 0.5,
                            fontWeight: 500,
                        }}
                    >
                        Its Tuesday, 4 June 2025
                    </Typography>
                </Box>

                {/* Search Bar */}
                <TextField
                    placeholder="Search..."
                    size="small"
                    sx={{
                        width: '450px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '24px',
                            backgroundColor: '#FFFFFF',
                            height: '46px',
                            '& fieldset': {
                                borderColor: '#E4E7EC', // Subtle border color
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

            {/* Notification Alert */}
            {showAlert && (
                <Box
                    sx={{
                        backgroundColor: '#F1F5F9', // Light blue-grey background from screenshot
                        borderRadius: '24px',
                        p: '24px 32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid #7281971A',
                        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {/* Icon Background */}
                        <Box
                            sx={{
                                width: '56px',
                                height: '50px',
                                backgroundColor: '#E2E8F0',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                p: '14px',
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
                                    color: '#003366', // Deep blue color for the highlight
                                    mb: 0.5,
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase'
                                }}
                            >
                                HEY! YOUR LATEST HEALTH DATA IS READY...
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '13px',
                                    color: '#475467',
                                    fontWeight: 400,
                                    lineHeight: '20px'
                                }}
                            >
                                This is dashboard displaying result of latest data reviewed on September ! Check in and take action by viewing recommendations
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
            )}
            {/* Health Info Cards Grid */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 3,
                    mt: 4,
                }}
            >
                {/* 1. Biological Age Card */}
                <Box
                    sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '32px',
                        p: 3,
                        border: '1px solid #E4E7EC',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        height: '340px',

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
                                        hollow: { size: '65%' },
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
                            height={250}
                        />

                        {/* Figma-Style Tooltip (Hybrid CSS) */}
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
                                Calendar Age
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                                <Typography sx={{ fontSize: '12px', fontWeight: 500 }}>35 Years</Typography>
                            </Box>
                        </Box>

                        {/* Centered Labels (Hybrid CSS) */}
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
                                BIOLOGICAL AGE
                            </Typography>
                            <Typography sx={{ fontSize: '28px', fontWeight: 700, color: '#6B7280', lineHeight: 1, fontFamily: 'Source Sans Pro' }}>
                                28.2 Years
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
                        borderRadius: '32px',
                        p: 3,
                        border: '1px solid #E4E7EC',
                        height: '340px',
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
                        {/* High-Precision SVG Framework */}
                        <svg width="100%" height="240" viewBox="0 0 400 240" preserveAspectRatio="none">
                            <defs>
                                {/* Figma Gradients */}
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

                                {/* Exact 4x4 Slanted Lines Pattern */}
                                <pattern id="preciseStripes" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(-45)">
                                    <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(0,0,0,0.15)" strokeWidth="3" />
                                </pattern>
                            </defs>

                            {/* 12 GRID LINES for better depth + Increased strokeWidth */}
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

                            {/* Bar 1: IN RANGE (Baseline: 200, Height: 114) */}
                            <text x="140" y="78" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 600, fill: '#6B7280', fontFamily: 'Source Sans Pro' }}>88</text>
                            <rect x="122" y="86" width="36" height="114" rx="8" fill="url(#rangeGrad1)" />
                            <rect x="126" y="92" width="28" height="103" rx="4" fill="url(#preciseStripes)" />
                            <circle cx="140" cy="96" r="4.5" fill="#4B5563" stroke="#fff" strokeWidth="1.5" />
                            <text x="140" y="220" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 400, fill: '#1A212B', fontFamily: 'Source Sans Pro' }}>IN RANGE</text>

                            {/* Bar 2: OUT OF RANGE (Baseline: 200, Height: 152) */}
                            <text x="200" y="38" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 400, fill: '#5B5B5B', fontFamily: 'Source Sans Pro' }}>88</text>
                            <rect x="182" y="48" width="36" height="152" rx="8" fill="url(#rangeGrad2)" />
                            <rect x="186" y="54" width="28" height="141" rx="4" fill="url(#preciseStripes)" />
                            <circle cx="200" cy="58" r="4.5" fill="#4B5563" stroke="#fff" strokeWidth="1.5" />
                            <text x="200" y="220" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 400, fill: '#1A212B', fontFamily: 'Source Sans Pro' }}>OUT OF RANGE</text>

                            {/* Bar 3: ABNORMAL (Baseline: 200, Height: 85) */}
                            <text x="260" y="105" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 600, fill: '#6B7280', fontFamily: 'Source Sans Pro' }}>16</text>
                            <rect x="242" y="115" width="36" height="85" rx="8" fill="url(#rangeGrad3)" />
                            <rect x="246" y="121" width="28" height="75" rx="4" fill="url(#preciseStripes)" />
                            <circle cx="260" cy="125" r="4.5" fill="#4B5563" stroke="#fff" strokeWidth="1.5" />
                            <text x="260" y="220" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 400, fill: '#1A212B', fontFamily: 'Source Sans Pro' }}>ABNORMAL</text>

                            {/* Main Baseline */}
                            <line x1="20" y1="200" x2="380" y2="200" stroke="#F2F4F7" strokeWidth="1.5" />
                        </svg>
                    </Box>
                </Box>

                {/* 3. Clinical Notes Card */}
                <Box
                    sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '32px',
                        p: 3,
                        border: '1px solid #E4E7EC',
                        height: '340px',
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
                    pr: 0,
                    border: '1px solid #E4E7EC',
                    boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.05)',
                }}
            >
                <Box sx={{ display: 'flex', gap: 5 }}>
                    {/* Left Column */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography
                                sx={{
                                    fontSize: '28px',
                                    fontWeight: 700,
                                    color: '#1A212B',
                                    fontFamily: 'Inter, sans-serif',
                                    textAlign: 'left'
                                }}
                            >
                                Biomarker
                            </Typography>

                            {/* Header: Legend moved from right side */}
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
                        </Box>

                        {/* Cards Grid */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '16px',
                            }}
                        >
                            {biomarkerData.map((item, index) => (
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
                                                {item.title}
                                            </Typography>
                                            <Typography sx={{ fontSize: '11px', fontWeight: 500, color: '#475467' }}>
                                                {item.status}
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
                            <Typography sx={{ fontSize: '28px', fontWeight: 700, color: '#1A212B', mb: 0.5, textAlign: 'left', pr: 4.5 }}>
                                Auto Immunity
                            </Typography>
                            <Typography sx={{ fontSize: '16px', color: '#667085', mb: 5, fontWeight: 500, textAlign: 'left', pr: 4.5 }}>
                                {isExpanded ? 'All Biomarkers' : '4 Biomarkers'}
                            </Typography>

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
                                {(isExpanded ? [1, 2, 3, 4, 5, 6, 7, 8] : [1, 2, 3]).map((item) => (
                                    <Box key={item} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', pr: 4.5 }}>
                                        <Box
                                            sx={{
                                                width: '4px',
                                                height: '46px',
                                                backgroundColor: '#BAEBD7',
                                                borderRadius: '2px',
                                                flexShrink: 0,
                                                mt: 0.5
                                            }}
                                        />
                                        <Box>
                                            <Typography sx={{ fontSize: '16px', fontFamily: 'source sans pro', fontWeight: 600, color: '#1A212B', mb: 0.5, lineHeight: '1.2' }}>
                                                Anti Nuclear Antibodies (ANA) Pattern
                                            </Typography>
                                            <Typography sx={{ fontSize: '15px', color: '#728197' }}>
                                                <span style={{ color: '#728197', fontWeight: 600 }}>In Range</span> 410 nmol/ L
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
            </Box>

            {/* Biomarker Section Container */}
            <RecommendationSection />
        </Box>
    );
};

export default VitalityMap;
