const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

// Conditionally include the dev tools installer to load React Dev Tools
let mainWin; let installExtension; let REACT_DEVELOPER_TOOLS;

const PUBLIC = path.join(__dirname, '../public');
const PLATFORM = process.platform;

if (isDev) {
  // eslint-disable-next-line global-require
  const devTools = require('electron-devtools-installer');
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;
}

const createMainWindow = () => {
  mainWin = new BrowserWindow({
    center: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWin.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${PUBLIC}/index.html)`,
  );

  // Only show the main window when it is ready
  // this prevents an unfinished window from showing briefly
  mainWin.on('ready-to-show', () => {
    mainWin.show();
  });

  // Deconstruct the main window when it is closed
  mainWin.on('closed', () => {
    mainWin = null;
  });

  // Open the browser dev tools and install React Dev Tools if we are in dev env
  if (isDev) {
    mainWin.webContents.openDevTools({ mode: 'detach' });

    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`));
  }
};

app.whenReady().then(() => {
  createMainWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (PLATFORM !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
