'use server';

import { API_ENDPOINTS } from '../config/api';

export async function getDog(slug) {
  const res = await fetch(API_ENDPOINTS.DOG_BY_ID(slug), {
    cache: 'no-store',
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export async function getActivity(slug) {
  const res = await fetch(API_ENDPOINTS.ACTIVITY_BY_ID(slug), {
    cache: 'no-store',
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export async function createAlert(dogId, alert, category, tab) {
  const body = {
    data: alert,
    priority: category,
  };
  const res = await fetch(API_ENDPOINTS.DOG_TAB(dogId, tab), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error('Failed to POST data');
  }

  return res.json();
}

export async function deleteWhiteboard(dogId, type, id) {
  const res = await fetch(API_ENDPOINTS.DELETE_WHITEBOARD(dogId, type, id), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to DELETE data');
  }

  return res.json();
}

export async function getDogs() {
  const res = await fetch(API_ENDPOINTS.DOGS, {
    cache: 'no-store',
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}
