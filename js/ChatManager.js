var ChatManager = {};
(function (self) {

	self.chats = {
		channels: [],
		pms: []
	};

	self.newChat = function (name, isPM) {
		var newChat;

		if (isPM) {

		} else {
			newChat = new Channel(name);
			this.chats.channels.push(newChat);
			this.sendChatDataToUI();
		}

		if (this.getAllChats().length == 1) {
			UI.switchActiveChat(this.getAllChats()[0].name);
		}
		return newChat;
	};

	self.sendChatDataToUI = function () {
		var data = [];
		var chats = this.getAllChats();
		for (var i = 0; i < chats.length; i++) {
			data.push(chats[i].getRactiveData());
		}
		UI.ractives.chatView.set("chats", data);
	};

	self.getAllChats = function () {
		return [].concat(this.chats.channels, this.chats.pms);
	}

	self.getChatByName = function (name) {
		return this.getAllChats().first(function (e) { return e.name == name; });
	};

	self.sendMessage = function (channel, message) {
		var channel = this.getChatByName(channel);
		channel.sendMessage(message);
	};

	self.messageRecieved = function (channel, message) {
		var channel = this.getChatByName(channel);
		channel.receiveMessage(message);
	};

	self.setChannelTopic = function (channel, topic) {
		var channel = this.getChatByName(channel);
		channel.setTopic(topic);
	};

})(ChatManager);
