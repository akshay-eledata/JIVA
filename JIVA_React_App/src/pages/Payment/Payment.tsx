import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, InputAdornment, Divider } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SecurityIcon from '@mui/icons-material/Security';
import { PAYMENT_LABELS } from '../Payment/labels';
import { PAYMENT_CONSTANTS } from '../Payment/constants';
import cardsFixed from '../../assets/cardsFixed.png';
import CvcIcon from '../../assets/Cvc.png';
import { COLORS, FONTS } from '../../constants/constants';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const selectedAddons = state.selectedAddons || [];
  const totalPrice = state.totalPrice || 299.00;
  const hasBasic = state.hasBasic !== false;
  const basicPrice = state.basicPrice || 299.00;

  const [formData, setFormData] = useState({
    email: '00Chukwudaniel@gmail.com',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Payment submitted:', formData);
    // Navigate to Success screen
    navigate('/success');
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: { xs: '20px 20px', md: '40px 40px' },
        display: 'flex',
        flexDirection: 'column',
        gap: PAYMENT_CONSTANTS.CONTAINER_GAP,
        backgroundColor: '#FFFFFF',
        height: 'auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Title */}
      <Typography
        sx={{
          fontWeight: PAYMENT_CONSTANTS.TITLE_FONT_WEIGHT,
          fontSize: PAYMENT_CONSTANTS.TITLE_FONT_SIZE,
          lineHeight: PAYMENT_CONSTANTS.TITLE_LINE_HEIGHT,
          letterSpacing: PAYMENT_CONSTANTS.TITLE_LETTER_SPACING,
          background: PAYMENT_CONSTANTS.TITLE_GRADIENT,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
          marginTop: '0',
          marginBottom: PAYMENT_CONSTANTS.TITLE_MARGIN_BOTTOM,
        }}
      >
        {PAYMENT_LABELS.TITLE}
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          fontWeight: PAYMENT_CONSTANTS.SUBTITLE_FONT_WEIGHT,
          fontSize: PAYMENT_CONSTANTS.SUBTITLE_FONT_SIZE,
          lineHeight: PAYMENT_CONSTANTS.SUBTITLE_LINE_HEIGHT,
          letterSpacing: PAYMENT_CONSTANTS.SUBTITLE_LETTER_SPACING,
          color: PAYMENT_CONSTANTS.SUBTITLE_COLOR,
          textAlign: 'center',
          maxWidth: PAYMENT_CONSTANTS.SUBTITLE_MAX_WIDTH,
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '30px',
        }}
      >
        {PAYMENT_LABELS.SUBTITLE}
      </Typography>

      {/* Side-by-side Form and Summary */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '40px',
          width: '100%',
        }}
      >
        {/* Left Column: Payment Form Card */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: { xs: '100%', md: PAYMENT_CONSTANTS.CARD_WIDTH },
            minHeight: PAYMENT_CONSTANTS.CARD_MIN_HEIGHT,
            backgroundColor: PAYMENT_CONSTANTS.CARD_BACKGROUND_COLOR,
            borderRadius: PAYMENT_CONSTANTS.CARD_BORDER_RADIUS,
            border: PAYMENT_CONSTANTS.CARD_BORDER,
            padding: PAYMENT_CONSTANTS.CARD_PADDING,
            boxShadow: PAYMENT_CONSTANTS.CARD_BOX_SHADOW,
            display: 'flex',
            flexDirection: 'column',
            gap: PAYMENT_CONSTANTS.CARD_GAP,
            boxSizing: 'border-box',
          }}
        >
          {/* Contact Information Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: PAYMENT_CONSTANTS.SECTION_GAP }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '24px',
                color: PAYMENT_CONSTANTS.SECTION_HEADING_COLOR,
                marginBottom: PAYMENT_CONSTANTS.SECTION_HEADING_MARGIN_BOTTOM,
                textAlign: 'left',
              }}
            >
              {PAYMENT_LABELS.CONTACT_INFORMATION}
            </Typography>

            <Box>
              <TextField
                fullWidth
                value={formData.email}
                onChange={handleChange('email')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography
                        sx={{
                          fontWeight: PAYMENT_CONSTANTS.LABEL_FONT_WEIGHT,
                          fontSize: PAYMENT_CONSTANTS.LABEL_FONT_SIZE,
                          lineHeight: PAYMENT_CONSTANTS.LABEL_LINE_HEIGHT,
                          color: PAYMENT_CONSTANTS.LABEL_COLOR,
                          marginRight: '8px',
                        }}
                      >
                        {PAYMENT_LABELS.EMAIL}
                      </Typography>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: PAYMENT_CONSTANTS.INPUT_HEIGHT,
                    borderRadius: PAYMENT_CONSTANTS.INPUT_BORDER_RADIUS,
                    backgroundColor: '#F7F7F7',
                    '& fieldset': {
                      borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                      borderWidth: PAYMENT_CONSTANTS.INPUT_BORDER_WIDTH,
                    },
                    '&:hover fieldset': {
                      borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: PAYMENT_CONSTANTS.INPUT_FONT_SIZE,
                    lineHeight: PAYMENT_CONSTANTS.INPUT_LINE_HEIGHT,
                    color: PAYMENT_CONSTANTS.INPUT_TEXT_COLOR,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Payment Method Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: PAYMENT_CONSTANTS.SECTION_GAP }}>
            <Typography
              sx={{
                fontWeight: PAYMENT_CONSTANTS.SECTION_HEADING_FONT_WEIGHT,
                fontSize: PAYMENT_CONSTANTS.SECTION_HEADING_FONT_SIZE,
                lineHeight: PAYMENT_CONSTANTS.SECTION_HEADING_LINE_HEIGHT,
                color: PAYMENT_CONSTANTS.SECTION_HEADING_COLOR,
                marginBottom: PAYMENT_CONSTANTS.SECTION_HEADING_MARGIN_BOTTOM,
                textAlign: 'left',
              }}
            >
              {PAYMENT_LABELS.PAYMENT_METHOD}
            </Typography>

            {/* Card Information */}
            <Box>
              <Typography
                sx={{
                  fontWeight: PAYMENT_CONSTANTS.LABEL_FONT_WEIGHT,
                  fontSize: PAYMENT_CONSTANTS.LABEL_FONT_SIZE,
                  lineHeight: PAYMENT_CONSTANTS.LABEL_LINE_HEIGHT,
                  color: PAYMENT_CONSTANTS.LABEL_COLOR,
                  marginBottom: PAYMENT_CONSTANTS.LABEL_MARGIN_BOTTOM,
                  textAlign: 'left',
                }}
              >
                {PAYMENT_LABELS.CARD_INFORMATION}
              </Typography>
              <Box sx={{ position: 'relative', marginBottom: PAYMENT_CONSTANTS.CARD_NUMBER_MARGIN_BOTTOM }}>
                <TextField
                  fullWidth
                  required
                  placeholder={PAYMENT_LABELS.ENTER_TEXT}
                  value={formData.cardNumber}
                  onChange={handleChange('cardNumber')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: PAYMENT_CONSTANTS.INPUT_HEIGHT,
                      borderRadius: PAYMENT_CONSTANTS.INPUT_BORDER_RADIUS,
                      backgroundColor: PAYMENT_CONSTANTS.INPUT_BACKGROUND_COLOR,
                      paddingRight: '120px',
                      '& fieldset': {
                        borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                        borderWidth: PAYMENT_CONSTANTS.INPUT_BORDER_WIDTH,
                      },
                      '&:hover fieldset': {
                        borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: PAYMENT_CONSTANTS.INPUT_FONT_SIZE,
                      lineHeight: PAYMENT_CONSTANTS.INPUT_LINE_HEIGHT,
                      color: PAYMENT_CONSTANTS.INPUT_TEXT_COLOR,
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: PAYMENT_CONSTANTS.CARD_ICONS_GAP,
                  }}
                >
                  <img
                    src={cardsFixed}
                    alt="Accepted cards"
                    style={{
                      height: PAYMENT_CONSTANTS.CARD_ICONS_HEIGHT,
                      width: 'auto',
                    }}
                  />
                </Box>
              </Box>

              {/* Expiry and CVC */}
              <Box sx={{ display: 'flex', gap: 0, width: '100%' }}>
                <TextField
                  required
                  placeholder={PAYMENT_LABELS.MM_YY}
                  value={formData.expiryDate}
                  onChange={handleChange('expiryDate')}
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      height: PAYMENT_CONSTANTS.INPUT_HEIGHT,
                      borderRadius: '8px 0 0 8px',
                      backgroundColor: PAYMENT_CONSTANTS.INPUT_BACKGROUND_COLOR,
                      '& fieldset': {
                        borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                        borderWidth: PAYMENT_CONSTANTS.INPUT_BORDER_WIDTH,
                        borderRight: 'none',
                      },
                      '&:hover fieldset': {
                        borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                        borderRight: 'none',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                        borderRight: 'none',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: PAYMENT_CONSTANTS.INPUT_FONT_SIZE,
                      lineHeight: PAYMENT_CONSTANTS.INPUT_LINE_HEIGHT,
                      color: PAYMENT_CONSTANTS.INPUT_TEXT_COLOR,
                    },
                  }}
                />
                <Box sx={{ position: 'relative', flex: 1 }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '1px',
                      height: '35px',
                      backgroundColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                      zIndex: 1,
                    }}
                  />
                  <TextField
                    required
                    placeholder={PAYMENT_LABELS.CVC}
                    value={formData.cvc}
                    onChange={handleChange('cvc')}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        height: PAYMENT_CONSTANTS.INPUT_HEIGHT,
                        borderRadius: '0 8px 8px 0',
                        backgroundColor: PAYMENT_CONSTANTS.INPUT_BACKGROUND_COLOR,
                        paddingRight: '40px',
                        '& fieldset': {
                          borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                          borderWidth: PAYMENT_CONSTANTS.INPUT_BORDER_WIDTH,
                          borderLeft: 'none',
                        },
                        '&:hover fieldset': {
                          borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                          borderLeft: 'none',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                          borderLeft: 'none',
                        },
                      },
                      '& .MuiInputBase-input': {
                        fontSize: PAYMENT_CONSTANTS.INPUT_FONT_SIZE,
                        lineHeight: PAYMENT_CONSTANTS.INPUT_LINE_HEIGHT,
                        color: PAYMENT_CONSTANTS.INPUT_TEXT_COLOR,
                      },
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={CvcIcon}
                      alt="CVC location"
                      style={{
                        height: '17px',
                        width: 'auto',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Cardholder Name */}
            <Box>
              <Typography
                sx={{
                  fontWeight: PAYMENT_CONSTANTS.LABEL_FONT_WEIGHT,
                  fontSize: PAYMENT_CONSTANTS.LABEL_FONT_SIZE,
                  lineHeight: PAYMENT_CONSTANTS.LABEL_LINE_HEIGHT,
                  color: PAYMENT_CONSTANTS.LABEL_COLOR,
                  marginBottom: PAYMENT_CONSTANTS.LABEL_MARGIN_BOTTOM,
                  textAlign: 'left',
                }}
              >
                {PAYMENT_LABELS.CARDHOLDER_NAME}
              </Typography>
              <TextField
                fullWidth
                required
                placeholder={PAYMENT_LABELS.FULL_NAME_ON_CARD}
                value={formData.cardholderName}
                onChange={handleChange('cardholderName')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: PAYMENT_CONSTANTS.INPUT_HEIGHT,
                    borderRadius: PAYMENT_CONSTANTS.INPUT_BORDER_RADIUS,
                    backgroundColor: PAYMENT_CONSTANTS.INPUT_BACKGROUND_COLOR,
                    '& fieldset': {
                      borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                      borderWidth: PAYMENT_CONSTANTS.INPUT_BORDER_WIDTH,
                    },
                    '&:hover fieldset': {
                      borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: PAYMENT_CONSTANTS.INPUT_BORDER_COLOR,
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontSize: PAYMENT_CONSTANTS.INPUT_FONT_SIZE,
                    lineHeight: PAYMENT_CONSTANTS.INPUT_LINE_HEIGHT,
                    color: PAYMENT_CONSTANTS.INPUT_TEXT_COLOR,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Subscribe Button */}
          <Button
            type="submit"
            fullWidth
            sx={{
              height: PAYMENT_CONSTANTS.BUTTON_HEIGHT,
              borderRadius: PAYMENT_CONSTANTS.BUTTON_BORDER_RADIUS,
              backgroundColor: PAYMENT_CONSTANTS.BUTTON_BACKGROUND_COLOR,
              color: PAYMENT_CONSTANTS.BUTTON_TEXT_COLOR,
              fontWeight: PAYMENT_CONSTANTS.BUTTON_FONT_WEIGHT,
              fontSize: PAYMENT_CONSTANTS.BUTTON_FONT_SIZE,
              lineHeight: PAYMENT_CONSTANTS.BUTTON_LINE_HEIGHT,
              textTransform: 'none',
              marginTop: PAYMENT_CONSTANTS.BUTTON_MARGIN_TOP,
              '&:hover': {
                backgroundColor: PAYMENT_CONSTANTS.BUTTON_HOVER_BACKGROUND_COLOR,
              },
            }}
          >
            {PAYMENT_LABELS.SUBSCRIBE}
          </Button>
        </Box>

        {/* Right Column: Order Summary Card */}
        <Box
          sx={{
            width: { xs: '100%', md: '420px' },
            backgroundColor: '#F9FAFB',
            borderRadius: '24px',
            border: '1px solid #EFF0F6',
            padding: '30px',
            boxShadow: '0px 2px 12px 0px rgba(20, 20, 43, 0.04)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left',
          }}
        >
          <Typography
            sx={{
              fontFamily: FONTS.SATOSHI,
              fontWeight: 700,
              fontSize: '20px',
              color: '#111827',
              mb: 3,
            }}
          >
            Order Summary
          </Typography>

          {/* Items List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {hasBasic && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: 600, fontSize: '15px', color: '#111827' }}>
                    JIVA Basic Plan
                  </Typography>
                  <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', mt: 0.5 }}>
                    Includes 27 foundational tests
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: 700, fontSize: '16px', color: '#006045' }}>
                  ${basicPrice}.00
                </Typography>
              </Box>
            )}

            {selectedAddons.map((addon: any, idx: number) => (
              <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: 600, fontSize: '15px', color: '#111827' }}>
                    {addon.displayName || addon.name} Add-on
                  </Typography>
                  <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B7280', mt: 0.5 }}>
                    Additional specialized biomarker panel
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: 700, fontSize: '16px', color: '#006045' }}>
                  ${addon.price || 99.00}.00
                </Typography>
              </Box>
            ))}

            {selectedAddons.length === 0 && (
              <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B7280', fontStyle: 'italic' }}>
                No additional add-on packages selected.
              </Typography>
            )}
          </Box>

          <Divider sx={{ mb: 3, borderColor: '#EAECF0' }} />

          {/* Pricing Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: 700, fontSize: '16px', color: '#111827' }}>
              Total Due Annually
            </Typography>
            <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: 700, fontSize: '28px', color: '#006045' }}>
              ${totalPrice}.00
            </Typography>
          </Box>

          {/* Trust indicators */}
          <Box
            sx={{
              backgroundColor: '#F3FAF7',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <SecurityIcon sx={{ color: '#006045', fontSize: '20px' }} />
              <Typography sx={{ fontFamily: 'Inter', fontSize: '13px', fontWeight: 600, color: '#006045' }}>
                Secure Payment
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: 'Inter', fontSize: '12px', color: '#4B5563', lineHeight: 1.4 }}>
              Your transactions are secured with military-grade SSL encryption and are PCI-compliant.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <CheckCircleOutlineIcon sx={{ color: '#006045', fontSize: '16px' }} />
              <Typography sx={{ fontFamily: 'Inter', fontSize: '11px', color: '#4B5563', fontWeight: 500 }}>
                Cancel or modify packages anytime
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Payment;
