// Placeholder lab network.
//
// We are not connected to a lab partner yet, so these are invented draw sites.
// The list is keyed off whatever address someone types so the demo always
// returns something believable near them. Replace this file with the partner
// lookup once the integration lands.

export interface DemoLab {
  id: string;
  name: string;
  street: string;
  distanceMiles: number;
  slots: string[];
}

const NAMES = [
  { name: 'Northgate Diagnostics', street: '412 Northgate Ave, Suite 120' },
  { name: 'Cedar Park Clinical Labs', street: '88 Cedar Park Way' },
  { name: 'Riverbend Health Labs', street: '2301 Riverbend Rd, Building C' },
  { name: 'Summit Draw Center', street: '55 Summit Plaza, Suite 4' },
  { name: 'Lakeview Diagnostics', street: '719 Lakeview Blvd' },
];

// Morning slots only. Fasting draws read best early, which is also what the
// scheduling guidance on this screen tells people.
const SLOT_SETS = [
  ['7:15 AM', '8:00 AM', '9:30 AM', '10:15 AM'],
  ['7:00 AM', '7:45 AM', '9:00 AM'],
  ['8:15 AM', '9:45 AM', '10:30 AM'],
  ['7:30 AM', '8:45 AM', '10:00 AM'],
  ['7:15 AM', '9:15 AM'],
];

const DISTANCES = [1.2, 2.8, 4.1, 5.6, 7.3];

/**
 * Returns the draw sites we would show for an address. The set is stable for a
 * given address so the demo does not reshuffle when someone goes back a step.
 */
export function labsNear(address: string): DemoLab[] {
  const seed = address
    .trim()
    .toLowerCase()
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  const cityLine = cityFrom(address);

  return NAMES.map((entry, i) => {
    const offset = (seed + i) % DISTANCES.length;
    return {
      id: `lab-${i}`,
      name: entry.name,
      street: cityLine ? `${entry.street}, ${cityLine}` : entry.street,
      distanceMiles: DISTANCES[offset],
      slots: SLOT_SETS[i % SLOT_SETS.length],
    };
  }).sort((a, b) => a.distanceMiles - b.distanceMiles);
}

/** Pulls a city/state style tail off a typed address so the results look local. */
function cityFrom(address: string): string {
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) return parts.slice(1).join(', ');
  return parts.length === 1 && !/^\d/.test(parts[0]) ? parts[0] : '';
}
