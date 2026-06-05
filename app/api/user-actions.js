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

export async function createUser(userData, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to create user');
    }

    const json = await res.json();

    logDomainAction(logger, 'user_created', {
      result: 'success',
      targetUserId: json?.data?._id,
      role: json?.data?.role,
      requestId: getRequestId(res),
    });

    return json;
  } catch (error) {
    logger.warn('user_create_failed', {
      action: 'user_created',
      result: 'failure',
      role: userData?.role,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

    throw new Error('Failed to create user');
  }
}

export async function updateUser(userId, userData, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.AUTH.USER_BY_ID(userId), {
      method: 'PUT',
      headers,
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to update user');
    }

    const json = await res.json();

    logDomainAction(logger, 'user_updated', {
      result: 'success',
      targetUserId: userId,
      role: userData?.role,
      requestId: getRequestId(res),
    });

    return json;
  } catch (error) {
    logger.warn('user_update_failed', {
      action: 'user_updated',
      result: 'failure',
      targetUserId: userId,
      role: userData?.role,
      statusCode: error.status,
      requestId: error.requestId,
      errorName: error.name,
      errorMessage: error.message,
    });

    throw new Error('Failed to update user');
  }
}

export async function getUser(userId, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.AUTH.USER_BY_ID(userId), {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to fetch user');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user');
  }
}

export async function getAllUsers(token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.AUTH.USERS, {
      headers,
      cache: 'no-store',
    });

    if (!res.ok) {
      throw await buildApiError(res, 'Failed to fetch users');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw new Error('Failed to fetch users');
  }
}
