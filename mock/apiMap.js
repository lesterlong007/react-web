module.exports = {
  '^/api/user-info$': (url, method, param) => {
    console.log(url, method);
    return '/api/user-info';
  },
  '^/api/list$': '/api/list',
  '^/insurance-policy/customers/me/policies': '/policy/list',
  '^/services/pulse/identity/auth/credential/payload': '/policy/user-info'
};
