import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  onClipboardChanged: (listener: (text: string) => void) => {
    ipcRenderer.on("clipboard-changed", (_event, text) => listener(text));
  },

  clearClipboardContent: () => {
    ipcRenderer.invoke("clear-clipboard");
  },
});
