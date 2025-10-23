'use server';

import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

function getAuthHeaders(token) {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function getNotes(slug, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(`${API_BASE_URL}/note/${slug}`, {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    throw new Error('Failed to fetch data');
  }
}

export async function createNote(text, dogs, token) {
  try {
    const headers = getAuthHeaders(token);
    const body = {
      dogs,
      text: text,
    };

    const res = await fetch(API_ENDPOINTS.NOTES, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to create note:', error);
    throw new Error('Failed to create note');
  }
}
