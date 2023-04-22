const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
// const os = require('os');
// const fs = require('fs');
const resizeImg = require('resize-img');
process.env.NODE_ENV = 'production';

const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV !== 'production';

let mainWindow;

// Create the main window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'Image Resizer',
    width: isDev ? 1000 : 500,
    height: 700,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.js'),
    },
  });

  // Open devtools if in dev env
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

// Create about window
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: 'Image Resizer',
    width: isDev ? 300 : 200,
    height: 300,
  });

  aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}

// App is ready
app.whenReady().then(() => {
  createMainWindow();

  // Implement menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // Remove mainWindow from memory on close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// Menu template
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [{ label: 'About', click: () => createAboutWindow() }],
        },
      ]
    : []),
  {
    role: 'fileMenu',
  },
  ...(!isMac
    ? [{ label: 'Help', submenu }]
    : [{ label: 'About', click: () => createAboutWindow() }]),
];

// Respond to ipcRenderer resize
ipcMain.on('image:resize', (event, options) => {
  const os = require('os');
  options.destination = path.join(os.homedir(), 'imageresizer');
  resizeImage(options);
}); // Listen to event

// Resize the image
async function resizeImage({ imagePath, width, height, destination }) {
  const fs = require('fs');
  try {
    const newPath = await resizeImg(fs.readFileSync(imagePath), {
      width: +width, // The + sign casts the string to a number
      height: +height,
    });

    // Create filename
    const filename = path.basename(imagePath);

    // Create desination folder if not exists
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination);
    }

    // Write file to destination
    fs.writeFileSync(path.join(destination, filename), newPath);

    // Send success to render
    mainWindow.webContents.send('image:done'); // send event to renderer

    // Open destination folder
    shell.openPath(destination);
  } catch (e) {
    console.log(e);
  }
}

// Following closing behaviour of a mac
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});
