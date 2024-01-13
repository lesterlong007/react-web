import React from 'react';
import { StaticRouter as Router } from 'react-router-dom/server';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n';
import Context from '../src/store';

const { basename } = require('../scripts/common/base');

const App = ({ children, location }) => {
  return (
    <I18nextProvider i18n={i18n}>
      <Context>
        <Router location={location} basename={basename}>{children}</Router>
      </Context>
    </I18nextProvider>
  );
};

export default App;
