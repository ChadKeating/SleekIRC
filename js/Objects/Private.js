var Private = function (name) {
	Chat.call(this)
	this.name = name;	
};
(function (p) {
	p.receiveMessage = function (message) {
		this.addMessage(this.name, message);
	};
})(Private.prototype = Object.create(Chat.prototype));
