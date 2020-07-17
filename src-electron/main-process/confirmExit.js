import { app, dialog } from "electron";
import { mainWindow } from "./electron-main";
const confirmExit = function confirmExit() {
  let options = {
    type: "question",
    buttons: ["Si", "No", "Cancelar"],
    message: "¿En realidad quieres cerrar la aplicación?"
  };
  let res = dialog.showMessageBoxSync(mainWindow, options, response => {
    console.log("response :>> ", response);
    console.log("options :>> ", options);
    return response;
  });
  if (res === 0) {
    app.quit();
    // Map the windows array (should be aviable somewhere) and quit each window
    // mainWindow.quit();
  } else if (res === 1) {
    console.log("Response 1 selected");
    event.preventDefault();
  } else if (res === 2) {
    console.log("Cancel button pressed");
    return;
  } // if
  return res;
};
exports.confirmExit = confirmExit;
