import React from 'react';
import {
    Box,
    Typography,
    Button,
} from '@mui/material';
import CheckCircleStepIcon from '../../assets/CheckCircle.svg';

interface StepLayoutProps {
    title: string;
    currentStep: number;
    totalSteps: number;
    steps: { label: string }[];
    onNext: () => void;
    onPrev: () => void;
    nextLabel?: string;
    prevLabel?: string;
    isNextDisabled?: boolean;
    isPrevDisabled?: boolean;
    children: React.ReactNode;
}

const StepLayout: React.FC<StepLayoutProps> = ({
    title,
    currentStep,
    totalSteps,
    steps,
    onNext,
    onPrev,
    nextLabel = "Next",
    prevLabel = "Back",
    isNextDisabled = false,
    isPrevDisabled = false,
    children,
}) => {
    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '854px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
                padding: '20px 0',
            }}
        >
            {/* Page Title */}
            <Typography
                sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '40px',
                    fontWeight: 700,
                    lineHeight: '50px',
                    color: '#1A212B',
                    textAlign: 'center',
                    marginBottom: '8px',
                }}
            >
                {title}
            </Typography>

            {/* Stepper */}
            <Box
                sx={{
                    height: '61px',
                    backgroundColor: '#F1F5F9',
                    borderRadius: '12px',
                    border: '1px solid rgba(114, 129, 151, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    justifyContent: 'space-between',
                    position: 'relative',
                }}
            >
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isActive = stepNumber === currentStep;

                    return (
                        <React.Fragment key={index}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1, backgroundColor: '#F1F5F9', pr: index === steps.length - 1 ? 0 : 1, pl: index === 0 ? 0 : 1 }}>
                                {isCompleted ? (
                                    <Box component="img" src={CheckCircleStepIcon} sx={{ width: '20px', height: '20px' }} />
                                ) : (
                                    <Box
                                        sx={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            border: `1.5px solid ${isActive ? '#007A55' : '#728197'}`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            color: isActive ? '#007A55' : '#728197',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {stepNumber}
                                    </Box>
                                )}
                                <Typography
                                    sx={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: isActive ? '#101828' : (isCompleted ? '#007A55' : '#728197'),
                                    }}
                                >
                                    {step.label}
                                </Typography>
                            </Box>

                            {index < steps.length - 1 && (
                                <Box
                                    sx={{
                                        flex: 1,
                                        height: '0px',
                                        borderTop: `1px dashed ${isCompleted ? '#007A55' : '#E5E7EB'}`,
                                        mx: 1,
                                    }}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </Box>

            {/* Content Section */}
            <Box>
                {children}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    onClick={onPrev}
                    disabled={isPrevDisabled}
                    variant="contained"
                    sx={{
                        width: 'auto',
                        minWidth: '184px',
                        height: '40px',
                        backgroundColor: '#F3F4F6 !important',
                        color: '#99A1AF !important',
                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '20px',
                        padding: '10px 24px',
                        border: '1px solid #E5E7EB',
                        whiteSpace: 'nowrap',
                        '&.Mui-disabled': {
                            backgroundColor: '#F3F4F6',
                            color: '#99A1AF',
                        }
                    }}
                >
                    {prevLabel}
                </Button>
                <Button
                    onClick={onNext}
                    disabled={isNextDisabled}
                    variant="contained"
                    sx={{
                        width: 'auto',
                        minWidth: '154px',
                        height: '40px',
                        backgroundColor: '#006045',
                        color: '#FFFFFF',
                        textTransform: 'none',
                        borderRadius: '12px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: 600,
                        padding: '10px 24px',
                        boxShadow: '0px 1px 0.5px 0.05px #1D293D05',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                            backgroundColor: '#004D37',
                            boxShadow: '0px 1px 0.5px 0.05px #1D293D05',
                        }
                    }}
                >
                    {nextLabel}
                </Button>
            </Box>
        </Box>
    );
};

export default StepLayout;
