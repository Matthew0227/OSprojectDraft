const fs = require('fs');
const path = require('path');
const exe = path.join(__dirname, '..', 'dist', 'win-unpacked', 'GoatOS Learning.exe');
try {
  const now = new Date();
  fs.utimesSync(exe, now, now);
  console.log('updated mtime for', exe);
} catch (e) {
  console.error('failed to update mtime:', e.message);
  process.exitCode = 2;
}
