const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  onWindowStateChange: (cb) => {
    ipcRenderer.on('window-state-changed', (_, state) => cb(state));
  },
});

// Inject CSS to shift elements away from the native titlebar overlay buttons (top-right)
window.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    /* Push the Environments button and tab bar away from overlay buttons */
    button[data-testid="environment-selector-manage"],
    .Tabs_environmentSelector__eZ3hx {
      margin-right: 138px !important;
    }
  `;
  document.head.appendChild(style);
});
