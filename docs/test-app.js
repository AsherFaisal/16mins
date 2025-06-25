// Test script to debug the app loading
console.log('TEST: Script loaded');
console.log('TEST: Document ready state:', document.readyState);
console.log('TEST: Root element exists:', !!document.getElementById('root'));
console.log('TEST: Current URL:', window.location.href);
console.log('TEST: Base URL:', window.location.origin);

// Check if the main JS file is loading
console.log('TEST: Checking for main JS file...');
fetch('/16mins/assets/index-CoPxxsmA.js')
  .then(response => {
    console.log('TEST: Main JS file response status:', response.status);
    console.log('TEST: Main JS file response headers:', [...response.headers.entries()]);
    return response.text();
  })
  .then(text => {
    console.log('TEST: Main JS file size:', text.length, 'characters');
    console.log('TEST: Main JS file starts with:', text.substring(0, 100));
  })
  .catch(error => {
    console.error('TEST: Failed to fetch main JS file:', error);
  });

// Check if CSS is loading
fetch('/16mins/assets/index-m623uHXE.css')
  .then(response => {
    console.log('TEST: CSS file response status:', response.status);
    return response.text();
  })
  .then(text => {
    console.log('TEST: CSS file size:', text.length, 'characters');
  })
  .catch(error => {
    console.error('TEST: Failed to fetch CSS file:', error);
  });

// Monitor for any errors
window.addEventListener('error', (event) => {
  console.error('TEST: Global error:', event.error);
  console.error('TEST: Error message:', event.message);
  console.error('TEST: Error filename:', event.filename);
  console.error('TEST: Error line:', event.lineno);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('TEST: Unhandled promise rejection:', event.reason);
});

// Check if React is loading
setTimeout(() => {
  console.log('TEST: Checking React after 2 seconds...');
  console.log('TEST: Root element content:', document.getElementById('root')?.innerHTML || 'EMPTY');
  console.log('TEST: Body content length:', document.body.innerHTML.length);
}, 2000);
