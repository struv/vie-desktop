// Preload script - bridges main and renderer processes
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message) => ipcRenderer.invoke('send-message', message),
  getConfig: () => ipcRenderer.invoke('get-config'),
  onResponse: (callback) => ipcRenderer.on('message-response', callback)
});

console.log('Preload script loaded');
