const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    frame: true, // Will make frameless later for custom title bar
    backgroundColor: '#1a0f2e', // Deep purple-black from design
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Simplified for MVP, secure later
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../../assets/icons/icon.png')
  });

  // In development, load from file. In production, load built files.
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    mainWindow.webContents.openDevTools(); // Auto-open DevTools in dev
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
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

// IPC handlers for renderer communication
ipcMain.handle('send-message', async (event, message) => {
  // TODO: Send to OpenClaw gateway
  console.log('Message from renderer:', message);
  return { success: true, reply: 'Echo: ' + message };
});

ipcMain.handle('get-config', async () => {
  // Load OpenClaw gateway configuration
  // These can be set via environment variables or a config file
  return {
    gatewayUrl: process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789',
    gatewayToken: process.env.OPENCLAW_GATEWAY_TOKEN || ''
  };
});

console.log('Vie Desktop starting...');
