var Chat = function () {
	this.id = "CHAT_".generateId("_");
	this.name;
	this.type = "CHAT";
	this.messages = [];
	this.connected = false;
};
(function (p) {

	p.chatJoined = function () {
		this.connected = true;
		Sleek.log("Chat Joined: " + this.name);
	};

	p.sendMessage = function (message) {
		Sleek.client.say(this.name, message);
		this.receiveMessage(new Message("0000", Sleek.profile.username, message, true));
	};

	p.receiveMessage = function (message) {
		this.messages.push(message);
	};

	p.setChatActive = function () {
		UI.switchActiveChat(this.name);
	};

	p.getRactiveData = function () {
		return {
			id: this.id,
			name: this.name,
			type: this.type,
			messages: this.messages,
			connected: this.connected,
			messagebox: ""
		};
	};

})(Chat.prototype);