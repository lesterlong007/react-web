const viewList = [];

const originalPushState = window.history.pushState;
const originalReplaceState = window.history.replaceState;

function preRender (pathName) {
  console.log('pre render for: ' + pathName);
  const { content } = viewList.find((vw) => vw.path.endsWith(pathName)) || {};
  if (content) {
    document.getElementById('root').innerHTML = content;
  }
}

window.history.pushState = function (...args) {
  const pathName = args[args.length - 1];
  preRender(pathName);
  originalPushState(...args);
};

window.history.replaceState = function (...args) {
  const pathName = args[args.length - 1];
  if (pathName) {
    preRender(pathName);
    originalReplaceState(...args);
  }
};

window.addEventListener('popstate', () => {
  //   console.log(window.location.pathname);
});

window.addEventListener('load', () => {
  console.log('loaded', viewList);
  preRender(window.location.pathname);
  //   console.log(window.location.pathname);
});
