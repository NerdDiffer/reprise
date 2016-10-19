/* global window */

// helpers for local storage

const createStorageManager = KEY => ({
  get: () => window.localStorage.getItem(KEY),
  set: token => window.localStorage.setItem(KEY, token),
  clear: () => window.localStorage.removeItem(KEY)
});

const authStorage = createStorageManager('auth_token');
const fbAccessStorage = createStorageManager('fb_access_token');

export {
  authStorage,
  fbAccessStorage
};
