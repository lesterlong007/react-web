import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import Layout from 'src/layout/Layout';
import i18n from 'src/util/i18n';

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <Router basename={process.env.BASENAME}>
        <Layout />
      </Router>
    </I18nextProvider>
  );
};

export default App;
