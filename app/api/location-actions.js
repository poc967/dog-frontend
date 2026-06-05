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

    const json = await res.json();

    logDomainAction(logger, 'location_created', {
      result: 'success',
      locationId: json?.data?._id,
      locationName: json?.data?.name,
      requestId: getRequestId(res),
    });

    return json;
  } catch (error) {
    logger.warn('location_create_failed', {
      action: 'location_created',
      result: 'failure',
      locationName: locationData?.name,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

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

    const json = await res.json();

    logDomainAction(logger, 'location_updated', {
      result: 'success',
      locationId,
      locationName: locationData?.name,
      requestId: getRequestId(res),
    });

    return json;
  } catch (error) {
    logger.warn('location_update_failed', {
      action: 'location_updated',
      result: 'failure',
      locationId,
      locationName: locationData?.name,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

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

    const json = await res.json();

    logDomainAction(logger, 'location_deleted', {
      result: 'success',
      locationId,
      requestId: getRequestId(res),
    });

    return json;
  } catch (error) {
    logger.warn('location_delete_failed', {
      action: 'location_deleted',
      result: 'failure',
      locationId,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

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
    logger.warn('locations_fetch_failed', {
      action: 'locations_fetched',
      result: 'failure',
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

    throw error;
  }
}
