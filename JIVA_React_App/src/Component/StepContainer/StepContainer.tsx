import React from 'react';
import {
    Box,
    Typography,
    Button,
} from '@mui/material';
import CheckCircleStepIcon from '../../assets/CheckCircle.svg';

interface Step {
    label: string;
}

interface StepContainerProps {
    title: string;
    currentStep: number;
    steps: Step[];
    onNext: () => void;
    onBack: () => void;
    nextLabel?: string;
    backLabel?: string;
    isNextDisabled?: boolean;
    isBackDisabled?: boolean;
    children: React.ReactNode;
}

const StepContainer: React.FC<StepContainerProps> = ({
    title,
    currentStep,
    steps,
    onNext,
    onBack,
    nextLabel = 'Next',
    backLabel = 'Back',
    isNextDisabled = false,
    isBackDisabled = false,
    children,
}) => {
    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '950px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                padding: '10px 0',
            }}
        >
            {/* Page Title */}
            <Typography
                sx={{
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
                    const isFirstStep = stepNumber === 1;

                    return (
                        <React.Fragment key={index}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1, backgroundColor: '#F1F5F9', pr: 1 }}>
                                {(isCompleted || (isFirstStep && isActive)) ? (
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
                                        color: isActive || isCompleted ? '#007A55' : '#728197',
                                    }}
                                >
                                    {step.label}
                                </Typography>
                            </Box>

                            {index < steps.length - 1 && (
                                <Box
                                    sx={{
                                        flex: 1,
                                        height: '1px',
                                        backgroundColor: '#E5E7EB',
                                        mx: 2,
                                    }}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </Box>

            {/* Dynamic Content */}
            <Box>
                {children}
            </Box>

            {/* Action Buttons - Now Sticky */}
            <Box
                sx={{
                    position: 'sticky',
                    bottom: 0,
                    padding: '5px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 10,

                }}
            >
                <Button
                    onClick={onBack}
                    disabled={isBackDisabled}
                    variant="outlined"
                    sx={{
                        width: 'auto',
                        minWidth: '184px',
                        height: '40px',
                        borderColor: isBackDisabled ? '#E5E7EB' : '#006045',
                        color: isBackDisabled ? '#99A1AF' : '#006045',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontSize: '14px',
                        fontWeight: 500,
                        padding: '10px 24px',
                        backgroundColor: isBackDisabled ? '#F3F4F6' : '#FFFFFF',
                        '&:hover': {
                            backgroundColor: isBackDisabled ? '#F3F4F6' : '#F1F1F1',
                            borderColor: isBackDisabled ? '#E5E7EB' : '#006045',
                        },
                        '&.Mui-disabled': {
                            borderColor: '#E5E7EB',
                            color: '#99A1AF',
                            backgroundColor: '#F3F4F6',
                        }
                    }}
                >
                    {backLabel}
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
                        fontSize: '14px',
                        fontWeight: 500,
                        padding: '10px 24px',
                        boxShadow: 'none',
                        '&:hover': {
                            backgroundColor: '#004D37',
                            boxShadow: 'none',
                        }
                    }}
                >
                    {nextLabel}
                </Button>
            </Box>
        </Box>
    );
};

export default StepContainer;
