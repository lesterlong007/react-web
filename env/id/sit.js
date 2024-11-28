// sit env variables config for PCLA
module.exports = {
  BASENAME:
    'eval(\'/prudential\\.co\\.id/.test(window.location.hostname)?"/sit/pruservice-pages":"/sit/id/pruservice-pages"\')',
  API_HOST:
    'eval(\'/prudential\\.co\\.id/.test(window.location.hostname)?"/sit/v1":"https://api-uat.pulse.wedopulse.com/sit/v1"\')',
  WEB_PDF_HOST:
    'eval(\'/prudential\\.co\\.id/.test(window.location.hostname)?"https://pruservices-nprd.prudential.co.id/sit/pruservice-static":"https://pulse-nprd.wedopulse.com/sit/pruservice-static"\')'
};
