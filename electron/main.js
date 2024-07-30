const { app, BrowserWindow, ipcMain, desktopCapturer, session } = require('electron');
const path = require('path');

let mainWin;
let childWin;
let cutWin;

app.whenReady().then(() => {
  createMainWindow();

  //app生命周期 
  app.on('activate', function () {
    // 没有其他页面打开执行
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  });

  app.on('window-all-closed', () => {
    // 非mac所有窗口关闭关闭程序
    if (process.platform !== 'darwin') app.quit()
  });
})

/*
主窗口
*/
function createMainWindow() {
  mainWin = new BrowserWindow({
    title: "主聊天页",
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')//__dirname 根路径
    }
  })

  console.log('env', process.env.NODE_ENV);
  // development模式
  if (process.env.NODE_ENV == 'development') {
    mainWin.loadURL('http://localhost:5173/')
    mainWin.webContents.openDevTools();
  } else {
    mainWin.loadURL(path.join(__dirname, 'dist/index.html'))
  }

}

//m2e_send：主窗口给子窗口
ipcMain.on("m2e_send", mainWinToElectron);

//mainWin -> electron
function mainWinToElectron(e, res) {
  console.log("mainWIn", res)
  if (res.method == "changeChildWinState") changeChildWinState(res.type)
  if (res.method == "updateChildData") updateChildData(res)
}

function changeChildWinState(type) {
  if (type == 'new') {
    if (childWin != null) {
      childWin.close();
    } else {
      createChildWindow()
    }
  }
  if (type == 'cut') {
    if (cutWin != null) {
      cutWin.close();
    } else {
      createCutwindow()
    }
  }
}

const updateChildData = (res) => {
  if (childWin == null) return;
  childWin.webContents.send("fromMain", { method: res.method, list: res.obj });
}

function getAudioInfo() {
  // desktopCapturer访问关于使用navigator.mediaDevices.getUserMedia API 获取的可以用来从桌面捕获音频和视频的媒体源的信息。
}

//--------------------------------------------------------------

/*
辅助窗口
*/
function createChildWindow() {
  childWin = new BrowserWindow({
    title: "辅助聊天页",
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')//__dirname 根路径
    }
  });

  // development模式
  if (process.env.NODE_ENV == 'development') {
    childWin.loadURL('http://localhost:5173/#/child')
    childWin.webContents.openDevTools();
  }

  childWin.on("close", function () {
    childWin = null;
  });

}

//c2e_send：子窗口给主窗口
ipcMain.on("c2e_send", childWinToElectron);

//childWin -> electron
function childWinToElectron(e, res) {
  console.log("childWin", res)
  if (res.method == "updateMainData") updateMainData(res)
}

const updateMainData = (res) => {
  if (mainWin == null) return;
  mainWin.webContents.send("fromChild", { method: res.method, list: res.obj });
}

// ------------------------------------------------------------
/*
透明截图窗口
*/

function createCutwindow() {
  cutWin = new BrowserWindow({
    title: "截图",
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')//__dirname 根路径
    }
  });

  // development模式
  if (process.env.NODE_ENV == 'development') {
    cutWin.loadURL('http://localhost:5173/#/child')
    cutWin.webContents.openDevTools();
  }

  cutWin.on("close", function () {
    cutWin = null;//必须
  });
}
