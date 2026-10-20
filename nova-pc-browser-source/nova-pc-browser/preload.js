const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('novaAPI', {
  getVersion: () => ipcRenderer.invoke('nova:get-version')
});
