import React from 'react';
import loadSDK from '../../utils/facebook/loadSDK';

/**
 * Asynchronously load Facebook JS SDK. Place this at top of a render method.
 * Sourced from: https://developers.facebook.com/docs/javascript/quickstart
 * @param debug, {Boolean} load un-minified SDK with logging statements.
 *   Is false by default.
 */
const LoadSDK = ({ debug }) => (
  <script>
    {loadSDK(debug)}
  </script>
);

LoadSDK.propTypes = {
  debug: React.PropTypes.bool
};

export default LoadSDK;
