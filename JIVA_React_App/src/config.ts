// Centralized API base URL. Override in dev/prod via VITE_API_BASE_URL.
export const API_BASE: string =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:5001';

// Small helper for authenticated fetches against the JIVA API.
export const apiUrl = (path: string): string =>
    `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
