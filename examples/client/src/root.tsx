import { hydrateRoot } from 'react-dom/client';

import { App } from './app/App';

const root = document.getElementById('root');
if (root === null) throw new Error('No root element found');
hydrateRoot(root, <App />);
