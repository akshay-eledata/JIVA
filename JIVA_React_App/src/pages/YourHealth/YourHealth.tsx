import React from 'react';
import { Box, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import BaseHealthCard from '../../Component/BaseHealthCard/BaseHealthCard';
import BiomarkerRow from '../../Component/BiomarkerRow/BiomarkerRow';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/raleway/700.css';
import FileIcon from '../../assets/File.svg';
import CancelIcon from '../../assets/cancel.svg';
import OvalIcon from '../../assets/Oval.svg';
import EyeIcon from '../../assets/Eye.svg';
import HighIcon from '../../assets/high.svg';

const YourHealth: React.FC = () => {
    const [view, setView] = React.useState<'overview' | 'detailed'>('overview');
    const [selectedTab, setSelectedTab] = React.useState<'inRange' | 'outOfRange' | 'improving'>('inRange');

    const chartOptions: any = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '8%',
                barGap: '30%',
            }
        },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 3,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Jan', 'Feb'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: {
                    colors: '#98A2B3',
                    fontSize: '11px',
                    fontWeight: 600,
                }
            }
        },
        yaxis: {
            min: 0,
            max: 400,
            tickAmount: 4,
            labels: {
                style: {
                    colors: '#98A2B3',
                    fontSize: '11px',
                    fontWeight: 600,
                }
            }
        },
        fill: {
            opacity: 1,
            colors: ['#2563EB', '#CBD5E1']
        },
        grid: {
            show: true,
            borderColor: '#E4E7EC',
            strokeDashArray: 0,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } }
        },
        legend: { show: false },
        tooltip: {
            theme: 'dark',
            custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
                return '<div class="custom-tooltip">' +
                    '<span class="tooltip-title">July 2022</span>' +
                    '<ul>' +
                    '<li><span class="dot" style="background-color: #3B82F6"></span> 88.4</li>' +
                    '<li><span class="dot" style="background-color: #14B8A6"></span> 77</li>' +
                    '</ul>' +
                    '<div class="tooltip-arrow"></div>' +
                    '</div>';
            }
        }
    };

    const chartSeries = [
        { name: 'In Range', data: [180, 280] },
        { name: 'Out of Range', data: [130, 120] }
    ];

    const biomarkers = [
        { category: 'Autoimmunity', name: 'Anti Nuclear Antibodies (ANA) Pattern', sublabel: "Appropriate range <10 IU/ml", valueLabel: "25 IU/ml", statusLabel: "In Range", statusColor: "#CCFBF1", batch: "25 IU/ml", qty: "In Range", status: 'inRange' },
        { category: 'Autoimmunity', name: 'Anti Nuclear Antibodies (ANA) Pattern', sublabel: "<10 IU/ml", valueLabel: "25 IU/ml", statusLabel: "In Range", statusColor: "#CCFBF1", batch: "25 IU/ml", qty: "In Range", status: 'inRange' },
        { category: 'Autoimmunity', name: 'Anti Nuclear Antibodies (ANA) Pattern', sublabel: "<10 IU/ml", valueLabel: "25 IU/ml", statusLabel: "In Range", statusColor: "#CCFBF1", batch: "25 IU/ml", qty: "In Range", status: 'inRange' },
        { category: 'Blood', name: 'Anti Nuclear Antibodies (ANA) Pattern', sublabel: "Appropriate range <10 IU/ml", valueLabel: "25 IU/ml", statusLabel: "In Range", statusColor: "#CCFBF1", batch: "25 IU/ml", qty: "In Range", status: 'inRange' },
        { category: 'Blood', name: 'Anti Nuclear Antibodies (ANA) Pattern', sublabel: "<10 IU/ml", valueLabel: "25 IU/ml", statusLabel: "In Range", statusColor: "#CCFBF1", batch: "25 IU/ml", qty: "In Range", status: 'inRange' },
        { category: 'Blood', name: 'Anti Nuclear Antibodies (ANA) Pattern', sublabel: "<10 IU/ml", valueLabel: "25 IU/ml", statusLabel: "In Range", statusColor: "#CCFBF1", batch: "25 IU/ml", qty: "In Range", status: 'inRange' },
    ];

    const summaryCards = [
        { id: 'inRange', label: 'In Range', count: 18, color: '#D1FAE5', iconColor: '#10B981' },
        { id: 'outOfRange', label: 'Out of Range', count: 8, color: '#FEE2E2', iconColor: '#EF4444' },
        { id: 'improving', label: 'Improving', count: 17, color: '#DBEAFE', iconColor: '#3B82F6' }
    ];

    const filteredBiomarkers = view === 'detailed' ? biomarkers.filter(b => b.status === selectedTab) : biomarkers;

    // Group filtered biomarkers by category
    const groupedBiomarkers = filteredBiomarkers.reduce((acc, curr) => {
        if (!acc[curr.category]) {
            acc[curr.category] = [];
        }
        acc[curr.category].push(curr);
        return acc;
    }, {} as Record<string, typeof biomarkers>);

    const handleSummaryClick = (id: string) => {
        setSelectedTab(id as any);
        setView('detailed');
    };

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '1300px',
            p: '30px 16px',
            backgroundColor: '#FFFFFF',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            margin: '0 auto'
        }}>
            <Typography sx={{ fontSize: '48px', fontWeight: 600, color: '#1E293B', textAlign: 'left' }}>
                Your Health
            </Typography>
            <Typography sx={{ fontSize: '16px', color: '#475569', fontFamily: 'Plus Jakarta Sans', mb: 4, textAlign: 'left', fontWeight: '500' }}>
                Tuesday August 26, 2025
            </Typography>

            {view === 'overview' ? (
                /* Overview View (Old UI) */
                <BaseHealthCard
                    hideMiddleBorder={true}
                    title={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{ fontSize: '24px', fontWeight: 700, color: '#1B1B1F' }}>35%</Typography>
                            <img src={HighIcon} alt="High" style={{ width: 20, height: 20 }} />
                            <Typography component="span" sx={{ fontSize: '18px', color: '#14B8A6', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                25.3%
                            </Typography>
                        </Box>
                    }
                    leftContent={
                        <Box sx={{ px: 1, pb: 0, position: 'relative' }}>
                            <Box sx={{ position: 'absolute', top: -48, right: 0, display: 'flex', gap: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#14B8A6' }} />
                                    <Typography sx={{ fontSize: '14px', color: '#1F2937', fontWeight: 500 }}>In Range</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F1696E' }} />
                                    <Typography sx={{ fontSize: '14px', color: '#1F2937', fontWeight: 500 }}>Out of range</Typography>
                                </Box>
                            </Box>
                            <Chart
                                options={chartOptions}
                                series={chartSeries}
                                type="bar"
                                height={240}
                            />
                        </Box>
                    }
                    rightContent={
                        <Box sx={{ p: '24px 50px', display: 'flex', flexDirection: 'column', gap: 1.5, justifyContent: 'center', width: '100%' }}>
                            {summaryCards.map((item, index) => (
                                <Box
                                    key={index}
                                    onClick={() => handleSummaryClick(item.id)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        borderBottom: index < 2 ? '1px solid #E4E7EC' : 'none',
                                        pb: 1.5,
                                        // mt: index === 0 ? 0 : 1.5,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            opacity: 0.7
                                        }
                                    }}
                                >
                                    <Typography sx={{ fontSize: '40px', fontWeight: 600, color: '#1A212B', fontFamily: 'Source Sans Pro', minWidth: '40px' }}>
                                        {item.count}
                                    </Typography>
                                    <Typography sx={{ fontSize: '20px', color: '#1A212B', fontWeight: 600, fontFamily: 'Source Sans Pro' }}>
                                        {item.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    }
                />
            ) : (
                /* Detailed View (New UI) */
                <>
                    {/* Banner Section */}
                    <Box sx={{
                        mb: 4,
                        p: '32px 48px',
                        borderRadius: '32px',
                        backgroundColor: '#F6F8FB',
                        display: 'flex',
                        alignItems: 'flex-start',
                        position: 'relative',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3.5, width: '100%' }}>
                            <Box sx={{
                                width: 49,
                                height: 49,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                position: 'relative',
                                mt: 0.5
                            }}>
                                <img src={OvalIcon} alt="Oval background" style={{ position: 'absolute', width: '100%', height: '100%' }} />
                                <img src={FileIcon} alt="File" style={{ position: 'relative', width: 20, height: 20 }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{
                                    fontSize: '15px',
                                    fontWeight: 700,
                                    color: '#001940',
                                    fontFamily: 'source sans pro',
                                    letterSpacing: '0.02em',
                                    mb: 0.5,
                                    textAlign: 'left'
                                }}>
                                    HEY! YOUR KINDLY CHECK IF OTHER TEST ARE NEEDED
                                </Typography>
                                <Typography sx={{
                                    fontSize: '13px',
                                    color: '#001940',
                                    fontFamily: 'source sans pro',
                                    fontWeight: 400,
                                    maxWidth: '750px',
                                    textAlign: 'left',

                                }}>
                                    Your doctor can personalize these tests based on your medical history, lifestyle, and family risk factors. Take control of your health—book your preventive screenings today and stay ahead of potential risks.
                                </Typography>
                            </Box>
                        </Box>
                        <Box
                            onClick={() => setView('overview')}
                            sx={{
                                position: 'absolute',
                                top: 24,
                                right: 24,
                                cursor: 'pointer',
                                opacity: 0.8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <img src={CancelIcon} alt="Close" style={{ width: 14, height: 14, }} />
                        </Box>
                    </Box>

                    {/* Summary Cards (Tabs) */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                        {summaryCards.map((card) => {
                            const isActive = selectedTab === card.id;
                            return (
                                <Box
                                    key={card.id}
                                    onClick={() => setSelectedTab(card.id as any)}
                                    sx={{
                                        flex: 1,
                                        p: '14px 24px',
                                        borderRadius: '16px',
                                        border: isActive ? '1px solid #BBF7D0' : '1px solid #EAECF0',
                                        backgroundColor: isActive ? '#D8FDE3' : '#FFFFFF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        height: '76px',
                                        '&:hover': {
                                            backgroundColor: isActive ? '#D8FDE3' : '#F9FAFB'
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: '#F8F9FA',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,

                                    }}>
                                        <img src={EyeIcon} alt="View" style={{ width: '100%', height: '100%' }} />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
                                        <Typography sx={{
                                            fontSize: '16px',
                                            fontFamily: 'lexend',
                                            fontWeight: 600,
                                            color: '#728197',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {card.label}
                                        </Typography>
                                        <Box sx={{ width: '1px', height: '16px', backgroundColor: '#D0D5DD', mx: 1, opacity: 0.8 }} />
                                        <Typography sx={{
                                            fontSize: '22px',
                                            fontWeight: 600,
                                            fontFamily: 'lexend',
                                            color: '#1A212B',
                                        }}>
                                            {card.count}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Table Header */}
                    <Box sx={{ display: 'flex', px: 2, pb: 1, borderBottom: '1px solid #EAECF0', width: '100%' }}>
                        <Typography sx={{ fontSize: '16px', fontWeight: 500, color: '#1A212B', fontFamily: 'lexend  ', flex: 1, textAlign: 'left' }}>Product Name</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1A212B', fontFamily: 'lexend', width: '140px', textAlign: 'center' }}>Batch</Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1A212B', fontFamily: 'lexend', width: '100px', textAlign: 'center' }}>Qty</Typography>
                        </Box>
                    </Box>
                </>
            )}

            {/* Biomarker List grouped by category */}
            {Object.keys(groupedBiomarkers).map((category) => (
                <Box key={category} sx={{ mt: 4 }}>
                    <Box sx={{ mb: 1.5 }}>
                        <Typography sx={{ fontSize: '27px', fontWeight: 700, color: '#1B1B1F', fontFamily: 'Raleway', textAlign: 'left', }}>
                            {category}
                        </Typography>
                        <Typography sx={{ fontSize: '16px', color: '#728197', textAlign: 'left', fontFamily: 'source sans pro', fontWeight: 400 }}>
                            {groupedBiomarkers[category].length} Biomarkers
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {groupedBiomarkers[category].map((biomarker, index) => (
                            <BiomarkerRow
                                key={`${category}-${index}`}
                                name={biomarker.name}
                                sublabel={biomarker.sublabel}
                                valueLabel={biomarker.valueLabel}
                                statusLabel={biomarker.statusLabel}
                                statusColor={biomarker.statusColor}
                                batch={biomarker.batch}
                                qty={biomarker.qty}
                                isOverview={view === 'overview'}
                                miniChart={
                                    <Box sx={{
                                        width: 44,
                                        height: 44,
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                                            <path d="M4 4V20H20" stroke="#9AA8BC" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter" />
                                            <rect x="7" y="6" width="4" height="13" rx="2" fill="#9AA8BC" />
                                            <rect x="14" y="12" width="4" height="7" rx="2" fill="#E2E8F0" />
                                        </svg>
                                    </Box>
                                }
                            />
                        ))}
                    </Box>
                </Box>
            ))}
            <style>{`
                .custom-tooltip {
                    background: #101828;
                    border-radius: 8px;
                    padding: 12px;
                    color: white;
                    border: none;
                    position: relative;
                    box-shadow: 0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08);
                }
                .tooltip-title {
                    display: block;
                    font-size: 14px;
                    margin-bottom: 4px;
                    color: #98A2B3;
                    font-weight: 500;
                }
                .custom-tooltip ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .custom-tooltip li {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    margin-bottom: 2px;
                }
                .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }
                .tooltip-arrow {
                    position: absolute;
                    bottom: -4px;
                    left: 50%;
                    transform: translateX(-50%) rotate(45deg);
                    width: 14px;
                    height: 14px;
                    background: #101828;
                    border-bottom-right-radius: 2px;
                }
                .apexcharts-tooltip {
                    box-shadow: none !important;
                    background: transparent !important;
                    border: none !important;
                    overflow: visible !important;
                }
            `}</style>
        </Box>
    );
};

export default YourHealth;
