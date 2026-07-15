import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Breadcrumbs, Link as MuiLink, CircularProgress } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { apiUrl } from '../../config';
import { getBiomarkerContent, normalizeKey } from './content';

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
    const decodedName = decodeURIComponent(name || '');

    const [marker, setMarker] = useState<Marker | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(apiUrl('/api/me/biomarkers?groupBy=system'), { credentials: 'include' })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
                if (!d) return;
                const target = normalizeKey(decodedName);
                for (const sys of d.systems || []) {
                    for (const b of sys.biomarkers || []) {
                        if (normalizeKey(b.testName) === target || normalizeKey(b.biomarkerName || '') === target) {
                            setMarker({ ...b, system: sys.displayName || sys.name });
                            return;
                        }
                    }
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [decodedName, navigate]);

    const title = marker?.biomarkerName || decodedName;
    const content = getBiomarkerContent(decodedName);
    const st = statusOf(marker?.status || 'unknown');

    // Position of the value within (padded) reference range for the bar.
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
                <MuiLink underline="hover" sx={{ color: '#667085', cursor: 'pointer' }} onClick={() => navigate('/vitality-map')}>Vitality Map</MuiLink>
                {marker?.system && <Typography sx={{ color: '#667085', fontSize: '13px', fontWeight: 500 }}>{marker.system}</Typography>}
                <Typography sx={{ color: '#256111', fontWeight: 700, fontSize: '13px' }}>{title}</Typography>
            </Breadcrumbs>

            {/* Status Card */}
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
                                    Reference: {marker.refLow}–{marker.refHigh}{marker.unit ? ` ${marker.unit}` : ''}
                                </Typography>
                            )}
                        </Box>

                        {/* Range position bar */}
                        {hasBar && (
                            <Box sx={{ mt: 5, mb: 1, position: 'relative' }}>
                                <Box sx={{ position: 'relative', height: '12px', borderRadius: '6px', backgroundColor: '#EAECF0' }}>
                                    {/* in-range band */}
                                    <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: `${barLeft}%`, width: `${barWidth}%`, backgroundColor: '#D1FADF', borderRadius: '6px' }} />
                                    {/* marker */}
                                    <Box sx={{ position: 'absolute', top: '-6px', left: `${markerPct}%`, transform: 'translateX(-50%)', width: '4px', height: '24px', borderRadius: '3px', backgroundColor: st.dot, boxShadow: '0 0 0 3px #FFFFFF' }} />
                                    {/* value label */}
                                    <Typography sx={{ position: 'absolute', top: '-30px', left: `${markerPct}%`, transform: 'translateX(-50%)', fontSize: '13px', fontWeight: 700, color: '#1A212B', whiteSpace: 'nowrap' }}>
                                        {marker.value}
                                    </Typography>
                                </Box>
                                {/* range endpoints */}
                                <Box sx={{ position: 'relative', height: '18px', mt: 0.5 }}>
                                    <Typography sx={{ position: 'absolute', left: `${barLeft}%`, transform: 'translateX(-50%)', fontSize: '12px', color: '#667085' }}>{marker.refLow}</Typography>
                                    <Typography sx={{ position: 'absolute', left: `${barLeft + barWidth}%`, transform: 'translateX(-50%)', fontSize: '12px', color: '#667085' }}>{marker.refHigh}</Typography>
                                </Box>
                                <Typography sx={{ fontSize: '11px', color: '#98A2B3', textAlign: 'center', mt: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Healthy range shaded green</Typography>
                            </Box>
                        )}
                    </>
                ) : (
                    <Typography sx={{ fontSize: '16px', color: '#667085', mt: 3 }}>
                        This biomarker isn’t part of your latest report. The information below explains what it measures.
                    </Typography>
                )}
            </Box>

            {/* Educational article */}
            {content ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '820px' }}>
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
                <MuiLink onClick={() => navigate('/vitality-map')} underline="hover" sx={{ color: '#256111', fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}>
                    ← Back to Vitality Map
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
