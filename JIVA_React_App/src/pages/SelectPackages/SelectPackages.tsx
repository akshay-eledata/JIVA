import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Collapse } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import MaleRoundedIcon from '@mui/icons-material/MaleRounded';
import FemaleRoundedIcon from '@mui/icons-material/FemaleRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import SelfImprovementRoundedIcon from '@mui/icons-material/SelfImprovementRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import { PackageInfo } from './constants';
import { apiUrl } from '../../config';
import DemoSkip from '../../Component/DemoSkip/DemoSkip';
import { nextStepAfter } from '../../onboarding/steps';

const NEXT = nextStepAfter('/select-packages');

const GREEN = '#006045';
const GREEN_HOVER = '#004d35';
const FONT = 'Inter, "Source Sans Pro", sans-serif';
const BASE_PRICE = 299;
const ADDON_PRICE = 99;

// Per-panel accent + icon, matched by name.
type Cat = { icon: React.ElementType; color: string; bg: string };
const CATS: { match: string; cat: Cat }[] = [
  { match: 'heart', cat: { icon: FavoriteRoundedIcon, color: '#E5484D', bg: '#FEEFEF' } },
  // 'female' must be checked before 'male' — "female health" contains "male".
  { match: 'female', cat: { icon: FemaleRoundedIcon, color: '#D6409F', bg: '#FCEDF6' } },
  { match: 'male', cat: { icon: MaleRoundedIcon, color: '#2E7CF6', bg: '#EDF3FF' } },
  { match: 'thyroid', cat: { icon: MonitorHeartRoundedIcon, color: '#0E9384', bg: '#E9FBF6' } },
  { match: 'nutrition', cat: { icon: RestaurantRoundedIcon, color: '#E8850A', bg: '#FFF5E8' } },
  { match: 'stress', cat: { icon: SelfImprovementRoundedIcon, color: '#7A5AF8', bg: '#F3F0FE' } },
  { match: 'inflammation', cat: { icon: ShieldRoundedIcon, color: '#CA8504', bg: '#FEF6E4' } },
  { match: 'cognitive', cat: { icon: PsychologyRoundedIcon, color: '#4E5BA6', bg: '#EEF0FA' } },
  { match: 'digestive', cat: { icon: ScienceRoundedIcon, color: '#3E9B4F', bg: '#ECF8EE' } },
];
const catFor = (name: string): Cat =>
  (CATS.find((c) => name.toLowerCase().includes(c.match)) || { cat: { icon: ScienceRoundedIcon, color: GREEN, bg: '#EFFAF4' } }).cat;

const TwoVisitPill: React.FC = () => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.5, py: '5px', borderRadius: '999px', backgroundColor: '#ECFDF3', border: '1px solid #ABEFC6' }}>
    <AutorenewRoundedIcon sx={{ fontSize: 16, color: GREEN }} />
    <Typography sx={{ fontFamily: FONT, fontSize: '13px', fontWeight: 600, color: GREEN }}>2 lab visits · 6 months apart</Typography>
  </Box>
);

/** Per-panel targeting info from /api/me/recommended-panels. */
interface PanelMatch {
  matchCount: number;
  matchedBiomarkers: string[];
  coversFocus: boolean;
}

interface Targeting {
  flaggedCount: number;
  flaggedSystems: { name: string; count: number }[];
  focusMatched: boolean;
  byPanelId: Record<string, PanelMatch>;
}

const joinNames = (arr: string[]) =>
  arr.length <= 1 ? arr[0] || '' : `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}`;

