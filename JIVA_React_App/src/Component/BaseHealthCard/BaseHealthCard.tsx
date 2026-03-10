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
}) => {
    return (
        <Box sx={{
            width: '100%',
            backgroundColor: '#F1F5F9',
            borderRadius: '40px',
            border: '1px solid #B1C2DC',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'stretch',
                flex: 1
            }}>
                {/* Left Section (Header + Chart) */}
                <Box sx={{
                    flex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3,
                    pb: 1
                }}>
                    <Box sx={{ mb: 2 }}>
                        {title}
                    </Box>
                    {leftContent}
                </Box>

                {/* Vertical Divider & Right Section */}
                {rightContent && (
                    <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        borderLeft: showRightBorder ? { xs: 'none', md: '1px solid #B1C2DC' } : 'none',
                    }}>
                        {rightContent}
                    </Box>
                )}
            </Box>

            {/* Footer Section */}
            {footerContent && (
                <Box sx={{ mt: 'auto', borderTop: '1px solid #B1C2DC' }}>
                    {footerContent}
                </Box>
            )}
        </Box>
    );
};

export default BaseHealthCard;
