// prod env variables config for PCLA
module.exports = {
  BASENAME:
    'eval(\'/prudential\\.co\\.id/.test(window.location.hostname)?"/pruservice-pages":"/id/pruservice-pages"\')',
  API_HOST:
    'eval(\'/prudential\\.co\\.id/.test(window.location.hostname)?"/v1":"https://api.pulse.wedopulse.com/v1"\')',
  WEB_PDF_HOST:
    'eval(\'/prudential\\.co\\.id/.test(window.location.hostname)?"https://pruservices.prudential.co.id/pruservice-static":"https://pulse.wedopulse.com/pruservice-static"\')'
};
