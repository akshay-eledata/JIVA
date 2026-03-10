import React, { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { PAYMENT_LABELS } from '../Payment/labels';
import { PAYMENT_CONSTANTS } from '../Payment/constants';
import cardsFixed from '../../assets/cardsFixed.png';
import CvcIcon from '../../assets/Cvc.png';

const Payment: React.FC = () => {
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
    // Handle payment submission
    console.log('Payment submitted:', formData);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: PAYMENT_CONSTANTS.CONTAINER_PADDING,
        display: 'flex',
        flexDirection: 'column',
        gap: PAYMENT_CONSTANTS.CONTAINER_GAP,
        backgroundColor: '#FFFFFF',
        height: 'auto',
        minHeight: 'auto',
        flexShrink: 0,
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
          marginBottom: PAYMENT_CONSTANTS.SUBTITLE_MARGIN_BOTTOM,
        }}
      >
        {PAYMENT_LABELS.SUBTITLE}
      </Typography>

      {/* Payment Card */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: PAYMENT_CONSTANTS.CARD_WIDTH,
          minHeight: PAYMENT_CONSTANTS.CARD_MIN_HEIGHT,
          backgroundColor: PAYMENT_CONSTANTS.CARD_BACKGROUND_COLOR,
          borderRadius: PAYMENT_CONSTANTS.CARD_BORDER_RADIUS,
          border: PAYMENT_CONSTANTS.CARD_BORDER,
          padding: PAYMENT_CONSTANTS.CARD_PADDING,
          boxShadow: PAYMENT_CONSTANTS.CARD_BOX_SHADOW,
          display: 'flex',
          flexDirection: 'column',
          gap: PAYMENT_CONSTANTS.CARD_GAP,
        }}
      >
        {/* Contact Information Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: PAYMENT_CONSTANTS.SECTION_GAP }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0%',
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
                  top: '22px',
                  transform: 'translateY(0)',
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
            <Box sx={{ display: 'flex', marginTop: '-15px', gap: 0 }}>
              <Box sx={{ display: 'flex', width: '620px', gap: 0 }}>
                <TextField
                  placeholder={PAYMENT_LABELS.MM_YY}
                  value={formData.expiryDate}
                  onChange={handleChange('expiryDate')}
                  sx={{
                    flex: 1,
                    marginRight: 0,
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
                    placeholder={PAYMENT_LABELS.CVC}
                    value={formData.cvc}
                    onChange={handleChange('cvc')}
                    sx={{
                      width: '310px',
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
    </Box>
  );
};

export default Payment;

