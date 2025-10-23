'use server';

import { API_ENDPOINTS } from '../config/api';
var FormData = require('form-data');

function getAuthHeaders(token) {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function getDog(slug, token) {
  try {
    const headers = getAuthHeaders(token);
    console.log('Fetching dog with token:', token);
    const res = await fetch(API_ENDPOINTS.DOG_BY_ID(slug), {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch dog:', error);
    throw new Error('Failed to fetch data');
  }
}

export async function getActivity(slug, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.ACTIVITY_BY_ID(slug), {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch activity:', error);
    throw new Error('Failed to fetch data');
  }
}

export async function createAlert(dogId, alert, category, tab, token) {
  console.log(dogId, alert, category, tab, token);
  try {
    const headers = getAuthHeaders(token);
    const body = {
      data: alert,
      priority: category,
    };

    const res = await fetch(API_ENDPOINTS.DOG_TAB(dogId, tab), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to create alert:', error);
    throw new Error('Failed to POST data');
  }
}

export async function deleteWhiteboard(dogId, type, id, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(
      API_ENDPOINTS.DELETE_WHITEBOARD(dogId, type, id, token),
      {
        method: 'DELETE',
        headers,
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to delete whiteboard:', error);
    throw new Error('Failed to DELETE data');
  }
}

export async function getDogs(token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.DOGS, {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch dogs:', error);
    throw new Error('Failed to fetch data');
  }
}
