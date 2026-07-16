import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';

export interface Band {
    inLow: number | null; inHigh: number | null;
    bLow: number | null; bHigh: number | null;
    critLow: number | null; critHigh: number | null;
}
export interface TrendPoint {
    date: string; visit: number | null; value: string; numericValue: number | null;
    status: string; unit: string | null; refLow: number | null; refHigh: number | null;
}
export interface BiomarkerHistory {
    testName: string; biomarkerName: string; unit: string | null;
    refLow: number | null; refHigh: number | null; band: Band | null; points: TrendPoint[];
}

const STATUS_COLOR: Record<string, string> = {
    in_range: '#12B76A', borderline: '#F79009', out_of_range: '#F04438', critical: '#B42318', unknown: '#98A2B3',
};

const fmtDate = (s: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
    const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
};
const fmtMonthYear = (s: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
    const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
};

const BiomarkerTrendChart: React.FC<{ data: BiomarkerHistory }> = ({ data }) => {
    const [hovered, setHovered] = useState<number | null>(null);
    const pts = data.points.filter((p) => p.numericValue != null) as (TrendPoint & { numericValue: number })[];
    if (pts.length === 0) {
        return <Typography sx={{ fontSize: 14, color: '#98A2B3', py: 4, textAlign: 'center' }}>No numeric trend available for this marker.</Typography>;
    }

    const band: Band = data.band || { inLow: data.refLow, inHigh: data.refHigh, bLow: null, bHigh: null, critLow: null, critHigh: null };
    const sane = (n: number | null | undefined) => n != null && n > 0 && n < 100000;
    const inHi = sane(band.inHigh) ? (band.inHigh as number) : null;
    const inLo = sane(band.inLow) ? (band.inLow as number) : null;

    // Layout
    const W = 470, H = 236;
    const M = { top: 30, right: 26, bottom: 34, left: 104 };
    const plotW = W - M.left - M.right;
    const plotH = H - M.top - M.bottom;
    const yTop = M.top, yBot = M.top + plotH;

    // Y domain from values + in-range edges.
    const domainVals = [...pts.map((p) => p.numericValue), ...[inHi, inLo].filter((n): n is number => n != null)];
    let lo = Math.min(...domainVals);
    let hi = Math.max(...domainVals);
    if (lo === hi) { lo -= 1; hi += 1; }
    const pad = (hi - lo) * 0.28;
    lo -= pad; hi += pad;

    const x = (i: number) => {
        if (pts.length === 1) return M.left + plotW / 2;
        const inset = 0.16;
        const t = inset + (i / (pts.length - 1)) * (1 - 2 * inset);
        return M.left + t * plotW;
    };
    const y = (v: number) => M.top + plotH - ((v - lo) / (hi - lo)) * plotH;
    const clampY = (v: number) => Math.max(yTop, Math.min(yBot, y(v)));

    // Region labels in the left gutter (Above / In / Below range).
    type Region = { text: string; sub: string; color: string; yc: number };
    const regions: Region[] = [];
    if (inHi != null && y(inHi) > yTop + 14) {
        regions.push({ text: 'Above range', sub: `> ${inHi}`, color: '#F04438', yc: Math.max(yTop + 12, (yTop + y(inHi)) / 2) });
    }
    {
        const t = inHi != null ? Math.max(yTop, y(inHi)) : yTop;
        const b = inLo != null ? Math.min(yBot, y(inLo)) : yBot;
        const sub = inLo != null && inHi != null ? `${inLo}–${inHi}` : inHi != null ? `< ${inHi}` : inLo != null ? `> ${inLo}` : '';
        regions.push({ text: 'In range', sub, color: '#12B76A', yc: (t + b) / 2 });
    }
    if (inLo != null && y(inLo) < yBot - 14) {
        regions.push({ text: 'Below range', sub: `< ${inLo}`, color: '#F04438', yc: Math.min(yBot - 12, (y(inLo) + yBot) / 2) });
    }

    const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${clampY(p.numericValue).toFixed(1)}`).join(' ');

    // Horizontal gridlines
    const gridN = 4;
    const grids = Array.from({ length: gridN + 1 }, (_, i) => yTop + (i / gridN) * plotH);

    // Hover tooltip position for a given point.
    const tipW = 104, tipH = 46;
    const tipFor = (i: number) => {
        const px = x(i), py = clampY(pts[i].numericValue);
        let tx = px - tipW / 2;
        tx = Math.max(M.left, Math.min(tx, W - tipW - 2));
        let ty = py - tipH - 14;
        if (ty < 2) ty = Math.min(yBot - tipH, py + 14);
        return { tx, ty };
    };

    return (
        <Box sx={{ width: '100%' }}>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
                {/* faint in-range band */}
                {(inHi != null || inLo != null) && (
                    <rect
                        x={M.left}
                        y={inHi != null ? Math.max(yTop, y(inHi)) : yTop}
                        width={plotW}
                        height={Math.max(0, (inLo != null ? Math.min(yBot, y(inLo)) : yBot) - (inHi != null ? Math.max(yTop, y(inHi)) : yTop))}
                        fill="#ECFDF3"
                    />
                )}

                {/* gridlines */}
                {grids.map((gy, i) => (
                    <line key={i} x1={M.left} x2={M.left + plotW} y1={gy} y2={gy} stroke="#F2F4F7" strokeWidth={1} />
                ))}

                {/* in-range boundary lines */}
                {[inHi, inLo].filter((n): n is number => n != null).map((v, i) => (
                    <line key={i} x1={M.left} x2={M.left + plotW} y1={y(v)} y2={y(v)} stroke="#A6E4C4" strokeWidth={1} strokeDasharray="3 3" />
                ))}

                {/* zone labels (left gutter) */}
                {regions.map((r, i) => (
                    <g key={i}>
                        <text x={14} y={r.yc - 2} fontSize={12} fontWeight={700} fill={r.color}>{r.text}</text>
                        {r.sub && <text x={14} y={r.yc + 13} fontSize={10} fill="#98A2B3">{r.sub}{data.unit ? ` ${data.unit}` : ''}</text>}
                    </g>
                ))}

                {/* droplines */}
                {pts.map((p, i) => (
                    <line key={i} x1={x(i)} x2={x(i)} y1={clampY(p.numericValue)} y2={yBot} stroke="#D0D5DD" strokeWidth={1} strokeDasharray="2 3" />
                ))}

                {/* baseline */}
                <line x1={M.left} x2={M.left + plotW} y1={yBot} y2={yBot} stroke="#EAECF0" strokeWidth={1} />

                {/* line */}
                <path d={linePath} fill="none" stroke="#667085" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

                {/* points + static value labels + x labels + hover hit areas */}
                {pts.map((p, i) => {
                    const cy = clampY(p.numericValue);
                    const color = STATUS_COLOR[p.status] || '#98A2B3';
                    const isHover = hovered === i;
                    return (
                        <g key={i}>
                            {!isHover && (
                                <text x={x(i)} y={cy - 12} fontSize={11.5} fontWeight={700} fill="#475467" textAnchor="middle">{p.value}</text>
                            )}
                            <circle cx={x(i)} cy={cy} r={isHover ? 5.5 : 4.5} fill={color} stroke="#FFFFFF" strokeWidth={2} />
                            <text x={x(i)} y={yBot + 20} fontSize={11} fill={isHover ? '#1A212B' : '#667085'} fontWeight={isHover ? 700 : 500} textAnchor="middle">{fmtDate(p.date)}</text>
                            {/* enlarged transparent hit target */}
                            <circle
                                cx={x(i)} cy={cy} r={16} fill="transparent"
                                style={{ pointerEvents: 'all', cursor: 'pointer' }}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                            />
                        </g>
                    );
                })}

                {/* dark tooltip callout — only for the hovered point */}
                {hovered != null && pts[hovered] && (() => {
                    const p = pts[hovered];
                    const { tx, ty } = tipFor(hovered);
                    return (
                        <g style={{ pointerEvents: 'none' }}>
                            <rect x={tx} y={ty} width={tipW} height={tipH} rx={9} fill="#101828" />
                            <text x={tx + 12} y={ty + 18} fontSize={10.5} fill="#D0D5DD">{fmtMonthYear(p.date)}</text>
                            <circle cx={tx + 15} cy={ty + 33} r={3.5} fill={STATUS_COLOR[p.status] || '#98A2B3'} />
                            <text x={tx + 25} y={ty + 37} fontSize={13} fontWeight={700} fill="#FFFFFF">{p.value}{data.unit ? ` ${data.unit}` : ''}</text>
                        </g>
                    );
                })()}
            </svg>
        </Box>
    );
};

export default BiomarkerTrendChart;
