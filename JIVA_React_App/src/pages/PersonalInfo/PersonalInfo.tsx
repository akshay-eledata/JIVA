import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import PersonalInfoForm from '../../Component/PersonalInfoForm/PersonalInfoForm';
import AboutYouForm from '../../Component/AboutYouForm/AboutYouForm';
import RescheduleAddOnsForm from '../../Component/RescheduleAddOnsForm/RescheduleAddOnsForm';
import ScheduleForm from '../../Component/ScheduleForm/ScheduleForm';
import StepContainer from '../../Component/StepContainer/StepContainer';
import ScheduleConfirmDialog from '../../Component/ScheduleConfirmDialog/ScheduleConfirmDialog';
import { PERSONAL_INFO_CONSTANTS } from './constants';
import { PERSONAL_INFO_LABELS } from './labels';

const PersonalInfo: React.FC = () => {
    const location = useLocation();
    const isReschedule = (location.state as { isReschedule?: boolean })?.isReschedule ?? false;

    const [step, setStep] = React.useState(1); // 1: Personal Info only, 2: +About You/Add Ons, 3: +Schedule
    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        state: '',
        city: '',
        zipCode: '',
    });

    const steps = [
        { label: PERSONAL_INFO_LABELS.STEP_PERSONAL_INFO },
        { label: PERSONAL_INFO_LABELS.STEP_SCHEDULE },
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
        if (step === 1) return PERSONAL_INFO_LABELS.LABEL_NEXT_ADD_ONS;
        if (step === 2) return PERSONAL_INFO_LABELS.LABEL_NEXT_ADD_ONS;
        return PERSONAL_INFO_LABELS.LABEL_SCHEDULE;
    };

    const getBackLabel = () => {
        if (step === 1) return PERSONAL_INFO_LABELS.LABEL_PREV_PERSONAL_INFO;
        if (step === 2) return PERSONAL_INFO_LABELS.LABEL_PREV_PERSONAL_INFO;
        if (step === 3) return PERSONAL_INFO_LABELS.LABEL_PREV_PERSONAL_INFO;
        return PERSONAL_INFO_LABELS.LABEL_BACK;
    };

    return (
        <Box sx={{ width: '100%', maxWidth: PERSONAL_INFO_CONSTANTS.MAX_WIDTH, margin: '0 auto' }}>
            <StepContainer
                title={isReschedule ? PERSONAL_INFO_LABELS.TITLE_RESCHEDULE : PERSONAL_INFO_LABELS.TITLE_DEFAULT}
                currentStep={step === 1 ? 1 : 2} // Keep stepper at 1 or 2
                steps={steps}
                onNext={handleNext}
                onBack={handleBack}
                nextLabel={getNextLabel()}
                backLabel={getBackLabel()}
                isBackDisabled={step === 1}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: PERSONAL_INFO_CONSTANTS.GAP }}>
                    {/* Personal Info is CONSTANT at the top */}
                    <PersonalInfoForm
                        data={formData}
                        onChange={handleFormChange}
                    />

                    {/* Sub-steps appear BELOW */}
                    {step === 2 && (isReschedule ? <RescheduleAddOnsForm /> : <AboutYouForm />)}
                    {step === 3 && <ScheduleForm />}
                </Box>
            </StepContainer>
            <ScheduleConfirmDialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                isReschedule={isReschedule}
            />
        </Box>
    );
};

export default PersonalInfo;
