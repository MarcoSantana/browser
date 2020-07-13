import {
  globalShortcut,
  dialog
} from "electron";
import { confirmExit } from "./confirmExit";
import { mainWindow } from "./electron-main";
export function setGlobalShortcuts() {
  // Reset
  globalShortcut.unregisterAll();
  // Ctrl+Tab to avoid tab switch and whatever
  globalShortcut.register("CmdOrCtrl+Tab", () => {
    console.log("CmdOrCtrl+Tab was pressed");
    return;
  });
  // Alt + tab (switch windows)
  globalShortcut.register("Alt+Tab", () => {
    console.log("Alt+Tab was pressed");
    return;
  });
  // PrintScreen to avoid screenshots
  globalShortcut.register("PrintScreen", () => {
    console.log("PrintScreen was pressed");
    return;
  });
  // Super because super
  globalShortcut.register("Super", () => {
    console.log("Super was pressed");
    return;
  });

  globalShortcut.unregister("CmdOrCtrl+q");
  globalShortcut.unregister("Ctrl+q");

  globalShortcut.register("Ctrl+q", () => {
    //asynchronous usage
    let options = {
      buttons: ["Yes", "No", "Cancel"],
      message: "Do you really want to quit? from my local shortcuts"
    };
    let foo = dialog.showMessageBox(mainWindow, options, response => {
      console.log("response :>> ", response);

      if (response === 0) {
        console.log("Response 0 selected");
        confirmExit();
      }
      else if (response === 1) {
        console.log("Response 1 selected");
      }
      else if (response === 2) {
        console.log("Cancel button pressed");
      }
    });
    return foo;
  });

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
