// Draft persistence + backend sync for questionnaire answers.
//
// Intake answers are drafted in localStorage while the user moves through the
// wizard (so a refresh loses nothing), then pushed to the backend once a token
// exists. The backend merges into the Questionnaire JSONB row that feeds the
// engine.

import { apiUrl } from '../config';
import { Answers } from './types';

const DRAFT_KEY = 'jiva_intake_draft';

export function loadDraft(): Answers {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveDraft(answers: Answers): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}

export async function fetchSavedQuestionnaire(): Promise<Answers | null> {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const res = await fetch(apiUrl('/api/me/profile'), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.questionnaire || null;
}

/** Merge `answers` into the user's saved questionnaire. Requires a token. */
export async function submitQuestionnaire(answers: Answers): Promise<void> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(apiUrl('/api/me/questionnaire'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: answers }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || 'Failed to save questionnaire');
  }
}

/**
 * Push any locally drafted intake answers to the backend (used right after
 * signup/signin so pre-auth answers are never lost). Keeps the draft if the
 * request fails.
 */
export async function flushDraftToServer(): Promise<void> {
  const draft = loadDraft();
  if (!Object.keys(draft).length) return;
  await submitQuestionnaire(draft);
  clearDraft();
}
