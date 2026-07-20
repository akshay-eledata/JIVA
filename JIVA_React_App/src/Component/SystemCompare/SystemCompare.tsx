import React, { useState } from 'react';
import { Box, Typography, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/* ── Types mirror the /api/me/compare payload ─────────────────────────────── */
interface BmDelta {
    testName: string;
    biomarkerName: string;
    unit: string | null;
    from: { value: string; numericValue: number | null; status: string } | null;
    to: { value: string; numericValue: number | null; status: string };
    numericDelta: number | null;
    statusChange: 'improved' | 'worsened' | 'same';
    enteredRange: boolean;
    leftRange: boolean;
}
interface SystemDelta {
    name: string;
    displayName: string;
    summary: string;
    from: { spectrumP: number; counts: any } | null;
    to: { spectrumP: number; counts: any };
    deltaSpectrum: number;
    improvedCount: number;
    worsenedCount: number;
    biomarkers: BmDelta[];
}
export interface ComparePayload {
    from: { visit: number; dateProcessed: string; biologicalAge: number; counts: any };
    to: { visit: number; dateProcessed: string; biologicalAge: number; counts: any };
    headline: { improved: number; worsened: number; enteredRange: number; leftRange: number };
    systemDeltas: SystemDelta[];
}

const SHORT_SYSTEM_LABELS: Record<string, string> = {
    'Immune/Inflammatory': 'Immunity',
    'Hormonal/Reproductive': 'Hormonal',
};

const STATUS_LABEL: Record<string, string> = {
    in_range: 'In range', borderline: 'Borderline', out_of_range: 'Out of range',
    critical: 'Critical', unknown: 'Unknown',
};
const STATUS_TEXT: Record<string, string> = {
    in_range: '#006045', borderline: '#B7791F', out_of_range: '#D92D20', critical: '#B42318', unknown: '#667085',
};
const STATUS_BG: Record<string, string> = {
    in_range: '#E7F7F0', borderline: '#FCF3E3', out_of_range: '#FEECEA', critical: '#FEE4E2', unknown: '#F2F4F7',
};

const GREEN = '#54AD88';
const RED = '#EF5C5C';

const fmtDate = (s: string) => {
    if (!s) return '';
    // Parse the YYYY-MM-DD date-only string as local (avoid the UTC shift that
    // would roll e.g. 2026-03-01 back to Feb in a timezone behind UTC).
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
    const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
};

// Verdict for a system based on how many of its markers moved each way.
// "Mixed" is the important case the dumbbell hid: some markers improved AND
// some declined, so net position barely moves.
const verdictOf = (imp: number, dec: number) => {
    if (imp > 0 && dec > 0) return { label: 'Mixed', color: '#B54708', bg: '#FEF0C7', icon: '↕' };
    if (imp > 0) return { label: 'Improved', color: '#027A48', bg: '#E7F7F0', icon: '↑' };
    if (dec > 0) return { label: 'Declined', color: '#D92D20', bg: '#FEECEA', icon: '↓' };
    return { label: 'No change', color: '#667085', bg: '#F2F4F7', icon: '' };
};

const StatusChip: React.FC<{ status: string }> = ({ status }) => (
    <Box sx={{
        display: 'inline-flex', alignItems: 'center', px: 1, py: '2px', borderRadius: '6px',
        backgroundColor: STATUS_BG[status] || '#F2F4F7',
    }}>
        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: STATUS_TEXT[status] || '#667085', whiteSpace: 'nowrap' }}>
            {STATUS_LABEL[status] || status}
        </Typography>
    </Box>
);

/* One system row: a diverging bar. Declines grow LEFT (red), improvements grow
   RIGHT (green) from a shared center — so improve vs decline vs mixed are each
   visually distinct, and a churning system shows both arms at once. */
