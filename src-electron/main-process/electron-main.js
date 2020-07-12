import {
  app,
  BrowserWindow,
  nativeTheme,
  screen} from "electron";
import { log } from "console";
import { confirmExit } from "./confirmExit";
import { setGlobalShortcuts } from "./setGlobalShortcuts";

try {
  if (
    process.platform === "win32" &&
    nativeTheme.shouldUseDarkColors === true
  ) {
    require("fs").unlinkSync(
      require("path").join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname;
}

//function to create a window for each display (discriminating between main a d secondary)
function createAllWindows() {
  //Get all connected displays
  let displays = screen.getAllDisplays();
  // Store all windows for later use
  let windows = [];
  // Iterate displays and create windows
  displays.forEach(display => {
    if (display.bounds.x == 0) {
      windows.push(createMainWindow(display));
    } else {
      windows.push(createSecondaryWindow(display));
    }
  }); // displays.foreach
} // createAllWindows

// Returns the main window which in most cases will be the only one
export let mainWindow;
function createMainWindow(display) {
  let { width, height } = display.workAreaSize;
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    fullscreen: true,
    kiosk: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  }); // mainWindow
  mainWindow.loadURL(process.env.APP_URL);
  mainWindow.on("beforeunload", event => {
    console.log("event :>> ", event);
  });
  mainWindow.on("close", event => {
    return confirmExit();
  });
  return mainWindow;
} // createMainWindow

// Returns a dummy window to fill up the space and make unusable not primary
// display
function createSecondaryWindow(display) {
  let { width, height } = display.workAreaSize;
  let window;
  window = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    fullscreen: true,
    kiosk: true,
    x: display.bounds.x + 50,
    y: display.bounds.y + 50,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  }); // window
  return window;
} // createSecondaryWindow

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    frame: false,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  });

  mainWindow.loadURL(process.env.APP_URL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// app.on("ready", createAllWindows);
app.on("ready", async () => {
  createAllWindows();
  setGlobalShortcuts();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});


