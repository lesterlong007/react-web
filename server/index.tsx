import express, { Response } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import App from '../src/App';

const app = express();

app.get('/', (_: unknown, res: Response) => {
  res.send(renderToString(<App />));
});

app.listen(5000, () => {
  console.log('Listening on port 5000');
});

hydrateRoot(document.getElementById('root')!, <App />);
