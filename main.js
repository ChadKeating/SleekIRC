var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		"min-width": 600,
		width: 800,
		"min-height": 160,
		height: 600
	});

	// and load the index.html of the app.
	mainWindow.loadUrl("file://" + __dirname + "/sleek.html");

	// Open the DevTools.
	mainWindow.openDevTools();

	mainWindow.on('close', function () {
		//mainWindow.webContents.executeJavaScript("Sleek.onClose();");
	});
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		
		mainWindow = null;
	});

});

