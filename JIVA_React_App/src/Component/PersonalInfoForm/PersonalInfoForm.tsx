import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import AngleDownIcon from '../../assets/angle-down.svg';

interface PersonalInfoData {
    firstName: string;
    lastName: string;
    state: string;
    city: string;
    zipCode: string;
}

interface PersonalInfoFormProps {
    data?: PersonalInfoData;
    onChange?: (field: string, value: string) => void;
    title?: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
    data = {
        firstName: '',
        lastName: '',
        state: '',
        city: '',
        zipCode: '',
    },
    onChange,
    title = "Share Your Details"
}) => {
    const AngleDown = (props: any) => (
        <Box
            component="img"
            src={AngleDownIcon}
            {...props}
            sx={{
                width: '16px',
                height: '16px',
                marginRight: '12px',
                pointerEvents: 'none',
                ...props.sx
            }}
        />
    );

    const handleChange = (field: keyof PersonalInfoData) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
    ) => {
        if (onChange) {
            onChange(field, event.target.value);
        }
    };

    return (
        <Box>
            {title && (
                <Typography
                    sx={{
                        fontSize: '18px',
                        fontWeight: 700,
                        lineHeight: '1.25',
                        color: '#728197',
                        marginBottom: '16px',
                        fontFamily: 'Inter, sans-serif',
                        textAlign: 'left',
                    }}
                >
                    {title}
                </Typography>
            )}

            <Box
                sx={{
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E5E7EB',
                    borderTop: '1px solid #728197',
                    borderRadius: '12px',
                    padding: '40px 32px',
                }}
            >
                {/* Form Fields - Row 1 */}
                <Box sx={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <Box sx={{ width: '387px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 1.5, color: '#101828' }}>
                            First name
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Placeholder text"
                            variant="outlined"
                            value={data.firstName}
                            onChange={handleChange('firstName')}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '12px',
                                    boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
                                    '& fieldset': {
                                        borderColor: '#E5E7EB',
                                        borderRadius: '12px',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#D1D5DB',
                                    },
                                    '& input': {
                                        textAlign: 'left',
                                        padding: '10px 12px',
                                    },
                                    '& input::placeholder': {
                                        textAlign: 'left',
                                    }
                                }
                            }}
                        />
                    </Box>
                    <Box sx={{ width: '387px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 1.5, color: '#101828' }}>
                            Last Name
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Placeholder text"
                            variant="outlined"
                            value={data.lastName}
                            onChange={handleChange('lastName')}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '12px',
                                    boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
                                    '& fieldset': {
                                        borderColor: '#E5E7EB',
                                        borderRadius: '12px',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#D1D5DB',
                                    },
                                    '& input': {
                                        textAlign: 'left',
                                        padding: '10px 12px',
                                    },
                                    '& input::placeholder': {
                                        textAlign: 'left',
                                    }
                                }
                            }}
                        />
                    </Box>
                </Box>

                {/* Form Fields - Row 2 */}
                <Box sx={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
                    <Box sx={{ width: '280px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 1.5, color: '#101828', fontFamily: 'Inter, sans-serif' }}>
                            Select State
                        </Typography>
                        <Select
                            fullWidth
                            value={data.state}
                            onChange={handleChange('state')}
                            displayEmpty
                            IconComponent={AngleDown}
                            sx={{
                                height: '40px',
                                backgroundColor: '#F9FAFB',
                                borderRadius: '12px',
                                boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#E5E7EB',
                                    borderRadius: '12px',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#D1D5DB',
                                },
                                '& .MuiSelect-select': {
                                    textAlign: 'left',
                                    paddingLeft: '12px !important',
                                    color: '#666666',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '14px',
                                },
                                '& .MuiSelect-icon': {
                                    top: 'calc(50% - 6px)',
                                    right: '12px',
                                }
                            }}
                        >
                            <MenuItem value="" disabled>
                                <Typography sx={{ color: '#999', textAlign: 'left', width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>English (US)</Typography>
                            </MenuItem>
                            <MenuItem value="state1">State 1</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{ width: '280px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 1.5, color: '#101828', fontFamily: 'Inter, sans-serif' }}>
                            Select City
                        </Typography>
                        <Select
                            fullWidth
                            value={data.city}
                            onChange={handleChange('city')}
                            displayEmpty
                            IconComponent={AngleDown}
                            sx={{
                                height: '40px',
                                backgroundColor: '#F9FAFB',
                                borderRadius: '12px',
                                boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#E5E7EB',
                                    borderRadius: '12px',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#D1D5DB',
                                },
                                '& .MuiSelect-select': {
                                    textAlign: 'left',
                                    paddingLeft: '12px !important',
                                    color: '#666666',
                                    fontFamily: 'Inter, sans-serif',
                                    fontSize: '14px',
                                },
                                '& .MuiSelect-icon': {
                                    top: 'calc(50% - 6px)',
                                    right: '12px',
                                }
                            }}
                        >
                            <MenuItem value="" disabled>
                                <Typography sx={{ color: '#999', textAlign: 'left', width: '100%', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>English (US)</Typography>
                            </MenuItem>
                            <MenuItem value="city1">City 1</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{ width: '166px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 1.5, color: '#101828', fontFamily: 'Inter, sans-serif' }}>
                            Zip
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Placeholder text"
                            variant="outlined"
                            value={data.zipCode}
                            onChange={handleChange('zipCode')}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '12px',
                                    boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
                                    '& fieldset': {
                                        borderColor: '#E5E7EB',
                                        borderRadius: '12px',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#D1D5DB',
                                    },
                                    '& input': {
                                        textAlign: 'left',
                                        padding: '10px 12px',
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: '14px',
                                    },
                                    '& input::placeholder': {
                                        textAlign: 'left',
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: '14px',
                                    }
                                }
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default PersonalInfoForm;
