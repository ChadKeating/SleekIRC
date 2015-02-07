var Private = function (name, update) {
	Chat.call(this, update);
	this.name = name;
	this.type = "PRIVATE";
};
(function (p) {
	p.receiveMessage = function (message) {
		this.addMessage(this.name, message);
	};
})(Private.prototype = Object.create(Chat.prototype));
