// This is a test to see if we can create a simple React app without service worker
// We'll inject this into the page to override the main app

console.log('TEST: Loading no-SW app override');

// Wait for React to be available
const waitForReact = () => {
  return new Promise((resolve) => {
    const checkReact = () => {
      if (window.React && window.ReactDOM) {
        resolve();
      } else {
        setTimeout(checkReact, 100);
      }
    };
    checkReact();
  });
};

// Simple test component
const TestApp = () => {
  console.log('TEST: TestApp component rendering');
  
  return React.createElement('div', {
    style: {
      padding: '20px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }
  }, [
    React.createElement('h1', { key: 'title', style: { color: '#333' } }, '16mins Test App (No SW)'),
    React.createElement('p', { key: 'desc', style: { color: '#666' } }, 'This is a test version without service worker registration.'),
    React.createElement('div', { 
      key: 'status',
      style: { 
        padding: '10px', 
        backgroundColor: '#d4edda', 
        border: '1px solid #c3e6cb',
        borderRadius: '4px',
        marginTop: '20px'
      } 
    }, 'React is working! The issue is not with React itself.'),
    React.createElement('button', {
      key: 'btn',
      onClick: () => alert('Button clicked!'),
      style: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        marginTop: '20px',
        cursor: 'pointer'
      }
    }, 'Test Button')
  ]);
};

// Override the main app when React is ready
waitForReact().then(() => {
  console.log('TEST: React is available, overriding main app');
  
  // Clear the root and render our test app
  const root = document.getElementById('root');
  if (root) {
    // Clear existing content
    root.innerHTML = '';
    
    // Create React root and render
    if (window.ReactDOM.createRoot) {
      // React 18+
      const reactRoot = window.ReactDOM.createRoot(root);
      reactRoot.render(React.createElement(TestApp));
    } else {
      // React 17 and below
      window.ReactDOM.render(React.createElement(TestApp), root);
    }
    
    console.log('TEST: Test app rendered successfully');
  } else {
    console.error('TEST: Root element not found');
  }
}).catch(error => {
  console.error('TEST: Failed to load React:', error);
});
