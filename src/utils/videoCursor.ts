export const initVideoSectionCursor = (element: HTMLElement) => {
  // Create cursor element
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: white;
    font-family: abel;
    text-transform: uppercase;
    transform: translate(-50%, -50%);
    z-index: 9999;
    opacity: 0;
  `;
  cursor.textContent = 'Play Video';
  document.body.appendChild(cursor);

  // Check if mouse is within section boundaries
  const isMouseInSection = (mouseY: number) => {
    const rect = element.getBoundingClientRect();
    return mouseY >= rect.top && mouseY <= rect.bottom;
  };

  // Update cursor position and check for interactive elements
  const updateCursorPosition = (e: MouseEvent) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;

    // Check if we're hovering over an interactive element
    const target = e.target as HTMLElement;
    const isInteractive = target.matches('button, a, input, [role="button"], iframe') || 
                         target.closest('button, a, input, [role="button"], iframe') !== null;

    if (!isMouseInSection(e.clientY) || isInteractive) {
      hideCursor();
    } else if (element.contains(target)) {
      showCursor();
    }
  };

  // Handle scroll events
  const handleScroll = () => {
    const mouseY = parseInt(cursor.style.top) || 0;
    if (!isMouseInSection(mouseY)) {
      hideCursor();
    }
  };

  const showCursor = () => {
    cursor.style.transition = 'opacity 0.15s ease-out';
    cursor.style.opacity = '1';
    document.body.style.cursor = 'none';
  };

  const hideCursor = () => {
    cursor.style.transition = 'none';
    cursor.style.opacity = '0';
    document.body.style.cursor = 'auto';
  };

  // Show cursor when entering the section
  const handleMouseEnter = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.matches('button, a, input, [role="button"], iframe') || 
                         target.closest('button, a, input, [role="button"], iframe') !== null;

    if (!isInteractive && isMouseInSection(e.clientY)) {
      showCursor();
    }
  };

  // Hide cursor when leaving the section
  const handleMouseLeave = () => {
    hideCursor();
  };

  // Hide cursor on click
  const handleClick = () => {
    hideCursor();
  };

  // Add event listeners
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);
  element.addEventListener('click', handleClick);
  document.addEventListener('mousemove', updateCursorPosition);
  document.addEventListener('scroll', handleScroll, { passive: true });

  // Return cleanup function
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
    element.removeEventListener('click', handleClick);
    document.removeEventListener('mousemove', updateCursorPosition);
    document.removeEventListener('scroll', handleScroll);
    cursor.remove();
  };
}; 