import React, { useState } from 'react';
import { Box, Typography, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockIcon from '@mui/icons-material/Block';
import SaladIcon from '../../assets/salad.svg';
import DumbellIcon from '../../assets/Dumbell.svg';
import MedicineIcon from '../../assets/Medicine-Bottle.svg';
import ExerciseTab from '../ExerciseTab/ExerciseTab';
import { ACTION_PLAN_CONSTANTS } from './constants';
import { ACTION_PLAN_LABELS } from './labels';

import CheckIconAsset from '../../assets/check.svg';
import BlockIconAsset from '../../assets/block.svg';

const ActionPlan: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Food');
    const [subTab, setSubTab] = useState<'Enjoy' | 'Limit'>('Enjoy');
    const [selectedAlpha, setSelectedAlpha] = useState('#');

    const alphabets = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

    const tabs = [
        { id: 'Food', label: ACTION_PLAN_LABELS.TAB_FOOD, icon: SaladIcon },
        { id: 'Exercise', label: ACTION_PLAN_LABELS.TAB_EXERCISE, icon: DumbellIcon },
        { id: 'Supplements', label: ACTION_PLAN_LABELS.TAB_SUPPLEMENTS, icon: MedicineIcon },
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
                maxWidth: ACTION_PLAN_CONSTANTS.MAX_WIDTH,
                margin: '0 auto',
                padding: ACTION_PLAN_CONSTANTS.CONTAINER_PADDING,
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
                {ACTION_PLAN_LABELS.TITLE}
            </Typography>

            {/* Main Tabs (Food, Exercise, Supplements) */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: ACTION_PLAN_CONSTANTS.TABS_GAP,
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
                                minWidth: ACTION_PLAN_CONSTANTS.TAB_MIN_WIDTH,
                                height: ACTION_PLAN_CONSTANTS.TAB_HEIGHT,
                                borderRadius: ACTION_PLAN_CONSTANTS.TAB_BORDER_RADIUS,
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
                                    width: ACTION_PLAN_CONSTANTS.ICON_BG_SIZE,
                                    height: ACTION_PLAN_CONSTANTS.ICON_BG_SIZE,
                                    borderRadius: ACTION_PLAN_CONSTANTS.ICON_BG_RADIUS,
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
                                    sx={{ width: ACTION_PLAN_CONSTANTS.ICON_SIZE, height: ACTION_PLAN_CONSTANTS.ICON_SIZE }}
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
                    maxWidth: ACTION_PLAN_CONSTANTS.DESC_MAX_WIDTH,
                    margin: '0 auto',
                    mb: 8
                }}
            >
                {ACTION_PLAN_LABELS.DESC_PART1}
                <Box
                    component="span"
                    sx={{ fontWeight: 700, textDecoration: 'underline', color: '#1A212B', cursor: 'pointer' }}
                >
                    {ACTION_PLAN_LABELS.DESC_BIOMARKERS}
                </Box>
                {ACTION_PLAN_LABELS.DESC_PART2}
            </Typography>

            {/* Content Sections */}
            {activeTab === 'Exercise' ? (
                <ExerciseTab />
            ) : activeTab === 'Food' ? (
                <Box sx={{ width: ACTION_PLAN_CONSTANTS.FOOD_CONTAINER_WIDTH, margin: '0 auto', textAlign: 'left' }}>
                    <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#256111', mb: 2 }}>
                        {ACTION_PLAN_LABELS.RECOMMENDED_FOOD}
                    </Typography>

                    <Box
                        sx={{
                            borderTop: '1px solid #728197',
                            borderRadius: '16px 16px 0 0',
                            padding: ACTION_PLAN_CONSTANTS.FOOD_SECTION_PADDING,
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
                                backgroundColor: '#D0D5DD',
                                borderRadius: ACTION_PLAN_CONSTANTS.TOGGLE_BORDER_RADIUS,
                                padding: ACTION_PLAN_CONSTANTS.TOGGLE_PADDING,
                                width: 'fit-content',
                            }}
                        >
                            <Box
                                onClick={() => setSubTab('Enjoy')}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: ACTION_PLAN_CONSTANTS.TOGGLE_ITEM_PADDING,
                                    borderRadius: ACTION_PLAN_CONSTANTS.TOGGLE_ITEM_RADIUS,
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
                                <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{ACTION_PLAN_LABELS.ENJOY_THESE}</Typography>
                            </Box>

                            <Box
                                onClick={() => setSubTab('Limit')}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: ACTION_PLAN_CONSTANTS.TOGGLE_ITEM_PADDING,
                                    borderRadius: ACTION_PLAN_CONSTANTS.TOGGLE_ITEM_RADIUS,
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
                                <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{ACTION_PLAN_LABELS.LIMIT_THESE}</Typography>
                            </Box>
                        </Box>

                        {/* Search Bar */}
                        <TextField
                            placeholder={ACTION_PLAN_LABELS.SEARCH_PLACEHOLDER}
                            size="small"
                            sx={{
                                width: ACTION_PLAN_CONSTANTS.SEARCH_WIDTH,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: ACTION_PLAN_CONSTANTS.TOGGLE_BORDER_RADIUS,
                                    backgroundColor: '#FFFFFF',
                                    height: ACTION_PLAN_CONSTANTS.SEARCH_HEIGHT,
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
                            gap: ACTION_PLAN_CONSTANTS.ALPHABETS_GAP,
                            py: ACTION_PLAN_CONSTANTS.ALPHABETS_PADDING_Y,
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: ACTION_PLAN_CONSTANTS.FOOD_LIST_GAP }}>
                        {/* Top 5 Section (Mapped to #) */}
                        <Box>
                            <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#101828', mb: 3 }}>
                                {ACTION_PLAN_LABELS.TOP_5}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: ACTION_PLAN_CONSTANTS.FOOD_SUBSECTION_GAP }}>
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
                                {ACTION_PLAN_LABELS.SEC_A}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: ACTION_PLAN_CONSTANTS.FOOD_SUBSECTION_GAP }}>
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
                                {ACTION_PLAN_LABELS.SEC_B}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: ACTION_PLAN_CONSTANTS.FOOD_SUBSECTION_GAP }}>
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
                                {ACTION_PLAN_LABELS.SEC_C}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: ACTION_PLAN_CONSTANTS.FOOD_SUBSECTION_GAP }}>
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
