import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/fraunces/latin-300.css';
import '@fontsource/fraunces/latin-300-italic.css';
import '@fontsource/fraunces/latin-600.css';
import '@fontsource/plus-jakarta-sans/latin-400.css';
import '@fontsource/plus-jakarta-sans/latin-600.css';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
