import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom/client';
import i18n from 'src/util/i18n';
import App from './App';
import './index.scss';

i18n.init();

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(<App />);
