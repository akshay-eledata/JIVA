import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Checkbox, FormControlLabel, CircularProgress, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { COLORS, FONTS, FONT_WEIGHTS } from '../../constants/constants';
import { PackageInfo } from './constants';
import tickIconWhite from '../../assets/Tick-Icon-white.svg';

const SelectPackages: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [basicPanel, setBasicPanel] = useState<PackageInfo | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [activeAddonId, setActiveAddonId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Attempt to fetch packages from JIVA Node API on mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/packages');
        if (response.ok) {
          const data = await response.json();
          const addons = data.filter((p: any) => p.type === 'addon');
          const base = data.find((p: any) => p.type === 'base');

          if (base) {
            setBasicPanel({
              id: base.id || 'basic-panel',
              name: base.name,
              displayName: 'Basic',
              price: base.price || 299.00,
              testCount: base.testCount || base.tests.length,
              description: base.description || '',
              tests: base.tests || []
            });
          }

          if (addons.length > 0) {
            // Map backend fields to frontend interface if needed
            const mappedAddons = addons.map((p: any) => {
              return {
                id: p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                name: p.name,
                displayName: p.name,
                price: p.price || 99.00,
                testCount: p.testCount || p.tests.length,
                description: p.description || '',
                tests: p.tests || []
              };
            });
            setPackages(mappedAddons);
            setActiveAddonId(mappedAddons[0].id);
          }
        }
      } catch (error) {
        console.warn('API fetch failed, falling back to local package constants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const activeAddon = packages.find(p => p.id === activeAddonId) || packages[0] || null;

  const handleToggleAddon = (id: string, event?: React.MouseEvent) => {
    // Prevent event bubbling if triggered by row click instead of checkbox directly
    if (event) {
      event.stopPropagation();
    }

    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectRow = (id: string) => {
    setActiveAddonId(id);
  };

  // Calculate totals
  const basePrice = basicPanel ? basicPanel.price : 299.00;
  const addonPrice = 99.00;
  const totalPrice = basePrice + (selectedAddons.length * addonPrice);

  const handleProceedToCheckout = () => {
    const chosenAddons = packages.filter(p => selectedAddons.includes(p.id));
    navigate('/payment', {
      state: {
        selectedAddons: chosenAddons.map(a => ({
          id: a.id,
          name: a.name,
          displayName: a.displayName,
          price: a.price
        })),
        totalPrice: totalPrice,
        hasBasic: true,
        basicPrice: basePrice
      }
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
        <Typography sx={{ fontFamily: FONTS.SATOSHI, color: COLORS.TEXT_PRIMARY }}>Loading JIVA Health Packages...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: { xs: '20px 20px', md: '40px 40px 100px' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* HEADER SECTION */}
      <Box sx={{ textAlign: 'center', mb: 5, maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: { xs: '36px', md: '54px' },
            background: 'linear-gradient(180deg, #000000 0%, #001354 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: { xs: '44px', md: '60px' },
            textAlign: 'center',
            mb: 1.5,
          }}
        >
          Track every Biomarker own your health with Jiva
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: { xs: '18px', md: '22px' },
            color: '#010D3E',
            lineHeight: { xs: '26px', md: '31px' },
            textAlign: 'center',
          }}
        >
          Effortlessly turn your health into a fully functional, proactive in just months with the Jiva's plan.
        </Typography>
      </Box>

      {/* PLAN SELECTOR GRID */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '360px 1fr' },
          gap: 4,
          width: '100%',
          alignItems: 'stretch',
          mb: 4
        }}
      >
        {/* LEFT COLUMN: BASIC PANEL */}
        <Box
          sx={{
            backgroundColor: '#006045',
            borderRadius: '24px',
            color: '#FFFFFF',
            padding: '36px 28px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0px 12px 32px rgba(0, 96, 69, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0px 16px 40px rgba(0, 96, 69, 0.25)',
            }
          }}
        >
          {/* Top Row: Basic Title & Badge */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', lineHeight: '130%', letterSpacing: '0px', color: '#FFFFFF' }}>
              Basic
            </Typography>
            <Box
              sx={{
                width: '106px',
                height: '31px',
                boxSizing: 'border-box',
                borderRadius: '10px',
                opacity: 1,
                gap: '10px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                pt: '10px',
                pr: '13px',
                pb: '10px',
                pl: '13px',
                // backgroundColor: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '12px',
                  background: 'linear-gradient(90deg, #DD7DFF 0%, #E1CD86 29.5%, #8BCB92 51%, #71C2EF 76.5%, #3BFFFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                Most Popular
              </Typography>
            </Box>
          </Box>

          {/* Pricing */}
          <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 4 }}>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '54px', lineHeight: '60px', letterSpacing: '-0.06em', color: '#FFFFFF' }}>
              ${basePrice}
            </Typography>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '18px', color: '#E5E7EB', ml: 0.5, lineHeight: '100%', letterSpacing: '-0.031em' }}>
              /Annually
            </Typography>
          </Box>

          {/* Action Button */}
          <Button
            disabled
            sx={{
              width: '271px',
              height: '39px',
              minHeight: '39px',
              backgroundColor: '#FFFFFF !important',
              color: '#000000 !important',
              textTransform: 'none',
              borderRadius: '10px',
              opacity: '1 !important',
              gap: '4px',
              pt: '10px',
              pr: '15px',
              pb: '10px',
              pl: '15px',
              mb: 4,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '100%',
              boxShadow: 'none',
            }}
          >
            Add to cart
          </Button>

          {/* Tests List - Removed scrollbar and maxHeight */}
          <Box
            sx={{
              flex: 1,
              textAlign: 'left',
            }}
          >
            {basicPanel && basicPanel.tests.map((test, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2.0, mb: 1.8 }}>
                <Box
                  component="img"
                  src={tickIconWhite}
                  alt="check"
                  sx={{ width: '24px', height: '24px', opacity: 1, flexShrink: 0 }}
                />
                <Typography
                  sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    letterSpacing: '0%',
                  }}
                >
                  {test}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* RIGHT COLUMN: ADDITIONAL PACKAGES */}
        <Box
          sx={{
            backgroundColor: '#E2FBE9',
            borderRadius: '24px',
            border: '1px solid rgba(0, 96, 69, 0.08)',
            padding: '36px 36px 0px 36px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.02)',
            transition: 'transform 0.3s ease',
            overflow: 'hidden',
            '&:hover': {
              boxShadow: '0px 12px 36px rgba(0, 96, 69, 0.06)',
            }
          }}
        >
          {/* Top Row: Title, Pricing & Button */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 4 }}>
            <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '18px', color: '#6F6C90', textAlign: 'left', mb: 1.5, lineHeight: '100%', letterSpacing: '-0.031em' }}>
              Additional
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '54px', color: '#000000', lineHeight: '60px', letterSpacing: '-0.06em' }}>
                ${addonPrice}
              </Typography>
              <Typography sx={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '18px', color: '#6F6C90', ml: 0.5, lineHeight: '100%', letterSpacing: '-0.031em' }}>
                /Annually
              </Typography>
            </Box>

            <Button
              onClick={() => {
                handleToggleAddon(activeAddonId);
              }}
              sx={{
                width: '271px',
                height: '39px',
                minHeight: '39px',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                textTransform: 'none',
                borderRadius: '10px',
                opacity: 1,
                gap: '4px',
                pt: '10px',
                pr: '15px',
                pb: '10px',
                pl: '15px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '100%',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#F3F4F6'
                }
              }}
            >
              Add to cart
            </Button>
          </Box>

          {/* Divider */}
          <Box sx={{ borderTop: '0.5px solid #256111', mx: '-36px', mb: 0 }} />

          {/* SPLIT LAYOUT FOR PACKAGES & TESTS */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '0.8fr 0.5px 1.2fr' },
              gap: 0,
              mx: '-36px',
              flex: 1,
            }}
          >
            {/* Split Left Column: Checklist of Packages */}
            <Box sx={{ display: 'flex', flexDirection: 'column', pb: '24px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {packages.map((addon, index) => {
                  const isActive = addon.id === activeAddonId;
                  const isChecked = selectedAddons.includes(addon.id);

                  return (
                    <Box
                      key={addon.id}
                      onClick={() => handleSelectRow(addon.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 16px 10px 36px',
                        backgroundColor: isActive ? '#D9D9D9' : 'transparent',
                        // borderTop: index === 0 ? 'none' : '1px solid #E5E7EB',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: isActive ? '#D9D9D9' : 'rgba(0, 96, 69, 0.03)',
                        }
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isChecked}
                            onClick={(e) => handleToggleAddon(addon.id, e)}
                            icon={
                              <Box sx={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '4px',
                                border: '1px solid #E5E7EB',
                                backgroundColor: '#F9FAFB',
                              }} />
                            }
                            checkedIcon={
                              <Box sx={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '4px',
                                border: '1px solid #E5E7EB',
                                backgroundColor: '#006045',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                <CheckIcon sx={{ color: '#FFFFFF', fontSize: '14px' }} />
                              </Box>
                            }
                          />
                        }
                        label={
                          <Box sx={{ textAlign: 'left' }}>
                            <Typography
                              sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                fontSize: '15px',
                                color: '#111827'
                              }}
                            >
                              {addon.displayName}
                            </Typography>
                          </Box>
                        }
                        sx={{ margin: 0 }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Split Vertical Divider */}
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                backgroundColor: '#256111',
                alignSelf: 'stretch'
              }}
            />

            {/* Split Right Column: Tests List for Active Package */}
            <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', pl: '40px', pr: '40px', pt: '24px', pb: '24px' }}>
              <Box
                sx={{
                  flex: 1,
                }}
              >
                {activeAddon && activeAddon.tests.map((test, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2.6 }}>
                    <CheckIcon sx={{ fontSize: '24px', color: '#202020', flexShrink: 0 }} />
                    <Typography
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#000000',
                        lineHeight: '16px',
                        letterSpacing: '0px'
                      }}
                    >
                      {test}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* STICKY BOTTOM SUMMARY BAR */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E5E7EB',
          boxShadow: '0px -10px 30px rgba(0, 0, 0, 0.05)',
          padding: '16px 24px',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <ShoppingCartOutlinedIcon sx={{ color: '#006045' }} />
              <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: 700, fontSize: '16px', color: '#111827' }}>
                Your Cart Details
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: FONTS.NUNITO_SANS, fontSize: '13px', color: '#4B5563', mt: 0.5 }}>
              Basic Plan + {selectedAddons.length} optional addon packages selected
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: { xs: '100%', sm: 'auto' }, justifyContent: 'space-between' }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontFamily: FONTS.NUNITO_SANS, fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>
                Total Annual Price
              </Typography>
              <Typography sx={{ fontFamily: FONTS.SATOSHI, fontWeight: 700, fontSize: '28px', color: '#006045' }}>
                ${totalPrice}
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleProceedToCheckout}
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: '#006045',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15px',
                fontFamily: FONTS.SATOSHI,
                textTransform: 'none',
                borderRadius: '30px',
                height: '48px',
                px: 4,
                boxShadow: '0px 4px 12px rgba(0, 96, 69, 0.2)',
                '&:hover': {
                  backgroundColor: '#004d35',
                  boxShadow: '0px 6px 16px rgba(0, 96, 69, 0.3)',
                }
              }}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SelectPackages;
