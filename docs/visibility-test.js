console.log('VISIBILITY: Testing if content is just invisible');

// Wait for the app to load
setTimeout(() => {
  const root = document.getElementById('root');
  console.log('VISIBILITY: Root element:', root);
  console.log('VISIBILITY: Root innerHTML length:', root?.innerHTML?.length || 0);
  console.log('VISIBILITY: Root innerHTML:', root?.innerHTML || 'EMPTY');
  
  // Check if there are any elements with zero opacity or hidden
  const allElements = root?.querySelectorAll('*') || [];
  console.log('VISIBILITY: Total elements in root:', allElements.length);
  
  let hiddenElements = 0;
  let transparentElements = 0;
  
  allElements.forEach((el, index) => {
    const styles = window.getComputedStyle(el);
    if (styles.display === 'none' || styles.visibility === 'hidden') {
      hiddenElements++;
      console.log(`VISIBILITY: Hidden element ${index}:`, el.tagName, el.className);
    }
    if (styles.opacity === '0' || styles.color === 'transparent') {
      transparentElements++;
      console.log(`VISIBILITY: Transparent element ${index}:`, el.tagName, el.className, 'opacity:', styles.opacity, 'color:', styles.color);
    }
  });
  
  console.log('VISIBILITY: Hidden elements:', hiddenElements);
  console.log('VISIBILITY: Transparent elements:', transparentElements);
  
  // Add a visible overlay to test
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 0, 0, 0.8);
    color: white;
    padding: 20px;
    z-index: 9999;
    font-family: Arial, sans-serif;
    font-size: 18px;
  `;
  overlay.innerHTML = `
    <h1>VISIBILITY TEST OVERLAY</h1>
    <p>If you can see this red overlay, then JavaScript is working.</p>
    <p>Root element has ${allElements.length} child elements.</p>
    <p>Hidden elements: ${hiddenElements}</p>
    <p>Transparent elements: ${transparentElements}</p>
    <button onclick="this.parentElement.remove()" style="padding: 10px; font-size: 16px; margin-top: 20px;">Remove This Overlay</button>
    <div style="margin-top: 20px; background: rgba(0,0,0,0.5); padding: 10px; border-radius: 5px; max-height: 200px; overflow-y: auto;">
      <strong>Root Content:</strong><br>
      <pre style="white-space: pre-wrap; font-size: 12px;">${root?.innerHTML?.substring(0, 500) || 'EMPTY'}${root?.innerHTML?.length > 500 ? '...' : ''}</pre>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
}, 3000);
