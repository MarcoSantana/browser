import { app, dialog } from "electron";
import { mainWindow } from "./electron-main";
export function confirmExit() {
  let options = {
    type: "question",
    buttons: ["Si", "No", "Cancelar"],
    message: "¿En realidad quieres cerrar la aplicación?"
  };
  dialog.showMessageBox(mainWindow, options, response => {
    console.log("response 🔈:>> ", response);
    console.log("options :notepad_spiral::>> ", options);

    if (response === 0) {
      app.quit();
      // mainWindow.quit();
    } else if (response === 1) {
      console.log("Response 1 selected");
      event.preventDefault();
    } else if (response === 2) {
      console.log("Cancel button pressed");
      return;
    } // if
  });
}
