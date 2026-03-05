import React, { useState } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LotusIcon from '../../assets/Lotus.svg';
import Yoga1 from '../../assets/yoga1.svg';
import Yoga2 from '../../assets/yoga 2.svg';
import Yoga3 from '../../assets/yoga 3.svg';
import Yoga4 from '../../assets/yoga 4.svg';

const ExerciseTab: React.FC = () => {
    const navigate = useNavigate();
    const [activeSubTab, setActiveSubTab] = useState('Yoga');

    const subTabs = ['Yoga', 'Exercise'];

    const recommendedYoga = [
        { id: 1, img: Yoga1, title: "Today's Top Hits", desc: "Pranayama is on top of the\nExcercise!" },
        { id: 2, img: Yoga2, title: "Today's Top Hits", desc: "Pranayama is on top of the\nExcercise!" },
        { id: 3, img: Yoga3, title: "Today's Top Hits", desc: "Pranayama is on top of the\nExcercise!" },
        { id: 4, img: Yoga4, title: "Today's Top Hits", desc: "Pranayama is on top of the\nExcercise!" },
    ];

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
            {activeSubTab === 'Yoga' && (
                <Box sx={{ width: '100%' }}>
                    {/* Types of Yoga Section */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography sx={{ fontSize: '18px', fontWeight: 800, color: '#1A212B' }}>
                            Types of Yoga
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#667085', cursor: 'pointer', fontWeight: 500 }}>
                            Show all
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '32px', flexWrap: 'wrap', mb: 8, mt: 4 }}>
                        {[1, 2, 3].map((item) => (
                            <Box
                                key={item}
                                component={Link}
                                to="/video-player"
                                sx={{
                                    flex: '1 1 350px',
                                    textDecoration: 'none',
                                    background: 'linear-gradient(225deg, rgba(219, 200, 200, 0.16) 0%, rgba(219, 200, 200, 0.21) 100%)',
                                    border: '1px solid #D53B3B40',
                                    borderRadius: '24px',
                                    padding: '94px 24px 32px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    gap: '8px',
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
                                        width: '120px',
                                        height: '108px',
                                        position: 'absolute',
                                        top: '-30px',
                                        left: '50%',
                                        transform: 'translateX(-50%)'
                                    }}
                                />
                                <Box>
                                    <Typography sx={{ fontSize: '20px', fontWeight: 800, color: '#1A212B', }}>
                                        YOGA TYPE 1
                                    </Typography>
                                    <Typography sx={{ fontSize: '14px', color: '#CCCCCC', lineHeight: '1.5', fontWeight: 500 }}>
                                        Pranayama is on top of the<br /> Excercise!
                                    </Typography>
                                </Box>

                                <Button
                                    variant="outlined"
                                    sx={{
                                        marginTop: '8px',
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        borderColor: '#256111',
                                        color: '#256111',
                                        padding: '8px 24px',
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
                                    View playlist
                                </Button>
                            </Box>
                        ))}
                    </Box>

                    {/* Divider Above */}
                    <Divider sx={{ mb: 6, borderColor: '#EAECF0' }} />

                    {/* Recommended Yoga Section */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography sx={{ fontSize: '20px', fontWeight: 800, color: '#1A212B' }}>
                            Recommended Yoga
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#667085', cursor: 'pointer', fontWeight: 500 }}>
                            Show all
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
                        gap: '24px',
                        mb: 6
                    }}>
                        {recommendedYoga.map((item) => (
                            <Box
                                key={item.id}
                                component={Link}
                                to="/video-player"
                                sx={{
                                    textDecoration: 'none',
                                    backgroundColor: '#F1F5F9',
                                    borderRadius: '12px',
                                    padding: '16px',
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
                                        height: '180px',

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
                            Yoga Playlist
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#667085', cursor: 'pointer', fontWeight: 500 }}>
                            Show all
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
                        gap: '24px',
                        mb: 6
                    }}>
                        {[...recommendedYoga].reverse().map((item) => (
                            <Box
                                key={item.id}
                                component={Link}
                                to="/video-player"
                                sx={{
                                    textDecoration: 'none',
                                    backgroundColor: '#F1F5F9',
                                    borderRadius: '12px',
                                    padding: '16px',
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
                                        height: '180px',

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

            {activeSubTab === 'Exercise' && (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography sx={{ color: '#667085' }}>Exercise content goes here</Typography>
                </Box>
            )}
        </Box>
    );
};

export default ExerciseTab;
