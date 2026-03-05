import React from 'react';
import { Dialog, Box, Typography, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSchedule } from '../../context/ScheduleContext';
import PlusIcon from '../../assets/plus.svg';
import LocationIcon from '../../assets/Location.svg';
import CloseIconAsset from '../../assets/close.svg';

interface ScheduleConfirmDialogProps {
    open: boolean;
    onClose: () => void;
}

const ScheduleConfirmDialog: React.FC<ScheduleConfirmDialogProps> = ({ open, onClose }) => {
    const { confirmSchedule } = useSchedule();
    const navigate = useNavigate();

    const handleConfirm = () => {
        confirmSchedule();
        onClose();
        navigate('/dashboard');
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: '490px',
                    height: '300px',
                    borderRadius: '12px',
                    padding: '24px',
                    boxSizing: 'border-box',
                    maxWidth: '490px',
                }
            }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3,
                pb: 2,
                borderBottom: '1px solid #E5E7EB'
            }}>
                <Typography sx={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#101828',
                    lineHeight: '28px'
                }}>
                    Please Confirm your lab visit
                </Typography>
                <IconButton
                    onClick={onClose}
                    sx={{
                        p: 0,
                        color: '#667085'
                    }}
                >
                    <img src={CloseIconAsset} alt="Close" style={{ width: '24px', height: '24px' }} />
                </IconButton>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '16px', mb: 2 }}>
                <Box
                    sx={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '24px',
                        backgroundColor: '#D8FDE3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    <img src={PlusIcon} alt="Plus" style={{ width: '24px', height: '24px' }} />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Typography sx={{ fontWeight: 600, color: '#101828', fontSize: '14px', lineHeight: '20px' }}>
                                Quest Diagnostics
                            </Typography>
                            <Typography sx={{ color: '#475467', fontSize: '14px', fontWeight: 400, lineHeight: '20px', pt: '12px' }}>
                                10710 Chantilly Pkwy, Aurburn, AL 36117
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', whiteSpace: 'nowrap', pt: 2 }}>
                            <img src={LocationIcon} alt="Location" style={{ width: '16px', height: '16px' }} />
                            <Typography sx={{ color: '#475467', fontSize: '12px', fontWeight: 500 }}>
                                4.93 mil
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Typography sx={{ color: '#475467', fontSize: '14px', mt: 2, textAlign: 'left' }}>
                Thursday, August 23
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', gap: '12px', justifyContent: 'space-between', mt: 'auto', }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: '#006045',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '16px',
                        width: '65px',
                        height: '44px',
                        border: '1px solid #006045',
                        backgroundColor: '#FFFFFF',
                    }}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    sx={{
                        backgroundColor: '#006045',
                        color: '#FFFFFF',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '16px',
                        height: '44px',
                        '&:hover': {
                            backgroundColor: '#004d35',
                        },
                    }}
                >
                    Confirm Schedule
                </Button>
            </Box>
        </Dialog>
    );
};

export default ScheduleConfirmDialog;
