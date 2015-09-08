var Channel = function (name, update) {
	Chat.call(this, update);
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
	
		});
	};
	
	p.leave = function (callback) {
		Sleek.client.part(this.name, Sleek.profile.leavingMessage, callback);
	};

	p.changeTopic = function (topic) {
		this.topic = topic;
		this.updateScope();
	};
})(Channel.prototype = Object.create(Chat.prototype));
