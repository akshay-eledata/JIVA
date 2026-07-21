// Demo-only helper: makes sure a token exists so someone can skip the signup
// screen and still reach the questionnaire, checkout and scheduling screens.

import { apiUrl } from '../config';

export async function ensureDemoAccount(): Promise<void> {
  if (localStorage.getItem('token')) return;

  const stamp = Date.now();
  const res = await fetch(apiUrl('/api/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      firstName: 'Demo',
      lastName: 'Guest',
      email: `demo+${stamp}@jiva.com`,
      password: 'demo1234',
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Could not start the demo session.');
  localStorage.setItem('token', data.token);
}
