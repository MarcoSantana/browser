import {
  app,




  dialog
} from "electron";
import { mainWindow } from "./electron-main";
export async function  confirmExit() {
  //asynchronous usage
  let options = {
    buttons: ["Yes", "No", "Cancel"],
    message: "Do you really want to quit? from my function"
  };
  let foo = dialog.showMessageBox(mainWindow, options, response => {
    console.log("response :>> ", response);
    console.log("options :>> ", options);

    if (response === 0) {
      console.log("Response 0 selected");
      app.quit();
      mainWindow.quit();
    }
    else if (response === 1) {
      console.log("Response 1 selected");
      event.preventDefault();
    }
    else if (response === 2) {
      console.log("Cancel button pressed");
    }
  });
}
