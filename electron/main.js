const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    autoHideMenuBar: true,     // 自动隐藏菜单栏
    frame: true,               // 保留窗口边框
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // 加载打包后的应用
  win.loadFile(path.join(__dirname, '../dist/index.html'))
  
  // 禁用菜单栏
  win.removeMenu()
  
  // 监听全屏事件
  win.on('enter-full-screen', () => {
    win.setMenuBarVisibility(false)
  })
  
  win.on('leave-full-screen', () => {
    win.setMenuBarVisibility(false)
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})