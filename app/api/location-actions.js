'use server';

import { API_ENDPOINTS } from '../config/api';

const buildApiError = async (res, fallbackMessage) => {
  let message = fallbackMessage;

  try {
    const errorPayload = await res.json();
    message =
      errorPayload?.message ||
      errorPayload?.data ||
      errorPayload?.error ||
      fallbackMessage;
  } catch (parseError) {
    message = fallbackMessage;
  }

  const error = new Error(message);
  error.status = res.status;
  return error;
};

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
      throw await buildApiError(res, 'Failed to create location');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to create location:', error);
    throw error;
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
      throw await buildApiError(res, 'Failed to update location');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to update location:', error);
    throw error;
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
      throw await buildApiError(res, 'Failed to delete location');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to delete location:', error);
    throw error;
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
      throw await buildApiError(res, 'Failed to fetch locations');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    throw error;
  }
}
