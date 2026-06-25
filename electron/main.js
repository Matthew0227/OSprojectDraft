const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }]);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1024,
    minHeight: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL('app://index.html');
}

app.whenReady().then(() => {
  protocol.registerFileProtocol('app', (request, callback) => {
    try {
      const fs = require('fs');
      // Use URL to reliably parse the incoming request
      const requestUrl = new URL(request.url);
      let requestPath = decodeURIComponent(requestUrl.pathname || '/');

      if (requestPath === '/' || requestPath === '') requestPath = '/index.html';

      // Normalize and remove leading slash
      if (requestPath.startsWith('/')) requestPath = requestPath.slice(1);

      let filePath = path.join(__dirname, '../out', requestPath);

      // If path points to a directory, try index.html
      if (filePath.endsWith(path.sep)) {
        filePath = path.join(filePath, 'index.html');
      }

      // If no extension provided, attempt .html
      if (!path.extname(filePath)) {
        if (fs.existsSync(filePath + '.html')) {
          filePath = filePath + '.html';
        } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
          filePath = path.join(filePath, 'index.html');
        }
      }

      // Final fallback to index.html so client-side routing can handle unknown routes
      if (!fs.existsSync(filePath)) {
        filePath = path.join(__dirname, '../out/index.html');
      }

      callback({ path: filePath });
    } catch (err) {
      callback({ error: -6 });
    }
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
