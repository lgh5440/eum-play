import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// GitHub Pages SPA fallback — 404.html이 sessionStorage에 보관한 경로를 복원.
const redirected = sessionStorage.getItem('eum-redirect')
if (redirected) {
  sessionStorage.removeItem('eum-redirect')
  if (redirected !== location.pathname + location.search + location.hash) {
    history.replaceState(null, '', redirected)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
