"use strict";
const { app, BrowserWindow, ipcMain, desktopCapturer, session } = require("electron");
const path = require("path");
let mainWin;
let childWin;
let cutWin;
app.whenReady().then(() => {
  createMainWindow();
  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0)
      createMainWindow();
  });
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
      app.quit();
  });
});
function createMainWindow() {
  mainWin = new BrowserWindow({
    title: "主聊天页",
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
      //__dirname 根路径
    }
  });
  console.log("env", process.env.NODE_ENV);
  if (process.env.NODE_ENV == "development") {
    mainWin.loadURL("http://localhost:5173/");
    mainWin.webContents.openDevTools();
  } else {
    mainWin.loadURL(path.join(__dirname, "dist/index.html"));
  }
}
ipcMain.on("m2e_send", mainWinToElectron);
function mainWinToElectron(e, res) {
  console.log("mainWIn", res);
  if (res.method == "changeChildWinState")
    changeChildWinState(res.type);
  if (res.method == "updateChildData")
    updateChildData(res);
}
function changeChildWinState(type) {
  if (type == "new") {
    if (childWin != null) {
      childWin.close();
    } else {
      createChildWindow();
    }
  }
  if (type == "cut") {
    if (cutWin != null) {
      cutWin.close();
    } else {
      createCutwindow();
    }
  }
}
const updateChildData = (res) => {
  if (childWin == null)
    return;
  childWin.webContents.send("fromMain", { method: res.method, list: res.obj });
};
function createChildWindow() {
  childWin = new BrowserWindow({
    title: "辅助聊天页",
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
      //__dirname 根路径
    }
  });
  if (process.env.NODE_ENV == "development") {
    childWin.loadURL("http://localhost:5173/#/child");
    childWin.webContents.openDevTools();
  }
  childWin.on("close", function() {
    childWin = null;
  });
}
ipcMain.on("c2e_send", childWinToElectron);
function childWinToElectron(e, res) {
  console.log("childWin", res);
  if (res.method == "updateMainData")
    updateMainData(res);
}
const updateMainData = (res) => {
  if (mainWin == null)
    return;
  mainWin.webContents.send("fromChild", { method: res.method, list: res.obj });
};
function createCutwindow() {
  cutWin = new BrowserWindow({
    title: "截图",
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
      //__dirname 根路径
    }
  });
  if (process.env.NODE_ENV == "development") {
    cutWin.loadURL("http://localhost:5173/#/child");
    cutWin.webContents.openDevTools();
  }
  cutWin.on("close", function() {
    cutWin = null;
  });
}
