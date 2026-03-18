import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface BiomarkerTest {
    name: string;
    outOfRange?: boolean;
}

interface BiomarkerCategory {
    id: string;
    category: string;
    tests: BiomarkerTest[];
    middleTests: string[];
}

const biomarkerCategories: BiomarkerCategory[] = [
    {
        id: 'heart1',
        category: 'Heart',
        middleTests: [
            'High- Sensitivity C-reactive\nProtein (hs CRP)',
            'Triglycerides',
            'Total Cholesterol',
        ],
        tests: [
            { name: 'LDL-Cholesterol', outOfRange: true },
            { name: 'HDL-Cholesterol', outOfRange: true },
            { name: 'Non-HDL-Cholesterol', outOfRange: true },
            { name: 'Cholesterol/ HDL Ratio' },
        ],
    },
    {
        id: 'heart2',
        category: 'Heart',
        middleTests: [
            'High- Sensitivity C-reactive\nProtein (hs CRP)',
            'Triglycerides',
            'Total Cholesterol',
        ],
        tests: [
            { name: 'LDL-Cholesterol', outOfRange: true },
            { name: 'HDL-Cholesterol', outOfRange: true },
            { name: 'Non-HDL-Cholesterol', outOfRange: true },
            { name: 'Cholesterol/ HDL Ratio' },
        ],
    },
    {
        id: 'heart3',
        category: 'Heart',
        middleTests: [
            'High- Sensitivity C-reactive\nProtein (hs CRP)',
            'Triglycerides',
            'Total Cholesterol',
        ],
        tests: [
            { name: 'LDL-Cholesterol', outOfRange: true },
            { name: 'HDL-Cholesterol', outOfRange: true },
            { name: 'Non-HDL-Cholesterol', outOfRange: true },
            { name: 'Cholesterol/ HDL Ratio' },
        ],
    },
    {
        id: 'heart4',
        category: 'Heart',
        middleTests: [
            'High- Sensitivity C-reactive\nProtein (hs CRP)',
            'Triglycerides',
            'Total Cholesterol',
        ],
        tests: [
            { name: 'LDL-Cholesterol', outOfRange: true },
            { name: 'HDL-Cholesterol', outOfRange: true },
            { name: 'Non-HDL-Cholesterol', outOfRange: true },
            { name: 'Cholesterol/ HDL Ratio' },
        ],
    },
    {
        id: 'heart5',
        category: 'Heart',
        middleTests: [
            'High- Sensitivity C-reactive\nProtein (hs CRP)',
            'Triglycerides',
            'Total Cholesterol',
        ],
        tests: [
            { name: 'LDL-Cholesterol', outOfRange: true },
            { name: 'HDL-Cholesterol', outOfRange: true },
            { name: 'Non-HDL-Cholesterol', outOfRange: true },
            { name: 'Cholesterol/ HDL Ratio' },
        ],
    },
];

const RescheduleAddOnsForm: React.FC = () => {
    return (
        <Box sx={{ width: '950px' }}>
            {/* Title */}
            <Typography
                sx={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#101828',
                    mb: 2,
                    textAlign: 'left',
                }}
            >
                Your Follow-Up Test includes 60+ biomarkers
            </Typography>

            {/* Table Card */}
            <Box
                sx={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#F1F5F9',
                }}
            >
                {/* Table Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: '24px',
                        py: '14px',
                        borderBottom: '1px solid #E5E7EB',
                    }}
                >
                    <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1A212B' }}>
                        $0 Included with Membership
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: '#F6494F',
                                flexShrink: 0,
                            }}
                        />
                        <Typography sx={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '16px',
                            color: '#101828'
                        }}>
                            Out Of Range
                        </Typography>
                    </Box>
                </Box>

                {/* Biomarker Rows */}
                {biomarkerCategories.map((cat, index) => (
                    <Box
                        key={cat.id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            px: '24px',
                            py: '16px',
                            borderBottom:
                                index === biomarkerCategories.length - 1
                                    ? 'none'
                                    : '1px solid #E5E7EB',
                        }}
                    >
                        {/* Left: Category */}
                        <Box sx={{ width: '120px', flexShrink: 0 }}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1A212B' }}>
                                {cat.category}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '12px',
                                    color: '#006045',
                                    fontWeight: 500,
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    mt: 0.5,
                                }}
                            >
                                View More
                            </Typography>
                        </Box>

                        {/* Middle: Test names */}
                        <Box sx={{ flex: 1, px: '16px' }}>
                            {cat.middleTests.map((test, i) => (
                                <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: i < cat.middleTests.length - 1 ? 2 : 0 }}>
                                    <Box
                                        sx={{
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '4px',
                                            border: '1px solid #E5E7EB',
                                            backgroundColor: '#F9FAFB',
                                            mr: 1.5,
                                            flexShrink: 0,
                                            mt: '1px'
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 500,
                                            fontSize: '14px',
                                            lineHeight: '16px',
                                            color: '#101828',
                                            whiteSpace: 'pre-line',
                                            textAlign: 'left'
                                        }}
                                    >
                                        {test}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Right: Tests with out-of-range dots */}
                        <Box sx={{ width: '220px', flexShrink: 0 }}>
                            {cat.tests.map((test, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mb: i < cat.tests.length - 1 ? 2 : 0,
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box
                                            sx={{
                                                width: '16px',
                                                height: '16px',
                                                borderRadius: '4px',
                                                border: '1px solid #E5E7EB',
                                                backgroundColor: '#F9FAFB',
                                                mr: 1.5,
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Typography sx={{
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 500,
                                            fontSize: '14px',
                                            lineHeight: '16px',
                                            color: '#101828'
                                        }}>
                                            {test.name}
                                        </Typography>
                                    </Box>
                                    {test.outOfRange && (
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                backgroundColor: '#F6494F',
                                                flexShrink: 0,
                                                ml: 1,
                                            }}
                                        />
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default RescheduleAddOnsForm;
