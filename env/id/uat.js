// uat env variables config for PCLA
module.exports = {
  BASENAME:
    'eval(\'/prudential\\.co\\.id/.test(window.location.hostname)?"/uat/pruservice-pages":"/uat/id/pruservice-pages"\')',
  FAVICON_PATH: '/uat/icons/pru-icon-32x32.png',
  API_HOST:
    'eval(\'/prudential\\.co\\.id/.test(window.location.hostname)?"/uat/v1":"https://api-uat.pulse.wedopulse.com/uat/v1"\')',
  WEB_PDF_HOST:
    'eval(\'/prudential\\.co\\.id/.test(window.location.hostname)?"https://pruservices-nprd.prudential.co.id/uat/pruservice-static":"https://pulse-nprd.wedopulse.com/uat/pruservice-static"\')'
};
