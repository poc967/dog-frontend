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

export async function createDog(dogData, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.DOGS, {
      method: 'POST',
      headers,
      body: JSON.stringify(dogData),
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to create dog');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to create dog:', error);
    throw error;
  }
}

export async function removeDogs(dogIds, token) {
  const body = {
    dogIds,
  };
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.DOGS, {
      method: 'DELETE',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to delete dogs');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to delete dogs:', error);
    throw error;
  }
}

export async function moveOrWalkDogs(dogsData, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.ACTIVITIES, {
      method: 'POST',
      headers,
      body: JSON.stringify(dogsData),
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to move/walk dogs');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to move/walk dogs:', error);
    throw error;
  }
}

export async function completeWalk(walkData, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.COMPLETE_WALK, {
      method: 'PUT',
      headers,
      body: JSON.stringify(walkData),
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to complete walk');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to complete walk:', error);
    throw error;
  }
}

export async function createBehaviorNote(noteData, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.NOTES, {
      method: 'POST',
      headers,
      body: JSON.stringify(noteData),
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to create behavior note');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to create behavior note:', error);
    throw error;
  }
}

export async function getLocations(token) {
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
