"use strict";
const { app, BrowserWindow, ipcMain, desktopCapturer, session, Tray } = require("electron");
const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");
let mainWin;
let childWin;
let Mainurl = "http://localhost:5173/";
const desktopPath = path.join(os.homedir(), "desktopAI");
const funList = ["fun1", "fun2", "fun3", "fun4", "fun5", "fun6", "fun7", "fun8", "fun9"];
const contentList = ["chats", "speech", "task"];
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
    mainWin.loadURL(Mainurl);
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
  if (res.method == "changeMainUrl")
    changeMainUrl(e);
  if (res.method == "mainWriteFile")
    mainWriteFile(e, res.obj);
  if (res.method == "mainReadFile")
    mainReadFile(e, res.obj);
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
    {
      openCutwindow();
    }
  }
}
const updateChildData = (res) => {
  if (childWin == null)
    return;
  childWin.webContents.send("fromMain", { method: res.method, list: res.obj });
};
function changeMainUrl(event) {
  Mainurl = "http://localhost:5173/#/main";
  mainWin.loadURL(Mainurl);
  event.reply("fromMain", {
    method: "changeMainUrl",
    isloaded: true
  });
}
function mainWriteFile(event, obj) {
  console.log("mainWriteFile", obj);
  let f_index = funList.indexOf(obj.funType);
  let c_index = contentList.indexOf(obj.contentType);
  let filePath = "";
  if (funList[f_index]) {
    filePath = path.join(desktopPath, funList[f_index], contentList[c_index]);
  } else {
    filePath = path.join(desktopPath);
  }
  if (!fs.existsSync(filePath)) {
    console.log("filePath not create");
    fs.mkdirSync(filePath, { recursive: true });
    mainWriteFile(event, obj);
  } else {
    let fileName = "";
    switch (obj.contentType) {
      case "chats":
        fileName = "/msg.json";
        break;
      case "speech":
        fileName = "/test.mp3";
        break;
      case "task":
        fileName = "/state.json";
        break;
      default:
        fileName = "/access_token_ai.json";
        break;
    }
    fs.writeFileSync(filePath + fileName, obj.data);
  }
}
function mainReadFile(event, obj) {
  console.log("mainReadFile", obj);
  let f_index = funList.indexOf(obj.funType);
  let c_index = contentList.indexOf(obj.contentType);
  let filePath = "";
  if (funList[f_index]) {
    filePath = path.join(desktopPath, funList[f_index], contentList[c_index]);
  } else {
    filePath = path.join(desktopPath);
  }
  if (!fs.existsSync(filePath)) {
    console.log("filePath not create");
    fs.mkdirSync(filePath, { recursive: true });
    mainReadFile(event, obj);
  } else {
    let fileName = "";
    switch (obj.contentType) {
      case "chats":
        fileName = "/msg.json";
        break;
      case "speech":
        fileName = "/test.mp3";
        break;
      case "task":
        fileName = "/state.json";
        break;
      default:
        fileName = "/access_token_ai.json";
        break;
    }
    const fileData = fs.readFileSync(filePath + fileName, "utf-8");
    event.reply("fromMain", {
      method: "mainReadFile",
      filedata: JSON.parse(fileData)
    });
  }
}
function createChildWindow() {
  childWin = new BrowserWindow({
    title: "辅助聊天页",
    width: 50,
    height: 50,
    frame: false,
    //创建无边框窗口
    transparent: true,
    movable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
      //__dirname 根路径
    }
  });
  if (process.env.NODE_ENV == "development") {
    childWin.loadURL("http://localhost:5173/#/child");
    childWin.webContents.openDevTools();
  }
  childWin.setAlwaysOnTop(true);
  let tray = new Tray(path.join(__dirname, "audio.png"));
  tray.setToolTip("audio");
  tray.on("click", () => {
    childWin.isVisible() ? childWin.hide() : childWin.show();
  });
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
function openCutwindow() {
  execFile(path.join(__dirname, "/screen/PrintScr.exe"), (error, stdout, stderr) => {
  });
}
