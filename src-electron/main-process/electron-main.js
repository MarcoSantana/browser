import { app, BrowserWindow, nativeTheme, screen, dialog } from "electron";
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
    frame: true,
    fullscreen: false,
    kiosk: false,
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
  // Manage window events
  mainWindow.on("beforeunload", event => {
    console.log("event beforeunload:>> ", event);
    // return confirmExit();
  });
  mainWindow.on("close", event => {
    // console.log("event close:>> ", event);

    let options = {
      type: "question",
      buttons: ["Si", "No", "Cancelar"],
      message: "¿En realidad quieres cerrar la aplicación?",
      normalizeAccessKey: true
    };

    let res = dialog.showMessageBoxSync(mainWindow, options, response => {
      console.log("response :>> ", response);
      console.log("options :>> ", options);
      return response;
    }); // dialogMessageBox

    if (res === 0) {
      console.log("Selected 0 i.e. Si");
      // mainWindow.destroy();
      // app.quit();
    } else if (res === 1) {
      event.preventDefault();
      console.log("Response 1 selected");
    } else if (res === 2) {
      console.log("Cancel button pressed");
    } // if
    console.log("res :>>", res);
    return res;
    // return confirmExit();
  });
  mainWindow.on("before-quit", () => {
    console.log("event beforequit:>> ", event);
    // return confirmExit();
  });
  mainWindow.on("ready", () => {
    console.log("event ready:>> ", event);
    setGlobalShortcuts();
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
    kiosk: false,
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
  setGlobalShortcuts();
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

function showAlert(message) {
  dialog.showAlert(message);
}

// app.on("ready", createAllWindows);
app.on("browser-window-blur", event => {
  // event.preventDefault();
});

app.on("before-quit", event => {
  // console.log("before-quit:>> ", event);
  // confirmExit();
});
app.on("ready", async () => {
  createAllWindows();
  // setGlobalShortcuts();
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
