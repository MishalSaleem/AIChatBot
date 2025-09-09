const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Server</title>
    </head>
    <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
      <h1>Test Server is Running</h1>
      <p>If you can see this page, your browser can connect to localhost properly.</p>
      <p>This test server is running on port 8888.</p>
      <p>Try accessing <a href="http://localhost:5000">http://localhost:5000</a> for your Next.js app.</p>
    </body>
    </html>
  `);
});

server.listen(8888, '127.0.0.1', () => {
  console.log('Test server running at http://localhost:8888/');
});
