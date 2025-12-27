import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/reset.css';
import './styles/global.css';
import './styles/variables.css';
import './i18n';

import App from './App.tsx';
import { SettingsProvider } from './context/SettingsContext.tsx';
import { ProgressProvider } from './context/ProgressContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </SettingsProvider>
  </StrictMode>
);
