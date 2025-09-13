const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Settings management
  getSetting: (key) => ipcRenderer.invoke('get-setting', key),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),
  
  // Text enhancement
  enhanceText: (text, mode, provider) => ipcRenderer.invoke('enhance-text', { text, mode, provider }),
  
  // API key testing
  testApiKey: (apiKey, provider) => ipcRenderer.invoke('test-api-key', apiKey, provider),
  
  // Get available providers
  getAvailableProviders: () => ipcRenderer.invoke('get-available-providers'),
  
  // App info
  getVersion: () => process.versions.electron,
  getPlatform: () => process.platform,
});