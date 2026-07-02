'use server';

import { API_ENDPOINTS } from '../config/api';
var FormData = require('form-data');
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

export async function getDog(slug, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.DOG_BY_ID(slug), {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to fetch dog');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch dog:', error);
    throw new Error('Failed to fetch data');
  }
}

export async function getActivity(slug, token, date) {
  try {
    const headers = getAuthHeaders(token);

    let url = API_ENDPOINTS.ACTIVITY_BY_ID(slug);
    if (date) {
      // Parse the local YYYY-MM-DD string and compute UTC boundaries for
      // that local calendar day so the server query is timezone-safe.
      const [year, month, day] = date.split('-').map(Number);
      const localStart = new Date(year, month - 1, day, 0, 0, 0, 0);
      const localEnd   = new Date(year, month - 1, day + 1, 0, 0, 0, 0);
      const params = new URLSearchParams({
        start: localStart.toISOString(),
        end:   localEnd.toISOString(),
      });
      url = `${url}?${params}`;
    }

    const res = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to fetch activity');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch activity:', error);
    throw new Error('Failed to fetch data');
  }
}

export async function createAlert(dogId, alert, category, tab, token) {
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
      throw await buildApiError(res, 'Failed to create alert');
    }

    const json = await res.json();

    logDomainAction(logger, 'alert_added', {
      result: 'success',
      dogId,
      priority: category,
      requestId: getRequestId(res),
    });

    return json;
  } catch (error) {
    logger.warn('alert_add_failed', {
      action: 'alert_added',
      result: 'failure',
      dogId,
      priority: category,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

    throw new Error('Failed to POST data');
  }
}

export async function addFriend(dogId, friendId, token) {
  try {
    const headers = getAuthHeaders(token);
    const body = {
      friendId: friendId,
    };

    const res = await fetch(API_ENDPOINTS.DOG_TAB(dogId, 'friends'), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to add friend');
    }

    let jsonResponse = await res.json();

    logDomainAction(logger, 'friend_added', {
      result: 'success',
      dogId,
      targetDogId: friendId,
      requestId: getRequestId(res),
    });

    return jsonResponse;
  } catch (error) {
    logger.warn('friend_add_failed', {
      action: 'friend_added',
      result: 'failure',
      dogId,
      targetDogId: friendId,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

    throw new Error('Failed to POST friend data');
  }
}

export async function deleteFriend(dogId, friendId, token) {
  try {
    const headers = getAuthHeaders(token);
    const body = {
      friendId: friendId,
    };

    const res = await fetch(API_ENDPOINTS.DOG_TAB(dogId, 'friends'), {
      method: 'DELETE',
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to remove friend');
    }

    let jsonResponse = await res.json();

    logDomainAction(logger, 'friend_removed', {
      result: 'success',
      dogId,
      targetDogId: friendId,
      requestId: getRequestId(res),
    });

    return jsonResponse;
  } catch (error) {
    logger.warn('friend_remove_failed', {
      action: 'friend_removed',
      result: 'failure',
      dogId,
      targetDogId: friendId,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

    throw new Error('Failed to DELETE friend data');
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
      },
    );

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to delete whiteboard entry');
    }

    const json = await res.json();

    logDomainAction(logger, 'alert_removed', {
      result: 'success',
      dogId,
      type,
      targetId: id,
      requestId: getRequestId(res),
    });

    return json;
  } catch (error) {
    logger.warn('alert_remove_failed', {
      action: 'alert_removed',
      result: 'failure',
      dogId,
      type,
      targetId: id,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

    throw new Error('Failed to DELETE data');
  }
}

export async function editWhiteboard(dogId, type, id, data, priority, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.EDIT_WHITEBOARD(dogId, type, id), {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, priority }),
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to edit whiteboard entry');
    }

    const json = await res.json();

    logDomainAction(logger, 'alert_edited', {
      result: 'success',
      dogId,
      type,
      targetId: id,
      requestId: getRequestId(res),
    });

    return json;
  } catch (error) {
    logger.warn('alert_edit_failed', {
      action: 'alert_edited',
      result: 'failure',
      dogId,
      type,
      targetId: id,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

    throw new Error('Failed to edit whiteboard entry');
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
      throw await buildApiError(res, 'Failed to fetch dogs');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch dogs:', error);
    throw new Error('Failed to fetch data');
  }
}

export async function updateDog(dogId, dogData, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.DOG_BY_ID(dogId), {
      method: 'PUT',
      headers,
      body: JSON.stringify(dogData),
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to update dog');
    }

    const json = await res.json();

    logDomainAction(logger, 'dog_updated', {
      result: 'success',
      dogId,
      dogName: dogData?.name,
      requestId: getRequestId(res),
    });

    return json;
  } catch (error) {
    logger.warn('dog_update_failed', {
      action: 'dog_updated',
      result: 'failure',
      dogId,
      dogName: dogData?.name,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

    throw new Error('Failed to update dog');
  }
}
