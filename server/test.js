console.log('=== Node.js Startup Test ===');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Current working directory:', process.cwd());
console.log('Environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('===========================');

// Simple HTTP server for testing
const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <h1>Node.js is Working!</h1>
    <p>Node.js version: ${process.version}</p>
    <p>Platform: ${process.platform}</p>
    <p>PORT: ${port}</p>
    <p>NODE_ENV: ${process.env.NODE_ENV}</p>
    <p>Current time: ${new Date().toISOString()}</p>
  `);
});

server.listen(port, () => {
  console.log(`✅ Test server running on port ${port}`);
});

module.exports = server;
