// sit env variables config for PCLA
module.exports = {
  BASENAME:
    'eval(\'/prulifeuk\\.com\\.ph/.test(window.location.hostname)?"/sit/pruservice-pages":"/sit/ph/pruservice-pages"\')',
  API_HOST:
    'eval(\'/prulifeuk\\.com\\.ph/.test(window.location.hostname)?"/sit/v1":"https://api-uat.pulse.wedopulse.com/sit/v1"\')',
  WEB_PDF_HOST:
    'eval(\'/prulifeuk\\.com\\.ph/.test(window.location.hostname)?"https://pruservices-nprd.prulifeuk.com.ph/sit/pruservice-static":"https://pulse-nprd.wedopulse.com/sit/pruservice-static"\')',
  FAVICON_PATH: '/sit/icons/pru-icon-32x32.png'
};
