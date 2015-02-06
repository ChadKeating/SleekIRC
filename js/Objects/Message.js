var Message = function (time, sender, message, self) {
	this.timestamp = time;
	this.sender = sender;
	this.message = message;
	this.senderSelf = self || false;
};
(function (p) {
	p.getMessageHTML = function () {
		return this.message;
	};
})(Message.prototype);