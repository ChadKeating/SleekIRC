var Sleek = {};
(function (self) {
	self.irc = require('irc');

	self.profile = {
		name: 'MR_IRC_TEST'
	};
	self.channels = [];
	self.currentChat = function () {
		return self.channels.first(function (chan) {
			return chan.isActive();
		});
	};

	self.init = function () {
		UI.init();
		self.client = new self.irc.Client('irc.freenode.com', self.profile.name, {});
		self.client.addListener('error', function (message) {
			console.log('error: ', message);
		});
		self.client.addListener('message', function (from, to, message) {
			console.log('{0} => {1}: {2}'.format(from, to, message));
		});
	};

	self.closeSequence = function () {
		//Disconnect all chats
		//Disconnect server
		//return;
		Sleek.client.disconnect()
	};

	self.changeChat = function (chat) {
		self.channels.forEach(function (e) {
			if (e.name == chat) {
				e.makeActive();
			} else {
				e.makeInactive();
			}
		});
	};

})(Sleek);
$(document).ready(function () {
	Sleek.init();
});
