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

export async function createUser(userData, token) {
  try {
    const headers = getAuthHeaders(token);
    const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to create user:', error);
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
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to update user:', error);
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
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
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
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw new Error('Failed to fetch users');
  }
}
