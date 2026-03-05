import React from 'react';
import { Box } from '@mui/material';
import PersonalInfoForm from '../../Component/PersonalInfoForm/PersonalInfoForm';
import AboutYouForm from '../../Component/AboutYouForm/AboutYouForm';
import ScheduleForm from '../../Component/ScheduleForm/ScheduleForm';
import StepContainer from '../../Component/StepContainer/StepContainer';
import ScheduleConfirmDialog from '../../Component/ScheduleConfirmDialog/ScheduleConfirmDialog';

const PersonalInfo: React.FC = () => {
    const [step, setStep] = React.useState(1); // 1: Personal Info only, 2: +About You, 3: +Schedule
    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        state: '',
        city: '',
        zipCode: '',
    });

    const steps = [
        { label: 'Personal Info' },
        { label: 'Schedule' },
    ];

    const handleFormChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            setShowConfirmDialog(true);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const getNextLabel = () => {
        if (step === 1) return 'Next: Add Ons';
        if (step === 2) return 'Next: Add Ons';
        return 'Schedule';
    };

    const getBackLabel = () => {
        if (step === 1) return 'Prev: Personal Info';
        if (step === 2) return 'Prev: Personal Info';
        if (step === 3) return 'Prev: Personal Info';
        return 'Back';
    };

    return (
        <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            <StepContainer
                title="Lets Get Started"
                currentStep={step === 1 ? 1 : 2} // Keep stepper at 1 or 2
                steps={steps}
                onNext={handleNext}
                onBack={handleBack}
                nextLabel={getNextLabel()}
                backLabel={getBackLabel()}
                isBackDisabled={step === 1}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Personal Info is CONSTANT at the top */}
                    <PersonalInfoForm
                        data={formData}
                        onChange={handleFormChange}
                    />

                    {/* Sub-steps appear BELOW */}
                    {step === 2 && <AboutYouForm />}
                    {step === 3 && <ScheduleForm />}
                </Box>
            </StepContainer>
            <ScheduleConfirmDialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
            />
        </Box>
    );
};

export default PersonalInfo;
