// dev env variables config for PCLA
module.exports = {
  BASENAME:
    'eval(\'/prudential\\.co\\.id/.test(window.location.hostname)?"/dev/pruservice-pages":"/dev/id/pruservice-pages"\')',
  API_HOST:
    'eval(\'/prudential\\.co\\.id/.test(window.location.hostname)?"/dev/v1":"https://api-uat.pulse.wedopulse.com/dev/v1"\')',
  WEB_PDF_HOST:
    'eval(\'/prudential\\.co\\.id/.test(window.location.hostname)?"https://pruservices-nprd.prudential.co.id/dev/pruservice-static":"https://pulse-nprd.wedopulse.com/dev/pruservice-static"\')'
};
