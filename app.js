#!/usr/bin/env node

// Azure Web App startup file
console.log('Azure Web App starting up...');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Working directory:', process.cwd());

// Start the main application
import('./server/index.js');
