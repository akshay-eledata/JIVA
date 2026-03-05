import React from 'react';
import { Box, Typography } from '@mui/material';

interface BiomarkerRowProps {
    name: string;
    valueLabel: string;
    sublabel?: string;
    statusLabel: string;
    statusColor: string;
    miniChart?: React.ReactNode;
}

const BiomarkerRow: React.FC<BiomarkerRowProps> = ({
    name,
    valueLabel,
    sublabel,
    statusLabel,
    statusColor,
    miniChart
}) => {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
            borderBottom: '1px solid #EAECF0',
            width: '100%'
        }}>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                {miniChart ? (
                    miniChart
                ) : (
                    <Box
                        sx={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#F2F4F7',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {/* Placeholder for mini chart or icon */}
                    </Box>
                )}
                <Box>
                    <Typography
                        sx={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#1A212B',
                            fontFamily: 'source sans pro'
                        }}
                    >
                        {name}
                    </Typography>
                    {sublabel && (
                        <Typography sx={{ fontSize: '14px', color: '#667085', fontWeight: 400, fontFamily: 'source sans pro' }}>
                            {sublabel}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Box sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '16px',
                    backgroundColor: statusColor === 'green' ? '#ECFDF3' : '#FEF3F2',
                    border: `1px solid ${statusColor === 'green' ? '#ABEFC6' : '#FECDCA'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: statusColor === 'green' ? '#12B76A' : '#F04438' }} />
                    <Typography sx={{ color: statusColor === 'green' ? '#067647' : '#B42318', fontSize: '13px', fontWeight: 600 }}>
                        {statusLabel}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box sx={{ textAlign: 'right', minWidth: '80px' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#475467' }}>
                            {valueLabel}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', minWidth: '80px' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#475467' }}>
                            {valueLabel}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default BiomarkerRow;
