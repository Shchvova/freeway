import process from 'node:process'
import {electronAPI} from '@electron-toolkit/preload'
import {contextBridge, ipcRenderer} from 'electron'

const electron = {
  beep: (): void => ipcRenderer.send('app:beep'),

  reveal: (path: string): void => ipcRenderer.send('reveal', path),

  login: (): void => ipcRenderer.send('auth:login'),
  logout: (): void => ipcRenderer.send('auth:logout'),
  openExternal: (url: string): void => ipcRenderer.send('open:external', url),
  getAccount: (): Promise<string> => ipcRenderer.invoke('profile'),

  sendMsg: (msg: string): Promise<string> => ipcRenderer.invoke('msg', msg),
  onReplyMsg: (cb: (msg: string) => any) => ipcRenderer.on('reply-msg', (_, msg: string) => {
    cb(msg)
  }),

  onIpcMessage: (cb: (event: {name: string, data: any}) => any) => ipcRenderer.on('ipc-message', (_, event: {name: string, data: any}) => {
    cb(event)
  }),
}

// Custom APIs for renderer
const api = {
  foo() {
    return 42
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electron)
    contextBridge.exposeInMainWorld('electronApi', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  }
  catch (error) {
    console.error(error)
  }
}
else {
  globalThis.electronApi = electronAPI
  globalThis.electron = electron
  globalThis.api = api
}
