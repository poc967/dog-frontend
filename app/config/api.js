// API configuration based on environment
const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8080';
  }
  return 'https://still-garden-24228-4efab39a388a.herokuapp.com';
};

export const API_BASE_URL = getApiBaseUrl();

// Available color options for dog levels
export const COLOR_OPTIONS = ['green', 'yellow', 'red', 'purple', 'blue'];

// API endpoint helpers
export const API_ENDPOINTS = {
  DOGS: `${API_BASE_URL}/dog`,
  LOCATIONS: `${API_BASE_URL}/settings/location`,
  ACTIVITIES: `${API_BASE_URL}/activity`,
  COMPLETE_WALK: `${API_BASE_URL}/activity/complete-walk`,
  NOTES: `${API_BASE_URL}/note/new`,

  // Authentication endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    USERS: `${API_BASE_URL}/auth/users`,
    USER_BY_ID: (id) => `${API_BASE_URL}/auth/users/${id}`,
  },

  // Dynamic endpoints
  DOG_BY_ID: (id) => `${API_BASE_URL}/dog/${id}`,
  ACTIVITY_BY_ID: (id) => `${API_BASE_URL}/activity/${id}`,
  DOG_TAB: (dogId, tab) => `${API_BASE_URL}/dog/${dogId}/${tab.toLowerCase()}`,
  DELETE_WHITEBOARD: (dogId, type, id) =>
    `${API_BASE_URL}/dog/${dogId}/${type.toLowerCase()}/${id}`,
};
