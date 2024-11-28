// dev env variables config for PCLA
module.exports = {
  BASENAME:
    'eval(\'/prulifeuk\\.com\\.ph/.test(window.location.hostname)?"/dev/pruservice-pages":"/dev/ph/pruservice-pages"\')',
  API_HOST:
    'eval(\'/prulifeuk\\.com\\.ph/.test(window.location.hostname)?"/dev/v1":"https://api-uat.pulse.wedopulse.com/dev/v1"\')',
  WEB_PDF_HOST:
    'eval(\'/prulifeuk\\.com\\.ph/.test(window.location.hostname)?"https://pruservices-nprd.prulifeuk.com.ph/dev/pruservice-static":"https://pulse-nprd.wedopulse.com/dev/pruservice-static"\')',
  FAVICON_PATH: '/dev/icons/pru-icon-32x32.png'
};
