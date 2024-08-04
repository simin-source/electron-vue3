// 预加载脚本在加载“index.html”之前运行,可访问windowApi,nodejs,Electron 版本信息
const { contextBridge, ipcRenderer } = require("electron");

// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }

//   for (const type of ['chrome', 'node', 'electron']) {
//     replaceText(`${type}-version`, process.versions[type])
//   }
// })

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    let validChannels = ["m2e_send",'c2e_send'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["fromMain","fromChild"];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));//监听回调函数
    }
  },
});