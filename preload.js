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

// Inject CSS to shift elements away from the titlebar controls (top-right).
// On Windows the caption buttons are drawn inside the web content via
// titleBarOverlay, so we need a wide margin. On Linux/macOS the window manager
// draws the controls in the native frame, so only a small gap is needed.
window.addEventListener('DOMContentLoaded', () => {
  const overlayMargin = process.platform === 'win32' ? 138 : 100;
  const style = document.createElement('style');
  style.textContent = `
    /* Push the Environments button and tab bar away from the window controls */
    button[data-testid="environment-selector-manage"],
    .Tabs_environmentSelector__eZ3hx {
      margin-right: ${overlayMargin}px !important;
    }
  `;
  document.head.appendChild(style);
});
