import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Collapse } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { PackageInfo } from './constants';
import { apiUrl } from '../../config';

const GREEN = '#006045';
const GREEN_HOVER = '#004d35';
const FONT = 'Inter, "Source Sans Pro", sans-serif';

const BASE_PRICE = 299;
const ADDON_PRICE = 99;

// Small two-column grid of a panel's biomarkers.
const TestGrid: React.FC<{ tests: string[]; dark?: boolean }> = ({ tests, dark }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '8px 20px', mt: 1.5 }}>
    {tests.map((t, i) => (
      <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <CheckIcon sx={{ fontSize: 15, mt: '2px', color: dark ? 'rgba(255,255,255,0.9)' : GREEN, flexShrink: 0 }} />
        <Typography sx={{ fontFamily: FONT, fontSize: '13px', lineHeight: 1.35, color: dark ? 'rgba(255,255,255,0.92)' : '#344054' }}>
          {t}
        </Typography>
      </Box>
    ))}
  </Box>
);

// Pill that states the two-visit model.
const TwoVisitPill: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: '4px', borderRadius: '999px', backgroundColor: '#ECFDF3', border: '1px solid #ABEFC6' }}>
    <AutorenewRoundedIcon sx={{ fontSize: 15, color: GREEN }} />
    <Typography sx={{ fontFamily: FONT, fontSize: compact ? '11.5px' : '12.5px', fontWeight: 600, color: GREEN }}>
      2 lab visits · 6 months apart
    </Typography>
  </Box>
);

