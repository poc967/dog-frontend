'use server';

import { API_ENDPOINTS } from '../config/api';
import { createLogger, logDomainAction } from '../lib/logger';

const logger = createLogger('frontend');

function getAuthHeaders(token) {
  if (!token) {
    throw new Error('Authentication token is required');
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

const getRequestId = (res) => res.headers.get('x-request-id') || undefined;

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
  error.requestId = getRequestId(res);
  return error;
};

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

    const json = await res.json();

    logDomainAction(logger, 'dog_created', {
      result: 'success',
      dogId: json?.data?._id,
      dogName: json?.data?.name,
      locationId: json?.data?.location?._id || dogData.location,
      requestId: getRequestId(res),
    });

    return json;
  } catch (error) {
    logger.warn('dog_create_failed', {
      action: 'dog_created',
      result: 'failure',
      dogName: dogData?.name,
      locationId: dogData?.location,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

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

    const json = await res.json();

    logDomainAction(logger, 'dog_archived', {
      result: 'success',
      dogCount: dogIds.length,
      requestId: getRequestId(res),
    });

    return json;
  } catch (error) {
    logger.warn('dog_archive_failed', {
      action: 'dog_archived',
      result: 'failure',
      dogCount: dogIds.length,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

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

    const json = await res.json();

    logDomainAction(
      logger,
      dogsData.type === 'walk' ? 'walk_started' : 'dog_moved',
      {
        result: 'success',
        dogCount: dogsData.dogs?.length || 0,
        locationId: dogsData.location,
        requestId: getRequestId(res),
      },
    );

    return json;
  } catch (error) {
    logger.warn('dog_action_failed', {
      action: dogsData.type === 'walk' ? 'walk_started' : 'dog_moved',
      result: 'failure',
      dogCount: dogsData.dogs?.length || 0,
      locationId: dogsData.location,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

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

    const json = await res.json();

    logDomainAction(logger, 'walk_ended', {
      result: 'success',
      dogCount: walkData.dogIds?.length || 0,
      requestId: getRequestId(res),
    });

    return json;
  } catch (error) {
    logger.warn('walk_end_failed', {
      action: 'walk_ended',
      result: 'failure',
      dogCount: walkData.dogIds?.length || 0,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

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

    const json = await res.json();

    logDomainAction(logger, 'note_created', {
      result: 'success',
      dogCount: noteData?.dogs?.length || 0,
      requestId: getRequestId(res),
    });

    return json;
  } catch (error) {
    logger.warn('note_create_failed', {
      action: 'note_created',
      result: 'failure',
      dogCount: noteData?.dogs?.length || 0,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

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
