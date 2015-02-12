var Chat = function (update) {
	this.id = "CHAT_".generateId("_");
	this.name;
	this.type = "CHAT";
	this.messages = [];
	this.status = STATUS.NOTCONNECTED;
	this.$HTML = null;
	this.active = false;
	this.notifications = 0;
	this.updateScope = update;
};
(function (p) {
	p.makeActive = function () {
		this.active = true;
		this.notifications = 0;
		this.updateScope();
	};

	p.makeInactive = function () {
		this.active = false;
	};

	p.isActive = function () {
		return this.active;
	};

	p.focusChat = function () {
		Sleek.changeChat(this.id);
	};

	p.chatJoined = function (focusChat) {
		this.status = STATUS.CONNECTED;
		this.setupChat();
		if (focusChat) {
			this.focusChat();
		}
	};

	p.setupChat = function () {
		var _this = this;
		Sleek.setupChatLog(_this);
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
	
	p.addMessage = function (sender, message, isSelf) {
		var timestamp = Date.now();
		this.messages.push(new Message(timestamp, sender, message, isSelf));
		Sleek.addChatLog(this.id, timestamp, sender, message)
		this.updateScope();
	};
})(Chat.prototype);