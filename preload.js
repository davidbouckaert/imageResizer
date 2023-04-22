// the preloader exposes node modules to the renderer

const os = require('os');
const path = require('path');
const Toastify = require('toastify-js');
const { contextBridge, ipcRenderer } = require('electron');

// We need os for the access to the system home directory
contextBridge.exposeInMainWorld('os', {
  homedir: () => os.homedir(),
});
// We need path to save the image
contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args),
});

contextBridge.exposeInMainWorld('Toastify', {
  toast: (options) => Toastify(options).showToast(),
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, funct) =>
    ipcRenderer.on(channel, (event, ...args) => funct(...args)),
});
