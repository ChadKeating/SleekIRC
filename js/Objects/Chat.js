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
		this.updateScope();
	};

	p.setupChat = function () {
		var _this = this;
		Sleek.setupChatLog(_this);
	};
	/*
	p.updateHeader = function () {
		var head = this.$HTML.window.find(".chatHeader");
		head.find(".title").text(this.getTitle());
		head.find(".topic").text(this.getTopic());
	};
	*/
	p.sendMessage = function (message) {
		Sleek.client.say(this.name, message);
		this.addMessage(Sleek.profile.name, message, true);
		/*
		var message = this.$HTML.window.find(".messageBox input").val();
		this.addMessage(Sleek.profile.name, message, true);
		this.$HTML.window.find(".messageBox input").val("");
		*/
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
		this.updateScope();
		/*
		Sleek.addChatLog(this.id, timestamp, sender, message)
		UI.addMessage(this.$HTML, timestamp, sender, message, isSelf);
		UI.updateNotifications(this.$HTML, this.notifications);
		*/
	};
	
})(Chat.prototype);