/* global FB */

/**
 * Invalidate access_token & log user out of app.
 * This method is provided by the Facebook JS SDK, which is loaded globally by
 * the FacebookLogin component.
 * @see https://github.com/keppelen/react-facebook-login/
 * @see https://developers.facebook.com/docs/reference/javascript/FB.logout/
 */
export const fbLogout = onFbLogout => FB.logout(onFbLogout);
