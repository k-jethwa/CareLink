import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('Main.jsx loading...');

try {
  const rootElement = document.getElementById('root');
  console.log('Root element found:', rootElement);
  
  if (rootElement) {
    const root = createRoot(rootElement);
    console.log('React root created:', root);
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    console.log('App rendered successfully');
  } else {
    console.error('Root element not found!');
  }
} catch (error) {
  console.error('Error in main.jsx:', error);
}
