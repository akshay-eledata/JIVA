import React from 'react';

/**
 * Per-system glyphs for the Vitality Map heatmap tiles — one coherent
 * stroke-style set (24x24 grid, 1.8 stroke, round caps) keyed by the canonical
 * system names the API returns. Unknown systems fall back to a pulse glyph.
 */
const GLYPHS: Record<string, React.ReactNode> = {
    // Droplet
    Blood: (
        <>
            <path d="M12 3.2C12 3.2 6 10 6 14.4a6 6 0 0 0 12 0C18 10 12 3.2 12 3.2Z" />
            <path d="M9.3 14.6a2.9 2.9 0 0 0 2 2.7" />
        </>
    ),
    // Flame
    Metabolic: (
        <path d="M12 3.5c.5 3 4.5 5 4.5 9a4.5 4.5 0 0 1-9 0c0-1.7.8-2.9 1.8-4.3.6 1.1 1.4 1.7 2.1 2 0-2.2.2-4.5.6-6.7Z" />
    ),
    // Heart with a pulse line
    Heart: (
        <>
            <path d="M12 19.5C11.4 19.2 4.5 15 4.5 9.9A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 7.5 2.8c0 5.1-6.9 9.3-7.5 9.6Z" />
            <path d="M8.2 11.6h1.7l1.1-1.7 1.6 3.2 1.1-1.5h2.1" />
        </>
    ),
    // Two-lobed organ
    Liver: (
        <>
            <path d="M4.7 10.6c0-3.2 2.4-5.4 5.6-5.4h4.8c2.6 0 4.4 1.7 4.4 4 0 1.5-.8 2.7-2.1 3.5l-4.9 3.1c-2.2 1.4-4.7 1.6-6.2-.3-1-1.3-1.6-2.9-1.6-4.9Z" />
            <circle cx="11" cy="13.4" r="1.1" />
        </>
    ),
    // Kidney bean with hilum notch
    Kidney: (
        <path d="M14.5 4.5a7.5 7.5 0 0 0 0 15c1.9 0 3.1-1.3 3.1-2.7 0-1.1-.8-1.7-1.8-2.2-1.5-.8-1.5-3.4 0-4.2 1-.5 1.8-1.1 1.8-2.2 0-1.4-1.2-2.7-3.1-2.7Z" />
    ),
    // Bolt
    Electrolytes: (
        <path d="M13.2 3.2 6.4 13.4h4.3l-.9 7.4 6.8-10.2h-4.3l.9-7.4Z" />
    ),
    // Butterfly gland
    Thyroid: (
        <>
            <path d="M12 4.2v5" />
            <ellipse cx="8.7" cy="14.3" rx="2.7" ry="5.2" />
            <ellipse cx="15.3" cy="14.3" rx="2.7" ry="5.2" />
            <path d="M10.9 11.3a2.6 2.6 0 0 1 2.2 0" />
        </>
    ),
    // Leaf with vein
    Nutrients: (
        <>
            <path d="M5.5 18.5c0-8 5-13 13-13 0 8-5 13-13 13Z" />
            <path d="M5.5 18.5C9 15 12 12 15.5 8.5" />
        </>
    ),
    // Shield with plus
    'Immune/Inflammatory': (
        <>
            <path d="M12 3.6 18.8 6v5.1c0 4.3-2.9 7.2-6.8 9.3-3.9-2.1-6.8-5-6.8-9.3V6Z" />
            <path d="M12 9.3v5.4M9.3 12h5.4" />
        </>
    ),
    // Signaling molecule
    'Hormonal/Reproductive': (
        <>
            <circle cx="7.2" cy="7.4" r="2.1" />
            <circle cx="16.9" cy="9.2" r="2.1" />
            <circle cx="10.6" cy="16.9" r="2.1" />
            <path d="M9.3 7.8l5.5 1M8 9.4l1.9 5.5M12.2 15.6l3.4-4.5" />
        </>
    ),
};

// Short labels some screens use in place of the canonical names.
GLYPHS['Immunity'] = GLYPHS['Immune/Inflammatory'];
GLYPHS['Hormonal'] = GLYPHS['Hormonal/Reproductive'];

const FALLBACK = (
    <>
        <circle cx="12" cy="12" r="8.2" />
        <path d="M8.2 12h1.8l1.2-2.3 1.5 4.4 1.2-2.1h1.9" />
    </>
);

const SystemIcon: React.FC<{ system: string; size?: number; color?: string }> = ({
    system,
    size = 16,
    color = '#17301B',
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
    >
        {GLYPHS[system] || FALLBACK}
    </svg>
);

export default SystemIcon;
