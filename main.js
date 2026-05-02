const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

// Icon path: in dev it's in __dirname, in production it's in resources/
const iconPath = app.isPackaged
  ? path.join(process.resourcesPath, 'icon.ico')
  : path.join(__dirname, 'icon.ico');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#191515',
      symbolColor: '#ffffff',
      height: 36,
    },
    icon: iconPath,
    backgroundColor: '#191515',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Show loading screen first
  mainWindow.loadFile(path.join(__dirname, 'loading.html'));
  mainWindow.show();

  // Navigate to HTTPie once loading screen is rendered
  mainWindow.webContents.on('did-finish-load', () => {
    const url = mainWindow.webContents.getURL();
    if (url.startsWith('file://')) {
      mainWindow.loadURL('https://httpie.io/app');
    }
  });

  mainWindow.on('maximize', () => mainWindow.webContents.send('window-state-changed', 'maximized'));
  mainWindow.on('unmaximize', () => mainWindow.webContents.send('window-state-changed', 'normal'));
  mainWindow.on('minimize', () => mainWindow.webContents.send('window-state-changed', 'minimized'));
  mainWindow.on('restore', () => mainWindow.webContents.send('window-state-changed', 'normal'));
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.httpie.desktop');
  createWindow();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

ipcMain.on('window-minimize', (e) => BrowserWindow.fromWebContents(e.sender).minimize());
ipcMain.on('window-maximize', (e) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  win.isMaximized() ? win.unmaximize() : win.maximize();
});
ipcMain.on('window-close', (e) => BrowserWindow.fromWebContents(e.sender).close());
ipcMain.handle('window-is-maximized', (e) => BrowserWindow.fromWebContents(e.sender).isMaximized());
