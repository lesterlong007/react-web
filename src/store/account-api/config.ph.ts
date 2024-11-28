const isNewDomain = /prulifeuk\.com\.ph/.test(window.location.hostname);
const identityService = isNewDomain ? 'identity-pruid' : 'identity';
export default {
  userInfo: `/services/pulse/${identityService}/auth/credential/payload`,
  logout: `/services/pulse/${identityService}/auth/logout`,
  refreshToken: `/services/pulse/${identityService}/auth/credential/refresh`,
  profile: isNewDomain ? '' : '/services/pulse/profile/customers/me'
};
