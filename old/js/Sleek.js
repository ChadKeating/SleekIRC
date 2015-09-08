var Sleek = {};
(function (self) {
	self.irc = require('irc');

	self.FLAGS = {
		DEBUG: true
	};
	self.date = new Date();
	self.profile = {
		name: 'MR_IRC_TEST',
		leavingMessage: "Goodbye!"
	};
	self.settings = {
		useMaxNotifications: true,
		maxNotifications: 10
	};

	self.servers = [{
		name: "Freenode",
		address: "irc.freenode.com",
		status: STATUS.NOTCONNECTED
	}];

	self.chats = [];
	self.getChatById = function (id) {
		return self.chats.first(function (chat) {
			return chat.id == id;
		});
	};
	self.getChatByName = function (name) {
		return self.chats.first(function (chat) {
			return chat.name.toUpperCase() == name.toUpperCase();
		});
	};
	self.currentChat = function () {
		return self.chats.first(function (chat) {
			return chat.isActive();
		});
	};
	self.changeChat = function (chat) {
		self.chats.forEach(function (e) {
			if (e.id == chat) {
				e.makeActive();
			} else {
				e.makeInactive();
			}
		});
	};

	/* Database stuff */
	self.db = null;
	function setupDatabase() {
		self.db = new localStorageDB("sleekDB", localStorage);
		if (self.FLAGS.DEBUG) {
			self.db.drop();
			self.db = new localStorageDB("sleekDB", localStorage);
		}
		if (self.db.isNew()) {
			self.db.createTableWithData("settings", [self.settings]);
			self.db.createTableWithData("servers", self.servers);
			self.db.createTable("profiles", ["id", "name", "leavingMessage"]);
			self.db.createTable("channels", ["id", "name", "topic"]);
			self.db.createTable("privates", ["id", "name"]);
		}
	}
	function resetDatabase(hardreset) {
		if (hardreset) {
			self.db.drop();
			setupDatabase();
			/*
			self.db.truncate("settings")
			self.db.truncate("servers")
			self.db.truncate("profiles")
			self.db.truncate("channels")
			self.db.truncate("privates")
			*/
		}
	}
	self.setupChatLog = function (chat) {
		var table = chat.id;
		if (chat.type == "CHANNEL") {
			if (!(self.db.query("channels", { name: chat.name }, 1).length > 0)) {
				self.db.insert("channels", { id: chat.id, name: chat.name, topic: chat.topic });
			}
		} else {
			if (!(self.db.query("privates", { name: chat.name }, 1).length > 0)) {
				self.db.insert("privates", { id: chat.id, name: chat.name });
			}
		}
		if (!self.db.tableExists(table)) {
			self.db.createTable(table, ["timestamp", "sender", "message"]);
		}
	};

	self.addChatLog = function (chatid, time, sender, message) {
		self.db.insert(chatid, {
			timestamp: time,
			sender: sender,
			message: message
		});
	};

	/*		*/

	self.init = function () {
		setupDatabase();
		UI.init();
		self.client = new self.irc.Client(self.servers[0].address, self.profile.name, {
			autoRejoin: false,
			autoConnect: false,
			channels: [],
			floodProtection: true,
			floodProtectionDelay: 500,
			sasl: false,
			stripColors: false
		});
		self.client.addListener('error', function (message) {
			console.log("Error: ", message);
		});
		self.client.addListener('pm', function (name, text, message) {
			var chatPresent = self.getChatByName(name);
			if (!chatPresent) {
				chatPresent = new Private(name);
				chatPresent.chatJoined(true);
				self.chats.push(chatPresent);
			}
			chatPresent.receiveMessage(text);
		});

		self.client.addListener('topic', function (channel, topic, nick, message) {
			var channelPresent = self.getChatByName(channel);
			if (channelPresent) {
				channelPresent.changeTopic(topic);
			}
		});
		self.client.addListener("names", function (channel, nicks) {
			console.log("names called, " + channel, nicks)
			var chan = Sleek.getChatByName(channel);
			if (chan) {
				chan.users = Object.keys(nicks);
				chan.updateScope();
			}
		});
		Sleek.client.addListener("message#", function (from, channel, message, msgOBJ) {
			var chan = Sleek.getChatByName(channel);
			if (chan) {
				chan.receiveMessage(from, message);
			}
		});
		if (self.FLAGS.DEBUG) {
			self.client.addListener('message', function (from, to, message, msgOBJ) {
				console.log('{0} => {1}: {2}'.format(from, to, message));
				console.log(msgOBJ);
			});
		}
	};

	self.closeSequence = function (closecallback) {
		//Disconnect all chats
		//Disconnect server
		//return;
		self.client.disconnect(self.profile.leavingMessage, function(){
			self.db.commit();
			if (closecallback) {
				closecallback();
			}
		});
	};

})(Sleek);
$(document).ready(function () {
	Sleek.init();
});
