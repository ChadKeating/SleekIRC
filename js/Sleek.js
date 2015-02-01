var Sleek = {};
(function (self) {
	self.irc = require('irc');

	self.FLAGS ={
		DEBUG: true
	};

	self.profile = {
		name: 'MR_IRC_TEST',
		leavingMessage: "Goodbye!"
	};

	self.chats = [];
	self.getChatByName = function (name) {
		return self.chats.first(function (chat) {
			return chat.name == name;
		});
	};
	self.currentChat = function () {
		return self.chats.first(function (chat) {
			return chat.isActive();
		});
	};
	self.changeChat = function (chat) {
		self.chats.forEach(function (e) {
			if (e.name == chat) {
				e.makeActive();
			} else {
				e.makeInactive();
			}
		});
	};

	self.init = function () {
		UI.init();
		self.client = new self.irc.Client('irc.freenode.com', self.profile.name, {
			autoRejoin: false,
			autoConnect: false,
			channels: [],
			floodProtection: true,
			floodProtectionDelay: 500,
			sasl: false,
			stripColors: false
		});
		self.client.addListener('error', function (message) {
			console.log('error: ', message);
		});
		self.client.addListener('pm', function (name, text, message) {
			var chatPresent = self.getChatByName(name);
			if (!chatPresent) {
				chatPresent = new Private(name);
				self.chats.push(chatPresent);
			}
			chatPresent.chatJoined(true);
			chatPresent.receiveMessage(text);
		});
		

		self.client.addListener('topic', function (channel, topic, nick, message) {
			var channelPresent = self.getChatByName(channel);
			channelPresent.changeTopic(topic);
			channelPresent.updateHeader();
		});

		if(self.FLAGS.DEBUG){
			self.client.addListener('message', function (from, to, message, msgOBJ) {
				console.log('{0} => {1}: {2}'.format(from, to, message));
				console.log(msgOBJ);
			});
		}
		self.client.connect();
	};

	self.closeSequence = function () {
		//Disconnect all chats
		//Disconnect server
		//return;
		Sleek.client.disconnect()
	};


})(Sleek);
$(document).ready(function () {
	Sleek.init();
});
