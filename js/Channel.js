var Channel = function (name) {
	this.id = "CHANNEL-".generateId();
	this.name = name;
	this.users = [];
	this.history;
	this.status = STATUS.NOTCONNECTED;
	this.$HTML = null;
	this.active = false;
};
(function (p) {

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

	p.join = function () {
		var _this = this;
		Sleek.client.join(this.name, function () {
			_this.chatJoined();
		});
	};

	p.chatJoined = function () {
		this.status = STATUS.CONNECTED;
		if (this.$HTML == null) {
			this.setupChat();
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
		this.makeActive();

		this.$HTML.button.click(function () {
			if (!_this.isActive()) {
				Sleek.changeChat(_this.name);
			}
		});
		this.$HTML.window.find(".messageBox button").click(function () {
				_this.sendMessage()
			});

		Sleek.client.addListener('message{0}'.format(this.name), function (from, message) {
			_this.recieveMessage(from, message);
		});
	}

	p.sendMessage = function () {
		var message = this.$HTML.window.find(".messageBox input").val();
		Sleek.client.say(this.name, message);
		this.addMessage(Sleek.profile.name, message);
	};

	p.recieveMessage = function (sender, message) {
		this.addMessage(sender, message);
	};

	p.addMessage = function (sender, message) {
		UI.addMessage(this.$HTML, sender, message);
	};

})(Channel.prototype);