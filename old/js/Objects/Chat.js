var Chat = function (update) {
	this.id = "CHAT_".generateId("_");
	this.name;
	this.type = "CHAT";
	this.messages = [];
	this.connected = false;
};
(function (p) {

	p.init = function () {


	};

	p.chatJoined = function (focusChat) {
		this.status = STATUS.CONNECTED;
		this.setupChat();
		if (focusChat) {
			this.focusChat();
		}
	};

	p.sendMessage = function (message) {
		Sleek.client.say(this.name, message);
		this.addMessage(Sleek.profile.name, message, true);
	};

	p.receiveMessage = function (sender, message) {
		if (!this.isActive()) {
			this.notifications++;
		}
		this.addMessage(sender, message);
	};

})(Chat.prototype);