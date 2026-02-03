const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    frame: true,
    backgroundColor: '#1a0f2e',
    show: false, // Don't show until ready
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '..', '..', 'assets', 'icons', 'icon.png')
  });

  // Load index.html
  const indexPath = path.join(__dirname, '..', 'renderer', 'index.html');
  console.log('Loading index.html from:', indexPath);
  
  mainWindow.loadFile(indexPath).then(() => {
    console.log('✓ Loaded index.html successfully');
  }).catch(err => {
    console.error('✗ Failed to load index.html:', err);
  });
  
  // Show window once ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('✓ Window shown');
  });
  
  // Open DevTools
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // Log any console messages from renderer
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Renderer] ${message}`);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('send-message', async (event, message) => {
  console.log('Message from renderer:', message);
  return { success: true, reply: 'Echo: ' + message };
});

ipcMain.handle('get-config', async () => {
  return {
    gatewayUrl: process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789',
    gatewayToken: process.env.OPENCLAW_GATEWAY_TOKEN || ''
  };
});

console.log('Vie Desktop starting...');
console.log('App path:', app.getAppPath());
console.log('__dirname:', __dirname);
