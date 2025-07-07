// Utility to inject scroll-snap CSS if supported by the browser
/**
 * Injects scroll-snap CSS if the browser supports scroll-snap-type.
 * @returns {void}
 */
export function injectScrollSnapCss() {
  // Create a test element to check for scroll-snap-type support
  const testEl = document.createElement('div');
  testEl.style.scrollSnapType = 'y mandatory';
  if (testEl.style.scrollSnapType === 'y mandatory') {
    const style = document.createElement('style');
    style.textContent = `
      *,
      ::after,
      ::before {
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        scroll-snap-type: y mandatory;
        scroll-snap-align: start;
      }
    `;
    document.head.appendChild(style);
  }
} 