import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Breadcrumbs, Link as MuiLink, CircularProgress, Button } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { apiUrl } from '../../config';
import { getBiomarkerContent, normalizeKey } from './content';
import BiomarkerTrendChart, { BiomarkerHistory } from '../../Component/BiomarkerTrend/BiomarkerTrendChart';

interface Marker {
    testName: string;
    biomarkerName?: string;
    value: string | number | null;
    unit?: string;
    refLow: number | null;
    refHigh: number | null;
    status: string;
    system: string;
}

const STATUS = {
    in_range: { label: 'In Range', color: '#027A48', bg: '#ECFDF3', dot: '#12B76A' },
    borderline: { label: 'Borderline', color: '#B54708', bg: '#FFFAEB', dot: '#F79009' },
    out_of_range: { label: 'Out of Range', color: '#B42318', bg: '#FEF3F2', dot: '#F04438' },
    critical: { label: 'Critical', color: '#B42318', bg: '#FEF3F2', dot: '#F04438' },
    unknown: { label: 'Not measured', color: '#475467', bg: '#F2F4F7', dot: '#98A2B3' },
} as const;

const statusOf = (s: string) => (STATUS as any)[s] || STATUS.unknown;

const BiomarkerDetail: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const decodedName = decodeURIComponent(name || '');

    // Trend mode: reached from Vitality Map 2 — show the two-test graph in place
    // of the single-value spectrum bar, but keep the same explanations.
    const trend = new URLSearchParams(location.search).get('trend') === '1';
    const backTarget = trend ? '/vitality-map-2' : '/vitality-map';
    const backLabel = trend ? 'Vitality Map 2' : 'Vitality Map';

    const [marker, setMarker] = useState<Marker | null>(null);
    const [history, setHistory] = useState<BiomarkerHistory | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/signin'); return; }
        const headers = { Authorization: `Bearer ${token}` };
        const target = normalizeKey(decodedName);

        // In trend mode read the latest (visit 2) values; otherwise the default report.
        const bmUrl = trend ? '/api/me/biomarkers?groupBy=system&visit=2' : '/api/me/biomarkers?groupBy=system';

        const loadMarker = fetch(apiUrl(bmUrl), { headers })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
                if (!d) return;
                for (const sys of d.systems || []) {
                    for (const b of sys.biomarkers || []) {
                        if (normalizeKey(b.testName) === target || normalizeKey(b.biomarkerName || '') === target) {
                            setMarker({ ...b, system: sys.displayName || sys.name });
                            return;
                        }
                    }
                }
            })
            .catch(() => {});

        const loadHistory = trend
            ? fetch(apiUrl(`/api/me/biomarker/history?name=${encodeURIComponent(decodedName)}`), { headers })
                .then((r) => (r.ok ? r.json() : null))
                .then((d) => { if (d) setHistory(d); })
                .catch(() => {})
            : Promise.resolve();

        Promise.all([loadMarker, loadHistory]).finally(() => setLoading(false));
    }, [decodedName, navigate, trend]);

    const title = marker?.biomarkerName || history?.biomarkerName || decodedName;
    const content = getBiomarkerContent(decodedName);
    const st = statusOf(marker?.status || 'unknown');
    // Borderline and worse are worth re-testing; in-range markers are not.
    const isFlagged = ['borderline', 'out_of_range', 'critical', 'abnormal'].includes(marker?.status || '');

    // Position of the value within (padded) reference range for the single-test bar.
    const num = marker ? (typeof marker.value === 'number' ? marker.value : parseFloat(String(marker.value))) : NaN;
    const hasBar = marker && marker.refLow != null && marker.refHigh != null && !Number.isNaN(num);
    let barLeft = 0, barWidth = 0, markerPct = 0;
    if (hasBar) {
        const lo = marker!.refLow as number, hi = marker!.refHigh as number;
        const span = (hi - lo) || 1;
        const pad = span * 0.6;
        let dMin = lo - pad, dMax = hi + pad;
        if (num < dMin) dMin = num - span * 0.15;
        if (num > dMax) dMax = num + span * 0.15;
        const pct = (x: number) => Math.max(0, Math.min(100, ((x - dMin) / (dMax - dMin)) * 100));
        barLeft = pct(lo);
        barWidth = pct(hi) - pct(lo);
        markerPct = pct(num);
    }

    const showTrend = trend && history && history.points.filter((p) => p.numericValue != null).length > 0;

    // Left-column summary copy + footnote date for the trend card.
    const articleRef = useRef<HTMLDivElement>(null);
    const scrollToArticle = () => articleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const summaryLine = content?.whatItIs || `${title} is one of the markers measured in your panel.`;
    const latestPoint = (history?.points || []).filter((p) => p.numericValue != null).slice(-1)[0];
    const latestDateLong = latestPoint
        ? (() => {
            const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(latestPoint.date);
            const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(latestPoint.date);
            return isNaN(d.getTime()) ? latestPoint.date : d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        })()
        : '';
    const refText = marker && marker.refLow != null && marker.refHigh != null
        ? (marker.refLow <= 0 ? `< ${marker.refHigh}` : marker.refHigh >= 999 ? `> ${marker.refLow}` : `${marker.refLow}-${marker.refHigh}`) + (marker.unit ? ` ${marker.unit}` : '')
        : '';

    if (loading) {
        return (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#256111' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', px: { xs: 3, md: 6 }, py: 4, textAlign: 'left' }}>
            {/* Breadcrumb */}
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" sx={{ color: '#98A2B3' }} />}
                sx={{ mb: 4, '& .MuiBreadcrumbs-li': { fontSize: '13px', fontWeight: 500 } }}
            >
                <MuiLink underline="hover" sx={{ color: '#667085', cursor: 'pointer' }} onClick={() => navigate(backTarget)}>{backLabel}</MuiLink>
                {marker?.system && <Typography sx={{ color: '#667085', fontSize: '13px', fontWeight: 500 }}>{marker.system}</Typography>}
                <Typography sx={{ color: '#256111', fontWeight: 700, fontSize: '13px' }}>{title}</Typography>
            </Breadcrumbs>

            {/* Trend card (Vitality Map 2) — two-column: summary left, graph right */}
            {showTrend ? (
                <Box sx={{ backgroundColor: '#FFFFFF', border: '1px solid #E4E7EC', borderRadius: '24px', overflow: 'hidden', mb: 5, boxShadow: '0px 1px 3px rgba(16,24,40,0.04)' }}>
                    <Box sx={{ px: { xs: 3, md: 4 }, pt: { xs: 3, md: 3.5 }, pb: 2 }}>
                        <Typography sx={{ fontSize: '30px', fontWeight: 700, color: '#1A212B', fontFamily: 'Source Sans Pro' }}>{title}</Typography>
                        {content?.aka && <Typography sx={{ fontSize: '14px', color: '#667085', mt: 0.25 }}>Also known as {content.aka}</Typography>}
                    </Box>
                    <Box sx={{ height: '1px', backgroundColor: '#EAECF0' }} />
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 4 }, p: { xs: 3, md: 4 } }}>
                        {/* Left: status + summary + footnote */}
                        <Box sx={{ flex: { md: '0 0 38%' }, display: 'flex', flexDirection: 'column', textAlign: 'left', minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: st.dot }} />
                                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: st.color }}>{st.label}</Typography>
                                </Box>
                                {refText && <Typography sx={{ fontSize: '14px', color: '#98A2B3' }}>{refText}</Typography>}
                            </Box>
                            <Typography sx={{ fontSize: '16px', color: '#344054', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {summaryLine}
                            </Typography>
                            <Box sx={{ mt: 'auto', pt: 3 }}>
                                <Typography sx={{ fontSize: '13px', color: '#98A2B3', lineHeight: 1.5 }}>
                                    This result is based on your lab test from {latestDateLong}.{' '}
                                    <MuiLink onClick={scrollToArticle} underline="always" sx={{ color: '#256111', fontWeight: 700, cursor: 'pointer' }}>View More</MuiLink>
                                </Typography>
                            </Box>
                        </Box>

                        {/* Vertical divider */}
                        <Box sx={{ width: '1px', backgroundColor: '#EAECF0', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }} />

                        {/* Right: trend graph */}
                        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
                            <BiomarkerTrendChart data={history!} />
                        </Box>
                    </Box>
                </Box>
            ) : (
                /* Status Card (Vitality Map 1) — single value + spectrum bar */
                <Box sx={{ backgroundColor: '#F7FAFD', border: '1px solid #B1C2DC', borderRadius: '24px', p: { xs: 3, md: 5 }, mb: 5 }}>
                    <Typography sx={{ fontSize: '34px', fontWeight: 700, color: '#1A212B', fontFamily: 'Source Sans Pro' }}>{title}</Typography>
                    {content?.aka && <Typography sx={{ fontSize: '15px', color: '#667085', mt: 0.5 }}>Also known as {content.aka}</Typography>}

                    {marker ? (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mt: 3 }}>
                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, backgroundColor: st.bg, color: st.color, px: 2, py: 0.75, borderRadius: '20px', fontWeight: 700, fontSize: '14px' }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: st.dot }} />
                                    {st.label}
                                </Box>
                                <Typography sx={{ fontSize: '28px', fontWeight: 700, color: '#1A212B' }}>
                                    {marker.value}{marker.unit ? ` ${marker.unit}` : ''}
                                </Typography>
                                {marker.refLow != null && marker.refHigh != null && (
                                    <Typography sx={{ fontSize: '15px', color: '#728197' }}>
                                        Reference: {marker.refLow}-{marker.refHigh}{marker.unit ? ` ${marker.unit}` : ''}
                                    </Typography>
                                )}
                            </Box>

                            {hasBar && (
                                <Box sx={{ mt: 5, mb: 1, position: 'relative' }}>
                                    <Box sx={{ position: 'relative', height: '12px', borderRadius: '6px', backgroundColor: '#EAECF0' }}>
                                        <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: `${barLeft}%`, width: `${barWidth}%`, backgroundColor: '#D1FADF', borderRadius: '6px' }} />
                                        <Box sx={{ position: 'absolute', top: '-6px', left: `${markerPct}%`, transform: 'translateX(-50%)', width: '4px', height: '24px', borderRadius: '3px', backgroundColor: st.dot, boxShadow: '0 0 0 3px #FFFFFF' }} />
                                        <Typography sx={{ position: 'absolute', top: '-30px', left: `${markerPct}%`, transform: 'translateX(-50%)', fontSize: '13px', fontWeight: 700, color: '#1A212B', whiteSpace: 'nowrap' }}>
                                            {marker.value}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ position: 'relative', height: '18px', mt: 0.5 }}>
                                        <Typography sx={{ position: 'absolute', left: `${barLeft}%`, transform: 'translateX(-50%)', fontSize: '12px', color: '#667085' }}>{marker.refLow}</Typography>
                                        <Typography sx={{ position: 'absolute', left: `${barLeft + barWidth}%`, transform: 'translateX(-50%)', fontSize: '12px', color: '#667085' }}>{marker.refHigh}</Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: '11px', color: '#98A2B3', textAlign: 'center', mt: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Healthy range shaded green</Typography>
                                </Box>
                            )}

                            {/* A flagged marker is the moment someone most wants
                                to go deeper, so offer the panels that re-test it. */}
                            {isFlagged && (
                                <Box
                                    sx={{
                                        mt: 3, borderRadius: '16px', p: '18px 20px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        gap: 2, flexWrap: 'wrap',
                                        background: 'linear-gradient(90deg, #FFFAEB 0%, #FEF3F2 100%)',
                                        border: '1px solid #FEDF89',
                                    }}
                                >
                                    <Box sx={{ flex: 1, minWidth: '240px' }}>
                                        <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#B54708', mb: 0.25 }}>
                                            Go deeper on {title}
                                        </Typography>
                                        <Typography sx={{ fontSize: '13.5px', color: '#7A4B12', lineHeight: '19px' }}>
                                            This marker came back {st.label.toLowerCase()}. Targeted panels re-test it alongside related markers at your next lab visit.
                                        </Typography>
                                    </Box>
                                    <Button
                                        onClick={() => navigate(`/select-packages?mode=addon&focus=${encodeURIComponent(marker.biomarkerName || decodedName)}`)}
                                        sx={{
                                            backgroundColor: '#006045', color: '#FFFFFF', borderRadius: '10px',
                                            textTransform: 'none', fontWeight: 700, fontSize: '14px', px: 3, py: 1,
                                            whiteSpace: 'nowrap', flexShrink: 0, '&:hover': { backgroundColor: '#004d35' },
                                        }}
                                    >
                                        See targeted panels
                                    </Button>
                                </Box>
                            )}
                        </>
                    ) : (
                        <Typography sx={{ fontSize: '16px', color: '#667085', mt: 3 }}>
                            This biomarker isn’t part of your latest report. The information below explains what it measures.
                        </Typography>
                    )}
                </Box>
            )}

            {/* Educational article */}
            {content ? (
                <Box ref={articleRef} sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '820px', scrollMarginTop: '24px' }}>
                    <Section title="What it is" body={content.whatItIs} />
                    <Section title="Why it matters" body={content.whyItMatters} />
                    {content.lowMeans && <Section title="What a low result means" body={content.lowMeans} />}
                    {content.highMeans && <Section title="What a high result means" body={content.highMeans} />}
                    {content.tips && <Section title="What you can do" body={content.tips} />}
                </Box>
            ) : (
                <Box sx={{ maxWidth: '820px' }}>
                    <Typography sx={{ fontSize: '16px', color: '#475467', lineHeight: 1.6 }}>
                        A detailed explanation for <strong>{title}</strong> is coming soon. Your value and where it falls
                        relative to the reference range are shown above.
                    </Typography>
                </Box>
            )}

            <Box sx={{ mt: 6 }}>
                <MuiLink onClick={() => navigate(backTarget)} underline="hover" sx={{ color: '#256111', fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}>
                    ← Back to {backLabel}
                </MuiLink>
            </Box>
        </Box>
    );
};

const Section: React.FC<{ title: string; body: string }> = ({ title, body }) => (
    <Box>
        <Typography sx={{ fontSize: '22px', fontWeight: 700, color: '#1A212B', mb: 1.5, fontFamily: 'Source Sans Pro' }}>{title}</Typography>
        <Typography sx={{ fontSize: '16px', color: '#475467', lineHeight: 1.65 }}>{body}</Typography>
    </Box>
);

export default BiomarkerDetail;
