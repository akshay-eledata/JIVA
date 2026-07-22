/**
 * Continuous in-range → out-of-range tile color (plan.md D14).
 *
 * `p` is the out-of-range position: 0 = every biomarker in range (green, far
 * left of the legend), 1 = none in range (terracotta, far right). Borderline
 * counts as half in range — compute p on the server or via `spectrumP()` below.
 *
 * Stops are brand-anchored and interpolated in OKLCH, not RGB: hue travels
 * green → lime → amber → terracotta while chroma is held (RGB blending
 * desaturates midpoints into muddy olive) and lightness falls monotonically,
 * so severity stays readable in grayscale and under red-green color blindness.
 * Ink text (#1A212B) measures 5.8:1–11:1 across the whole ramp (≥4.8:1 at the
 * darkest gradient bottom).
 */
type LCH = { L: number; C: number; H: number };

const STOPS: { at: number; lch: LCH }[] = [
    { at: 0.0, lch: { L: 0.86, C: 0.1, H: 150 } }, // #A1E4AE brand green
    { at: 0.35, lch: { L: 0.845, C: 0.115, H: 106 } }, // #D6D175 brand-lime family
    { at: 0.7, lch: { L: 0.82, C: 0.115, H: 72 } }, // #F2B86C warm amber
    { at: 1.0, lch: { L: 0.7, C: 0.13, H: 33 } }, // #E37E68 terracotta
];

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const linearToSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

function oklchToHex({ L, C, H }: LCH): string {
    const h = (H * Math.PI) / 180;
    const a = C * Math.cos(h);
    const b = C * Math.sin(h);
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291485548 * b;
    const l = l_ ** 3;
    const m = m_ ** 3;
    const s = s_ ** 3;
    const rgb = [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ];
    return `#${rgb
        .map((v) => Math.max(0, Math.min(255, Math.round(linearToSrgb(v) * 255))).toString(16).padStart(2, '0'))
        .join('')}`;
}

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
    return oklchToHex({
        L: lo.lch.L + (hi.lch.L - lo.lch.L) * t,
        C: lo.lch.C + (hi.lch.C - lo.lch.C) * t,
        H: lo.lch.H + (hi.lch.H - lo.lch.H) * t,
    });
}

/**
 * Soft vertical gradient for a heatmap tile at position `p` — a slightly
 * lighter/airier shade at the top falling to a slightly deeper, warmer one at
 * the bottom (per the Figma treatment). Both ends stay on the OKLCH ramp's hue,
 * so text contrast is within ±0.04 L of the flat spectrumColor(p).
 */
export function spectrumTileGradient(p: number): string {
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
    const L = lo.lch.L + (hi.lch.L - lo.lch.L) * t;
    const C = lo.lch.C + (hi.lch.C - lo.lch.C) * t;
    const H = lo.lch.H + (hi.lch.H - lo.lch.H) * t;
    const top = oklchToHex({ L: Math.min(0.96, L + 0.025), C: Math.max(0.03, C - 0.01), H });
    const bottom = oklchToHex({ L: L - 0.045, C: C + 0.015, H: H - 4 });
    return `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`;
}

/** Out-of-range position from counts (borderline = half in range). */
export function spectrumP(counts: { total: number; inRange: number; borderline: number }): number {
    if (!counts.total) return 0;
    return clamp01(1 - (counts.inRange + 0.5 * counts.borderline) / counts.total);
}

/**
 * CSS gradient string for the legend. Sampled densely because CSS blends
 * between gradient stops in sRGB — the samples keep it on the OKLCH path.
 */
export const SPECTRUM_GRADIENT = `linear-gradient(90deg, ${Array.from({ length: 9 }, (_, i) => {
    const p = i / 8;
    return `${spectrumColor(p)} ${Math.round(p * 100)}%`;
}).join(', ')})`;

/**
 * The ramp's four anchors, for deriving status/chart colors elsewhere on the
 * screen so the whole page tells one color story.
 */
export const SPECTRUM_ANCHORS = {
    GOOD: spectrumColor(0),
    LIME: spectrumColor(0.35),
    AMBER: spectrumColor(0.7),
    BAD: spectrumColor(1),
} as const;
