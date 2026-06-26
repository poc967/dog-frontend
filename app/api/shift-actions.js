'use server';

import { API_ENDPOINTS } from '../config/api';

function getAuthHeaders(token) {
  if (!token) throw new Error('Authentication token is required');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

const buildApiError = async (res, fallbackMessage) => {
  let message = fallbackMessage;
  try {
    const payload = await res.json();
    message = payload?.message || fallbackMessage;
  } catch (_) {}
  const error = new Error(message);
  error.status = res.status;
  return error;
};

export async function getActiveShifts(token) {
  const res = await fetch(API_ENDPOINTS.SHIFTS.ACTIVE, {
    headers: getAuthHeaders(token),
    cache: 'no-store',
  });
  if (!res.ok) throw await buildApiError(res, 'Failed to fetch shifts');
  return res.json();
}

export async function createShift(token) {
  const res = await fetch(API_ENDPOINTS.SHIFTS.CREATE, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw await buildApiError(res, 'Failed to create shift');
  return res.json();
}

export async function assignVolunteer(shiftId, { volunteerId, dogIds, notes }, token) {
  const res = await fetch(API_ENDPOINTS.SHIFTS.ASSIGN(shiftId), {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ volunteerId, dogIds, notes }),
  });
  if (!res.ok) throw await buildApiError(res, 'Failed to assign volunteer');
  return res.json();
}

export async function removeVolunteer(shiftId, volunteerId, token) {
  const res = await fetch(API_ENDPOINTS.SHIFTS.REMOVE_VOLUNTEER(shiftId, volunteerId), {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw await buildApiError(res, 'Failed to remove volunteer');
  return res.json();
}

export async function completeDog(shiftId, dogId, completed = true, token) {
  const res = await fetch(API_ENDPOINTS.SHIFTS.COMPLETE_DOG(shiftId, dogId), {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw await buildApiError(res, 'Failed to update dog completion');
  return res.json();
}

export async function closeShift(shiftId, token) {
  const res = await fetch(API_ENDPOINTS.SHIFTS.CLOSE(shiftId), {
    method: 'PUT',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw await buildApiError(res, 'Failed to close shift');
  return res.json();
}
