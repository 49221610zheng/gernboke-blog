// 简单的HTTP服务器用于测试
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;

// MIME类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'text/plain';
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Internal Server Error</h1>');
      }
    } else {
      res.writeHead(200, { 'Content-Type': getContentType(filePath) });
      res.end(content);
    }
  });
}

const server = http.createServer((req, res) => {
  // 解析URL
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // 处理根路径
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  // 处理admin路径
  if (pathname === '/admin' || pathname === '/admin/') {
    pathname = '/admin.html';
  }
  
  // 构建文件路径
  const filePath = path.join(__dirname, pathname);
  
  // 检查文件是否存在
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // 文件不存在，返回404
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <head><title>404 - Not Found</title></head>
          <body>
            <h1>404 - File Not Found</h1>
            <p>The requested file <code>${pathname}</code> was not found.</p>
            <p><a href="/">Go to Homepage</a></p>
          </body>
        </html>
      `);
    } else {
      // 文件存在，提供服务
      serveFile(res, filePath);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}/`);
  console.log(`📱 Homepage: http://localhost:${PORT}/`);
  console.log(`🔧 Admin: http://localhost:${PORT}/admin`);
  console.log(`\n✅ Server started successfully!`);
  console.log(`📝 Press Ctrl+C to stop the server`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log(`💡 Try using a different port or stop the existing server`);
  } else {
    console.error(`❌ Server error: ${err.message}`);
  }
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
