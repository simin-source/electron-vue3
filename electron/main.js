const { app, BrowserWindow, ipcMain, desktopCapturer, session, Tray } = require('electron');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

let mainWin;
let childWin;
let cutWin;
let Mainurl = 'http://localhost:5173/';
const desktopPath = path.join(os.homedir(), 'desktopAI');
const funList = ['fun1', 'fun2', 'fun3', 'fun4', 'fun5', 'fun6', 'fun7', 'fun8', 'fun9'];
const contentList = ['chats', 'speech', 'task'];

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
    mainWin.loadURL(Mainurl)
    mainWin.webContents.openDevTools();
  } else {
    mainWin.loadURL(path.join(__dirname, 'dist/index.html'))
  }
  // mainWriteFile('fun1', 'chats', JSON.stringify({ a: 1 }));
  // mainReadFile('fun1', 'chats');
  // mainWriteFile('', '', JSON.stringify({ a: 1 }));//写入taskid
  // mainReadFile('', '');//读取taskid
}

//m2e_send：主窗口给子窗口
ipcMain.on("m2e_send", mainWinToElectron);

//mainWin -> electron
function mainWinToElectron(e, res) {
  console.log("mainWIn", res)
  if (res.method == "changeChildWinState") changeChildWinState(res.type)
  if (res.method == "updateChildData") updateChildData(res)
  if (res.method == "changeMainUrl") changeMainUrl(e)
  if (res.method == "mainWriteFile") mainWriteFile(e, res.obj);
  if (res.method == "mainReadFile") mainReadFile(e, res.obj);
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
      openCutwindow()
    }
  }
}

const updateChildData = (res) => {
  if (childWin == null) return;
  childWin.webContents.send("fromMain", { method: res.method, list: res.obj });
}

function changeMainUrl(event) {
  Mainurl = 'http://localhost:5173/#/main';
  mainWin.loadURL(Mainurl)
  event.reply('fromMain', {
    method: 'changeMainUrl',
    isloaded: true
  });
}

function mainWriteFile(event, obj) {
  console.log('mainWriteFile',obj);
  let f_index = funList.indexOf(obj.funType);
  let c_index = contentList.indexOf(obj.contentType);
  let filePath = '';
  if (funList[f_index]) {
    filePath = path.join(desktopPath, funList[f_index], contentList[c_index]);
  } else {
    filePath = path.join(desktopPath);
  }
  if (!fs.existsSync(filePath)) {
    console.log('filePath not create');
    // 创建新目录
    fs.mkdirSync(filePath, { recursive: true });
    mainWriteFile(event,obj);
  } else {
    let fileName = '';
    switch (obj.contentType) {
      case 'chats':
        fileName = '/msg.json';
        break;
      case 'speech':
        fileName = '/test.mp3';
        break;
      case 'task':
        fileName = '/state.json';
        break;
      default:
        fileName = '/access_token_ai.json';
        break;
    }
    fs.writeFileSync(filePath + fileName, obj.data);
    // console.log('mainWriteFile', filePath, fileName);
  }
}

function mainReadFile(event, obj) {
  console.log('mainReadFile',obj);
  let f_index = funList.indexOf(obj.funType);
  let c_index = contentList.indexOf(obj.contentType);
  let filePath = '';
  if (funList[f_index]) {
    filePath = path.join(desktopPath, funList[f_index], contentList[c_index]);
  } else {
    filePath = path.join(desktopPath);
  }
  // 检查目录是否存在
  if (!fs.existsSync(filePath)) {
    console.log('filePath not create');
    // 创建新目录
    fs.mkdirSync(filePath, { recursive: true });
    mainReadFile(event, obj);
  } else {
    let fileName = '';
    switch (obj.contentType) {
      case 'chats':
        fileName = '/msg.json';
        break;
      case 'speech':
        fileName = '/test.mp3';
        break;
      case 'task':
        fileName = '/state.json';
        break;
      default:
        fileName = '/access_token_ai.json';
        break;
    }
    const fileData = fs.readFileSync(filePath + fileName, "utf-8");
    // console.log('mainReadFile', filePath, JSON.parse(fileData), fileName);
    event.reply('fromMain', {
      method: 'mainReadFile',
      filedata: JSON.parse(fileData)
    });
  }
}

// 更新taskid
function mainUpdateFile() {

}

// function getAudioInfo() {
// desktopCapturer访问关于使用navigator.mediaDevices.getUserMedia API 获取的可以用来从桌面捕获音频和视频的媒体源的信息。
// }

//--------------------------------------------------------------

/*
辅助窗口
*/
function createChildWindow() {
  childWin = new BrowserWindow({
    title: "辅助聊天页",
    width: 50,
    height: 50,
    frame: false,//创建无边框窗口
    transparent: true,
    movable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')//__dirname 根路径
    }
  });

  // development模式
  if (process.env.NODE_ENV == 'development') {
    childWin.loadURL('http://localhost:5173/#/child')
    childWin.webContents.openDevTools();
  }

  // 使窗体始终位于顶层
  childWin.setAlwaysOnTop(true);

  // 创建系统托盘图标
  let tray = new Tray(path.join(__dirname, 'audio.png'));
  tray.setToolTip('audio');

  // 托盘图标被点击时，显示/隐藏窗口
  tray.on('click', () => {
    childWin.isVisible() ? childWin.hide() : childWin.show();
  });

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

function openCutwindow() {
  let cutWin = execFile(path.join(__dirname, '/screen/PrintScr.exe'), (error, stdout, stderr) => {
    // if (error) {
    //   console.error('Error:', error);
    //   return;
    // }
    // if (stderr) {
    //   console.error('stderr:', stderr);
    //   return;
    // }
    // // 打印标准输出
    // console.log('stdout:', stdout);
  });
  // cutWin.on('exit', (code) => {
  //   console.log('exit', code);//错误码为 3762507597，通常这表示外部程序在执行过程中出现了错误
  // })
}
