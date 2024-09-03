exports.MOCK_FLAG = true;

exports.MOCK_PORT = 1080;

exports.PROXY_ENV = 'dev';

/**
 * If MOCK_FLAG is set to false, the following credentials
 * will be utilized to automatically request an accessToken.
 *
 * @type {Record<'loginId' | 'password', string>}
 */
exports.LOGIN_CREDENTIALS = {
  loginId: 'lester001@mailsac.com',
  password: 'Aabb@3344'
};