const SelectPackages: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [basicPanel, setBasicPanel] = useState<PackageInfo | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [basicOpen, setBasicOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(apiUrl('/api/packages'));
        if (response.ok) {
          const data = await response.json();
          const base = data.find((p: any) => p.type === 'base');
          const addons = data.filter((p: any) => p.type === 'addon');

          if (base) {
            setBasicPanel({
              id: base.id || 'basic-panel',
              name: base.name,
              displayName: 'Basic Panel',
              price: base.price || BASE_PRICE,
              testCount: base.testCount || (base.tests ? base.tests.length : 0),
              description: base.description || '',
              tests: base.tests || [],
            });
          }
          setPackages(
            addons.map((p: any) => ({
              id: p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              name: p.name,
              displayName: p.name,
              price: p.price || ADDON_PRICE,
              testCount: p.testCount || (p.tests ? p.tests.length : 0),
              description: p.description || '',
              tests: p.tests || [],
            })),
          );
        }
      } catch (error) {
        console.warn('Package fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Toggle selection; selecting a panel auto-reveals its contents.
  const toggleSelect = (id: string) => {
    setSelectedAddons((prev) => {
      const isSel = prev.includes(id);
      const next = isSel ? prev.filter((x) => x !== id) : [...prev, id];
      setExpanded((exp) => {
        const s = new Set(exp);
        if (isSel) s.delete(id); else s.add(id);
        return s;
      });
      return next;
    });
  };

  // Expand/collapse a card's contents without changing selection.
  const toggleExpand = (id: string) => {
    setExpanded((exp) => {
      const s = new Set(exp);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  const basePrice = basicPanel ? basicPanel.price : BASE_PRICE;
  const addonCount = selectedAddons.length;
  const totalPrice = basePrice + addonCount * ADDON_PRICE;

  const handleProceedToCheckout = () => {
    const chosen = packages.filter((p) => selectedAddons.includes(p.id));
    navigate('/payment', {
      state: {
        selectedAddons: chosen.map((a) => ({ id: a.id, name: a.name, displayName: a.displayName, price: a.price })),
        totalPrice,
        hasBasic: true,
        basicPrice: basePrice,
      },
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
        <CircularProgress sx={{ color: GREEN }} />
        <Typography sx={{ fontFamily: FONT, color: '#1A212B' }}>Loading JIVA Health panels…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '960px', margin: '0 auto', px: { xs: 2.5, md: 4 }, pt: { xs: 3, md: 5 }, pb: '140px', boxSizing: 'border-box' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: { xs: '28px', md: '34px' }, color: '#1A212B', lineHeight: 1.15, mb: 1 }}>
          Build your panel
        </Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: '15px', md: '16px' }, color: '#667085', maxWidth: '620px', mx: 'auto', lineHeight: 1.5 }}>
          Everyone starts with the Basic Panel. Add any specialized panels you'd like on top — each one includes
          both of your lab visits.
        </Typography>
        <Box sx={{ mt: 2 }}><TwoVisitPill /></Box>
      </Box>

      {/* BASIC PANEL — always in the cart */}
      <Box sx={{ borderRadius: '18px', overflow: 'hidden', backgroundColor: GREEN, color: '#FFFFFF', boxShadow: '0px 10px 28px rgba(0,96,69,0.18)', mb: 3 }}>
        <Box sx={{ p: { xs: 2.5, md: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckRoundedIcon sx={{ color: '#FFFFFF', fontSize: 22 }} />
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '18px' }}>Basic Panel</Typography>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: '2px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.18)' }}>
                    <LockRoundedIcon sx={{ fontSize: 12 }} />
                    <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '10.5px', letterSpacing: '0.04em' }}>ALWAYS INCLUDED</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontFamily: FONT, fontSize: '13.5px', color: 'rgba(255,255,255,0.85)', mt: 0.25 }}>
                  {basicPanel?.testCount || 27} essential biomarkers · both visits included
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '30px', lineHeight: 1 }}>${basePrice}</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>covers both visits</Typography>
            </Box>
          </Box>

          <Box
            onClick={() => setBasicOpen((v) => !v)}
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 2, cursor: 'pointer', userSelect: 'none' }}
          >
            <Typography sx={{ fontFamily: FONT, fontSize: '13px', fontWeight: 700, color: '#FFFFFF', textDecoration: 'underline' }}>
              {basicOpen ? 'Hide' : "See what's included"}
            </Typography>
            <KeyboardArrowDownIcon sx={{ fontSize: 18, transform: basicOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </Box>
          <Collapse in={basicOpen} timeout="auto" unmountOnExit>
            <Box sx={{ pt: 1 }}>
              <TestGrid tests={basicPanel?.tests || []} dark />
            </Box>
          </Collapse>
        </Box>
      </Box>

      {/* ADD-ONS */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Box sx={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: '#ECFDF3', border: '1px solid #ABEFC6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontFamily: FONT, fontWeight: 800, color: GREEN, fontSize: '16px', lineHeight: 1 }}>+</Typography>
        </Box>
        <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '18px', color: '#1A212B' }}>Add specialized panels</Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: '14px', color: '#98A2B3', ml: 0.5 }}>${ADDON_PRICE} each · optional</Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {packages.map((addon) => {
          const isSel = selectedAddons.includes(addon.id);
          const isOpen = expanded.has(addon.id);
          return (
            <Box
              key={addon.id}
              sx={{
                borderRadius: '14px',
                border: `1.5px solid ${isSel ? GREEN : '#E4E7EC'}`,
                backgroundColor: isSel ? '#F6FEF9' : '#FFFFFF',
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
                overflow: 'hidden',
              }}
            >
              {/* Header row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: { xs: 1.75, md: 2 } }}>
                {/* Checkbox — selects (and auto-expands) */}
                <Box
                  onClick={() => toggleSelect(addon.id)}
                  sx={{
                    width: 24, height: 24, borderRadius: '7px', flexShrink: 0, cursor: 'pointer',
                    border: `1.5px solid ${isSel ? GREEN : '#CBD5E1'}`,
                    backgroundColor: isSel ? GREEN : '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isSel && <CheckIcon sx={{ color: '#FFFFFF', fontSize: 16 }} />}
                </Box>

                {/* Name + meta — clicking previews (expands) */}
                <Box onClick={() => toggleExpand(addon.id)} sx={{ flex: 1, minWidth: 0, cursor: 'pointer', textAlign: 'left' }}>
                  <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '15.5px', color: '#1A212B' }}>{addon.displayName}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: '12.5px', color: '#667085', mt: 0.25 }}>
                    {addon.testCount} biomarkers · both visits included
                  </Typography>
                </Box>

                <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '17px', color: '#1A212B', flexShrink: 0 }}>${ADDON_PRICE}</Typography>

                <Box
                  onClick={() => toggleExpand(addon.id)}
                  sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0, p: 0.25 }}
                >
                  <KeyboardArrowDownIcon sx={{ fontSize: 22, color: '#98A2B3', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </Box>
              </Box>

              {/* Expanded content */}
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box sx={{ px: { xs: 1.75, md: 2 }, pb: 2, pt: 0 }}>
                  <Box sx={{ borderTop: '1px solid #EEF2F6', pt: 1.5 }}>
                    <TestGrid tests={addon.tests} />
                    {!isSel && (
                      <Button
                        onClick={() => toggleSelect(addon.id)}
                        sx={{
                          mt: 2, textTransform: 'none', fontFamily: FONT, fontWeight: 700, fontSize: '13.5px',
                          color: GREEN, border: `1.5px solid ${GREEN}`, borderRadius: '9px', px: 2, py: '5px',
                          '&:hover': { backgroundColor: '#F3FAF7' },
                        }}
                      >
                        + Add this panel
                      </Button>
                    )}
                  </Box>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Box>

      {/* STICKY CART SUMMARY */}
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB', boxShadow: '0px -8px 24px rgba(0,0,0,0.06)', zIndex: 100 }}>
        <Box sx={{ maxWidth: '960px', mx: 'auto', px: { xs: 2.5, md: 4 }, py: 1.75, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '14.5px', color: '#1A212B' }}>
              Basic Panel{addonCount > 0 ? ` + ${addonCount} panel${addonCount === 1 ? '' : 's'}` : ''}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
              <AutorenewRoundedIcon sx={{ fontSize: 14, color: GREEN }} />
              <Typography sx={{ fontFamily: FONT, fontSize: '12px', color: '#667085' }}>
                2 lab visits (baseline + 6-month retest) included for every panel
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 } }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontFamily: FONT, fontSize: '11px', color: '#98A2B3', fontWeight: 700, letterSpacing: '0.05em' }}>TOTAL</Typography>
              <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '26px', color: GREEN, lineHeight: 1 }}>${totalPrice}</Typography>
            </Box>
            <Button
              onClick={handleProceedToCheckout}
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: GREEN, color: '#FFFFFF', fontWeight: 700, fontSize: '15px', fontFamily: FONT,
                textTransform: 'none', borderRadius: '999px', height: '46px', px: 3.5,
                boxShadow: '0px 4px 12px rgba(0,96,69,0.22)',
                '&:hover': { backgroundColor: GREEN_HOVER },
              }}
            >
              Checkout
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SelectPackages;
