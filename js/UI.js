﻿var UI = {};
(function (self) {
	var gui = require('nw.gui');
	var main = null;
	var resources = null;
	self.window = gui.Window.get();
	self.init = function () {
		var startingHeight = $(document).height() - $(".topBar").height();// - (gui.App.manifest.window.toolbar ? 32 : 0);
		main = $(".mainContainer");
		resources = $(".resources");
		main.height(startingHeight);
		main.find(".chatJoin button").click(function () {
			var newChannel = new Channel(main.find(".chatJoin input").val());
			Sleek.channels.push(newChannel);
			newChannel.join();
		});
		self.window.on('close', function () {
			this.hide();
			Sleek.closeSequence();
			this.close(true);
		});
	};

	self.addMessage = function ($html, sender, message) {
		var newMessage = resources.find(".message").clone();
		newMessage.find(".sender").text(sender);
		newMessage.find(".text").text(message);
		$html.window.find(".messageHistory").append(newMessage);
	};

	self.createChatButton = function (chatname, type) {
		var chatButton = $(document.createElement("div")).addClass("chat " + type);
		chatButton.text(chatname);
		main.find(".chatlist").append(chatButton);
		return chatButton;
	};

	self.createChatWindow = function () {
		var chatWindow = resources.find(".chatWindow").clone();

		main.find(".chats").append(chatWindow);	
		return chatWindow;
	};

})(UI);