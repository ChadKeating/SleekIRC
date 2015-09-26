var Message = function (time, sender, message, self) {
	this.timestamp = time;
	this.sender = sender;
	this.message = message;
	this.isSenderSelf = self || false;
};
(function (p) {

})(Message.prototype);