import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<App />);

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  const lbu = process.env.LOCATION?.toLowerCase();
  if (lbu === 'my') {
    const files = require.context('../src/', true, /my.tsx/);
    console.log(files.keys())
  }  
}
