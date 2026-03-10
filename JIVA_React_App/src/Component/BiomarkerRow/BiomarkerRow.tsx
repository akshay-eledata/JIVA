import React from 'react';
import { Box, Typography } from '@mui/material';
import RedArrow from '../../assets/Red-arrow.svg';

interface BiomarkerRowProps {
    name: string;
    valueLabel: string;
    sublabel?: string;
    statusLabel: string;
    statusColor: string;
    miniChart?: React.ReactNode;
    batch?: string;
    qty?: string;
    isOverview?: boolean;
}

const BiomarkerRow: React.FC<BiomarkerRowProps> = ({
    name,
    valueLabel,
    sublabel,
    statusLabel,
    statusColor,
    miniChart,
    batch = "-",
    qty = "-",
    isOverview = false
}) => {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            py: 2,
            px: 2,
            borderBottom: '1px solid #EAECF0',
            width: '100%'
        }}>
            {/* Product Name Column */}
            <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', flex: 1 }}>
                {miniChart ? (
                    miniChart
                ) : (
                    <Box
                        sx={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#9AA8BC4D',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}
                    >
                        {/* Placeholder */}
                    </Box>
                )}
                <Box>
                    <Typography
                        sx={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#1A212B',
                            textAlign: 'left',
                            fontFamily: 'Source Sans Pro'
                        }}
                    >
                        {name}
                    </Typography>
                    {sublabel && (
                        <Typography sx={{
                            fontSize: '14px',
                            color: '#9AA8BC',
                            fontWeight: 600,
                            textAlign: 'left',
                            mt: 0.5,
                            fontFamily: 'Source Sans Pro'
                        }}>
                            {sublabel}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Columns Container */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isOverview ? (
                    <>
                        {/* Overview Mode Columns */}
                        <Box sx={{ width: '140px', display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '16px',
                                backgroundColor: '#D1FAE5',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#115E59' }} />
                                <Typography sx={{ color: '#115E59', fontSize: '13px', fontWeight: 600 }}>
                                    {statusLabel}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ width: '140px', display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#728197' }} />
                                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#001940', fontFamily: 'Source Sans Pro' }}>
                                    25 IU/ml
                                </Typography>
                                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#F04438', display: 'flex', alignItems: 'center', fontFamily: 'Source Sans Pro' }}>
                                    <img src={RedArrow} alt="Up" style={{ width: 12, height: 12 }} />
                                    <span style={{ color: '#001940' }}>3</span>
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ width: '140px', display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#728197' }} />
                                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#001940', fontFamily: 'Source Sans Pro' }}>
                                    25 IU/ml
                                </Typography>
                                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#F04438', display: 'flex', alignItems: 'center', fontFamily: 'Source Sans Pro' }}>
                                    <img src={RedArrow} alt="Up" style={{ width: 12, height: 12 }} />
                                    <span style={{ color: '#001940' }}>3</span>
                                </Typography>
                            </Box>
                        </Box>
                    </>
                ) : (
                    <>
                        {/* Detailed Mode Columns */}
                        {/* Batch Column (Status Chip) */}
                        <Box sx={{ width: '140px', display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '16px',
                                backgroundColor: '#D1FAE5',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#115E59' }} />
                                <Typography sx={{ color: '#115E59', fontSize: '13px', fontWeight: 600 }}>
                                    {statusLabel}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Qty Column (Value Label) */}
                        <Box sx={{ width: '100px', display: 'flex', justifyContent: 'center' }}>
                            <Typography sx={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#001940',
                                fontFamily: 'Source Sans Pro'
                            }}>
                                {valueLabel}
                            </Typography>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default BiomarkerRow;
