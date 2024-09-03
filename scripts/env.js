// only for local code debug, not pipeline
module.exports = {
  BUILD_ENV: 'local', // local dev sit uat prod
  LOCATION: 'my', // my mo ph id
  LBU: 'pamb', // empty for most loaction, for my: pamb, pbtb
  HTTPS: false,
  REPO_NAME: '' // empty default, or your sub repo which you only want to run, such as new-pruservice-common
};
