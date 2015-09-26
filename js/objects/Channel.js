var Channel = function (name) {
	Chat.call(this);
	this.name = name;
	this.users = [];
	this.topic = "Test topic";
	this.type = "CHANNEL";
};
(function (p) {
	p.join = function () {
		var that = this;
		Sleek.client.join(this.name, function () {
			that.chatJoined();
		});
	};
	
	p.leave = function (callback) {
		Sleek.client.part(this.name, Sleek.profile.leavingMessage, callback);
	};

	p.setTopic = function (topic) {
		this.topic = topic;
	};

	p.getRactiveData = function () {
		var data = Chat.prototype.getRactiveData.call(this);
		data.users = this.users;
		data.topic = this.topic;
		return data;
	};

})(Channel.prototype = Object.create(Chat.prototype));
