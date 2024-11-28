import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import App from './App';
import './index.scss';

const Fallback: React.FC<FallbackProps> = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

window._ROOT_ELEMENT_ID = 'root';
const root = ReactDOM.createRoot(document.getElementById(window._ROOT_ELEMENT_ID)!);

root.render(
  <ErrorBoundary FallbackComponent={Fallback}>
    <App />
  </ErrorBoundary>
);
