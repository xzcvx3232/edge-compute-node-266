const http = require('http');

const PORT = process.env.PORT || 8080;
const NODE_ID = 'edge-compute-node-266';

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/process') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const response = {
          nodeId: NODE_ID,
          processedAt: new Date().toISOString(),
          input: payload,
          status: 'success'
        };
        console.log(`[${NODE_ID}] Processed message:`, payload);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'online', 
      node: NODE_ID, 
      uptime: process.uptime() 
    }));
  }
});

server.listen(PORT, () => {
  console.log(`${NODE_ID} initialized and listening on port ${PORT}`);
});