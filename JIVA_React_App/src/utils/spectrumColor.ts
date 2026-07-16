/**
 * Continuous in-range → out-of-range tile color (plan.md D14).
 *
 * `p` is the out-of-range position: 0 = every biomarker in range (green, far
 * left of the legend), 1 = none in range (red, far right). Borderline counts as
 * half in range — compute p on the server or via `spectrumP()` below.
 *
 * Colors are pastel so the dark tile text stays readable across the whole range.
 */
type RGB = [number, number, number];

// 3-stop pastel spectrum: green → amber → red (matches the section legend).
const STOPS: { at: number; rgb: RGB }[] = [
    { at: 0.0, rgb: [166, 228, 208] }, // #A6E4D0 green
    { at: 0.5, rgb: [255, 208, 138] }, // #FFD08A amber
    { at: 1.0, rgb: [255, 138, 101] }, // #FF8A65 red
];

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const toHex = (c: number) => Math.round(c).toString(16).padStart(2, '0');

/** Interpolated hex color at position `p` (0..1) along the spectrum. */
export function spectrumColor(p: number): string {
    const x = clamp01(p);
    let lo = STOPS[0];
    let hi = STOPS[STOPS.length - 1];
    for (let i = 0; i < STOPS.length - 1; i++) {
        if (x >= STOPS[i].at && x <= STOPS[i + 1].at) {
            lo = STOPS[i];
            hi = STOPS[i + 1];
            break;
        }
    }
    const span = hi.at - lo.at || 1;
    const t = (x - lo.at) / span;
    const rgb = lo.rgb.map((c, i) => c + (hi.rgb[i] - c) * t) as RGB;
    return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}

/** Out-of-range position from counts (borderline = half in range). */
export function spectrumP(counts: { total: number; inRange: number; borderline: number }): number {
    if (!counts.total) return 0;
    return clamp01(1 - (counts.inRange + 0.5 * counts.borderline) / counts.total);
}

/** CSS gradient string for the legend, sampled from the same stops. */
export const SPECTRUM_GRADIENT = `linear-gradient(90deg, ${STOPS.map(
    (s) => `${spectrumColor(s.at)} ${Math.round(s.at * 100)}%`,
).join(', ')})`;
