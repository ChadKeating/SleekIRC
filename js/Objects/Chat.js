var Chat = function () {
	this.id = "CHAT-".generateId();
	this.name;
	this.type = "CHAT";
	this.history;
	this.status = STATUS.NOTCONNECTED;
	this.$HTML = null;
	this.active = false;
};
(function (p) {
		
	p.getTitle = function () {
		return this.name;
	};

	p.getTopic = function () {
		return this.id;
	}

	p.makeActive = function () {
		this.active = true;
		this.$HTML.button.addClass("selected");
		this.$HTML.window.addClass("active");
	};

	p.makeInactive = function () {
		this.active = false;
		this.$HTML.button.removeClass("selected");
		this.$HTML.window.removeClass("active");
	};
	p.isActive = function () {
		return this.active;
	};

	p.chatJoined = function (focusChat) {
		this.status = STATUS.CONNECTED;
		if (this.$HTML == null) {
			this.setupChat();
		}
		if (focusChat) {
			Sleek.changeChat(this.name);
		}
	};

	p.setupChat = function () {
		var _this = this;
		this.$HTML = {
			button: null,
			window: null
		};
		this.$HTML.button = UI.createChatButton(this.name, "channel");
		this.$HTML.window = UI.createChatWindow();
		this.updateHeader();
		this.makeActive();

		this.$HTML.button.click(function () {
			if (!_this.isActive()) {
				Sleek.changeChat(_this.name);
			}
		});

		var inputBox = this.$HTML.window.find(".messageBox input");
		inputBox.on("keypress", function (e) {
			if (e.keyCode == 13) {
				_this.sendMessage();
			}
		});

		this.$HTML.window.find(".messageBox button").click(function () {
			_this.sendMessage();
		});

	};

	p.updateHeader = function () {
		var head = this.$HTML.window.find(".chatHeader");
		head.find(".title").text(this.getTitle());
		head.find(".topic").text(this.getTopic());
	};

	p.sendMessage = function () {
		var message = this.$HTML.window.find(".messageBox input").val();
		Sleek.client.say(this.name, message);
		this.addMessage(Sleek.profile.name, message, true);
		this.$HTML.window.find(".messageBox input").val("");
	};

	p.receiveMessage = function (sender, message) {
		this.addMessage(sender, message);
	};

	p.addMessage = function (sender, message, isSelf) {
		UI.addMessage(this.$HTML, sender, message, isSelf);
	};

})(Chat.prototype);