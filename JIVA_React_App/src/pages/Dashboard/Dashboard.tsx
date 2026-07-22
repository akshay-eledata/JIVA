import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton } from '@mui/material';
import GreenTickIcon from '../../assets/GreenTick.png';
import CloseIcon from '../../assets/CloseIcon.png';
import ManPointingSmartphone from '../../assets/man-pointing-smartphone.png';
import LineImage from '../../assets/Line.png';
import StickyNoteIcon from '../../assets/sticky-note.svg';
import LikeIcon from '../../assets/like.svg';
import GraphSqrIcon from '../../assets/graph-sqr.svg';
import GraphIcon from '../../assets/graph.svg';
import { DASHBOARD_CONSTANTS } from './constants';
import { DASHBOARD_LABELS } from './labels';

import { useSchedule } from '../../context/ScheduleContext';
import NextDraw from '../../Component/NextDraw/NextDraw';
import ReadingPaper from '../../assets/reading-paper.svg';
import PlusIcon from '../../assets/plus.svg';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isScheduled } = useSchedule();
  const [showBanner, setShowBanner] = useState(true);
  // Set once the next-draw card resolves, so the legacy scheduling block below
  // it can stand down (F1).
  const [hasNextDraw, setHasNextDraw] = useState(false);

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  return (
    <Box
      sx={{
        padding: DASHBOARD_CONSTANTS.CONTAINER_PADDING,
        display: 'flex',
        flexDirection: 'column',
        gap: DASHBOARD_CONSTANTS.CONTAINER_GAP,
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
      }}
    >
      {/* Success Banner */}
      {showBanner && (
        <Box
          sx={{
            width: DASHBOARD_CONSTANTS.SUCCESS_BANNER_WIDTH,
            height: DASHBOARD_CONSTANTS.SUCCESS_BANNER_HEIGHT,
            padding: DASHBOARD_CONSTANTS.SUCCESS_BANNER_PADDING,
            borderRadius: DASHBOARD_CONSTANTS.SUCCESS_BANNER_BORDER_RADIUS,
            backgroundColor: DASHBOARD_CONSTANTS.SUCCESS_BANNER_BACKGROUND_COLOR,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: DASHBOARD_CONSTANTS.SUCCESS_BANNER_GAP,
            marginTop: '20px',
            marginLeft: '1px',
            boxSizing: 'border-box',
          }}
        >
          {/* Success Icon */}
          <Box
            component="img"
            src={GreenTickIcon}
            alt="Success"
            sx={{
              width: DASHBOARD_CONSTANTS.SUCCESS_BANNER_ICON_SIZE,
              height: DASHBOARD_CONSTANTS.SUCCESS_BANNER_ICON_SIZE,
              flexShrink: 0,
            }}
          />

          {/* Success Message */}
          <Typography
            sx={{
              fontFamily: DASHBOARD_CONSTANTS.SUCCESS_BANNER_TEXT_FONT_FAMILY,
              fontWeight: DASHBOARD_CONSTANTS.SUCCESS_BANNER_TEXT_FONT_WEIGHT,
              fontSize: DASHBOARD_CONSTANTS.SUCCESS_BANNER_TEXT_FONT_SIZE,
              lineHeight: DASHBOARD_CONSTANTS.SUCCESS_BANNER_TEXT_LINE_HEIGHT,
              letterSpacing: DASHBOARD_CONSTANTS.SUCCESS_BANNER_TEXT_LETTER_SPACING,
              color: DASHBOARD_CONSTANTS.SUCCESS_BANNER_TEXT_COLOR,
              flex: 1,
              textAlign: 'left',
            }}
          >
            {isScheduled ? 'You will receive a confirmation via email' : DASHBOARD_LABELS.SUCCESS_MESSAGE}
          </Typography>

          {/* Close Icon */}
          <IconButton
            onClick={handleCloseBanner}
            sx={{
              padding: '3px',
              minWidth: 'auto',
              width: DASHBOARD_CONSTANTS.SUCCESS_BANNER_CLOSE_ICON_SIZE,
              height: DASHBOARD_CONSTANTS.SUCCESS_BANNER_CLOSE_ICON_SIZE,
              flexShrink: 0,
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Box
              component="img"
              src={CloseIcon}
              alt="Close"
              sx={{
                width: DASHBOARD_CONSTANTS.SUCCESS_BANNER_CLOSE_ICON_SIZE,
                height: DASHBOARD_CONSTANTS.SUCCESS_BANNER_CLOSE_ICON_SIZE,
              }}
            />
          </IconButton>
        </Box>
      )}

      {/* Next blood draw: the retest loop (F1) */}
      <NextDraw onResolved={setHasNextDraw} />

      {/* Legacy scheduling section: a static "book a visit" prompt and an
          equally static "scheduled visit" card. Both are superseded by the
          next-draw card above once it has real appointment data, so the whole
          block stands down rather than contradicting it (F1). */}
      {hasNextDraw ? null : !isScheduled ? (
        <Box
          sx={{
            width: DASHBOARD_CONSTANTS.SCHEDULE_SECTION_WIDTH,
            minHeight: DASHBOARD_CONSTANTS.SCHEDULE_SECTION_HEIGHT,
            backgroundColor: DASHBOARD_CONSTANTS.SCHEDULE_SECTION_BACKGROUND_COLOR,
            borderRadius: DASHBOARD_CONSTANTS.SCHEDULE_SECTION_BORDER_RADIUS,
            border: DASHBOARD_CONSTANTS.SCHEDULE_SECTION_BORDER,
            padding: DASHBOARD_CONSTANTS.SCHEDULE_SECTION_PADDING,
            display: 'flex',
            alignItems: 'center',
            // justifyContent: 'space-between',
            gap: DASHBOARD_CONSTANTS.SCHEDULE_SECTION_GAP,
            marginTop: DASHBOARD_CONSTANTS.SCHEDULE_SECTION_MARGIN_TOP,
            // marginLeft: DASHBOARD_CONSTANTS.SCHEDULE_SECTION_MARGIN_LEFT,
            boxSizing: 'border-box',
            overflow: 'visible',
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src={LineImage}
            alt="Line"
            sx={{
              position: 'absolute',
              left: '0px',
              height: '100%',
              width: 'auto',
              objectFit: 'contain',
              zIndex: 1,
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, maxWidth: '600px', zIndex: 2 }}>
            <Typography
              sx={{
                fontWeight: DASHBOARD_CONSTANTS.SCHEDULE_TITLE_FONT_WEIGHT,
                fontSize: DASHBOARD_CONSTANTS.SCHEDULE_TITLE_FONT_SIZE,
                lineHeight: DASHBOARD_CONSTANTS.SCHEDULE_TITLE_LINE_HEIGHT,
                color: DASHBOARD_CONSTANTS.SCHEDULE_TITLE_COLOR,
                marginBottom: DASHBOARD_CONSTANTS.SCHEDULE_TITLE_MARGIN_BOTTOM,
                textAlign: 'left',
              }}
            >
              {DASHBOARD_LABELS.SCHEDULE_TITLE}
            </Typography>

            <Typography
              sx={{
                fontWeight: DASHBOARD_CONSTANTS.SCHEDULE_DESCRIPTION_FONT_WEIGHT,
                fontSize: DASHBOARD_CONSTANTS.SCHEDULE_DESCRIPTION_FONT_SIZE,
                lineHeight: DASHBOARD_CONSTANTS.SCHEDULE_DESCRIPTION_LINE_HEIGHT,
                color: DASHBOARD_CONSTANTS.SCHEDULE_DESCRIPTION_COLOR,
                marginBottom: DASHBOARD_CONSTANTS.SCHEDULE_DESCRIPTION_MARGIN_BOTTOM,
                textAlign: 'left',
              }}
            >
              {DASHBOARD_LABELS.SCHEDULE_DESCRIPTION}
            </Typography>

            <Button
              onClick={() => navigate('/personal-info')}
              sx={{
                width: DASHBOARD_CONSTANTS.SCHEDULE_BUTTON_WIDTH,
                height: DASHBOARD_CONSTANTS.SCHEDULE_BUTTON_HEIGHT,
                backgroundColor: DASHBOARD_CONSTANTS.SCHEDULE_BUTTON_BACKGROUND_COLOR,
                color: DASHBOARD_CONSTANTS.SCHEDULE_BUTTON_TEXT_COLOR,
                fontWeight: DASHBOARD_CONSTANTS.SCHEDULE_BUTTON_FONT_WEIGHT,
                fontSize: DASHBOARD_CONSTANTS.SCHEDULE_BUTTON_FONT_SIZE,
                borderRadius: DASHBOARD_CONSTANTS.SCHEDULE_BUTTON_BORDER_RADIUS,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#004d35',
                },
              }}
            >
              {DASHBOARD_LABELS.SCHEDULE_BUTTON}
            </Button>
          </Box>

          <Box
            component="img"
            src={ManPointingSmartphone}
            alt="Schedule Lab Visit"
            sx={{
              width: '280px',
              height: '260px',
              maxWidth: '280px',
              objectFit: 'contain',
              flexShrink: 0,
              position: 'absolute',
              right: '20px',
              bottom: '-40px',
              zIndex: 2,
            }}
          />
        </Box>
      ) : (
        // New scheduled card
        <Box
          sx={{
            width: DASHBOARD_CONSTANTS.SCHEDULE_SECTION_WIDTH,
            minHeight: '232px', // Approximate height
            background: 'linear-gradient(90deg, #F1F5F9 0%, rgba(249, 249, 249, 0.75) 75.48%, #F9F9F9 100%)',
            borderRadius: '16px',
            padding: '24px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: DASHBOARD_CONSTANTS.SCHEDULE_SECTION_MARGIN_TOP,
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'visible', // For balloon
          }}
        >
          <Box sx={{ width: '60%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', mb: 4, }}>
              <Box
                sx={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EAECF0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <img src={PlusIcon} alt="Scheduled" style={{ width: '24px', height: '24px' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#101828', lineHeight: '28px', textAlign: 'left' }}>
                  Scheduled Lab Visit
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mt: '4px' }}>
                  <Typography
                    onClick={() => navigate('/follow-up-test')}
                    sx={{ fontSize: '14px', fontWeight: 500, color: '#1447E6', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Visit 1
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 400, color: '#475467' }}>
                    Tomorrow, 9:10 AM
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ width: '2px', height: '43px', backgroundColor: '#B1C2DC80' }} />
              <Button
                onClick={() => navigate('/vitality-map', { state: { rescheduleIntent: true } })}
                sx={{
                  ml: 2,
                  backgroundColor: '#006045',
                  color: '#FFFFFF',
                  border: '1px solid #256111',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  height: '36px',
                  '&:hover': {
                    backgroundColor: '#004d35',
                  },
                }}
              >
                Reschedule Visit
              </Button>
            </Box>

            {/* Steps Timeline Mockup */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: '636px', position: 'relative' }}>
              {/* Line */}
              <Box sx={{ position: 'absolute', width: '100%', top: '8.5px', left: '0', right: '0', height: '3px', background: 'linear-gradient(90deg, #484848 0%, rgba(72, 72, 72, 0.5) 25.96%, rgba(72, 72, 72, 0.25) 100%)', zIndex: 0 }} />

              {/* Step 1 */}
              <Box sx={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                <Box sx={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '4px solid #98A2B3' }} />
                <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#344054' }}>Visit 1</Typography>
              </Box>

              {/* Step 2 */}
              <Box sx={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                <Box sx={{ width: '14px', height: '14px', mt: '3px', borderRadius: '50%', backgroundColor: '#667085' }} />
                <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#344054' }}>Results</Typography>
              </Box>

              {/* Step 3 */}
              <Box sx={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                <Box sx={{ width: '14px', height: '14px', mt: '3px', borderRadius: '50%', backgroundColor: '#667085' }} />
                <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#344054' }}>Summary</Typography>
              </Box>
            </Box>
          </Box>

          <Box
            component="img"
            src={ReadingPaper}
            alt="Reading Paper"
            sx={{
              position: 'absolute',
              right: '30px',
              top: '-20px',
              height: '280px',
              width: 'auto',
              objectFit: 'contain',
              pointerEvents: 'none', // Allow clicks to pass through if overlapping buttons
            }}
          />
        </Box>
      )}

      {/* Discover what you can do in Jiva Section */}
      <Box
        sx={{
          width: DASHBOARD_CONSTANTS.SUCCESS_BANNER_WIDTH,
          marginTop: DASHBOARD_CONSTANTS.DISCOVER_SECTION_MARGIN_TOP,
          // marginLeft: DASHBOARD_CONSTANTS.SUCCESS_BANNER_LEFT,
          display: 'flex',
          flexDirection: 'column',
          gap: DASHBOARD_CONSTANTS.DISCOVER_SECTION_GAP,
        }}
      >
        <Typography
          sx={{
            fontWeight: DASHBOARD_CONSTANTS.DISCOVER_TITLE_FONT_WEIGHT,
            fontSize: DASHBOARD_CONSTANTS.DISCOVER_TITLE_FONT_SIZE,
            lineHeight: DASHBOARD_CONSTANTS.DISCOVER_TITLE_LINE_HEIGHT,
            color: DASHBOARD_CONSTANTS.DISCOVER_TITLE_COLOR,
            marginBottom: DASHBOARD_CONSTANTS.DISCOVER_TITLE_MARGIN_BOTTOM,
            textAlign: 'left',
          }}
        >
          {DASHBOARD_LABELS.DISCOVER_TITLE}
        </Typography>

        <Typography
          sx={{
            fontWeight: DASHBOARD_CONSTANTS.DISCOVER_DESCRIPTION_FONT_WEIGHT,
            fontSize: DASHBOARD_CONSTANTS.DISCOVER_DESCRIPTION_FONT_SIZE,
            lineHeight: DASHBOARD_CONSTANTS.DISCOVER_DESCRIPTION_LINE_HEIGHT,
            color: DASHBOARD_CONSTANTS.DISCOVER_DESCRIPTION_COLOR,
            marginBottom: DASHBOARD_CONSTANTS.DISCOVER_DESCRIPTION_MARGIN_BOTTOM,
            textAlign: 'left',
            marginTop: '-14px',
          }}
        >
          {DASHBOARD_LABELS.DISCOVER_DESCRIPTION}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: DASHBOARD_CONSTANTS.FEATURE_CARDS_GAP,
            flexWrap: 'wrap',
            width: '100%',
            height: 'auto',
            minHeight: '170px',
          }}
        >
          {/* Card 1: Whats In range? */}
          <Box
            sx={{
              width: DASHBOARD_CONSTANTS.FEATURE_CARD_WIDTH,
              minHeight: DASHBOARD_CONSTANTS.FEATURE_CARD_HEIGHT,
              backgroundColor: DASHBOARD_CONSTANTS.FEATURE_CARD_BACKGROUND_COLOR,
              borderRadius: DASHBOARD_CONSTANTS.FEATURE_CARD_BORDER_RADIUS,
              padding: DASHBOARD_CONSTANTS.FEATURE_CARD_PADDING,
              // boxShadow: DASHBOARD_CONSTANTS.FEATURE_CARD_BOX_SHADOW,
              border: '0.5px solid #B3B3B3',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              boxSizing: 'border-box',
            }}
          >
            <Box
              sx={{
                width: '44px',
                height: '44px',
                backgroundColor: '#F2F2F2',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Box
                component="img"
                src={StickyNoteIcon}
                alt="Range"
                sx={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography
              sx={{
                fontWeight: DASHBOARD_CONSTANTS.FEATURE_CARD_TITLE_FONT_WEIGHT,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#1A1A1A',
                marginBottom: '4px',
              }}
            >
              {DASHBOARD_LABELS.FEATURE_1_TITLE}
            </Typography>
            <Typography
              sx={{
                fontWeight: DASHBOARD_CONSTANTS.FEATURE_CARD_DESCRIPTION_FONT_WEIGHT,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#666666',
              }}
            >
              {DASHBOARD_LABELS.FEATURE_1_DESCRIPTION}
            </Typography>
          </Box>

          {/* Card 2: Recommendation */}
          <Box
            sx={{
              width: DASHBOARD_CONSTANTS.FEATURE_CARD_WIDTH,
              minHeight: DASHBOARD_CONSTANTS.FEATURE_CARD_HEIGHT,
              backgroundColor: DASHBOARD_CONSTANTS.FEATURE_CARD_BACKGROUND_COLOR,
              borderRadius: DASHBOARD_CONSTANTS.FEATURE_CARD_BORDER_RADIUS,
              padding: DASHBOARD_CONSTANTS.FEATURE_CARD_PADDING,
              // boxShadow: DASHBOARD_CONSTANTS.FEATURE_CARD_BOX_SHADOW,
              border: '0.5px solid #B3B3B3',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              boxSizing: 'border-box',
            }}
          >
            <Box
              sx={{
                width: '44px',
                height: '44px',
                backgroundColor: '#F2F2F2',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Box
                component="img"
                src={LikeIcon}
                alt="Recommend"
                sx={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography
              sx={{
                fontWeight: DASHBOARD_CONSTANTS.FEATURE_CARD_TITLE_FONT_WEIGHT,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#1A1A1A',
                marginBottom: '4px',
              }}
            >
              {DASHBOARD_LABELS.FEATURE_2_TITLE}
            </Typography>
            <Typography
              sx={{
                fontWeight: DASHBOARD_CONSTANTS.FEATURE_CARD_DESCRIPTION_FONT_WEIGHT,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#666666',
              }}
            >
              {DASHBOARD_LABELS.FEATURE_2_DESCRIPTION}
            </Typography>
          </Box>

          {/* Card 3: Clinical Reports */}
          <Box
            sx={{
              width: DASHBOARD_CONSTANTS.FEATURE_CARD_WIDTH,
              minHeight: DASHBOARD_CONSTANTS.FEATURE_CARD_HEIGHT,
              backgroundColor: DASHBOARD_CONSTANTS.FEATURE_CARD_BACKGROUND_COLOR,
              borderRadius: DASHBOARD_CONSTANTS.FEATURE_CARD_BORDER_RADIUS,
              padding: DASHBOARD_CONSTANTS.FEATURE_CARD_PADDING,
              // boxShadow: DASHBOARD_CONSTANTS.FEATURE_CARD_BOX_SHADOW,
              border: '0.5px solid #B3B3B3',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              boxSizing: 'border-box',
            }}
          >
            <Box
              sx={{
                width: '44px',
                height: '44px',
                backgroundColor: '#F2F2F2',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Box
                component="img"
                src={GraphSqrIcon}
                alt="Report"
                sx={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography
              sx={{
                fontWeight: DASHBOARD_CONSTANTS.FEATURE_CARD_TITLE_FONT_WEIGHT,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#1A1A1A',
                marginBottom: '4px',
              }}
            >
              {DASHBOARD_LABELS.FEATURE_3_TITLE}
            </Typography>
            <Typography
              sx={{
                fontWeight: DASHBOARD_CONSTANTS.FEATURE_CARD_DESCRIPTION_FONT_WEIGHT,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#666666',
              }}
            >
              {DASHBOARD_LABELS.FEATURE_3_DESCRIPTION}
            </Typography>
          </Box>

          {/* Card 4: Health Summary */}
          <Box
            sx={{
              width: DASHBOARD_CONSTANTS.FEATURE_CARD_WIDTH,
              minHeight: DASHBOARD_CONSTANTS.FEATURE_CARD_HEIGHT,
              backgroundColor: DASHBOARD_CONSTANTS.FEATURE_CARD_BACKGROUND_COLOR,
              borderRadius: DASHBOARD_CONSTANTS.FEATURE_CARD_BORDER_RADIUS,
              padding: DASHBOARD_CONSTANTS.FEATURE_CARD_PADDING,
              // boxShadow: DASHBOARD_CONSTANTS.FEATURE_CARD_BOX_SHADOW,
              border: '0.5px solid #B3B3B3',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              boxSizing: 'border-box',
            }}
          >
            <Box
              sx={{
                width: '44px',
                height: '44px',
                backgroundColor: '#F2F2F2',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <Box
                component="img"
                src={GraphIcon}
                alt="Health"
                sx={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography
              sx={{
                fontWeight: DASHBOARD_CONSTANTS.FEATURE_CARD_TITLE_FONT_WEIGHT,
                fontSize: '16px',
                lineHeight: '24px',
                color: '#1A1A1A',
                marginBottom: '4px',
              }}
            >
              {DASHBOARD_LABELS.FEATURE_4_TITLE}
            </Typography>
            <Typography
              sx={{
                fontWeight: DASHBOARD_CONSTANTS.FEATURE_CARD_DESCRIPTION_FONT_WEIGHT,
                fontSize: '12px',
                lineHeight: '18px',
                color: '#666666',
              }}
            >
              {DASHBOARD_LABELS.FEATURE_4_DESCRIPTION}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

