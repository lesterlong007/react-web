import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from 'src/layout/Layout';

const App: React.FC = () => {

  return (
    <Router basename={process.env.BASENAME}>
      <Layout />
    </Router>
  );
};

export default App;
