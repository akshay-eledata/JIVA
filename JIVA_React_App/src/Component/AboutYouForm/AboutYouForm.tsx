import React from 'react';
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    FormGroup,
    FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QuestionCircleIcon from '../../assets/question-circle.svg';

const questions = [
    {
        id: 'q1',
        question: 'How often are you physically active?',
        options: [
            'Every Day',
            'A few times a week',
            'Once or twice a week',
            'A few times a month',
            'A few times a year',
            'Rarely',
            'Never',
        ],
    },
    {
        id: 'q2',
        question: 'Do you have known food allergies?',
        options: ['Yes, severe', 'Yes, mild', 'None', 'I am not sure'],
    },
    {
        id: 'q3',
        question: 'How often do you consume caffeine?',
        options: ['Multiple times a day', 'Daily', 'Occasionally', 'Rarely', 'Never'],
    },
    {
        id: 'q4',
        question: 'Are you taking Medication?',
        options: ['Yes, prescription', 'Yes, over-the-counter', 'No'],
    },
    {
        id: 'q5',
        question: 'What describes your best diet?',
        options: ['Vegan', 'Vegetarian', 'Pescatarian', 'Omnivore', 'Other'],
    },
    {
        id: 'q6',
        question: 'How many hours of sleep do you get?',
        options: ['Less than 5 hours', '5-7 hours', '7-9 hours', 'More than 9 hours'],
    },
    {
        id: 'q7',
        question: 'Do you smoke or use tobacco?',
        options: ['Yes, daily', 'Yes, occasionally', 'Socially only', 'Never'],
    },
    {
        id: 'q8',
        question: 'How much water do you drink daily?',
        options: ['Less than 1L', '1L-2L', 'More than 2L'],
    },
    {
        id: 'q9',
        question: 'Is this suitable for commercial projects?',
        options: ['Yes', 'No', 'Maybe'],
    },
    {
        id: 'q10',
        question: 'How can I get support if I encounter issues?',
        options: ['Contact Support', 'Documentation', 'Community Forum'],
    },
];

const AboutYouForm: React.FC = () => {
    const [expanded, setExpanded] = React.useState<string | false>('q1');

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box sx={{ width: '950px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 2 }}>
                <Typography
                    sx={{
                        fontSize: '18px',
                        fontWeight: 700,
                        lineHeight: '125%',
                        color: '#4A5565',
                    }}
                >
                    About You
                </Typography>
                <Typography
                    sx={{
                        fontSize: '14px',
                        color: '#9CA3AF',
                    }}
                >
                    1/15
                </Typography>
            </Box>

            <Box
                sx={{
                    border: '1px solid #7281971A',
                    borderTop: '1px solid #728197',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0px 1px 0.5px 0.05px #1D293D05',
                }}
            >
                {questions.map((q) => (
                    <Accordion
                        key={q.id}
                        expanded={expanded === q.id}
                        onChange={handleChange(q.id)}
                        disableGutters
                        elevation={0}
                        sx={{
                            borderBottom: '1px solid #E5E7EB',
                            '&:last-child': {
                                borderBottom: 'none',
                            },
                            '&:before': {
                                display: 'none',
                            },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: '#4A5565' }} />}
                            sx={{
                                backgroundColor: expanded === q.id ? '#F1F5F9' : '#FFFFFF',
                                minHeight: '52px',
                                '& .MuiAccordionSummary-content': {
                                    alignItems: 'center',
                                    gap: '12px',
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={QuestionCircleIcon}
                                sx={{ width: '20px', height: '20px' }}
                            />
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#101828',
                                }}
                            >
                                {q.question}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ padding: '8px 24px 24px 24px' }}>
                            <FormGroup>
                                {q.options.map((option) => (
                                    <FormControlLabel
                                        key={option}
                                        control={
                                            <Checkbox
                                                icon={
                                                    <Box
                                                        sx={{
                                                            width: 18,
                                                            height: 18,
                                                            borderRadius: '4px',
                                                            backgroundColor: '#F9FAFB',
                                                            border: '1px solid #E5E7EB',
                                                        }}
                                                    />
                                                }
                                                checkedIcon={
                                                    <Box
                                                        sx={{
                                                            width: 16,
                                                            height: 16,
                                                            borderRadius: '4px',
                                                            backgroundColor: '#006045',
                                                            border: '1px solid #006045',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            '&:after': {
                                                                content: '""',
                                                                width: '5px',
                                                                height: '10px',
                                                                border: 'solid white',
                                                                borderWidth: '0 2px 2px 0',
                                                                transform: 'rotate(45deg) translate(-1px, -1px)',
                                                            }
                                                        }}
                                                    />
                                                }
                                                sx={{
                                                    padding: '6px', // Reduced padding for 16px size
                                                    '&.Mui-checked': {
                                                        color: '#006045',
                                                    },
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    lineHeight: '16px',
                                                    color: '#101828',
                                                }}
                                            >
                                                {option}
                                            </Typography>
                                        }
                                        sx={{
                                            mb: 1.5, // Increased from 0.5
                                            marginLeft: '-8px'
                                        }}
                                    />
                                ))}
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Box>
    );
};

export default AboutYouForm;