const SystemRow: React.FC<{ s: SystemDelta; maxMove: number; open: boolean; onToggle: () => void; onSelectBiomarker?: (t: string) => void }> = ({ s, maxMove, open, onToggle, onSelectBiomarker }) => {
    const imp = s.improvedCount;
    const dec = s.worsenedCount;
    const v = verdictOf(imp, dec);
    // Arm length as a % of each half; floored so a single marker is still visible.
    const impW = imp > 0 ? Math.max(16, (imp / maxMove) * 100) : 0;
    const decW = dec > 0 ? Math.max(16, (dec / maxMove) * 100) : 0;

    const outFrom = s.from ? s.from.counts.outOfRange : null;
    const outTo = s.to.counts.outOfRange;

    // Expanded list: worsened first, then improved, then unchanged.
    const changed = [...s.biomarkers].sort((a, b) => {
        const rank = (x: BmDelta) => (x.statusChange === 'worsened' ? 0 : x.statusChange === 'improved' ? 1 : 2);
        return rank(a) - rank(b);
    });

    const armLabel = (n: number, color: string) => (
        <Typography sx={{ fontSize: '13px', fontWeight: 800, color, flexShrink: 0 }}>{n}</Typography>
    );

    return (
        <Box sx={{ borderBottom: '1px solid #EEF2F6' }}>
            <Box
                onClick={onToggle}
                sx={{
                    display: 'flex', alignItems: 'center', gap: 2, py: 2, px: 1, cursor: 'pointer',
                    borderRadius: '12px', transition: 'background-color 0.15s ease',
                    '&:hover': { backgroundColor: '#F8FAFC' },
                }}
            >
                {/* System name + net count transition */}
                <Box sx={{ width: '160px', flexShrink: 0, textAlign: 'left' }}>
                    <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#1A212B', fontFamily: 'Source Sans Pro', lineHeight: 1.2 }}>
                        {SHORT_SYSTEM_LABELS[s.name] || s.displayName || s.name}
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#667085', mt: 0.25 }}>
                        {outFrom != null ? `${outFrom} to ${outTo} out of range` : `${outTo} out of range`}
                    </Typography>
                </Box>

                {/* Diverging bar: declined (left/red) | improved (right/green) */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', height: '40px' }}>
                    {/* Declined half — bar grows toward the left */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, pr: 1.25 }}>
                        {dec > 0 ? (
                            <>
                                {armLabel(dec, '#D92D20')}
                                <Box sx={{ width: `${decW}%`, height: '16px', borderRadius: '8px', background: `linear-gradient(90deg, ${RED} 0%, #F79892 100%)` }} />
                            </>
                        ) : (
                            <Typography sx={{ fontSize: '12px', color: '#CBD5E1' }}>0</Typography>
                        )}
                    </Box>
                    {/* Center axis */}
                    <Box sx={{ width: '2px', height: '28px', backgroundColor: '#D0D5DD', borderRadius: '1px', flexShrink: 0 }} />
                    {/* Improved half — bar grows toward the right */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1, pl: 1.25 }}>
                        {imp > 0 ? (
                            <>
                                <Box sx={{ width: `${impW}%`, height: '16px', borderRadius: '8px', background: `linear-gradient(90deg, #8FD9BC 0%, ${GREEN} 100%)` }} />
                                {armLabel(imp, '#027A48')}
                            </>
                        ) : (
                            <Typography sx={{ fontSize: '12px', color: '#CBD5E1' }}>0</Typography>
                        )}
                    </Box>
                </Box>

                {/* Verdict pill + expander */}
                <Box sx={{ width: '150px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.25, py: '5px', borderRadius: '8px', backgroundColor: v.bg }}>
                        {v.icon && <Box component="span" sx={{ fontSize: '13px', fontWeight: 800, color: v.color, lineHeight: 1 }}>{v.icon}</Box>}
                        <Typography sx={{ fontSize: '12px', fontWeight: 700, color: v.color, whiteSpace: 'nowrap' }}>{v.label}</Typography>
                    </Box>
                    <KeyboardArrowDownIcon sx={{ color: '#98A2B3', fontSize: 20, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </Box>
            </Box>

            {/* Expanded per-biomarker before → after */}
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ pb: 2.5, px: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                        {dec > 0 && <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#D92D20' }}>↓ {dec} declined</Typography>}
                        {imp > 0 && <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#027A48' }}>↑ {imp} improved</Typography>}
                        {imp === 0 && dec === 0 && <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#667085' }}>No status changes</Typography>}
                    </Box>
                    {s.summary && (
                        <Typography sx={{ fontSize: '13px', color: '#475467', lineHeight: '20px', mb: 2, textAlign: 'left', backgroundColor: '#F8FAFC', p: 1.5, borderRadius: '10px' }}>
                            {s.summary}
                        </Typography>
                    )}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 1.5 }}>
                        {changed.map((b) => {
                            const up = b.numericDelta != null && b.numericDelta > 0;
                            const down = b.numericDelta != null && b.numericDelta < 0;
                            const rowAccent = b.statusChange === 'improved' ? GREEN : b.statusChange === 'worsened' ? RED : '#E2E8F0';
                            return (
                                <Box
                                    key={b.testName}
                                    onClick={onSelectBiomarker ? () => onSelectBiomarker(b.testName) : undefined}
                                    sx={{
                                        display: 'flex', gap: 1.5, alignItems: 'flex-start', p: 1.25, borderRadius: '10px',
                                        border: '1px solid #EEF2F6', backgroundColor: '#FFFFFF',
                                        cursor: onSelectBiomarker ? 'pointer' : 'default',
                                        transition: 'box-shadow 0.15s ease, transform 0.15s ease',
                                        '&:hover': onSelectBiomarker ? { boxShadow: '0 4px 12px rgba(16,24,40,0.08)', transform: 'translateY(-1px)' } : {},
                                    }}
                                >
                                    <Box sx={{ width: '3px', alignSelf: 'stretch', borderRadius: '2px', backgroundColor: rowAccent, flexShrink: 0 }} />
                                    <Box sx={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
                                        <Typography sx={{ fontSize: '13.5px', fontWeight: 700, color: '#1A212B', lineHeight: 1.2, mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {b.biomarkerName || b.testName}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                                            <Typography sx={{ fontSize: '13px', color: '#98A2B3', fontWeight: 600 }}>
                                                {b.from ? b.from.value : '—'}
                                            </Typography>
                                            <ArrowForwardIcon sx={{ fontSize: 13, color: up ? '#D92D20' : down ? '#006045' : '#98A2B3' }} />
                                            <Typography sx={{ fontSize: '13px', color: '#1A212B', fontWeight: 800 }}>
                                                {b.to.value}{b.unit ? ` ${b.unit}` : ''}
                                            </Typography>
                                            {b.enteredRange && (
                                                <Box sx={{ display: 'inline-flex', px: 0.75, py: '1px', borderRadius: '5px', backgroundColor: '#E7F7F0' }}>
                                                    <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#006045' }}>NOW IN RANGE</Typography>
                                                </Box>
                                            )}
                                            {b.leftRange && (
                                                <Box sx={{ display: 'inline-flex', px: 0.75, py: '1px', borderRadius: '5px', backgroundColor: '#FEECEA' }}>
                                                    <Typography sx={{ fontSize: '10px', fontWeight: 800, color: '#D92D20' }}>NOW OUT OF RANGE</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.75, mt: 0.75 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                                <StatusChip status={b.from ? b.from.status : b.to.status} />
                                                <ArrowForwardIcon sx={{ fontSize: 12, color: '#98A2B3' }} />
                                                <StatusChip status={b.to.status} />
                                            </Box>
                                            {onSelectBiomarker && (
                                                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#256111', whiteSpace: 'nowrap' }}>View trend ›</Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Collapse>
        </Box>
    );
};

// Group order: declined first, then mixed, then improved, then unchanged;
// within a group, the biggest movers first.
const groupRank = (s: SystemDelta) => {
    if (s.worsenedCount > 0 && s.improvedCount > 0) return 1; // mixed
    if (s.worsenedCount > 0) return 0;                        // declined
    if (s.improvedCount > 0) return 2;                        // improved
    return 3;                                                 // no change
};

const SystemCompare: React.FC<{ compare: ComparePayload | null; onSelectBiomarker?: (t: string) => void }> = ({ compare, onSelectBiomarker }) => {
    const [openSystem, setOpenSystem] = useState<string | null>(null);

    if (!compare) {
        return (
            <Box sx={{ mt: 3, p: 4, textAlign: 'center', color: '#98A2B3' }}>
                <Typography sx={{ fontSize: '15px' }}>Comparison data is not available yet.</Typography>
            </Box>
        );
    }

    const systems = [...compare.systemDeltas].sort((a, b) => {
        const r = groupRank(a) - groupRank(b);
        if (r !== 0) return r;
        return Math.max(b.improvedCount, b.worsenedCount) - Math.max(a.improvedCount, a.worsenedCount);
    });
    const maxMove = Math.max(1, ...compare.systemDeltas.map((s) => Math.max(s.improvedCount, s.worsenedCount)));

    return (
        <Box sx={{ mt: 3, width: '100%' }}>
            {/* Caption + legend */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 1, px: 1 }}>
                <Typography sx={{ fontSize: '13px', color: '#667085' }}>
                    How each system's biomarkers moved from your first test ({fmtDate(compare.from.dateProcessed)}) to your retest ({fmtDate(compare.to.dateProcessed)}).
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '3px', backgroundColor: RED }} />
                        <Typography sx={{ fontSize: '12px', color: '#667085', fontWeight: 600 }}>Declined</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '3px', backgroundColor: GREEN }} />
                        <Typography sx={{ fontSize: '12px', color: '#667085', fontWeight: 600 }}>Improved</Typography>
                    </Box>
                </Box>
            </Box>

            {/* Column headers over the diverging axis */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1, mb: 0.5 }}>
                <Box sx={{ width: '160px', flexShrink: 0 }} />
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ flex: 1, textAlign: 'right', pr: 1.25 }}>
                        <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#D92D20', letterSpacing: '0.06em' }}>◀ DECLINED</Typography>
                    </Box>
                    <Box sx={{ width: '2px', flexShrink: 0 }} />
                    <Box sx={{ flex: 1, textAlign: 'left', pl: 1.25 }}>
                        <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#027A48', letterSpacing: '0.06em' }}>IMPROVED ▶</Typography>
                    </Box>
                </Box>
                <Box sx={{ width: '150px', flexShrink: 0 }} />
            </Box>

            {/* Rows */}
            <Box>
                {systems.map((s) => (
                    <SystemRow
                        key={s.name}
                        s={s}
                        maxMove={maxMove}
                        open={openSystem === s.name}
                        onToggle={() => setOpenSystem(openSystem === s.name ? null : s.name)}
                        onSelectBiomarker={onSelectBiomarker}
                    />
                ))}
            </Box>

            <Typography sx={{ fontSize: '12px', color: '#98A2B3', mt: 2, px: 1, textAlign: 'left' }}>
                Each bar counts the biomarkers that moved in that system. Click a row to see exactly which ones changed.
            </Typography>
        </Box>
    );
};

export default SystemCompare;
