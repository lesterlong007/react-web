// uat env variables config for PCLA
module.exports = {
  BASENAME:
    'eval(\'/prulifeuk\\.com\\.ph/.test(window.location.hostname)?"/uat/pruservice-pages":"/uat/ph/pruservice-pages"\')',
  FAVICON_PATH: '/uat/icons/pru-icon-32x32.png',
  API_HOST:
    'eval(\'/prulifeuk\\.com\\.ph/.test(window.location.hostname)?"/uat/v1":"https://api-uat.pulse.wedopulse.com/uat/v1"\')',
  WEB_PDF_HOST:
    'eval(\'/prulifeuk\\.com\\.ph/.test(window.location.hostname)?"https://pruservices-nprd.prulifeuk.com.ph/uat/pruservice-static":"https://pulse-nprd.wedopulse.com/uat/pruservice-static"\')'
};
