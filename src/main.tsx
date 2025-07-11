import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './styles/globals.css'
import { scrollManager } from './utils/scrollManager'
import './utils/gsap'

// Import fonts
// @fontsource packages only include latin subset by default. No cyrillic or vietnamese fonts are included.
import '@fontsource/montserrat/400.css'; // Regular
import '@fontsource/montserrat/700.css'; // Bold
import '@fontsource/nunito-sans/400.css'; // Regular
import '@fontsource/nunito-sans/600.css'; // SemiBold
import '@fontsource/abel/400.css'; // Regular

// Initialize smooth scrolling
scrollManager.init();

function isSafari() {
  // This will match Safari but not Chrome or Edge
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

if (!isSafari() && CSS.supports('scroll-snap-type: y mandatory')) {
  if (!document.getElementById('dynamic-scroll-snap-style')) {
    const style = document.createElement('style');
    style.id = 'dynamic-scroll-snap-style';
    style.textContent = `
      *, ::after, ::before {
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        scroll-snap-type: y mandatory;
        scroll-snap-align: start;
      }
    `;
    document.head.appendChild(style);
  }
} else {
  const style = document.getElementById('dynamic-scroll-snap-style');
  if (style) style.remove();
}

if (CSS.supports('scroll-snap-type: y mandatory')) {
  document.documentElement.classList.add('supports-scroll-snap');
} else {
  document.documentElement.classList.remove('supports-scroll-snap');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
