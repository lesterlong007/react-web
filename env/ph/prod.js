// prod env variables config for PCLA
module.exports = {
  BASENAME:
    'eval(\'/prulifeuk\\.com\\.ph/.test(window.location.hostname)?"/pruservice-pages":"/ph/pruservice-pages"\')',
  API_HOST:
    'eval(\'/prulifeuk\\.com\\.ph/.test(window.location.hostname)?"/v1":"https://api.pulse.wedopulse.com/v1"\')',
  WEB_PDF_HOST:
    'eval(\'/prulifeuk\\.com\\.ph/.test(window.location.hostname)?"https://pruservices.prulifeuk.com.ph/pruservice-static":"https://pulse.wedopulse.com/pruservice-static"\')',
  FAVICON_PATH: '/icons/pru-icon-32x32.png'
};
