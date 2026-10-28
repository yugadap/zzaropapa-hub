/**
 * 짜로파파의 AI 연구소 - 로컬 개발 서버 (Zero-Dependency)
 * Node.js 내장 http, fs, path 모듈만 사용하여 외부 설치 없이 즉시 실행됩니다.
 * 실행: node server.js
 * 주소: http://127.0.0.1:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // CORS 및 캐시 방지 헤더 설정 (로컬 개발용)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  // URL 파싱 및 파일 경로 해석
  const reqUrl = new URL(req.url, `http://${req.headers.host || HOST}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(path.join(ROOT_DIR, pathname));

  // 상위 경로 탐색(../) 방지 보안 검사
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden: 접근 권한이 없습니다.');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: 요청하신 파일을 찾을 수 없습니다 (${pathname})`);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('====================================================');
    console.log(` ✅ 허브 페이지 로컬 서버가 이미 실행 중입니다! (http://${HOST}:${PORT})`);
    console.log('====================================================');
    process.exit(0);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

server.listen(PORT, HOST, () => {
  console.log('====================================================');
  console.log(' 🚀 [짜로파파의 AI 연구소] 로컬 서버가 시작되었습니다!');
  console.log(` 🌐 주소: http://${HOST}:${PORT}`);
  console.log(' 💡 종료하려면 콘솔에서 Ctrl + C 를 누르세요.');
  console.log('====================================================');
});
