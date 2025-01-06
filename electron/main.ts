import {
  app,
  BrowserWindow,
  clipboard,
  globalShortcut,
  ipcMain,
  Menu,
  Tray,
} from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Determina o diretório atual do arquivo main.ts
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configurações de diretórios
process.env.APP_ROOT = path.join(__dirname, "..");
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

// Configuração do diretório público
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  // Cria uma nova janela do navegador
  win = new BrowserWindow({
    icon: path.join(__dirname, "appicon.png"),

    width: 450,
    height: 500,
    resizable: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"), // Carrega o preload script
    },
  });

  win.setSkipTaskbar(true);

  const shortcutKey = "Super+Shift+V";
  globalShortcut.register(shortcutKey, () => {
    if (win) {
      if (win.isMinimized()) {
        win.restore();
        win.focus();
      } else {
        win.minimize();
      }
    }
  });
  // Cria uma instância do Tray
  const tray = new Tray(path.join(__dirname, "appicon.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Shortcut: " + shortcutKey,
      enabled: false,
    },
    { type: "separator" },

    {
      label: "Minimize",
      click: () => {
        win?.minimize();
      },
    },
    {
      label: "Show App",
      click: () => {
        win?.show();
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip("Clipboard");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    win?.show();
  });

  // Envia uma mensagem para o processo de renderer quando a página é carregada
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Carrega a URL apropriada com base no ambiente
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  let lastText = clipboard.readText();
  setInterval(() => {
    const currentText = clipboard.readText();
    if (currentText !== lastText) {
      win?.webContents.send("clipboard-changed", currentText);
      lastText = currentText;
    }
  }, 1000);
}

ipcMain.handle("clear-clipboard", () => {
  clipboard.clear();
  return "Clipboard cleared!";
});

// Encerra o aplicativo quando todas as janelas são fechadas, exceto no macOS
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

// Recria a janela no macOS quando o ícone da dock é clicado
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Cria a janela assim que o aplicativo estiver pronto
app.whenReady().then(createWindow);
