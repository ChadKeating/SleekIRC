var Sleek = {};
(function (self) {
	self.irc = require('irc');

	self.client = null;

	self.cm = ChatManager;

	self.FLAGS = {
		DEBUG: true
	};

	self.server = {
		name: "Freenode",
		address: "irc.freenode.com",
		connected: false
	};

	self.profile = {
		username: "Mr_Sleek"
	}

	self.logObject = function (obj) {
		console.dir(obj);
	};

	self.logToClient = function (sender, message) {
		UI.addServerLog(sender, message);
	};

	self.logInfo = function (message) {
		sendConsoleLog("INFO", message);
	};

	self.logWarning = function (message) {
		sendConsoleLog("WARNING", message);
	};

	self.logError = function (message) {
		sendConsoleLog("ERROR", message);
	};

	function sendConsoleLog(level, message) {
		console.log("[{0}] {1}".format(level, message));
	}

	self.init = function () {
		Ractive.DEBUG = this.FLAGS.DEBUG;

		UI.init();

		//connect to freenode
		this.client = new this.irc.Client(this.server.address, this.profile.username, {
			autoRejoin: false,
			autoConnect: false,
			channels: [],
			floodProtection: true,
			floodProtectionDelay: 500,
			sasl: false,
			stripColors: false
		});

		this._bindIRCListeners();

		this.client.connect();

		window.onbeforeunload = function (e) {
			Sleek.onClose();
		};


		Sleek.logInfo("Sleek Finished");
	};

	self._bindIRCListeners = function () {
		var that = this;

		this.client.addListener('registered', function (server) {
			that.logInfo("Registered");
			console.dir(server);
			that.server.connected = true;
			UI.connectedToServer();
		});

		this.client.addListener('ping', function (server) {
			sendConsoleLog("PING", server);
		});

		this.client.addListener('error', function (message) {
			that.logToClient("server", "There was an error. See console for details.");
			that.logObject(message);
		});

		this.client.addListener('pm', function (name, text, message) {
			that.logInfo("pm: {0}; {1}; {2};".format(name, text, message));
		});

		this.client.addListener('topic', function (channel, topic, nick, message) {
			Sleek.cm.setChannelTopic(channel, topic);
		});

		this.client.addListener("names", function (channel, nicks) {
			that.logInfo("names of: {0}".format(channel));
			that.logObject(nicks);
		});

		this.client.addListener("message#", function (from, channel, message, msgOBJ) {
			that.logInfo('message#: {0} => {1}: {2}'.format(from, channel, message));
			that.logObject(msgOBJ);
			that.cm.messageRecieved(channel, new Message("0000", from, message, false)); //Pipe to correct channel via chat manager
		});

		this.client.addListener('message', function (from, to, message, msgOBJ) {
			that.logInfo('message: {0} => {1}: {2}'.format(from, to, message));
			that.logObject(msgOBJ);
		});

		this.client.addListener('raw', function (message) {
			/*
							0: "Mr_Sleek"
				1: "CASEMAPPING=rfc1459"
				2: "CHARSET=ascii"
				3: "NICKLEN=16"
				4: "CHANNELLEN=50"
				5: "TOPICLEN=390"
				6: "ETRACE"
				7: "CPRIVMSG"
				8: "CNOTICE"
				9: "DEAF=D"
				10: "MONITOR=100"
				11: "FNC"
				12: "TARGMAX=NAMES:1,LIST:1,KICK:1,WHOIS:1,PRIVMSG:4,NOTICE:4,ACCEPT:,MONITOR:"
				13: "are supported by this server"
				length: 14
				__proto__: Array[0]
				command: "rpl_isupport"
				commandType: "reply"
				prefix: "leguin.freenode.net"
				rawCommand: "005"
				server: "leguin.freenode.net"
			*/

			if (message.args[0] == that.profile.username) {
				that.logToClient(message.prefix, message.args.splice(1).join("<br/>"));
			}
			//that.logObject(message);
		});

		self.sendServerCommand = function (message) {
			if (message[0] == "/") {
				var args = message.slice(1).split("\\s+");
				switch (args.length) {
					case 1:
						this.client.send(args[0].toUpperCase());
						break;
					case 2:
						this.client.send(args[0].toUpperCase(), args[1]);
						break;
					case 3:
						this.client.send(args[0].toUpperCase(), args[1], args[2]);
						break;
					case 4:
						this.client.send(args[0].toUpperCase(), args[1], args[2], args[3]);
						break;
					default:
						break;
				}

			} else {
				this.logToClient("Sleek", "That is not a valid command.");
			}
		};


	};

	self.onClose = function (closecallback) {
		//Disconnect all chats
		//Disconnect server
		this.client.disconnect("Bye! - SleekIRC");
	};

})(Sleek);

$(document).ready(function () {
	Sleek.init();
});