const {contextBridge} = require('electron')
contextBridge.exposeInMainWorld('api', {
  version: process.version,
  versions: process.versions,
  num: 666
})