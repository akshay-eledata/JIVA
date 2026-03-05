import React from 'react';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarIcon from '../../assets/calendar.svg';
import ClockIcon from '../../assets/clock.svg';

const ScheduleForm: React.FC = () => {
    const [selectedId, setSelectedId] = React.useState<number>(2);

    const appointments = [
        { id: 0, name: 'Quest Diagnostics', address: '10710 Chantilly Pkwy, Auburn, AL 36117', distance: '4.93 miles away' },
        { id: 1, name: 'Quest Diagnostics', address: '10710 Chantilly Pkwy, Auburn, AL 36117', distance: '4.93 miles away' },
        { id: 2, name: 'Quest Diagnostics', address: '10710 Chantilly Pkwy, Auburn, AL 36117', distance: '4.93 miles away' },
    ];

    return (
        <Box sx={{ width: '950px', display: 'flex', flexDirection: 'column', gap: '40px', textAlign: 'left' }}>

            {/* Scheduling Guidelines */}
            <Box>
                <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 1.5, color: '#4A5565', fontFamily: 'Inter, sans-serif' }}>
                    Scheduling Guidelines
                </Typography>
                <Box
                    sx={{
                        backgroundColor: '#F1F5F9',
                        borderRadius: '12px',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        border: '1px solid #7281971A',
                        borderTop: '1px solid #728197',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        <Box component="img" src={ClockIcon} sx={{ width: '24px', height: '24px', mt: 0.5 }} />
                        <Box>
                            <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#1A212B', mb: 0.5 }}>Before 11 AM</Typography>
                            <Typography sx={{ fontSize: '14px', color: '#667085' }}>Book a morning lab visit for accuracy lab testing</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        <Box component="img" src={CalendarIcon} sx={{ width: '24px', height: '24px', mt: 0.5 }} />
                        <Box>
                            <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#1A212B', mb: 0.5 }}>Before Jan 9, 2026</Typography>
                            <Typography sx={{ fontSize: '14px', color: '#667085' }}>We recommend completing your remaining test in your annual membership by Jan 9, 2026</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Schedule Appointments */}
            <Box>
                <Typography sx={{ fontSize: '18px', fontWeight: 700, mb: 1.5, color: '#4A5565', fontFamily: 'Inter, sans-serif' }}>
                    Schedule Appointments
                </Typography>
                <Box
                    sx={{
                        border: '1px solid #7281971A',
                        borderTop: '1px solid #728197',
                        borderRadius: '12px',
                        padding: '32px 32px 0 32px',
                        backgroundColor: '#F1F5F9',
                        boxShadow: '0px 1px 0.5px 0.05px #1D293D05',
                    }}
                >
                    <Box sx={{ mb: 4, textAlign: 'left' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 1, color: '#101828' }}>
                            Date of Schedule <span style={{ color: '#F04438' }}>*</span>
                        </Typography>
                        <TextField
                            size="small"
                            variant="outlined"
                            defaultValue="August 11, 2025"
                            sx={{
                                width: '350px',
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '12px',
                                    height: '44px',
                                    boxShadow: 'none',
                                    fontFamily: 'Inter, sans-serif',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#E5E7EB',
                                        borderWidth: '1px solid',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#D1D5DB',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#E5E7EB',
                                        borderWidth: '1px solid ',
                                    }
                                },

                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box component="img" src={CalendarIcon} sx={{ width: '16px', height: '16px', mr: 0.5 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        {appointments.map((item, index) => (
                            <Box
                                key={item.id}
                                onClick={() => setSelectedId(item.id)}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '24px 32px',
                                    margin: '0 -32px',
                                    backgroundColor: item.id === selectedId ? '#CED4DA' : 'transparent',
                                    borderBottom: index === appointments.length - 1 ? 'none' : '1px solid #E5E7EB',
                                    borderRadius: item.id === selectedId ? '12px' : '0',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease, border-radius 0.2s ease',
                                }}
                            >
                                <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <Box
                                        sx={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: '#DCFAE6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <AddCircleOutlineIcon sx={{ fontSize: '20px', color: '#006045' }} />
                                    </Box>
                                    <Box>
                                        <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#1A212B' }}>{item.name}</Typography>
                                        <Typography sx={{ fontSize: '13px', color: '#667085', fontWeight: 500, }}>{item.address}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <LocationOnIcon sx={{ fontSize: '18px', color: '#667085' }} />
                                    <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#667085' }}>{item.distance}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ScheduleForm;
