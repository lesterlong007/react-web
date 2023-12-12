import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from 'src/layout/Layout';

const App: React.FC = () => {
  return (
    <Router basename="/react-web">
      <Layout />
    </Router>
  );
};

export default App;
