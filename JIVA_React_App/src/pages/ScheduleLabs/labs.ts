// Labin draw network (demo data).
//
// Labin is our Costa Rican lab partner, so the draw sites shown on this screen
// are Labin branches across the San Jose metro area. The integration is not
// live yet: branch addresses, distances and slot times here are illustrative,
// and the screen says so. Replace this file with the Labin location lookup once
// the integration lands.
//
// The list is deliberately independent of what the patient types. Labin's
// footprint is fixed, so the typed address only seeds the distance ordering
// rather than rewriting the addresses to match. That keeps every result
// coherent no matter what someone enters during a demo.

export interface DemoLab {
  id: string;
  name: string;
  street: string;
  distanceKm: number;
  slots: string[];
}

const BRANCHES = [
  { name: 'Labin Escazu', street: 'Centro Comercial Paco, San Rafael de Escazu' },
  { name: 'Labin Santa Ana', street: 'Plaza Santa Ana, 200 m oeste del parque' },
  { name: 'Labin Rohrmoser', street: 'Avenida 3, frente a Plaza Mayor, Pavas' },
  { name: 'Labin San Pedro', street: 'Barrio Dent, 100 m norte de Iglesia Santa Teresita' },
  { name: 'Labin Curridabat', street: 'Plaza Freses, local 8, Curridabat' },
  { name: 'Labin Heredia', street: 'Avenida Central, 50 m sur del Mercado Municipal' },
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

const DISTANCES = [1.4, 2.6, 3.9, 5.2, 7.1, 9.4];

/**
 * Returns the Labin branches we would show for an address. The set is stable
 * for a given address so the demo does not reshuffle when someone goes back a
 * step, and every address returns the full network.
 */
export function labsNear(address: string): DemoLab[] {
  const seed = address
    .trim()
    .toLowerCase()
    .split('')
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  return BRANCHES.map((branch, i) => ({
    id: `lab-${i}`,
    name: branch.name,
    street: branch.street,
    distanceKm: DISTANCES[(seed + i) % DISTANCES.length],
    slots: SLOT_SETS[i % SLOT_SETS.length],
  })).sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Rebuilds a draw site from a previous booking so a retest can be booked in one
 * tap without searching again (F1). Distance is unknown here, since we only
 * kept the lab, so the card omits it.
 */
export function labFromPrevious(name: string, address: string | null): DemoLab {
  return {
    id: 'lab-previous',
    name,
    street: address || '',
    distanceKm: 0,
    slots: SLOT_SETS[0],
  };
}
