/* global window */

// helpers for local storage

// Authentication token
const TOKEN_KEY = 'auth_token';

const getToken = () => window.localStorage.getItem(TOKEN_KEY);
const setToken = token => window.localStorage.setItem(TOKEN_KEY, token);
const clearToken = () => window.localStorage.removeItem(TOKEN_KEY);

export default {
  getToken,
  setToken,
  clearToken
};
