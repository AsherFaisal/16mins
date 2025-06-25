console.log('STATE: Debugging app state and routing');

setTimeout(() => {
  // Check localStorage
  console.log('STATE: localStorage contents:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`STATE: ${key} = ${value}`);
  }
  
  // Check current URL and routing
  console.log('STATE: Current URL:', window.location.href);
  console.log('STATE: Pathname:', window.location.pathname);
  console.log('STATE: Hash:', window.location.hash);
  console.log('STATE: Search:', window.location.search);
  
  // Check if the app is stuck in a particular state
  const root = document.getElementById('root');
  if (root) {
    console.log('STATE: Root content preview:', root.innerHTML.substring(0, 200));
    
    // Look for specific elements that should be visible
    const onboardingElements = root.querySelectorAll('[class*="onboarding"], [class*="card"], h1, h2');
    console.log('STATE: Found potential content elements:', onboardingElements.length);
    
    onboardingElements.forEach((el, index) => {
      const styles = window.getComputedStyle(el);
      console.log(`STATE: Element ${index}:`, {
        tagName: el.tagName,
        className: el.className,
        textContent: el.textContent?.substring(0, 50),
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        position: styles.position,
        zIndex: styles.zIndex
      });
    });
  }
  
  // Try to force a state change by clearing localStorage
  console.log('STATE: Clearing localStorage to reset app state...');
  localStorage.clear();
  
  // Add a button to manually reload
  const button = document.createElement('button');
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  `;
  button.textContent = 'Reload Page';
  button.onclick = () => window.location.reload();
  document.body.appendChild(button);
  
}, 2000);
