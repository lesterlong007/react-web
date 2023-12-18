module.exports = {
  '^/api/user-info$': (url, method, param) => {
    console.log(url, method, param, 'user-info');
    return '/api/user-info';
  },
  '^/api/list$': '/api/list'
};
