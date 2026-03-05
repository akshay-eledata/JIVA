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
import '@fontsource/raleway/400.css';
import '@fontsource/raleway/700.css';

const YourHealth: React.FC = () => {
    const chartOptions: any = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '20%',
                barGap: '30%',
                borderRadius: 4,
            }
        },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 2,
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
                    fontFamily: 'Inter',
                }
            }
        },
        yaxis: {
            min: 0,
            max: 300,
            tickAmount: 3,
            labels: {
                style: {
                    colors: '#98A2B3',
                    fontSize: '11px',
                    fontWeight: 600,
                    fontFamily: 'Inter'
                }
            }
        },
        fill: {
            opacity: 1,
            colors: ['#2E68FF', '#BDCEFF']
        },
        grid: {
            borderColor: '#E5E7EB',
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
                    '<li><span class="dot" style="background-color: #2E68FF"></span> 88.4</li>' +
                    '<li><span class="dot" style="background-color: #BDCEFF"></span> 77</li>' +
                    '</ul>' +
                    '</div>';
            }
        }
    };

    const chartSeries = [
        { name: 'In Range', data: [190, 230] },
        { name: 'Out of Range', data: [150, 140] }
    ];

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '1200px',
            p: '30px 16px',
            backgroundColor: '#FFFFFF',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            margin: '0 auto'
        }}>
            <Typography sx={{ fontSize: '48px', fontWeight: 600, color: '#1B1B1F', fontFamily: 'DM Sans', textAlign: 'left' }}>
                Your Health
            </Typography>
            <Typography sx={{ fontSize: '16px', color: '#667085', fontFamily: 'Inter', mb: 2, textAlign: 'left', fontWeight: '500,' }}>
                Tuesday August 26, 2025
            </Typography>

            <BaseHealthCard
                hideMiddleBorder={true}
                title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ fontSize: '32px', fontWeight: 700, color: '#1B1B1F', fontFamily: 'Inter' }}>35%</Typography>
                        <Typography component="span" sx={{ fontSize: '18px', color: '#12B76A', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                            </svg>
                            25.3%
                        </Typography>
                    </Box>
                }
                leftContent={
                    <Box sx={{ p: 4, pt: 0, height: '100%', position: 'relative' }}>
                        <Box sx={{ display: 'flex', gap: 3, mb: 2, justifyContent: 'flex-end', mr: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#12B76A' }} />
                                <Typography sx={{ fontSize: '14px', color: '#475467', fontWeight: 500 }}>In Range</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F04438' }} />
                                <Typography sx={{ fontSize: '14px', color: '#475467', fontWeight: 500 }}>Out of range</Typography>
                            </Box>
                        </Box>
                        <Chart
                            options={{
                                ...chartOptions,
                                yaxis: {
                                    ...chartOptions.yaxis,
                                    min: 0,
                                    max: 300,
                                    tickAmount: 3,
                                }
                            }}
                            series={chartSeries}
                            type="bar"
                            height={200}
                        />
                    </Box>
                }
                rightContent={
                    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', width: '100%' }}>
                        {[
                            { value: '18', label: 'In Range' },
                            { value: '18', label: 'Out of Range' },
                            { value: '18', label: 'Improving' }
                        ].map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 3, borderBottom: index < 2 ? '1px solid #EAECF0' : 'none', pb: index < 2 ? 1 : 0 }}>
                                <Typography sx={{ fontSize: '36px', fontWeight: 600, color: '#1B1B1F', fontFamily: 'DM Sans', minWidth: '60px' }}>
                                    {item.value}
                                </Typography>
                                <Typography sx={{ fontSize: '16px', color: '#1B1B1F', fontWeight: 600, fontFamily: 'Inter' }}>
                                    {item.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                }
            />

            <Box sx={{ mt: 8 }}>
                <Box sx={{ mb: 6 }}>
                    <Typography sx={{ fontSize: '32px', fontWeight: 700, color: '#1B1B1F', fontFamily: 'DM Sans', mb: 0.5 }}>
                        Autoimmunity
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#667085', fontFamily: 'Inter' }}>
                        4 Biomarkers
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {[1, 2, 3].map((i) => (
                        <BiomarkerRow
                            key={i}
                            name="Anti Nuclear Antibodies (ANA) Pattern"
                            sublabel="Appropriate range <10 IU/ml"
                            valueLabel="25 IU/ml"
                            statusLabel="In Range"
                            statusColor="green"
                            miniChart={
                                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end', height: '32px' }}>
                                    <Box sx={{ width: 4, height: 24, backgroundColor: '#D0D5DD', borderRadius: '2px' }} />
                                    <Box sx={{ width: 4, height: 32, backgroundColor: '#98A2B3', borderRadius: '2px' }} />
                                    <Box sx={{ width: 4, height: 16, backgroundColor: '#D0D5DD', borderRadius: '2px' }} />
                                </Box>
                            }
                        />
                    ))}
                </Box>
            </Box>

            <Box sx={{ mt: 8, mb: 4 }}>
                <Box sx={{ mb: 6 }}>
                    <Typography sx={{ fontSize: '32px', fontWeight: 700, color: '#1B1B1F', fontFamily: 'DM Sans', mb: 0.5 }}>
                        Blood
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#667085', fontFamily: 'Inter' }}>
                        4 Biomarkers
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {[1, 2].map((i) => (
                        <BiomarkerRow
                            key={i}
                            name="Anti Nuclear Antibodies (ANA) Pattern"
                            sublabel="Appropriate range <10 IU/ml"
                            valueLabel="25 IU/ml"
                            statusLabel="In Range"
                            statusColor="green"
                            miniChart={
                                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end', height: '32px' }}>
                                    <Box sx={{ width: 4, height: 16, backgroundColor: '#D0D5DD', borderRadius: '2px' }} />
                                    <Box sx={{ width: 4, height: 24, backgroundColor: '#98A2B3', borderRadius: '2px' }} />
                                    <Box sx={{ width: 4, height: 20, backgroundColor: '#D0D5DD', borderRadius: '2px' }} />
                                </Box>
                            }
                        />
                    ))}
                </Box>
            </Box>

            <style>{`
                .custom-tooltip {
                    background: #101828;
                    border-radius: 8px;
                    padding: 12px;
                    color: white;
                    border: none;
                }
                .tooltip-title {
                    display: block;
                    font-size: 14px;
                    margin-bottom: 8px;
                    color: #F9FAFB;
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
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }
            `}</style>
        </Box>
    );
};

export default YourHealth;
