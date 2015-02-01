var Sleek = {};
(function (self) {
	self.irc = require('irc');

	self.currentChat = null;

	self.init = function () {
		UI.init();
		self.client = new self.irc.Client('irc.freenode.com', 'MR_IRC_TEST', {});
		self.client.addListener('error', function (message) {
			console.log('error: ', message);
		});
		self.client.addListener('message', function (from, to, message) {
			console.log('{0} => {1}: {2}'.format(from, to, message));
		});
	};

	self.join = function (channel) {
		self.client.join(channel, function () {
			UI.chatJoined(channel);
		});
		self.client.addListener('message{0}'.format(channel), function (from, message) {
			UI.addMessage(channel, '{0} => {1}: {2}'.format(channel, from, message));
		});
	};

	self.changeChat = function (chat) {
		self.currentChat = chat;
	};

	self.sendMessage = function (chat, message) {
		self.client.say(chat, message);
	};
})(Sleek);


var UI = {};
(function (self) {
	var gui = require('nw.gui');
	
	var chats = {};
	var main = null;
	self.window = gui.Window.get();
	
	self.init = function () {
		var startingHeight = $(document).height() - $(".topBar").height();// - (gui.App.manifest.window.toolbar ? 32 : 0);
		main = $(".mainContainer");
		main.height(startingHeight);
		main.find(".chatJoin button").click(function () {
			Sleek.join(main.find(".chatJoin input").val());
		});
		self.window.on('close', function () {
			this.hide();
			Sleek.client.disconnect()
			this.close(true);
		});
	};

	self.chatJoined = function (chat) {
		self.createChat(chat, true);
	};

	self.addMessage = function (chat, message) {
		chats[chat].window.find(".messageHistory").append($(document.createElement("div")).text(message));
	};

	self.createChat = function (chat, active) {
		var chatButton = $(document.createElement("div")).addClass("chat channel");
		main.find(".chatlist").append(chat);

		var chatWindow = $(".resources").find(".chatWindow").clone();
		if (active) {
			chatWindow.addClass("active");
		}
		main.find(".chats").append(chatWindow);
		chatWindow.find(".messageBox button").click(function () {
			var sendMessage = chatWindow.find(".messageBox input").val();
			Sleek.sendMessage(chat, sendMessage);
			UI.addMessage(chat, sendMessage);
		});

		chats[chat] = {
			button: chatButton,
			window: chatWindow
		};
	};

	function joinButton() {
		
	}
})(UI);

$(document).ready(function () {
	Sleek.init();
});