const SelectPackages: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Add-on mode is reached from inside the app, after the basic panel is
  // already bought. It targets panels at whatever is currently flagged rather
  // than rebuilding the whole panel from scratch.
  const isAddonMode = searchParams.get('mode') === 'addon';
  const focusMarker = searchParams.get('focus') || '';

  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [basicPanel, setBasicPanel] = useState<PackageInfo | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [targeting, setTargeting] = useState<Targeting | null>(null);

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
              id: base.id || 'basic-panel', name: base.name, displayName: 'Basic Panel',
              price: base.price || BASE_PRICE, testCount: base.testCount || (base.tests ? base.tests.length : 0),
              description: base.description || '', tests: base.tests || [],
            });
          }
          setPackages(addons.map((p: any) => ({
            id: p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: p.name, displayName: p.name,
            price: p.price || ADDON_PRICE, testCount: p.testCount || (p.tests ? p.tests.length : 0),
            description: p.description || '', tests: p.tests || [],
          })));
        }
      } catch (error) {
        console.warn('Package fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Which panels actually cover the patient's flagged markers. Only needed in
  // add-on mode; during onboarding there are no results to target yet.
  useEffect(() => {
    if (!isAddonMode) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    const qs = focusMarker ? `?biomarker=${encodeURIComponent(focusMarker)}` : '';
    fetch(apiUrl(`/api/me/recommended-panels${qs}`), { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        const byPanelId: Record<string, PanelMatch> = {};
        for (const p of d.panels || []) {
          byPanelId[p.id] = {
            matchCount: p.matchCount,
            matchedBiomarkers: p.matchedBiomarkers || [],
            coversFocus: p.coversFocus,
          };
        }
        setTargeting({
          flaggedCount: d.flaggedCount || 0,
          flaggedSystems: d.flaggedSystems || [],
          focusMatched: Boolean(d.focusMatched),
          byPanelId,
        });
      })
      .catch(() => { /* Targeting is an enhancement; the plain list still works. */ });
  }, [isAddonMode, focusMarker]);

  const toggleSelect = (id: string) => {
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpanded((exp) => { const s = new Set(exp); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const basePrice = basicPanel ? basicPanel.price : BASE_PRICE;
  const addonCount = selectedAddons.length;
  // In add-on mode the basic panel is already paid for, so only the new panels
  // are charged.
  const totalPrice = (isAddonMode ? 0 : basePrice) + addonCount * ADDON_PRICE;

  // Best-targeted panels first, so the most relevant add-ons are seen first.
  const orderedPackages = React.useMemo(() => {
    if (!targeting) return packages;
    return [...packages].sort((a, b) => {
      const ma = targeting.byPanelId[a.id];
      const mb = targeting.byPanelId[b.id];
      return (
        (mb?.coversFocus ? 1 : 0) - (ma?.coversFocus ? 1 : 0) ||
        (mb?.matchCount || 0) - (ma?.matchCount || 0)
      );
    });
  }, [packages, targeting]);

  const handleProceedToCheckout = () => {
    const chosen = packages.filter((p) => selectedAddons.includes(p.id));
    navigate('/payment', {
      state: {
        selectedAddons: chosen.map((a) => ({ id: a.id, name: a.name, displayName: a.displayName, price: a.price })),
        totalPrice,
        hasBasic: !isAddonMode,
        basicPrice: isAddonMode ? 0 : basePrice,
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
    <>
    <Box sx={{ width: '100%', maxWidth: '1080px', margin: '0 auto', px: { xs: 2.5, md: 4 }, pt: { xs: 3, md: 5 }, pb: '150px', boxSizing: 'border-box' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3.5 }}>
        <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: { xs: '30px', md: '38px' }, color: '#1A212B', lineHeight: 1.12, mb: 1, letterSpacing: '-0.02em' }}>
          {isAddonMode ? 'Add panels to your next test' : 'Build your panel'}
        </Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: { xs: '15px', md: '16.5px' }, color: '#667085', maxWidth: '640px', mx: 'auto', lineHeight: 1.5 }}>
          {isAddonMode
            ? 'These panels go deeper on the markers flagged in your results. Anything you add is drawn at your next lab visit.'
            : "Everyone starts with the Basic Panel. Layer on any specialized panels you'd like. Every panel includes both of your lab visits."}
        </Typography>
        {!isAddonMode && <Box sx={{ mt: 2 }}><TwoVisitPill /></Box>}
      </Box>

      {/* Add-on mode: what we are targeting and why. */}
      {isAddonMode && targeting && targeting.flaggedCount > 0 && (
        <Box sx={{ mb: 4, borderRadius: '18px', p: { xs: 2.25, md: '22px 26px' }, background: 'linear-gradient(90deg, #FFFAEB 0%, #FEF3F2 100%)', border: '1px solid #FEDF89', textAlign: 'left' }}>
          <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '17px', color: '#B54708', mb: 0.5 }}>
            {focusMarker && targeting.focusMatched
              ? `Panels covering ${focusMarker}`
              : `${targeting.flaggedCount} of your biomarkers need a closer look`}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: '14px', color: '#7A4B12', lineHeight: 1.5 }}>
            {focusMarker && targeting.focusMatched
              ? `The panels listed first re-test ${focusMarker} along with related markers. Everything else you have flagged is covered by the panels below.`
              : targeting.flaggedSystems.length > 0
                ? `Most of the flagged markers sit in your ${joinNames(targeting.flaggedSystems.slice(0, 3).map((s) => s.name))} ${targeting.flaggedSystems.length === 1 ? 'system' : 'systems'}. The panels marked below test those areas in more depth.`
                : 'The panels marked below test the flagged areas in more depth.'}
          </Typography>
        </Box>
      )}

      {/* BASIC PANEL — hero with tests always visible. Hidden in add-on mode:
          it is already paid for and is not being bought again. */}
      {!isAddonMode && (
      <Box
        sx={{
          position: 'relative', borderRadius: '24px', overflow: 'hidden', mb: 4, color: '#FFFFFF',
          background: 'linear-gradient(135deg, #00553E 0%, #007A58 100%)',
          boxShadow: '0px 18px 40px rgba(0,96,69,0.22)',
        }}
      >
        {/* soft highlight */}
        <Box sx={{ position: 'absolute', top: -80, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'relative', p: { xs: 3, md: 4 } }}>
          {/* Top row */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2.5 }}>
            <Box sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: '3px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.18)' }}>
                  <LockRoundedIcon sx={{ fontSize: 12 }} />
                  <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '10.5px', letterSpacing: '0.05em' }}>ALWAYS INCLUDED</Typography>
                </Box>
              </Box>
              <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '26px', lineHeight: 1.1 }}>Basic Panel</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: '14px', color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>
                {basicPanel?.testCount || 27} essential biomarkers, the foundation of your health picture
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '40px', lineHeight: 1 }}>${basePrice}</Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, mt: 0.5, px: 1, py: '3px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.14)' }}>
                <AutorenewRoundedIcon sx={{ fontSize: 13 }} />
                <Typography sx={{ fontFamily: FONT, fontSize: '11.5px', fontWeight: 600 }}>covers both visits</Typography>
              </Box>
            </Box>
          </Box>

          {/* Tests — always visible on a translucent panel */}
          <Box sx={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '16px', p: { xs: 2, md: 2.5 } }}>
            <Typography sx={{ fontFamily: FONT, fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.75)', mb: 1.5 }}>
              WHAT'S INCLUDED
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: '9px 22px' }}>
              {(basicPanel?.tests || []).map((t, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <CheckRoundedIcon sx={{ fontSize: 15, mt: '2px', color: '#8FE8C4', flexShrink: 0 }} />
                  <Typography sx={{ fontFamily: FONT, fontSize: '13px', lineHeight: 1.35, color: 'rgba(255,255,255,0.94)' }}>{t}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      )}

      {/* ADD-ONS header */}
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '20px', color: '#1A212B', letterSpacing: '-0.01em' }}>
          {isAddonMode ? 'Available panels' : 'Add specialized panels'}
        </Typography>
        <Typography sx={{ fontFamily: FONT, fontSize: '14px', color: '#98A2B3' }}>
          {isAddonMode ? '$99 each · added to your next lab visit' : '$99 each · optional · each includes both visits'}
        </Typography>
      </Box>

      {/* ADD-ON card grid. alignItems 'start' keeps each card at its natural
          height — otherwise expanding one card stretches its row neighbor. */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, alignItems: 'start' }}>
        {orderedPackages.map((addon) => {
          const isSel = selectedAddons.includes(addon.id);
          const isOpen = expanded.has(addon.id);
          const match = targeting?.byPanelId[addon.id];
          const isRecommended = Boolean(match && match.matchCount > 0);
          const cat = catFor(addon.name);
          const Icon = cat.icon;
          const preview = addon.tests.slice(0, 3);
          const moreCount = Math.max(0, addon.tests.length - preview.length);
          return (
            <Box
              key={addon.id}
              onClick={() => toggleSelect(addon.id)}
              sx={{
                position: 'relative', cursor: 'pointer', borderRadius: '18px', p: { xs: 2, md: 2.25 },
                backgroundColor: isSel ? '#F6FEF9' : isRecommended ? '#FFFCF5' : '#FFFFFF',
                border: `1.5px solid ${isSel ? GREEN : isRecommended ? '#FEC84B' : '#E7EAEE'}`,
                boxShadow: isSel ? '0px 8px 24px rgba(0,96,69,0.12)' : '0px 2px 10px rgba(16,24,40,0.04)',
                transition: 'all 0.18s ease',
                '&:hover': { boxShadow: '0px 10px 26px rgba(16,24,40,0.10)', transform: 'translateY(-2px)', borderColor: isSel ? GREEN : '#D0D5DD' },
              }}
            >
              {/* selected check badge */}
              {isSel && (
                <CheckCircleRoundedIcon sx={{ position: 'absolute', top: 12, right: 12, fontSize: 22, color: GREEN, backgroundColor: '#FFFFFF', borderRadius: '50%' }} />
              )}

              {/* Why this panel is recommended: the flagged markers it covers. */}
              {isRecommended && (
                <Box sx={{ mb: 1.25, pr: isSel ? 3 : 0, textAlign: 'left' }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1, py: '3px', borderRadius: '999px', backgroundColor: '#FEF0C7', border: '1px solid #FEC84B', mb: 0.5 }}>
                    <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '10.5px', letterSpacing: '0.04em', color: '#B54708' }}>
                      {match!.coversFocus ? 'COVERS THIS MARKER' : 'RECOMMENDED FOR YOU'}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: '12px', color: '#7A4B12', lineHeight: 1.4 }}>
                    Re-tests {match!.matchCount} of your flagged marker{match!.matchCount === 1 ? '' : 's'}
                    {match!.matchedBiomarkers.length > 0 ? `: ${match!.matchedBiomarkers.join(', ')}` : ''}
                  </Typography>
                </Box>
              )}

              {/* Top: icon + name + price */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, pr: isSel ? 3 : 0 }}>
                <Box sx={{ width: 42, height: 42, borderRadius: '12px', backgroundColor: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon sx={{ fontSize: 22, color: cat.color }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '15.5px', color: '#1A212B', lineHeight: 1.2 }}>{addon.displayName}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: '12.5px', color: '#667085', mt: 0.25 }}>{addon.testCount} biomarkers · both visits</Typography>
                </Box>
                {!isSel && <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '18px', color: '#1A212B', flexShrink: 0 }}>${ADDON_PRICE}</Typography>}
              </Box>

              {/* Preview chips */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1 }}>
                {preview.map((t, i) => (
                  <Box key={i} sx={{ px: 1, py: '3px', borderRadius: '7px', backgroundColor: isSel ? '#FFFFFF' : '#F2F4F7', border: '1px solid #EAECF0' }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: '11.5px', fontWeight: 500, color: '#475467', whiteSpace: 'nowrap' }}>{t}</Typography>
                  </Box>
                ))}
                {moreCount > 0 && !isOpen && (
                  <Box onClick={(e) => toggleExpand(addon.id, e)} sx={{ px: 1, py: '3px', borderRadius: '7px', backgroundColor: 'transparent', border: `1px solid ${cat.color}`, cursor: 'pointer' }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: '11.5px', fontWeight: 700, color: cat.color, whiteSpace: 'nowrap' }}>+{moreCount} more</Typography>
                  </Box>
                )}
              </Box>

              {/* Expanded full list */}
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box sx={{ borderTop: '1px solid #EEF2F6', mt: 1, pt: 1.25, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: '6px 16px' }}>
                  {addon.tests.map((t, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                      <CheckIcon sx={{ fontSize: 14, mt: '2px', color: cat.color, flexShrink: 0 }} />
                      <Typography sx={{ fontFamily: FONT, fontSize: '12.5px', lineHeight: 1.3, color: '#344054' }}>{t}</Typography>
                    </Box>
                  ))}
                </Box>
              </Collapse>

              {/* Footer: view all + selected state */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                <Box onClick={(e) => toggleExpand(addon.id, e)} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, cursor: 'pointer' }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: '12.5px', fontWeight: 700, color: '#667085' }}>{isOpen ? 'Show less' : 'View all tests'}</Typography>
                  <KeyboardArrowDownIcon sx={{ fontSize: 17, color: '#98A2B3', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </Box>
                <Typography sx={{ fontFamily: FONT, fontSize: '12.5px', fontWeight: 700, color: isSel ? GREEN : '#98A2B3' }}>
                  {isSel ? 'Added ✓' : 'Tap to add'}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* STICKY CART SUMMARY */}
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB', boxShadow: '0px -8px 24px rgba(0,0,0,0.06)', zIndex: 100 }}>
        <Box sx={{ maxWidth: '1080px', mx: 'auto', px: { xs: 2.5, md: 4 }, py: 1.75, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ textAlign: 'left' }}>
            <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '15px', color: '#1A212B' }}>
              {isAddonMode
                ? (addonCount > 0 ? `${addonCount} panel${addonCount === 1 ? '' : 's'} added` : 'No panels added yet')
                : `Basic Panel${addonCount > 0 ? ` + ${addonCount} panel${addonCount === 1 ? '' : 's'}` : ''}`}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
              <AutorenewRoundedIcon sx={{ fontSize: 14, color: GREEN }} />
              <Typography sx={{ fontFamily: FONT, fontSize: '12px', color: '#667085' }}>
                {isAddonMode
                  ? 'Drawn at your next lab visit'
                  : '2 lab visits (baseline + 6-month retest) included for every panel'}
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
              disabled={isAddonMode && addonCount === 0}
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: GREEN, color: '#FFFFFF', fontWeight: 700, fontSize: '15px', fontFamily: FONT,
                textTransform: 'none', borderRadius: '999px', height: '46px', px: 3.5,
                boxShadow: '0px 4px 12px rgba(0,96,69,0.22)', '&:hover': { backgroundColor: GREEN_HOVER },
              }}
            >
              {isAddonMode ? 'Add to my next test' : 'Checkout'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>

    {/* Sits above the sticky checkout bar. Onboarding only: add-on mode is
        entered from inside the app and has its own way back. */}
    {!isAddonMode && <DemoSkip to={NEXT} label="Skip panel selection" bottomOffset="112px" />}
    </>
  );
};

export default SelectPackages;
