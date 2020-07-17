import { globalShortcut, dialog } from "electron";
import { confirmExit } from "./confirmExit";
import { mainWindow } from "./electron-main";
export function setGlobalShortcuts() {
  // Reset
  globalShortcut.unregisterAll();
  // Ctrl+Tab to avoid tab switch and whatever
  // globalShortcut.register("CmdOrCtrl+Tab", () => {
  globalShortcut.register("cmdorctrl+tab", () => {
    console.log("CmdOrCtrl+Tab was pressed");
    return;
  });
  // Alt + tab (switch windows)
  globalShortcut.register("alt+tab", () => {
    console.log("Alt+Tab was pressed");
    dialog.showMessageBox("Alt+Tab was pressed");
    return false;
  });
  // PrintScreen to avoid screenshots
  globalShortcut.register("printscreen", () => {
    console.log("PrintScreen was pressed");
    return false;
  });
  // Super because super
  globalShortcut.register("super", () => {
    console.log("Super was pressed");
    return false;
  });

  // globalShortcut.unregister("CmdOrCtrl+q");
  // globalShortcut.unregister("CmdOrCtrl+q");
  // globalShortcut.unregister("ctrl+q");

  // globalShortcut.register("ctrl+q", () => {
  //   console.log("ctrl+q was pressed");
  //   app.quit();
  // });

  // globalShortcut.register("cmdorctrl+q", () => {
  //   app.quit();
  // });

  console.log("globalShortcuts set");

  return true;
}

/*Notes
 *
 * So far none of this is working specially in Windows
 *
 * Some reference:
 * https://stackoverflow.com/questions/45138838/disable-keyboard-shortcuts-alt-tab-in-electron-application
 * */
