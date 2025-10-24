'use server';

import { API_ENDPOINTS } from '../config/api';

function getAuthHeaders(token) {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export async function createLocation(locationData, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.LOCATIONS, {
      method: 'POST',
      headers,
      body: JSON.stringify(locationData),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to create location:', error);
    throw new Error('Failed to create location');
  }
}

export async function updateLocation(locationId, locationData, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(`${API_ENDPOINTS.LOCATIONS}/${locationId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(locationData),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to update location:', error);
    throw new Error('Failed to update location');
  }
}

export async function deleteLocation(locationId, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(`${API_ENDPOINTS.LOCATIONS}/${locationId}`, {
      method: 'DELETE',
      headers,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to delete location:', error);
    throw new Error('Failed to delete location');
  }
}

export async function getAllLocations(token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.LOCATIONS, {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    throw new Error('Failed to fetch locations');
  }
}