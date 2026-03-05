import React from 'react';
import { Box, Typography } from '@mui/material';

interface BaseHealthCardProps {
    title: React.ReactNode;
    leftContent: React.ReactNode;
    rightContent?: React.ReactNode;
    footerContent?: React.ReactNode;
    showRightBorder?: boolean;
    hideMiddleBorder?: boolean;
}

const BaseHealthCard: React.FC<BaseHealthCardProps> = ({
    title,
    leftContent,
    rightContent,
    footerContent,
    showRightBorder = true,
    hideMiddleBorder = false
}) => {
    return (
        <Box sx={{
            width: '100%',
            backgroundColor: '#F1F5F9',
            borderRadius: '40px',
            border: '1px solid #B1C2DC',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Header Title Section */}
            <Box sx={{ p: { xs: 3, md: 3 }, pb: 0 }}>
                <Typography component="div" sx={{
                    fontSize: { xs: '24px', md: '32px' },
                    fontWeight: 700,
                    color: '#1B1B1F',
                    fontFamily: 'DM Sans',
                    textAlign: 'left',
                }}>
                    {title}
                </Typography>
            </Box>

            {!hideMiddleBorder && <Box sx={{ borderTop: '1px solid #B1C2DC', mt: 2 }} />}

            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'stretch'
            }}>
                {/* Left Section */}
                <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                    {leftContent}
                </Box>

                {/* Right Section (Chart or Info) */}
                {rightContent && (
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        minHeight: '250px',
                        borderLeft: showRightBorder ? { xs: 'none', md: '1px solid #C8D0DB' } : 'none',
                        position: 'relative'
                    }}>
                        {rightContent}
                    </Box>
                )}
            </Box>

            {/* Footer Section (Banner or FAQ) */}
            {footerContent && (
                <Box sx={{ mt: 'auto' }}>
                    {footerContent}
                </Box>
            )}
        </Box>
    );
};

export default BaseHealthCard;
