var Channel = function (name) {
	Chat.call(this)
	this.name = name;
	this.users = [];
	this.topic = "";
	this.type = "CHANNEL";
};
(function (p) {

	p.join = function () {
		var _this = this;
		Sleek.client.join(this.name, function () {
			_this.chatJoined(true);
			Sleek.client.addListener('message{0}'.format(_this.name), function (from, message) {
				_this.receiveMessage(from, message);
			});
		});
	};
	
	p.leave = function (callback) {
		Sleek.client.part(this.name, Sleek.profile.leavingMessage, callback);
	};

	p.changeTopic = function (topic) {
		this.topic = topic;
		this.updateHeader();
	};

	p.getTopic = function () {
		return this.topic;
	}

})(Channel.prototype = Object.create(Chat.prototype));
