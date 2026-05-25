import React from 'react';
import { Box, Typography } from '@mui/material';
import GreenUpArrow from '../../assets/green up-arrow.svg';
import RedDownArrow from '../../assets/red down-arrow.svg';

interface CompareItem {
    name: string;
    value: string;
    difference: number;
    trend: 'up' | 'down';
    width: string;
    hasBadge?: boolean;
}

const inRangeData: CompareItem[] = [
    { name: 'Auto Immunity', value: '4.2', difference: 3, trend: 'up', width: '95%' },
    { name: 'Liver', value: '4.2', difference: 3, trend: 'up', width: '85%' },
    { name: 'Immune Regulation', value: '4.2', difference: 3, trend: 'up', width: '75%' },
    { name: 'Metabolic', value: '4.2', difference: 3, trend: 'up', width: '65%' },
    { name: 'Pancreas', value: '4.2', difference: 3, trend: 'down', width: '55%' },
    { name: 'Liver', value: '4.2', difference: 3, trend: 'down', width: '85%' },
];

const outOfRangeData: CompareItem[] = [
    { name: 'Auto Immunity', value: '4.2', difference: 3, trend: 'up', width: '45%' },
    { name: 'Liver', value: '4.2', difference: 3, trend: 'up', width: '35%' },
    { name: 'Immune Regulation', value: '4.2', difference: 3, trend: 'up', width: '50%' },
    { name: 'Metabolic', value: '4.2', difference: 3, trend: 'up', width: '80%' },
    { name: 'Pancreas', value: '4.2', difference: 3, trend: 'down', width: '45%' },
    { name: 'Liver', value: '4.2', difference: 3, trend: 'down', width: '35%' },
];

const CompareList = ({ title, data, isOutRange }: { title: string, data: CompareItem[], isOutRange: boolean }) => {
    return (
        <Box sx={{
            flex: 1,
            border: '1px solid #E2E8F0',
            borderRadius: '24px',
            p: 3,
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.05)',
        }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, px: 1 }}>
                <Typography sx={{ fontSize: '16px', fontWeight: 400, fontFamily: 'Source Sans Pro', color: '#64748B' }}>{title}</Typography>
                <Box sx={{ display: 'flex', gap: 4 }}>
                    <Typography sx={{ fontSize: '16px', fontWeight: 400, fontFamily: 'Source Sans Pro', color: '#64748B' }}>Sep</Typography>
                    <Typography sx={{ fontSize: '16px', fontWeight: 400, fontFamily: 'Source Sans Pro', color: '#64748B' }}>Difference</Typography>
                </Box>
            </Box>

            {/* List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {data.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>

                        {/* Bar */}
                        <Box sx={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Box sx={{
                                width: item.width,
                                height: '40px',
                                borderRadius: '4px 22px 22px 4px',
                                background: isOutRange
                                    ? 'linear-gradient(180deg, #FFD4D8 0%, #ED997F 100%)'
                                    : 'linear-gradient(180deg, #E1FCDE 0%, #BAEBD7 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                pl: 3,
                            }}>
                                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1A212B' }}>
                                    {item.name}
                                </Typography>
                            </Box>

                            {/* Badge */}
                            {item.hasBadge && (
                                <Box sx={{
                                    position: 'absolute',
                                    left: `calc(${item.width} + 12px)`,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                }}>
                                    <Box sx={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        backgroundColor: '#7E3AF2', // Purple badge
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0px 4px 10px rgba(126, 58, 242, 0.3)',
                                        border: '4px solid #FFFFFF',
                                        boxSizing: 'border-box'
                                    }}>
                                        <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>E</Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        {/* Values */}
                        <Box sx={{ display: 'flex', gap: 6, pr: 2, pl: 2, alignItems: 'center' }}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1A212B', minWidth: '24px' }}>
                                {item.value}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '40px', justifyContent: 'flex-end' }}>
                                {item.trend === 'up' ? (
                                    <Box component="img" src={GreenUpArrow} sx={{ width: 10, height: 12, mr: 0.5 }} />
                                ) : (
                                    <Box component="img" src={RedDownArrow} sx={{ width: 10, height: 12, mr: 0.5 }} />
                                )}
                                <Typography sx={{
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    color: '#1A212B'
                                }}>
                                    {item.difference}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

const BiomarkerCompare: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', gap: 3, width: '100%', mt: 3 }}>
            <CompareList title="In Range" data={inRangeData} isOutRange={false} />
            <CompareList title="Out of Range" data={outOfRangeData} isOutRange={true} />
        </Box>
    );
};

export default BiomarkerCompare;
