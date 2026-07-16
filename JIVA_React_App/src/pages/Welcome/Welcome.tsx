import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import JivaLogo from '../../assets/jiva.svg';
import VectorBg from '../../assets/Vector.svg';
import HandImg from '../../assets/Hand.svg';
import Glassy from '../../assets/glassy.svg';
import Subtract from '../../assets/Subtract.svg';

// Import AI doctor images
import AIImg1 from '../../assets/AI img(1).svg';
import AIImg2 from '../../assets/AI img(2).svg';
import AIImg3 from '../../assets/AI img(3).svg';

// Import Social Icons for the Footer
import TwitterIcon from '../../assets/Twitter Icon.svg';
import LinkedinIcon from '../../assets/Linkedin Icon.svg';
import FacebookIcon from '../../assets/Facebook Icon (1).svg';
import MailIcon from '../../assets/Facebook Icon.svg';

// Import Icons for the Services section
import RecommendedIcon from '../../assets/recommeded large.svg';
import ReportIcon from '../../assets/report Large.svg';
import ThermalIcon from '../../assets/Thermal large.svg';
import YogaLargeIcon from '../../assets/yoga large.svg';

import { WELCOME_CONSTANTS } from './constants';
import { WELCOME_LABELS } from './labels';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = React.useState<number>(0);

  const services = [
    {
      id: 0,
      icon: RecommendedIcon,
      title: 'Recommended Tests',
      description: "Start with over 100 advanced lab tests, followed by a 60+ test follow-up after 3-6 months, it's 5x more lab testing than the average physical.",
    },
    {
      id: 1,
      icon: ReportIcon,
      title: 'Health Reports',
      description: 'Help detect thousands of diseases—cardiovascular, metabolic, hormonal, neurological, and more through detailed trend summaries.',
    },
    {
      id: 2,
      icon: ThermalIcon,
      title: 'Thermal Diagnostics',
      description: 'Utilize advanced infrared physiological assessments to monitor temperature dynamics and inflammatory patterns.',
    },
    {
      id: 3,
      icon: YogaLargeIcon,
      title: 'Yoga & Wellness',
      description: 'Follow custom yoga routines, physical recovery guides, and personalized mindfulness sessions tailored to your biometric readings.',
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#F1FFF5',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowX: 'hidden',
        overflowY: 'auto',
        fontFamily: '"Source Sans Pro", sans-serif',
      }}
    >
      {/* SECTION 1: HERO / LANDING */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          pt: 6,
          pb: 6,
          position: 'relative',
        }}
      >
        {/* Header Content */}
        <Box
          sx={{
            zIndex: 2,
            textAlign: 'center',
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography
              sx={{
                fontFamily: '"Alegreya Sans", sans-serif',
                fontWeight: 800,
                fontSize: { xs: '48px', md: '72px' },
                color: '#256111',
                lineHeight: 1.1,
              }}
            >
              {WELCOME_LABELS.WE_ARE}
            </Typography>
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 2,
                  left: -4,
                  right: -4,
                  height: '6px',
                  background: '#DBF740',
                  borderRadius: '3px',
                  zIndex: -1,
                  opacity: 0.9,
                }
              }}
            >
              <Box
                component="img"
                src={JivaLogo}
                alt="JiVa"
                sx={{
                  height: { xs: '44px', md: '64px' },
                  width: 'auto',
                }}
              />
            </Box>
          </Box>

          <Typography
            sx={{
              fontFamily: '"Source Sans Pro", sans-serif',
              fontWeight: 600,
              fontSize: { xs: '20px', md: '30px' },
              color: '#474747',
              letterSpacing: '0.01em',
              mb: 2,
            }}
          >
            {WELCOME_LABELS.SUBTITLE}
          </Typography>

          {/* GET STARTED BUTTON ADDED HERE */}
          <Button
            onClick={() => navigate('/intake')}
            sx={{
              backgroundColor: '#61CC3E',
              color: '#FFFFFF',
              fontFamily: '"Source Sans Pro", sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              padding: '8px 24px',
              borderRadius: '6px',
              mb: 5,
              textTransform: 'none',
              // boxShadow: '0 4px 14px 0 rgba(97,204,62,0.39)',
              '&:hover': {
                backgroundColor: '#52b332',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(97,204,62,0.4)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Get Started
          </Button>
          <Typography
            sx={{
              fontFamily: '"Source Sans Pro", sans-serif',
              fontSize: '14px',
              color: '#475467',
              mb: 5,
              mt: -3,
            }}
          >
            Already have an account?{' '}
            <Box
              component="span"
              onClick={() => navigate('/signin')}
              sx={{ color: '#256111', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign in
            </Box>
          </Typography>
        </Box>

        {/* Main Interactive Circle and Floating Cards Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: WELCOME_CONSTANTS.MAX_WIDTH,
            height: WELCOME_CONSTANTS.HERO_HEIGHT,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          {/* Background World/Grid Vector */}
          <Box
            component="img"
            src={VectorBg}
            alt="Background Grid"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '110%',
              height: '110%',
              objectFit: 'cover',
              opacity: 0.4,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Glassy Image Overlay Frame */}
          <Box
            component="img"
            src={Glassy}
            alt="Glassy frame"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: WELCOME_CONSTANTS.GLASSY_WIDTH,
              height: WELCOME_CONSTANTS.GLASSY_HEIGHT,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          {/* Subtract Highlight Ring */}
          <Box
            component="img"
            src={Subtract}
            alt="Subtract highlight"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: WELCOME_CONSTANTS.GLASSY_WIDTH,
              height: WELCOME_CONSTANTS.GLASSY_HEIGHT,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />

          {/* Decorative Circular Rings */}
          <Box
            sx={{
              position: 'absolute',
              width: { xs: '320px', md: '560px' },
              height: { xs: '320px', md: '560px' },
              borderRadius: '50%',
              border: '2px solid rgba(193, 235, 179, 0.4)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              width: { xs: '350px', md: '610px' },
              height: { xs: '350px', md: '610px' },
              borderRadius: '50%',
              border: '1.5px dashed rgba(97, 204, 62, 0.3)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          {/* Central Hand Circular Card */}
          <Box
            className="central-circle"
            sx={{
              position: 'relative',
              width: WELCOME_CONSTANTS.CENTRAL_CIRCLE_WIDTH,
              height: WELCOME_CONSTANTS.CENTRAL_CIRCLE_HEIGHT,
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0px 20px 50px rgba(37, 97, 17, 0.15)',
              border: '10px solid #FFFFFF',
              zIndex: 3,
              backgroundColor: '#FFFFFF',
            }}
          >
            <Box
              component="img"
              src={HandImg}
              alt="Hand scan"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.05)',
                transition: 'transform 0.5s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            />
          </Box>

          {/* LEFT FLOATING ELEMENTS */}
          <Box
            sx={{
              position: 'absolute',
              left: { xs: '5%', md: '10%' },
              top: '30%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              px: '14px',
              py: '6px',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(37, 97, 17, 0.1)',
            }}
          >
            <Box
              sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#DBF740',
                boxShadow: '0 0 8px #DBF740',
              }}
            />
            <Typography
              sx={{
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                color: '#256111',
              }}
            >
              {WELCOME_LABELS.HEALTH_STATUS}
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              left: { xs: '2%', md: '5%' },
              bottom: '25%',
              zIndex: 3,
              backgroundColor: 'rgba(223, 243, 228, 0.75)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '1.5px solid #FFFFFF',
              p: 3,
              minWidth: { xs: '160px', md: '220px' },
              boxShadow: '0px 10px 30px rgba(37, 97, 17, 0.08)',
              textAlign: 'left',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1 }}>
              <Typography
                sx={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontSize: { xs: '38px', md: '48px' },
                  fontWeight: 700,
                  color: '#256111',
                  lineHeight: 1,
                }}
              >
                {WELCOME_LABELS.BADGE_VALUE}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#256111',
                }}
              >
                {WELCOME_LABELS.BADGE_UNIT}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                color: '#256111',
                opacity: 0.8,
              }}
            >
              {WELCOME_LABELS.HEALTH_STATUS}
            </Typography>
          </Box>

          {/* RIGHT FLOATING ELEMENTS */}
          <Box
            sx={{
              position: 'absolute',
              right: { xs: '2%', md: '5%' },
              top: '25%',
              zIndex: 3,
              backgroundColor: 'rgba(223, 243, 228, 0.75)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              border: '1.5px solid #FFFFFF',
              p: 3,
              minWidth: { xs: '160px', md: '220px' },
              boxShadow: '0px 10px 30px rgba(37, 97, 17, 0.08)',
              textAlign: 'left',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1 }}>
              <Typography
                sx={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontSize: { xs: '38px', md: '48px' },
                  fontWeight: 700,
                  color: '#256111',
                  lineHeight: 1,
                }}
              >
                {WELCOME_LABELS.BADGE_VALUE}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#256111',
                }}
              >
                {WELCOME_LABELS.BADGE_UNIT}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                color: '#256111',
                opacity: 0.8,
              }}
            >
              {WELCOME_LABELS.HEALTH_STATUS}
            </Typography>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              right: { xs: '5%', md: '10%' },
              bottom: '30%',
              transform: 'translateY(50%)',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              px: '14px',
              py: '6px',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(37, 97, 17, 0.1)',
            }}
          >
            <Box
              sx={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#DBF740',
                boxShadow: '0 0 8px #DBF740',
              }}
            />
            <Typography
              sx={{
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                color: '#256111',
              }}
            >
              {WELCOME_LABELS.HEALTH_STATUS}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* SECTION 2: SERVICES LIST */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#D7F4E0',
          py: 8,
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: WELCOME_CONSTANTS.MAX_WIDTH,
            mx: 'auto',
            px: { xs: 3, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Source Sans Pro", sans-serif',
              fontSize: { xs: '28px', md: '36px' },
              fontWeight: 700,
              color: '#256111',
              textAlign: 'left',
              lineHeight: 1.3,
              mb: 6,
              maxWidth: '800px',
            }}
          >
            {WELCOME_LABELS.SERVICES_HEADER_PART1}
            <Box component="span" sx={{ color: '#256111', fontWeight: 800 }}>
              {WELCOME_LABELS.SERVICES_HEADER_HIGHLIGHT}
            </Box>
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 4,
              width: '100%',
            }}
          >
            {services.map((service, index) => {
              const isSelected = selectedCard === index;
              return (
                <Box
                  key={service.id}
                  onClick={() => setSelectedCard(index)}
                  sx={{
                    backgroundColor: isSelected ? '#F1FFF5' : '#FFFFFF66',
                    borderRadius: '24px',
                    border: isSelected ? '1px solid #4B9C53B0' : '1px solid rgba(37, 97, 17, 0.08)',
                    p: 4,
                    boxShadow: isSelected ? '0px 2px 8px 0px #4B9C53B0' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#F1FFF5',
                      boxShadow: '0px 2px 8px 0px #4B9C53B0',
                      border: '1px solid #4B9C53B0',
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: '#EAF7EC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                    }}
                  >
                    <Box component="img" src={service.icon} sx={{ width: '22px', height: '22px' }} />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: '"Source Sans Pro", sans-serif',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#256111',
                      mb: 1.5,
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Source Sans Pro", sans-serif',
                      fontSize: '14px',
                      color: '#256111',
                      lineHeight: 1.6,
                    }}
                  >
                    {service.description}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* SECTION 3: DOCTORS CLINICAL NOTES */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#F1FFF5',
          py: { xs: 8, md: 10 },
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: WELCOME_CONSTANTS.MAX_WIDTH,
            mx: 'auto',
            px: { xs: 3, md: 6 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 6, md: 10 },
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Box
              sx={{
                width: '100%',
                maxWidth: '540px',
                aspectRatio: '1.2 / 1',
                backgroundColor: '#D7F4E0',
                borderRadius: '54px',
                p: 3.5,
                display: 'flex',
                gap: 3,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                }}
              >
                <Box
                  component="img"
                  src={AIImg3}
                  alt="Doctor 3"
                  sx={{
                    flex: 1,
                    width: '100%',
                    height: '50%',
                    objectFit: 'cover',
                    borderRadius: '36px',
                  }}
                />
                <Box
                  component="img"
                  src={AIImg2}
                  alt="Doctor 2"
                  sx={{
                    flex: 1,
                    width: '100%',
                    height: '50%',
                    objectFit: 'cover',
                    borderRadius: '36px',
                  }}
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                }}
              >
                <Box
                  component="img"
                  src={AIImg1}
                  alt="Doctor 1"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '36px',
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: { xs: '32px', md: '44px' },
                fontWeight: 600,
                color: '#1B1B1F',
                lineHeight: 1.2,
                mb: 4,
              }}
            >
              {WELCOME_LABELS.CLINICAL_NOTES_HEADER}
              <Box component="span" sx={{ display: 'block', fontWeight: 800 }}>
                {WELCOME_LABELS.CLINICAL_NOTES_HIGHLIGHT1}
              </Box>
              <Box component="span" sx={{ display: 'block', color: '#256111', fontWeight: 800 }}>
                {WELCOME_LABELS.CLINICAL_NOTES_HIGHLIGHT2}
              </Box>
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                mb: 5,
              }}
            >
              {['Surgeons', 'Dentists', 'Therapists', 'Ophthalmologists'].map((speciality) => (
                <Typography
                  key={speciality}
                  sx={{
                    fontFamily: '"Source Sans Pro", sans-serif',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#1B1B1F',
                  }}
                >
                  {speciality}
                </Typography>
              ))}
            </Box>

            <Box
              sx={{
                alignSelf: { xs: 'flex-start', md: 'flex-end' },
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                backgroundColor: '#E2FBE9',
                borderRadius: '30px',
                px: 3,
                py: 1.5,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#D1F8DA',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#256111',
                }}
              >
                {WELCOME_LABELS.BUTTON_KNOW_MORE}
              </Typography>
              <Box
                sx={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#256111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.5 10.5L10.5 3.5M10.5 3.5H5.25M10.5 3.5V8.75"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* SECTION 4: TESTIMONIALS */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#F1FFF5',
          py: { xs: 8, md: 10 },
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: WELCOME_CONSTANTS.MAX_WIDTH,
            mx: 'auto',
            px: { xs: 3, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Source Sans Pro", sans-serif',
              fontSize: { xs: '32px', md: '44px' },
              fontWeight: 700,
              color: '#1C1C1E',
              mb: 2,
            }}
          >
            {WELCOME_LABELS.WHAT_PEOPLE_SAY}{' '}
            <Box component="span" sx={{ color: '#256111' }}>
              {WELCOME_LABELS.ABOUT_US}
            </Box>
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Source Sans Pro", sans-serif',
              fontSize: '15px',
              color: '#475467',
              lineHeight: 1.6,
              maxWidth: '800px',
              mb: 6,
            }}
          >
            {WELCOME_LABELS.TESTIMONIALS_SUBTITLE}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
              gap: 4,
              width: '100%',
              mb: 6,
            }}
          >
            {[1, 2, 3].map((cardId) => (
              <Box
                key={cardId}
                sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  p: 4,
                  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Source Sans Pro", sans-serif',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#1B1B1F',
                    mb: 1.5,
                  }}
                >
                  {WELCOME_LABELS.TESTIMONIAL_TITLE}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Source Sans Pro", sans-serif',
                    fontSize: '14px',
                    color: '#475467',
                    lineHeight: 1.6,
                    mb: 4,
                  }}
                >
                  {WELCOME_LABELS.TESTIMONIAL_DESC}
                </Typography>

                <Box
                  sx={{
                    backgroundColor: '#61A98F',
                    borderRadius: '16px',
                    px: 2,
                    py: 0.5,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Source Sans Pro", sans-serif',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {WELCOME_LABELS.TESTIMONIAL_RATING}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              backgroundColor: '#E2FBE9',
              borderRadius: '30px',
              px: 3.5,
              py: 1.5,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#D1F8DA',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                color: '#256111',
              }}
            >
              {WELCOME_LABELS.BUTTON_KNOW_MORE}
            </Typography>
            <Box
              sx={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#256111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.5 10.5L10.5 3.5M10.5 3.5H5.25M10.5 3.5V8.75"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* SECTION 5: FOOTER */}
      <Box
        sx={{
          width: '100%',
          height: WELCOME_CONSTANTS.FOOTER_HEIGHT,
          backgroundColor: '#D7F4E0',
          pt: { xs: 6, md: 8 },
          pb: 4,
          zIndex: 2,
          borderRadius: WELCOME_CONSTANTS.FOOTER_RADIUS,
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: WELCOME_CONSTANTS.MAX_WIDTH,
            mx: 'auto',
            px: { xs: 3, md: 6 },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 5,
              mb: 8,
              textAlign: 'left',
            }}
          >
            {/* Column 1 */}
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontWeight: 800,
                  fontSize: '14px',
                  color: '#1B1B1F',
                  letterSpacing: '0.05em',
                  mb: 2.5,
                }}
              >
                {WELCOME_LABELS.FOOTER_RESOURCES}
              </Typography>
              {['Worldwide Health', 'US Healthcare', 'Clinical Waste', 'Gaps in Care', 'Patient Satisfaction'].map((link) => (
                <Typography
                  key={link}
                  sx={{
                    fontFamily: '"Source Sans Pro", sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#475467',
                    mb: 1.5,
                    cursor: 'pointer',
                    '&:hover': { color: '#256111' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>

            {/* Column 2 */}
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontWeight: 800,
                  fontSize: '14px',
                  color: '#1B1B1F',
                  letterSpacing: '0.05em',
                  mb: 2.5,
                }}
              >
                {WELCOME_LABELS.FOOTER_COMPANY}
              </Typography>
              {['About Jiva', 'Our Story', 'Team', 'Careers'].map((link) => (
                <Typography
                  key={link}
                  sx={{
                    fontFamily: '"Source Sans Pro", sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#475467',
                    mb: 1.5,
                    cursor: 'pointer',
                    '&:hover': { color: '#256111' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>

            {/* Column 3 */}
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontWeight: 800,
                  fontSize: '14px',
                  color: '#1B1B1F',
                  letterSpacing: '0.05em',
                  mb: 2.5,
                }}
              >
                {WELCOME_LABELS.FOOTER_LEGAL}
              </Typography>
              {['Terms & Conditions', 'Privacy Policy', 'Data Security & Privacy'].map((link) => (
                <Typography
                  key={link}
                  sx={{
                    fontFamily: '"Source Sans Pro", sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#475467',
                    mb: 1.5,
                    cursor: 'pointer',
                    '&:hover': { color: '#256111' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>

            {/* Column 4 */}
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontWeight: 800,
                  fontSize: '14px',
                  color: '#1B1B1F',
                  letterSpacing: '0.05em',
                  mb: 2.5,
                }}
              >
                {WELCOME_LABELS.FOOTER_GET_STARTED}
              </Typography>
              {['Health Plans', 'ACOs', 'Individuals'].map((link) => (
                <Typography
                  key={link}
                  sx={{
                    fontFamily: '"Source Sans Pro", sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    color: '#475467',
                    mb: 1.5,
                    cursor: 'pointer',
                    '&:hover': { color: '#256111' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>
          </Box>

          {/* Divider */}
          <Box sx={{ width: '100%', borderTop: '1px solid rgba(0, 0, 0, 0.08)', mb: 4 }} />

          {/* Copyright Area */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
            }}
          >
            {/* Logo */}
            <Box component="img" src={JivaLogo} alt="Jiva" sx={{ height: '32px', width: 'auto' }} />

            {/* Copyright */}
            <Typography
              sx={{
                fontFamily: '"Source Sans Pro", sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                color: '#475467',
              }}
            >
              {WELCOME_LABELS.FOOTER_COPYRIGHT}
            </Typography>

            {/* Socials */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {[MailIcon, FacebookIcon, LinkedinIcon, TwitterIcon].map((icon, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={icon}
                  alt={`Social ${idx}`}
                  sx={{
                    width: '46px',
                    height: '46px',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                    '&:hover': { opacity: 0.8 },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Embedded CSS for custom keyframe animations */}
      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.6);
            opacity: 1;
          }
          100% {
            transform: scale(2.0);
            opacity: 0;
          }
        }
      `}</style>
    </Box>
  );
};

export default Welcome;
