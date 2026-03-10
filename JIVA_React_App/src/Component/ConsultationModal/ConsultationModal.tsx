import React from 'react';
import { Box, Typography, Dialog, IconButton } from '@mui/material';
import CloseIcon from '../../assets/close.svg';

interface ConsultationModalProps {
    open: boolean;
    onClose: () => void;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: '24px',
                    width: '657px',
                    height: '449px',
                    maxWidth: '90vw',
                    p: 0,
                    m: 2,
                    opacity: 1,
                    border: '1px solid #9AA8BC33',
                    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)'
                }
            }}
        >
            <Box sx={{ p: '24px 32px' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography sx={{
                        fontSize: '24px',
                        fontWeight: 600,
                        color: '#1A212B',
                        fontFamily: 'lexend, sans-serif'
                    }}>
                        Consultation
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        sx={{ p: 0.5, color: '#1A212B', '&:hover': { color: '#1A212B' } }}
                    >
                        <Box component="img" src={CloseIcon} alt="Close" sx={{ width: 22, height: 22, }} />
                    </IconButton>
                </Box>

                {/* Content */}
                <Typography sx={{
                    fontSize: '18px',
                    color: '#728197',
                    fontFamily: 'Source Sans Pro',
                    fontWeight: 400,
                    lineHeight: '30px',
                    mb: 1.5
                }}>
                    Turning 40 is an important milestone for your health. At this stage,
                    regular screening can help detect potential cancer conditions early
                    when treatment is most effective.
                </Typography>

                <Typography sx={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#27313F',
                    fontFamily: 'Source Sans Pro, sans-serif',
                    mb: 2
                }}>
                    Suggested Test
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Typography sx={{ fontSize: '16px', fontWeight: 400, color: '#1A212B', fontFamily: 'lexend, sans-serif' }}>
                        Mammogram (Every 1-2 years)
                    </Typography>
                    <Typography sx={{ fontSize: '16px', fontWeight: 400, color: '#1A212B', fontFamily: 'lexend, sans-serif' }}>
                        Pap Smear /HPV Test (Every 3-5 years)
                    </Typography>
                    <Typography sx={{ fontSize: '16px', fontWeight: 400, color: '#1A212B', fontFamily: 'lexend, sans-serif' }}>
                        Colonoscopy / Stool Test (Every 5-10 years)
                    </Typography>
                    <Typography sx={{ fontSize: '16px', fontWeight: 400, color: '#1A212B', fontFamily: 'lexend, sans-serif' }}>
                        Oral Screening (Annual)
                    </Typography>
                </Box>
            </Box>
        </Dialog>
    );
};

export default ConsultationModal;
