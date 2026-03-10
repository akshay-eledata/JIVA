import React, { useState } from 'react';
import { Box, Typography, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import SaladIcon from '../../assets/salad.svg';
import DumbellIcon from '../../assets/Dumbell.svg';
import MedicineIcon from '../../assets/Medicine-Bottle.svg';
import ExerciseTab from './ExerciseTab';

import CheckIconAsset from '../../assets/check.svg';
import BlockIconAsset from '../../assets/block.svg';

const ActionPlan: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Food');
    const [subTab, setSubTab] = useState<'Enjoy' | 'Limit'>('Enjoy');
    const [selectedAlpha, setSelectedAlpha] = useState('#');

    const alphabets = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

    const tabs = [
        { id: 'Food', label: 'Food', icon: SaladIcon },
        { id: 'Exercise', label: 'Exercise', icon: DumbellIcon },
        { id: 'Supplements', label: 'Suppliments', icon: MedicineIcon },
    ];

    const foodList = {
        '#': [
            { id: 1, name: 'Peanut Oil' },
            { id: 2, name: 'Corn Oil' },
            { id: 3, name: 'Sunflower Oil' },
            { id: 4, name: 'Palm Oil' },
            { id: 5, name: 'Soybean Oil' },
        ],
        'A': [
            { id: 1, name: 'Peanut Oil' },
            { id: 2, name: 'Corn Oil' },
            { id: 3, name: 'Sunflower Oil' },
            { id: 4, name: 'Palm Oil' },
            { id: 5, name: 'Soybean Oil' },
        ],
        'B': [
            { id: 1, name: 'Peanut Oil' },
            { id: 2, name: 'Corn Oil' },
            { id: 3, name: 'Sunflower Oil' },
            { id: 4, name: 'Palm Oil' },
            { id: 5, name: 'Soybean Oil' },
        ],
        'C': [
            { id: 1, name: 'Peanut Oil' },
            { id: 2, name: 'Corn Oil' },
        ],
    };

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '1350px',
                margin: '0 auto',
                padding: '40px 32px',
                textAlign: 'center',
            }}
        >
            {/* Title */}
            <Typography
                variant="h1"
                sx={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#1A212B',
                    mb: 5
                }}
            >
                Your Action Plan
            </Typography>

            {/* Main Tabs (Food, Exercise, Supplements) */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '24px',
                    mb: 5,
                    flexWrap: 'wrap'
                }}
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <Box
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 24px',
                                minWidth: '180px',
                                height: '72px',
                                borderRadius: '16px',
                                border: isActive ? '2px solid #2F5C3E' : '1px solid #E0E0E0',
                                backgroundColor: '#FFFFFF',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                gap: '16px',
                                boxShadow: isActive ? '0px 4px 12px rgba(47, 92, 62, 0.1)' : 'none',
                            }}
                        >
                            <Box
                                sx={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: isActive ? '#F1F8F5' : '#F9FAFB',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Box
                                    component="img"
                                    src={tab.icon}
                                    alt={tab.label}
                                    sx={{ width: '24px', height: '24px' }}
                                />
                            </Box>
                            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#344054' }}>
                                {tab.label}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            {/* Description Text */}
            <Typography
                sx={{
                    fontSize: '16px',
                    color: '#1A212B',
                    lineHeight: '1.6',
                    maxWidth: '600px',
                    margin: '0 auto',
                    mb: 8
                }}
            >
                Here is your personalised Jan 27th Action plan, targeting your{' '}
                <Box
                    component="span"
                    sx={{ fontWeight: 700, textDecoration: 'underline', color: '#1A212B', cursor: 'pointer' }}
                >
                    19 vital biomarkers
                </Box>
                . The food recommendation are specific to your findings
            </Typography>



            {/* Content Sections */}
            {activeTab === 'Exercise' ? (
                <ExerciseTab />
            ) : activeTab === 'Food' ? (
                <Box sx={{ width: '80%', margin: '0 auto', textAlign: 'left' }}>
                    <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#256111', mb: 2 }}>
                        Recommended Food
                    </Typography>

                    <Box
                        sx={{
                            borderTop: '1px solid #728197',
                            // borderLeft: '1px solid #D0D5DD',
                            // borderRight: '1px solid #D0D5DD',
                            borderRadius: '16px 16px 0 0',
                            padding: '32px 24px 24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2,
                        }}
                    >
                        {/* Toggle Switch */}
                        <Box
                            sx={{
                                display: 'flex',
                                backgroundColor: '#D0D5DD', // Light grey background for the container
                                borderRadius: '12px',
                                padding: '4px',
                                width: 'fit-content',

                            }}
                        >
                            <Box
                                onClick={() => setSubTab('Enjoy')}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 24px',
                                    borderRadius: '8px',
                                    backgroundColor: subTab === 'Enjoy' ? '#FFFFFF' : 'transparent',
                                    boxShadow: subTab === 'Enjoy' ? '0px 1px 2px rgba(16, 24, 40, 0.05)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    color: subTab === 'Enjoy' ? '#1D2939' : '#475467',
                                    fontWeight: 500
                                }}
                            >
                                <Box
                                    component="img"
                                    src={CheckIconAsset}
                                    alt="Check"
                                    sx={{ width: '16px', height: '14px' }}
                                />
                                <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>Enjoy These</Typography>
                            </Box>

                            <Box
                                onClick={() => setSubTab('Limit')}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 24px',
                                    borderRadius: '8px',
                                    backgroundColor: subTab === 'Limit' ? '#FFFFFF' : 'transparent',
                                    boxShadow: subTab === 'Limit' ? '0px 1px 2px rgba(16, 24, 40, 0.05)' : 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    color: subTab === 'Limit' ? '#1D2939' : '#475467',
                                    fontWeight: 500
                                }}
                            >
                                <Box
                                    component="img"
                                    src={BlockIconAsset}
                                    alt="Block"
                                    sx={{ width: '16px', height: '16px' }}
                                />
                                <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>Limit These</Typography>
                            </Box>
                        </Box>

                        {/* Search Bar */}
                        <TextField
                            placeholder="Search..."
                            size="small"
                            sx={{
                                width: '200px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    backgroundColor: '#FFFFFF',
                                    height: '44px',
                                    '& fieldset': {
                                        borderColor: '#D0D5DD',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#D0D5DD',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2F5C3E',
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: '#667085', fontSize: '20px' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Alphabet Filter List */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '24px',
                            py: '16px',
                            mb: 4,
                            flexWrap: 'wrap',
                            justifyContent: 'flex-start',
                            overflowX: 'auto',
                            borderTop: '1px solid #7281974D',
                            borderBottom: '1px solid #7281974D',
                            '&::-webkit-scrollbar': { height: '4px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#E4E7EC', borderRadius: '2px' }
                        }}
                    >
                        {alphabets.map((alpha) => (
                            <Typography
                                key={alpha}
                                onClick={() => setSelectedAlpha(alpha)}
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#256111',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        color: '#153226',
                                        transform: 'scale(1.1)'
                                    },
                                    transition: 'all 0.1s ease'
                                }}
                            >
                                {alpha}
                            </Typography>
                        ))}
                    </Box>

                    {/* Food List Sections */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {/* Top 5 Section (Mapped to #) */}
                        <Box>
                            <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#101828', mb: 3 }}>
                                Your Top 5
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {foodList['#'].map((item) => (
                                    <Typography key={item.id} sx={{ fontSize: '15px', fontWeight: 500, color: '#475467' }}>
                                        {item.name}
                                    </Typography>
                                ))}
                            </Box>
                            <Box sx={{ width: '100%', height: '1px', backgroundColor: '#F2F4F7', mt: 4 }} />
                        </Box>

                        {/* A Section */}
                        <Box>
                            <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#101828', mb: 3 }}>
                                A
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {foodList['A'].map((item) => (
                                    <Typography key={item.id} sx={{ fontSize: '15px', fontWeight: 500, color: '#475467' }}>
                                        {item.name}
                                    </Typography>
                                ))}
                            </Box>
                            <Box sx={{ width: '100%', height: '1px', backgroundColor: '#F2F4F7', mt: 4 }} />
                        </Box>

                        {/* B Section */}
                        <Box>
                            <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#101828', mb: 3 }}>
                                B
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {foodList['B'].map((item) => (
                                    <Typography key={item.id} sx={{ fontSize: '15px', fontWeight: 500, color: '#475467' }}>
                                        {item.name}
                                    </Typography>
                                ))}
                            </Box>
                            <Box sx={{ width: '100%', height: '1px', backgroundColor: '#F2F4F7', mt: 4 }} />
                        </Box>

                        {/* C Section */}
                        <Box>
                            <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#101828', mb: 3 }}>
                                C
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {foodList['C'].map((item) => (
                                    <Typography key={item.id} sx={{ fontSize: '15px', fontWeight: 500, color: '#475467' }}>
                                        {item.name}
                                    </Typography>
                                ))}
                            </Box>
                            <Box sx={{ width: '100%', height: '1px', backgroundColor: '#F2F4F7', mt: 4 }} />
                        </Box>

                    </Box>

                </Box>
            ) : null}
        </Box>
    );
};

export default ActionPlan;
