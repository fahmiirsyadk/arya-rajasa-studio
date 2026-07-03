import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// NOTE: StrictMode intentionally disabled to avoid dev-only double-invocation
// of effects tearing down and recreating the WebGL context on the carousel canvas.
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
