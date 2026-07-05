const http = require('http');
const fs = require('fs');
const path = require('path');

const mime = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const ROOT = __dirname;

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  // decode %20 spaces etc.
  try { urlPath = decodeURIComponent(urlPath); } catch(e) {}

  // default to index.html
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  // resolve file path safely
  const filePath = path.join(ROOT, urlPath);

  // prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log('404:', filePath);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + urlPath);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(5000, '127.0.0.1', () => {
  console.log('Server running at http://localhost:5000');
  console.log('Root directory:', ROOT);
});
