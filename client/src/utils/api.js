import axios from 'axios';

module.exports = {
  getUserInfo: cb => {
    const url = '/api/misc/getUserInfo';

    fetch(url)
      .then(result => {
        return cb(result);
      });
  },
  postToLogin: ({ username, password }) => {
    const url = '/api/accounts/login';
    const options = {
      username,
      password
    };

    return axios.post(url, options);
  },
  postToSignup: ({ username, password }) => {
    const url = '/api/accounts';
    const options = {
      username,
      password
    };

    return axios.post(url, options);
  },
  listPrivateRooms: () => {
    const url = '/api/rooms';

    return axios.get(url)
      .then(res => res.data);
  },
  createPrivateRoom: ({ name }) => {
    const url = '/api/rooms';
    const options = { name };

    return axios.post(url, options);
  },
  getLogout: () => {
    const url = '/api/accounts/logout';
    return axios.get(url);
  }
};
