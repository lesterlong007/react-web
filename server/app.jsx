import React, { useEffect, useState, createElement } from 'react';
// import { StaticRouter as Router } from 'react-router-dom/server';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n';
import Context from '../src/store';

const { basename } = require('../scripts/common/base');

const loadComponent = async () => {
  const res = await import(`../src/views${location.replace(basename, '')}/index.tsx`);
  console.log(res);
  return res.default;
};

const App = ({ location }) => {
  console.log('location, ', location);
  const [component, setComponent] = useState(null);

  if (!component) {
    return <div>Loading...</div>;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <Context>
       { createElement(component) }
      </Context>
    </I18nextProvider>
  );
};

export default App;
