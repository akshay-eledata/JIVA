import React from 'react';
import { Box, Typography, Button, Grid, Breadcrumbs, Link as MuiLink } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import '@fontsource/raleway/400.css';
import '@fontsource/raleway/600.css';
import '@fontsource/raleway/700.css';
import '@fontsource/raleway/800.css';
import { AUTO_IMMUNITY_CONSTANTS } from './constants';
import { AUTO_IMMUNITY_LABELS } from './labels';

const AutoImmunity: React.FC = () => {
    return (
        <Box sx={{ width: '100%', maxWidth: AUTO_IMMUNITY_CONSTANTS.MAX_WIDTH, margin: '0 auto', padding: AUTO_IMMUNITY_CONSTANTS.CONTAINER_PADDING, backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            {/* Breadcrumbs */}
            <Box sx={{ mb: AUTO_IMMUNITY_CONSTANTS.BREADCRUMB_MB, display: 'flex', alignItems: 'center' }}>
                <Box
                    sx={{
                        backgroundColor: AUTO_IMMUNITY_CONSTANTS.BREADCRUMB_BG,
                        borderRadius: AUTO_IMMUNITY_CONSTANTS.BREADCRUMB_RADIUS,
                        px: 3,
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        border: AUTO_IMMUNITY_CONSTANTS.BREADCRUMB_BORDER
                    }}
                >
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" sx={{ color: '#98A2B3' }} />}
                        aria-label="breadcrumb"
                        sx={{
                            '& .MuiBreadcrumbs-li': { color: '#667085', fontSize: '14px', fontWeight: 500 },
                            '& .MuiBreadcrumbs-separator': { mx: 1 }
                        }}
                    >
                        <MuiLink underline="none" color="inherit" href="#">{AUTO_IMMUNITY_LABELS.BREADCRUMB_HOME}</MuiLink>
                        <MuiLink underline="none" color="inherit" href="#">{AUTO_IMMUNITY_LABELS.BREADCRUMB_BLOG}</MuiLink>
                        <MuiLink underline="none" color="inherit" href="#">{AUTO_IMMUNITY_LABELS.BREADCRUMB_BLOG_WRITING}</MuiLink>
                        <Typography sx={{ color: '#006045', fontWeight: 700, fontSize: '14px' }}>{AUTO_IMMUNITY_LABELS.BREADCRUMB_HERE}</Typography>
                    </Breadcrumbs>
                </Box>
            </Box>

            <Grid container spacing={AUTO_IMMUNITY_CONSTANTS.GRID_SPACING}>
                {/* Main Content */}
                <Grid size={AUTO_IMMUNITY_CONSTANTS.MAIN_GRID_SIZE}>
                    <Box
                        sx={{
                            backgroundColor: AUTO_IMMUNITY_CONSTANTS.CONTENT_BG,
                            borderRadius: AUTO_IMMUNITY_CONSTANTS.CONTENT_RADIUS,
                            height: { xs: 'auto', md: '100%' },
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            border: AUTO_IMMUNITY_CONSTANTS.CONTENT_BORDER,
                            overflow: 'hidden'
                        }}
                    >
                        {/* Top Content Area */}
                        <Box sx={{ p: AUTO_IMMUNITY_CONSTANTS.CONTENT_PADDING, flexGrow: 1 }}>
                            <Typography
                                sx={{
                                    fontSize: '54px',
                                    fontWeight: 700,
                                    background: 'linear-gradient(180deg, #000000 0%, #001354 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 4,
                                    textAlign: 'left',
                                }}
                            >
                                {AUTO_IMMUNITY_LABELS.TITLE}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '22px',
                                    color: '#010D3E',
                                    mb: 8,
                                    fontWeight: 400,
                                    opacity: 0.9,
                                    textAlign: 'left',
                                }}
                            >
                                {AUTO_IMMUNITY_LABELS.SUBTITLE}
                            </Typography>

                            {/* Biomarker List */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                                {[1, 2, 3].map((item) => (
                                    <Box key={item} sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                                        <Box
                                            sx={{
                                                width: '10px',
                                                height: '50px',
                                                backgroundColor: '#BAEBD7',
                                                borderRadius: '5px',
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize: '16px',
                                                    fontWeight: 600,
                                                    color: '#1A212B',
                                                    fontFamily: 'source sans pro'
                                                }}
                                            >
                                                {AUTO_IMMUNITY_LABELS.BIOMARKER_TITLE}
                                            </Typography>
                                            <Typography sx={{ fontSize: '16px', color: '#27313F', fontWeight: 400, fontFamily: 'source sans pro', textAlign: 'left' }}>
                                                <span style={{ color: '#1A212B', fontWeight: 600, }}>{AUTO_IMMUNITY_LABELS.BIOMARKER_RANGE}</span>{AUTO_IMMUNITY_LABELS.BIOMARKER_VALUE}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* FAQ Footer Area - Pinned to bottom */}
                        <Box
                            sx={{
                                backgroundColor: '#A3B0C2',
                                p: AUTO_IMMUNITY_CONSTANTS.FAQ_PADDING,
                                mt: 'auto',
                                borderTop: '1px solid rgba(255,255,255,0.1)',
                                textAlign: 'left'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '27px',
                                    fontWeight: 700,
                                    color: '#FFFFFF',
                                    fontFamily: 'Raleway, sans-serif'
                                }}
                            >
                                {AUTO_IMMUNITY_LABELS.FAQ_TITLE}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Typography sx={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 500, fontFamily: 'Raleway, sans-serif' }}>{AUTO_IMMUNITY_LABELS.FAQ_DATE}</Typography>
                                <Typography sx={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 500, fontFamily: 'Raleway, sans-serif' }}>•</Typography>
                                <Typography sx={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 500, fontFamily: 'Raleway, sans-serif' }}>{AUTO_IMMUNITY_LABELS.FAQ_READ_TIME}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                {/* Sidebar */}
                <Grid size={AUTO_IMMUNITY_CONSTANTS.SIDEBAR_GRID_SIZE}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, height: { xs: 'auto', md: '100%' } }}>
                        {/* What is the Range? Card */}
                        <Box
                            sx={{
                                height: AUTO_IMMUNITY_CONSTANTS.SIDE_CARD_HEIGHT,
                                backgroundColor: '#FFFFFF',
                                borderRadius: AUTO_IMMUNITY_CONSTANTS.SIDE_CARD_RADIUS,
                                p: AUTO_IMMUNITY_CONSTANTS.SIDE_CARD_PADDING,
                                border: AUTO_IMMUNITY_CONSTANTS.SIDE_CARD_BORDER,
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: '24px',
                                    fontWeight: 800,
                                    color: '#1A212B',
                                    textAlign: 'left',
                                    mb: 1,
                                    fontFamily: 'Source Sans Pro, sans-serif'
                                }}
                            >
                                {AUTO_IMMUNITY_LABELS.RANGE_TITLE}
                            </Typography>
                            <Box
                                sx={{
                                    backgroundColor: '#F1F5F9',
                                    borderRadius: '16px',
                                    px: 2,
                                    py: 0.5,
                                    display: 'inline-block',
                                    mb: 1,
                                    alignSelf: 'flex-start',
                                    border: '1px solid #E4E7EC'
                                }}
                            >
                                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#667085' }}>{AUTO_IMMUNITY_LABELS.RANGE_TEXT}</Typography>
                            </Box>

                            {/* Legend */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box sx={{ width: AUTO_IMMUNITY_CONSTANTS.LEGEND_DOT_SIZE, height: AUTO_IMMUNITY_CONSTANTS.LEGEND_DOT_SIZE, borderRadius: '50%', backgroundColor: '#BAEBD7' }} />
                                    <Typography sx={{ fontSize: '10px', color: '#98A2B3', fontWeight: 700, letterSpacing: '0.05em' }}>{AUTO_IMMUNITY_LABELS.RANGE_LEGEND_IN}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box sx={{ width: AUTO_IMMUNITY_CONSTANTS.LEGEND_DOT_SIZE, height: AUTO_IMMUNITY_CONSTANTS.LEGEND_DOT_SIZE, borderRadius: '50%', backgroundColor: '#475467' }} />
                                    <Typography sx={{ fontSize: '10px', color: '#98A2B3', fontWeight: 700, letterSpacing: '0.05em' }}>{AUTO_IMMUNITY_LABELS.RANGE_LEGEND_OUT}</Typography>
                                </Box>
                            </Box>

                            {/* SVG Chart */}
                            <Box sx={{ height: AUTO_IMMUNITY_CONSTANTS.CHART_SVG_HEIGHT, width: '100%', position: 'relative' }}>
                                <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="rangeGradTeal" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#81FDCA" />
                                            <stop offset="100%" stopColor="#54AD88" />
                                        </linearGradient>
                                        <linearGradient id="rangeGradDark" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#90DCCE" />
                                            <stop offset="100%" stopColor="#58968A" />
                                        </linearGradient>
                                        <pattern id="preciseStripes" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(-45)">
                                            <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(0,0,0,0.15)" strokeWidth="3" />
                                        </pattern>
                                    </defs>

                                    {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220].map((y) => (
                                        <line key={y} x1="30" y1={250 - y} x2="380" y2={250 - y} stroke="#F2F4F7" strokeWidth="1.5" />
                                    ))}

                                    <text x="85" y="45" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: '#1A212B', fontFamily: 'Source Sans Pro' }}>88</text>
                                    <rect x="70" y="55" width="30" height="195" rx="10" fill="url(#rangeGradTeal)" />
                                    <rect x="73" y="60" width="24" height="185" rx="6" fill="url(#preciseStripes)" />
                                    <circle cx="85" cy="65" r="4.5" fill="#4B5563" stroke="#fff" strokeWidth="1.5" />
                                    <text x="85" y="275" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 600, fill: '#98A2B3' }}>Jan 15</text>

                                    <text x="125" y="25" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: '#1A212B', fontFamily: 'Source Sans Pro' }}>88</text>
                                    <rect x="110" y="35" width="30" height="215" rx="10" fill="url(#rangeGradTeal)" />
                                    <rect x="113" y="40" width="24" height="205" rx="6" fill="url(#preciseStripes)" />
                                    <circle cx="125" cy="45" r="4.5" fill="#4B5563" stroke="#fff" strokeWidth="1.5" />
                                    <text x="125" y="275" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 600, fill: '#98A2B3' }}>Sep 25</text>

                                    <text x="275" y="125" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: '#1A212B', fontFamily: 'Source Sans Pro' }}>16</text>
                                    <rect x="260" y="135" width="30" height="115" rx="10" fill="#475467" opacity="0.8" />
                                    <rect x="263" y="140" width="24" height="105" rx="6" fill="url(#preciseStripes)" />
                                    <circle cx="275" cy="145" r="4.5" fill="#4B5563" stroke="#fff" strokeWidth="1.5" />
                                    <text x="275" y="275" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 600, fill: '#98A2B3' }}>Jan 15</text>

                                    <text x="315" y="135" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 800, fill: '#1A212B', fontFamily: 'Source Sans Pro' }}>16</text>
                                    <rect x="300" y="145" width="30" height="105" rx="10" fill="#475467" opacity="0.8" />
                                    <rect x="303" y="150" width="24" height="95" rx="6" fill="url(#preciseStripes)" />
                                    <circle cx="315" cy="155" r="4.5" fill="#4B5563" stroke="#fff" strokeWidth="1.5" />
                                    <text x="315" y="275" textAnchor="middle" style={{ fontSize: '11px', fontWeight: 600, fill: '#98A2B3' }}>Sep 25</text>

                                    <line x1="30" y1="250" x2="380" y2="250" stroke="#F2F4F7" strokeWidth="2" />
                                </svg>
                            </Box>
                        </Box>

                        {/* Clinical Notes Card */}
                        <Box sx={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '40px',
                            border: '1px solid #B1C2DC',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{ px: 3, py: 2, flexGrow: 1, textAlign: 'left' }}>
                                <Typography
                                    sx={{
                                        fontSize: '28px',
                                        fontWeight: 600,
                                        color: '#1A212B',
                                        mb: 2,
                                        fontFamily: 'Source Sans Pro, sans-serif'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.CLINICAL_NOTES_TITLE}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        color: '#475467',
                                        lineHeight: '1.6',
                                        mb: 5,
                                        fontFamily: 'Source Sans Pro, sans-serif'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.CLINICAL_NOTES_DESC}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    p: 3,
                                    borderTop: '1px solid #B1C2DC',
                                    mt: 'auto'
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '16px',
                                        borderColor: '#256111',
                                        color: '#256111',
                                        fontWeight: 500,
                                        px: 4,
                                        height: AUTO_IMMUNITY_CONSTANTS.READ_MORE_HEIGHT,
                                        fontSize: '16px',
                                        fontFamily: 'lexend',
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.BUTTON_READ_MORE}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Article Section */}
            <Box sx={{ pt: AUTO_IMMUNITY_CONSTANTS.ARTICLE_SPACING }}>
                <Grid container spacing={AUTO_IMMUNITY_CONSTANTS.ARTICLE_SPACING}>
                    {/* Main Article Content */}
                    <Grid size={AUTO_IMMUNITY_CONSTANTS.ARTICLE_GRID_SIZE}>
                        <Typography
                            variant="h1"
                            sx={{
                                fontSize: '27px',
                                fontWeight: 700,
                                color: '#1B1B1F',
                                mb: 4,
                                fontFamily: 'Raleway, sans-serif',
                                textAlign: 'left',
                            }}
                        >
                            {AUTO_IMMUNITY_LABELS.ABOUT_TITLE}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left' }}>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    lineHeight: '1.5',
                                    letterSpacing: '0.01em',
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 400,
                                    textAlign: 'left'
                                }}
                            >
                                {AUTO_IMMUNITY_LABELS.ABOUT_PARAGRAPH_1}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    lineHeight: '1.5',
                                    letterSpacing: '0.01em',
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 400,
                                    textAlign: 'left'
                                }}
                            >
                                {AUTO_IMMUNITY_LABELS.ABOUT_PARAGRAPH_2_PART_1}
                                <span style={{ color: '#3D22CF' }}>{AUTO_IMMUNITY_LABELS.ABOUT_PARAGRAPH_2_SPAN_1}</span>
                                {AUTO_IMMUNITY_LABELS.ABOUT_PARAGRAPH_2_PART_2}
                                <span style={{ color: '#3D22CF' }}>{AUTO_IMMUNITY_LABELS.ABOUT_PARAGRAPH_2_SPAN_2}</span>
                                {AUTO_IMMUNITY_LABELS.ABOUT_PARAGRAPH_2_PART_3}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    lineHeight: '1.5',
                                    letterSpacing: '0.01em',
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 400,
                                    textAlign: 'left'
                                }}
                            >
                                {AUTO_IMMUNITY_LABELS.ABOUT_PARAGRAPH_3}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    lineHeight: '1.5',
                                    letterSpacing: '0.01em',
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 400,
                                    textAlign: 'left'
                                }}
                            >
                                {AUTO_IMMUNITY_LABELS.ABOUT_PARAGRAPH_4}
                            </Typography>

                            {/* Facts Section */}
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: '27px',
                                    fontWeight: 700,
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    textAlign: 'left'
                                }}
                            >
                                {AUTO_IMMUNITY_LABELS.FACTS_TITLE}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.FACTS_PARAGRAPH_1_PART_1}
                                    <span style={{ color: '#3D22CF' }}>{AUTO_IMMUNITY_LABELS.FACTS_PARAGRAPH_1_SPAN_1}</span>
                                    {AUTO_IMMUNITY_LABELS.FACTS_PARAGRAPH_1_PART_2}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.FACTS_PARAGRAPH_2}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.FACTS_PARAGRAPH_3}
                                </Typography>
                            </Box>

                            {/* Understanding & Recommendations Section */}
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: '27px',
                                    fontWeight: 700,
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    textAlign: 'left'
                                }}
                            >
                                {AUTO_IMMUNITY_LABELS.UNDERSTANDING_TITLE}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.UNDERSTANDING_PARAGRAPH_1_PART_1}
                                    <span style={{ color: '#3D22CF' }}>{AUTO_IMMUNITY_LABELS.UNDERSTANDING_PARAGRAPH_1_SPAN_1}</span>
                                    {AUTO_IMMUNITY_LABELS.UNDERSTANDING_PARAGRAPH_1_PART_2}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.UNDERSTANDING_PARAGRAPH_2}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.UNDERSTANDING_PARAGRAPH_3}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.UNDERSTANDING_PARAGRAPH_4}
                                </Typography>
                            </Box>

                            {/* Exploring the Condition Section */}
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: '27px',
                                    fontWeight: 700,
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    textAlign: 'left'
                                }}
                            >
                                {AUTO_IMMUNITY_LABELS.EXPLORING_TITLE}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.EXPLORING_PARAGRAPH_1}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.EXPLORING_PARAGRAPH_2_PART_1}
                                    <span style={{ color: '#3D22CF' }}>{AUTO_IMMUNITY_LABELS.EXPLORING_PARAGRAPH_2_SPAN_1}</span>
                                    {AUTO_IMMUNITY_LABELS.EXPLORING_PARAGRAPH_2_PART_2}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.EXPLORING_PARAGRAPH_3}
                                </Typography>
                            </Box>

                            {/* Best Practise Section */}
                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: '27px',
                                    fontWeight: 700,
                                    color: '#1B1B1F',
                                    fontFamily: 'Raleway, sans-serif',
                                    textAlign: 'left'
                                }}
                            >
                                {AUTO_IMMUNITY_LABELS.BEST_PRACTISE_TITLE}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.BEST_PRACTISE_PARAGRAPH_1}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.BEST_PRACTISE_PARAGRAPH_2}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '18px',
                                        lineHeight: '1.5',
                                        letterSpacing: '0.01em',
                                        color: '#1B1B1F',
                                        fontFamily: 'Raleway, sans-serif',
                                        fontWeight: 400,
                                        textAlign: 'left'
                                    }}
                                >
                                    {AUTO_IMMUNITY_LABELS.BEST_PRACTISE_PARAGRAPH_3}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Sidebar: In this article */}
                    <Grid size={AUTO_IMMUNITY_CONSTANTS.ARTICLE_SIDEBAR_GRID_SIZE}>
                        <Box sx={{ position: 'sticky', top: AUTO_IMMUNITY_CONSTANTS.STICKY_TOP }}>
                            <Typography
                                sx={{
                                    fontSize: '20px',
                                    fontWeight: 600,
                                    color: '#1B1B1F',
                                    mb: 4,
                                    fontFamily: 'Raleway, sans-serif',
                                    textAlign: 'left'
                                }}
                            >
                                {AUTO_IMMUNITY_LABELS.ARTICLE_SIDEBAR_TITLE}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, pl: 3, textAlign: 'left' }}>
                                {[
                                    { text: AUTO_IMMUNITY_LABELS.ABOUT_TITLE, active: true },
                                    { text: AUTO_IMMUNITY_LABELS.FACTS_TITLE, active: false },
                                    { text: AUTO_IMMUNITY_LABELS.UNDERSTANDING_TITLE, active: false },
                                    { text: AUTO_IMMUNITY_LABELS.EXPLORING_TITLE, active: false },
                                    { text: AUTO_IMMUNITY_LABELS.BEST_PRACTISE_TITLE, active: false }
                                ].map((item, index) => (
                                    <Typography
                                        key={index}
                                        sx={{
                                            fontSize: '16px',
                                            fontWeight: item.active ? 700 : 400,
                                            color: item.active ? '#3D22CF' : '#1B1B1F',
                                            fontFamily: 'Raleway, sans-serif',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            position: 'relative',
                                            '&:hover': { color: '#3D22CF' },
                                            ...(item.active && {
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    left: '-24px',
                                                    top: '-10px',
                                                    bottom: '-10px',
                                                    width: '3.5px',
                                                    backgroundColor: '#3D22CF',
                                                    borderRadius: '4px'
                                                }
                                            })
                                        }}
                                    >
                                        {item.text}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default AutoImmunity;
