const isNewDomain = /prudential\.co\.id/.test(window.location.hostname);
const identityService = isNewDomain ? 'identity-pruid' : 'identity';
export default {
  userInfo: `/services/pulse/${identityService}/auth/credential/payload`,
  logout: `/services/pulse/${identityService}/auth/logout`,
  refreshToken: `/services/pulse/${identityService}/auth/credential/refresh`,
  profile: ''
};
