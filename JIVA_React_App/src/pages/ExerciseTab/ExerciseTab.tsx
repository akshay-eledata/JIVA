import React, { useState } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LotusIcon from '../../assets/Lotus.svg';
import { EXERCISE_TAB_CONSTANTS } from './constants';
import { EXERCISE_TAB_LABELS } from './labels';

const ExerciseTab: React.FC = () => {
    const navigate = useNavigate();
    const [activeSubTab, setActiveSubTab] = useState<string>(EXERCISE_TAB_LABELS.SUBTAB_YOGA);

    const subTabs = [EXERCISE_TAB_LABELS.SUBTAB_YOGA, EXERCISE_TAB_LABELS.SUBTAB_EXERCISE];
    const recommendedYoga = EXERCISE_TAB_CONSTANTS.RECOMMENDED_YOGA;

    return (
        <Box sx={{ width: '100%', textAlign: 'left' }}>
            {/* Sub Tabs */}
            <Box sx={{ display: 'flex', gap: '32px', mb: 4, borderBottom: '1px solid #E0E0E0' }}>
                {subTabs.map((tab) => (
                    <Box
                        key={tab}
                        onClick={() => setActiveSubTab(tab)}
                        sx={{
                            paddingBottom: '12px',
                            cursor: 'pointer',
                            borderBottom: activeSubTab === tab ? '2px solid #1A212B' : '2px solid transparent',
                            marginBottom: '-1px'
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: activeSubTab === tab ? 600 : 500,
                                color: activeSubTab === tab ? '#1A212B' : '#667085'
                            }}
                        >
                            {tab}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Content */}
            {activeSubTab === EXERCISE_TAB_LABELS.SUBTAB_YOGA && (
                <Box sx={{ width: '100%' }}>
                    {/* Types of Yoga Section */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography sx={{ fontSize: '18px', fontWeight: 800, color: '#1A212B' }}>
                            {EXERCISE_TAB_LABELS.TYPES_OF_YOGA}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#667085', cursor: 'pointer', fontWeight: 500 }}>
                            {EXERCISE_TAB_LABELS.SHOW_ALL}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '32px', flexWrap: 'wrap', mb: 8, mt: 4 }}>
                        {[1, 2, 3].map((item) => (
                            <Box
                                key={item}
                                component={Link}
                                to="/video-player"
                                sx={{
                                    flex: EXERCISE_TAB_CONSTANTS.YOGA_CARD_FLEX,
                                    textDecoration: 'none',
                                    background: 'linear-gradient(225deg, rgba(219, 200, 200, 0.16) 0%, rgba(219, 200, 200, 0.21) 100%)',
                                    border: '1px solid #D53B3B40',
                                    borderRadius: EXERCISE_TAB_CONSTANTS.YOGA_CARD_RADIUS,
                                    padding: EXERCISE_TAB_CONSTANTS.YOGA_CARD_PADDING,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    gap: EXERCISE_TAB_CONSTANTS.YOGA_CARD_GAP,
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src={LotusIcon}
                                    alt="Lotus"
                                    sx={{
                                        width: EXERCISE_TAB_CONSTANTS.LOTUS_ICON_WIDTH,
                                        height: EXERCISE_TAB_CONSTANTS.LOTUS_ICON_HEIGHT,
                                        position: 'absolute',
                                        top: EXERCISE_TAB_CONSTANTS.LOTUS_ICON_TOP,
                                        left: '50%',
                                        transform: 'translateX(-50%)'
                                    }}
                                />
                                <Box>
                                    <Typography sx={{ fontSize: '20px', fontWeight: 800, color: '#1A212B', }}>
                                        {EXERCISE_TAB_LABELS.YOGA_TYPE_1_TITLE}
                                    </Typography>
                                    <Typography sx={{ fontSize: '14px', color: '#CCCCCC', lineHeight: '1.5', fontWeight: 500 }}>
                                        {EXERCISE_TAB_LABELS.YOGA_TYPE_1_DESC}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="outlined"
                                    sx={{
                                        marginTop: '8px',
                                        borderRadius: EXERCISE_TAB_CONSTANTS.BUTTON_RADIUS,
                                        textTransform: 'none',
                                        borderColor: '#256111',
                                        color: '#256111',
                                        padding: EXERCISE_TAB_CONSTANTS.BUTTON_PADDING,
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        borderWidth: '1px',
                                        backgroundColor: '#FFFFFF',
                                        '&:hover': {
                                            borderWidth: '1px',
                                            borderColor: '#1a430c',
                                            backgroundColor: '#F1F5F9'
                                        }
                                    }}
                                >
                                    {EXERCISE_TAB_LABELS.VIEW_PLAYLIST}
                                </Button>
                            </Box>
                        ))}
                    </Box>

                    {/* Divider Above */}
                    <Divider sx={{ mb: 6, borderColor: '#EAECF0' }} />

                    {/* Recommended Yoga Section */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography sx={{ fontSize: '20px', fontWeight: 800, color: '#1A212B' }}>
                            {EXERCISE_TAB_LABELS.RECOMMENDED_YOGA}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#667085', cursor: 'pointer', fontWeight: 500 }}>
                            {EXERCISE_TAB_LABELS.SHOW_ALL}
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)'
                        },
                        gap: EXERCISE_TAB_CONSTANTS.RECOMMENDED_GRID_GAP,
                        mb: 6
                    }}>
                        {recommendedYoga.map((item) => (
                            <Box
                                key={item.id}
                                component={Link}
                                to="/video-player"
                                state={{ videoUrl: item.videoUrl, title: item.title, desc: item.desc }}
                                sx={{
                                    textDecoration: 'none',
                                    backgroundColor: '#F1F5F9',
                                    borderRadius: '12px',
                                    padding: EXERCISE_TAB_CONSTANTS.RECOMMENDED_CARD_PADDING,
                                    border: '1px solid #F2F4F7',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: EXERCISE_TAB_CONSTANTS.RECOMMENDED_IMAGE_HEIGHT,
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={item.img}
                                        alt={item.title}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </Box>
                                <Box sx={{ px: 1, pb: 2 }}>
                                    <Typography sx={{ fontSize: '16px', fontWeight: 800, color: '#1A212B', mb: 1 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography sx={{ fontSize: '14px', color: '#667085', fontWeight: 500 }}>
                                        {item.desc}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    {/* Divider Above Yoga Playlist */}
                    <Divider sx={{ mb: 6, borderColor: '#EAECF0' }} />

                    {/* Yoga Playlist Section */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography sx={{ fontSize: '20px', fontWeight: 800, color: '#1A212B' }}>
                            {EXERCISE_TAB_LABELS.YOGA_PLAYLIST}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#667085', cursor: 'pointer', fontWeight: 500 }}>
                            {EXERCISE_TAB_LABELS.SHOW_ALL}
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)'
                        },
                        gap: EXERCISE_TAB_CONSTANTS.RECOMMENDED_GRID_GAP,
                        mb: 6
                    }}>
                        {[...recommendedYoga].reverse().map((item) => (
                            <Box
                                key={item.id}
                                component={Link}
                                to="/video-player"
                                state={{ videoUrl: item.videoUrl, title: item.title, desc: item.desc }}
                                sx={{
                                    textDecoration: 'none',
                                    backgroundColor: '#F1F5F9',
                                    borderRadius: '12px',
                                    padding: EXERCISE_TAB_CONSTANTS.RECOMMENDED_CARD_PADDING,
                                    border: '1px solid #F2F4F7',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: EXERCISE_TAB_CONSTANTS.RECOMMENDED_IMAGE_HEIGHT,
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={item.img}
                                        alt={item.title}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </Box>
                                <Box sx={{ px: 1, pb: 2 }}>
                                    <Typography sx={{ fontSize: '16px', fontWeight: 800, color: '#1A212B', mb: 1 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography sx={{ fontSize: '14px', color: '#B3B3B3', fontWeight: 600 }}>
                                        {item.desc}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    {/* Divider Below */}
                    <Divider sx={{ mb: 6, borderColor: '#EAECF0' }} />
                </Box>
            )}

            {activeSubTab === EXERCISE_TAB_LABELS.SUBTAB_EXERCISE && (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography sx={{ color: '#667085' }}>{EXERCISE_TAB_LABELS.EXERCISE_CONTENT_PLACEHOLDER}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default ExerciseTab;
