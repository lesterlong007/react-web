const fs = require('fs');
const path = require('path');

const { PROXY_ENV, LOGIN_CREDENTIALS } = require('./config');
const envContent = fs.readFileSync(path.resolve(__dirname, `../env/.env.${PROXY_ENV}`), { encoding: 'utf8' });

const CORE_APIM_SUBSCRIPTION_KEY = envContent.match(/(?<=CORE_APIM_SUBSCRIPTION_KEY=)\S+/)[0];
const API_HOST = envContent.match(/(?<=API_HOST=)\S+/)[0];

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

/**
 * @type {string | undefined}
 */
let accessToken;
let refreshToken;

/**
 * keeps track of whether a token request is currently in progress
 * @type {boolean}
 */
let isRequestingToken = false;

/**
 * holds the Promise for the token request process
 * @type {Promise<void>}
 */
let requestTokenPromise = Promise.resolve();

/**
 * @returns {boolean}
 */
const isTokenExpired = () => {
  if (!accessToken) {
    return true;
  }
  const expiry = JSON.parse(atob(accessToken.split('.')[1])).exp;
  return Math.floor(new Date().getTime() / 1000) >= expiry;
};

/**
 *
 * @param {string} token
 * @requires void
 */
const setToken = (token) => {
  accessToken = token;
};

/**
 *
 * @returns {Promise<string | undefined>}
 */
const getForgeRockToken = async () => {
  const host = 'https://prudentity-sit.pruconnect.net';
  const passWordLoginUrl = `${host}/am/json/realms/root/realms/mo/realms/pruserveweb/authenticate?service=m_PasswordLogin&authIndexType=service&authIndexValue=m_PasswordLogin`;

  // 1.init
  const initialData = await fetch(passWordLoginUrl, {
    method: 'POST'
  }).then((response) => response.json());

  const { loginId, password } = LOGIN_CREDENTIALS ?? {};

  // 2.check account
  initialData.callbacks[0].input[0].value = loginId;
  initialData.callbacks[1].input[0].value = password;
  const accountCheckResult = await fetch(passWordLoginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(initialData)
  }).then((response) => response.json());
  // console.log('accountCheckResult: ', accountCheckResult);

  // 3.check tc and privacy
  const tcAndPrivacyCheckResult = await fetch(passWordLoginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(accountCheckResult)
  }).then((response) => response.json());

  // console.log('tcAndPrivacyCheckResult: ', tcAndPrivacyCheckResult);

  // 4.set tc and privacy
  tcAndPrivacyCheckResult.callbacks[0].input[0].value = JSON.stringify({
    key: 'last-modified',
    value: 'Fri, 20 May 2022 06:40:58 GMT'
  });
  tcAndPrivacyCheckResult.callbacks[1].input[0].value = JSON.stringify({
    key: 'last-modified',
    value: 'Fri, 20 May 2022 06:40:58 GMT'
  });
  const tcAndPrivacySetResult = await fetch(passWordLoginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: 'amlbcookie=02;'
    },
    body: JSON.stringify(tcAndPrivacyCheckResult)
  }).then((response) => {
    return response.json();
  });

  // console.log('tcAndPrivacySetResult: ', tcAndPrivacySetResult);

  // 5.get code
  const { tokenId } = tcAndPrivacySetResult;
  const code = await fetch(`${host}/am/oauth2/mo/pruserveweb/authorize`, {
    method: 'POST',
    headers: {
      Cookie: `iplanetDirectoryPro=${tokenId}; amlbcookie=02;`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Origin: 'https://pruservices-uat.prudential.com.hk',
      Referer: 'https://pruservices-uat.prudential.com.hk/',
      'Accept-Language': 'en',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
    },
    body: new URLSearchParams({
      scope: 'openid profile location',
      response_type: 'code',
      client_id: 'pruservewebClient',
      redirect_uri: 'https://example.com',
      decision: 'allow',
      csrf: tokenId
    }),
    redirect: 'manual'
  }).then((response) => {
    const targetUrl = response.headers.get('location');
    console.log('targetUrl', targetUrl);
    return targetUrl.match(/code=[^&]+/)?.[0].split('=')[1];
  });

  // 6.get access token
  const accessTokenResult = await fetch(`${host}/am/oauth2/mo/pruserveweb/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Language': 'en'
    },
    body: new URLSearchParams({
      code: code,
      grant_type: 'authorization_code',
      client_id: 'pruservewebClient',
      redirect_uri: 'https://example.com'
    })
  }).then((response) => {
    return response.json();
  });
  const access_token = accessTokenResult.access_token;
  const refresh_token = accessTokenResult.refresh_token;
  console.log('accessTokenResult', accessTokenResult);
  return { accessToken: access_token, refreshToken: refresh_token };
};

/**
 * @param {string} region
 * @returns {Promise<{refreshToken: string, accessToken: string} | string | undefined>}
 */
const getAccessToken = async (region) => {
  if (region === 'MO') {
    return getForgeRockToken();
  }
  const { loginId, password } = LOGIN_CREDENTIALS ?? {};
  const url = `${API_HOST}/services/pulse/identity/auth/login/password`;
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      loginId: loginId,
      password: password
    }),
    headers: {
      'accept-language': `en-${region}`,
      'content-type': 'application/json;charset=UTF-8',
      'neo-device-os': 'web',
      'ocp-apim-subscription-key': CORE_APIM_SUBSCRIPTION_KEY,
      'pru-client': 'web',
      'pru-staging': 'false',
      'pru-tenant': region,
      Referer: 'https://pulse-nprd.wedopulse.com/',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  });

  const data = await res.json();
  return {
    accessToken: data?.data?.accessToken,
    refreshToken: data?.data?.refreshToken
  };
};

/**
 * @returns {{ authorization: string } | undefined}
 */
const formatToken = () => {
  if (accessToken) {
    // return {
    //   authorization: `Bearer ${accessToken}`,
    //   'Pru-Refresh-Token': `Bearer ${refreshToken}`,
    // };
    return {
      accessToken: accessToken.replace(/^(?!Bearer\s*)(.*)/, 'Bearer $1'),
      refreshToken: refreshToken.replace(/^(?!Bearer\s*)(.*)/, 'Bearer $1')
    };
  }
};

/**
 * @param {string} region
 * @returns {Promise<{ authorization: string } | undefined>}
 */
const getAuthorizationHeader = async (region) => {
  try {
    if (!isTokenExpired()) {
      return formatToken();
    }

    if (!isRequestingToken) {
      // If token refresh is required and no request is currently in progress,
      // set isRequestingToken to true and start a new token refresh process
      isRequestingToken = true;
      requestTokenPromise = getAccessToken(region)
        .then((token) => {
          accessToken = token.accessToken;
          refreshToken = token.refreshToken;
        })
        .finally(() => {
          isRequestingToken = false;
        });
    }

    return requestTokenPromise.then(() => {
      return formatToken();
    });
  } catch {
    return undefined;
  }
};

module.exports = { getAuthorizationHeader, setToken };
