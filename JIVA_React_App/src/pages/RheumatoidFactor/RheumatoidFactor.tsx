import React, { useState } from 'react';
import { Box, Typography, Link, Breadcrumbs, Grid } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Chart from 'react-apexcharts';
import '@fontsource/raleway/400.css';
import '@fontsource/raleway/600.css';
import '@fontsource/raleway/700.css';
import '@fontsource/raleway/800.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';

const RheumatoidFactor: React.FC = () => {
    const [currentView, setCurrentView] = useState('Why It matters');

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '1200px',
            p: '40px 32px',
            backgroundColor: '#FFFFFF',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '0 auto'
        }}>
            {/* Breadcrumb Section */}
            <Box sx={{ width: '100%', mb: 6, display: 'flex', alignItems: 'center' }}>
                <Box sx={{
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px',
                    px: 1.5,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #F2F4F7'
                }}>
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" sx={{ color: '#98A2B3' }} />}
                        aria-label="breadcrumb"
                        sx={{
                            '& .MuiBreadcrumbs-li': { color: '#667085', fontSize: '13px', fontWeight: 500 },
                            '& .MuiBreadcrumbs-separator': { mx: 1 }
                        }}
                    >
                        <Link underline="none" color="inherit" href="#">Your Health</Link>
                        <Typography sx={{ color: '#3D22CF', fontWeight: 600, fontSize: '13px' }}>Auto Immunity</Typography>
                    </Breadcrumbs>
                </Box>
            </Box>

            {/* Main Content Card */}
            <Box sx={{
                width: '100%',
                backgroundColor: '#F1F5F9',
                borderRadius: '40px',
                border: '1px solid #B1C2DC',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ p: { xs: 3, md: 3 }, pb: { xs: 2, md: 2 } }}>
                    <Typography sx={{
                        fontSize: '36px',
                        fontWeight: 600,
                        color: '#1B1B1F',
                        fontFamily: 'DM sans',
                        textAlign: 'left',
                    }}>
                        {currentView === 'Biological Age' ? (
                            <>
                                Biological Age <Typography component="span" sx={{ color: '#9AA8BC', fontSize: 'inherit', fontWeight: 'inherit' }}>30.5 Years</Typography>
                            </>
                        ) : (
                            'Rheumatoid Factor (RF)'
                        )}
                    </Typography>
                </Box>

                <Box sx={{ borderTop: '1px solid #B1C2DC' }} />

                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'stretch'
                }}>
                    {/* Left Info Section */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 4, pr: { md: 6, xs: 4 } }}>
                        {currentView === 'Biological Age' ? (
                            <Typography sx={{
                                fontSize: '22px',
                                color: '#010D3E',
                                mb: 8,
                                fontWeight: 400,
                                opacity: 0.9,
                                textAlign: 'left',
                                maxWidth: '550px'
                            }}>
                                Your Biological age is 7.2 years younger than your calendar age.
                            </Typography>
                        ) : (
                            <>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#69E0C6' }} />
                                    <Typography sx={{ color: '#69E0C6', fontFamily: 'source sans pro', fontWeight: 600, fontSize: '18px', }}>
                                        In Range
                                    </Typography>
                                    <Typography sx={{ color: '#9AA8BC', fontSize: '18px' }}>
                                        &lt;10 IU/ml
                                    </Typography>
                                </Box>

                                <Typography sx={{
                                    fontSize: '22px',
                                    color: '#010D3E',
                                    mb: 8,
                                    fontWeight: 400,
                                    opacity: 0.9,
                                    textAlign: 'left',
                                    maxWidth: '550px'
                                }}>
                                    Check for any indicators for auto immunity disorder like Rheumatoid Factor like rheumatoid Factor
                                </Typography>
                            </>
                        )}

                        <Box sx={{ mt: 'auto' }}>
                            <Typography sx={{ color: '#728197', fontSize: '16px' }}>
                                This result is based on the lab test from January 2025
                                <Link href="#" sx={{ color: '#444648', fontWeight: 600, fontFamily: 'source sans pro', textDecoration: 'underline', ml: 1, }}>
                                    View More
                                </Link>
                            </Typography>
                        </Box>
                    </Box>

                    {/* Chart Section */}
                    <Box sx={{
                        flex: 1.4,
                        display: 'flex',
                        minHeight: '350px',
                        borderLeft: currentView === 'Biological Age' ? 'none' : { xs: 'none', md: '1px solid #C8D0DB' },
                        position: 'relative'
                    }}>
                        {/* Status Vertical Bar & Labels */}
                        {currentView !== 'Biological Age' && (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                pt: 0,
                                minWidth: '160px',
                                position: 'relative',
                                height: '100%'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', height: '50%', position: 'relative', }}>
                                    <Box sx={{ position: 'absolute', left: 4, top: 8, bottom: 4, width: '6px', backgroundColor: '#9AA8BC', borderRadius: '4px' }} />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: { xs: 2.5, md: 4 } }}>
                                        <Typography sx={{ color: '#69E0C6', fontWeight: 600, fontSize: '16px' }}>In Range</Typography>
                                        <Typography sx={{ color: '#9AA8BC', fontSize: '14px' }}>&lt;10 IU/ml</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', height: '40%', position: 'relative' }}>
                                    <Box sx={{ position: 'absolute', left: 4, top: 4, bottom: -16, width: '6px', backgroundColor: '#CBD4E1', borderRadius: '4px' }} />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pl: { xs: 2.5, md: 4 } }}>
                                        <Typography sx={{ color: '#F1696E', fontWeight: 600, fontSize: '16px' }}>Above Range</Typography>
                                        <Typography sx={{ color: '#9AA8BC', fontSize: '14px' }}>&lt;10 IU/ml</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        )}

                        <Box sx={{
                            flex: 1.5,
                            position: 'relative',
                            height: '100%',
                            p: 4,
                            pl: currentView === 'Biological Age' ? 10 : 4,
                            '& .apexcharts-canvas': { margin: '0 auto' },
                            '& .apexcharts-tooltip': {
                                background: 'transparent !important',
                                border: 'none !important',
                                boxShadow: 'none !important'
                            }
                        }}>
                            <Chart
                                options={{
                                    chart: {
                                        type: 'line',
                                        toolbar: { show: false },
                                        zoom: { enabled: false },
                                        animations: { enabled: false }
                                    },
                                    stroke: {
                                        curve: 'straight',
                                        width: 2,
                                        colors: ['#94A3B8'],
                                        connectNulls: true
                                    } as any,
                                    markers: {
                                        size: [4, 0, 4],
                                        colors: ['#667085', 'transparent', '#94A3B8'],
                                        strokeWidth: 0,
                                        hover: { size: 6 }
                                    },
                                    grid: {
                                        show: true,
                                        borderColor: '#EAECF0',
                                        xaxis: { lines: { show: false } },
                                        yaxis: { lines: { show: false } }, // Disable standard lines
                                        padding: { top: 40, right: 40, bottom: 0, left: 40 }
                                    },
                                    xaxis: {
                                        type: 'category',
                                        categories: ['Feb', 'Mar', 'Apr'],
                                        labels: {
                                            style: {
                                                colors: '#667085',
                                                fontSize: '14px',
                                                fontWeight: 500,
                                            }
                                        },
                                        axisBorder: { show: false },
                                        axisTicks: { show: false },
                                        tooltip: { enabled: false }
                                    },
                                    yaxis: {
                                        min: 28.7,
                                        max: 30.2, // Narrowed range spreads the grid lines
                                        labels: { show: false },
                                        axisBorder: { show: false },
                                        axisTicks: { show: false }
                                    },
                                    tooltip: {
                                        enabled: true,
                                        theme: 'dark',
                                        shared: false,
                                        intersect: true,
                                        marker: { show: false },
                                        custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
                                            // Apr is index 1 in the 2-point series {Feb, Apr}
                                            if (dataPointIndex !== 1) return null;
                                            return `<div style="background: #101828; padding: 12px; border-radius: 8px; color: white; border: none; font-family: Inter; position: relative; margin-bottom: 25px; box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.08);">
                                                <div style="font-size: 14px; font-weight: 400; text-align: left; margin-bottom: 4px; color: #D0D5DD;">June 2025</div>
                                                <div style="display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600;">
                                                    <span style="width: 8px; height: 8px; border-radius: 50%; background: #2E90FA;"></span>
                                                    30.1
                                                </div>
                                                <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #101828;"></div>
                                            </div>`;
                                        },
                                        offsetY: -30
                                    } as any,
                                    dataLabels: {
                                        enabled: true,
                                        formatter: (val: any, { dataPointIndex }: any) => dataPointIndex === 0 ? '29.1' : '',
                                        offsetY: -15,
                                        style: {
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            colors: ['#101828']
                                        },
                                        background: {
                                            enabled: false,
                                            borderWidth: 0
                                        }
                                    },
                                    annotations: {
                                        position: 'back',
                                        yaxis: [
                                            { y: 28.8, borderColor: '#EAECF0', width: '100%', strokeDashArray: 0 },
                                            { y: 29.1, borderColor: '#EAECF0', width: '100%', strokeDashArray: 0 },
                                            { y: 29.4, borderColor: '#EAECF0', width: '100%', strokeDashArray: 0 },
                                            { y: 29.7, borderColor: '#EAECF0', width: '100%', strokeDashArray: 0 }
                                        ],
                                        xaxis: [
                                            {
                                                x: 'Feb',
                                                borderColor: '#FDA29B',
                                                strokeDashArray: 3,
                                                label: { text: '', style: { background: 'none' } }
                                            } as any,
                                            {
                                                x: 'Apr',
                                                borderColor: '#FDA29B',
                                                strokeDashArray: 3,
                                                label: { text: '', style: { background: 'none' } }
                                            } as any
                                        ]
                                    } as any
                                }}
                                series={[{
                                    name: 'Value',
                                    data: [
                                        { x: 'Feb', y: 29.1 },
                                        { x: 'Apr', y: 30.1 }
                                    ]
                                }]}
                                type="line"
                                height={310}
                            />
                        </Box>
                    </Box>
                </Box>

                {currentView === 'Biological Age' && (
                    <Box sx={{
                        backgroundColor: '#9AA8BC',
                        p: 3,
                        px: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}>
                        <Typography sx={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 600, fontFamily: 'Raleway' }}>
                            We made slight changes to how we calculate this
                        </Typography>
                        <Link href="#" sx={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 400, textDecoration: 'underline', opacity: 0.9 }}>
                            Learn More
                        </Link>
                    </Box>
                )}
            </Box>

            {/* Article Section */}
            <Box sx={{ width: '100%', pt: 4 }}>
                <Grid container spacing={8}>
                    {/* Main Article Content */}
                    <Grid size={{ xs: 12, md: 8 }}>
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
                            Why It matters
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left' }}>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    lineHeight: '1.5',
                                    letterSpacing: '0.01em',
                                    color: '#010D3E',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 400,
                                    textAlign: 'left'
                                }}
                            >
                                Hello there! As a marketing manager in the SaaS industry, you might be looking for innovative ways to engage your audience. I bet generative AI has crossed your mind as an option for creating content. Well, let me share from my firsthand experience.
                            </Typography>
                            {/* ... Rest of the article content ... */}
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    lineHeight: '1.5',
                                    letterSpacing: '0.01em',
                                    color: '#010D3E',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 400,
                                    textAlign: 'left'
                                }}
                            >
                                Google encourages high-quality blogs regardless of whether they're <Typography component="span" sx={{ color: '#3D22CF', fontWeight: 'inherit', fontSize: 'inherit' }}>written by humans or created using artificial intelligence</Typography> like ChatGPT. Here's what matters: producing original material with expertise and trustworthiness based on Google <Typography component="span" sx={{ color: '#3D22CF', fontWeight: 'inherit', fontSize: 'inherit' }}>E-E-A-T principles</Typography>.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    lineHeight: '1.5',
                                    letterSpacing: '0.01em',
                                    color: '#010D3E',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 400,
                                    textAlign: 'left'
                                }}
                            >
                                This means focusing more on people-first writing rather than primarily employing AI tools to manipulate search rankings. There comes a time when many experienced professionals want to communicate their insights but get stuck due to limited writing skills – that's where <Typography component="span" sx={{ fontWeight: 700 }}>Generative AI</Typography> can step in.
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    lineHeight: '1.5',
                                    letterSpacing: '0.01em',
                                    color: '#010D3E',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 400,
                                    textAlign: 'left'
                                }}
                            >
                                So, together, we're going explore how this technology could help us deliver valuable content without sounding robotic or defaulting into mere regurgitations of existing materials (spoiler alert – common pitfalls!). Hang tight - it'll be a fun learning journey!
                            </Typography>

                            <Typography
                                variant="h2"
                                sx={{
                                    fontSize: '27px',
                                    fontWeight: 700,
                                    color: '#010D3E',
                                    fontFamily: 'Raleway, sans-serif',
                                    textAlign: 'left',
                                }}
                            >
                                Summary
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '18px',
                                    lineHeight: '1.5',
                                    letterSpacing: '0.01em',
                                    color: '#010D3E',
                                    fontFamily: 'Raleway, sans-serif',
                                    fontWeight: 400,
                                    textAlign: 'left'
                                }}
                            >
                                Jumping headfirst into using AI, like <Typography component="span" sx={{ color: '#3D22CF', fontWeight: 'inherit', fontSize: 'inherit' }}>ChatGPT</Typography>, without a content strategy can lead to some unfortunate results. One common pitfall I've seen is people opting for <Typography component="span" sx={{ fontWeight: 700 }}>quantity over quality</Typography> - they churn out blogs, but each one feels robotic and soulless, reading just like countless others on the internet.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Sidebar: In this article */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ position: 'sticky', top: 40 }}>
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
                                In this article
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, pl: 3, textAlign: 'left' }}>
                                {[
                                    { text: 'Why It matters', active: currentView === 'Why It matters' },
                                    { text: 'Biological Age', active: currentView === 'Biological Age' },
                                    { text: 'Food to Eat', active: false },
                                    { text: 'Food To Limit', active: false },
                                    { text: 'How to Calculate', active: false },
                                    { text: 'Disclaimer', active: false }
                                ].map((item, index) => (
                                    <Typography
                                        key={index}
                                        onClick={() => {
                                            if (item.text === 'Why It matters' || item.text === 'Biological Age') {
                                                setCurrentView(item.text);
                                            }
                                        }}
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

export default RheumatoidFactor;
