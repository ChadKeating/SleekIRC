var UI = {};
(function (self) {

	self.main$ = null;
	self.templates$ = null;

	self.init = function () {
		this.main$ = $("#main-view");
		this.templates$ = $("#templates");

		this.bindControlBar();
		this.bindControlPanel();
		this.bindChatContainer();

		this.setActiveControlPanel("connection");

		Sleek.logInfo("UI Finished");
	};

	self.ractives = {
		controlPanel: null,
		chatView: null
	};

	self.connectedToServer = function () {
		this.ractives.controlPanel.set("connectionStatus", "Connected");
	};

	self.bindControlBar = function () {
		var that = this;

		this.ractives.controlBar = new Ractive({
			el: UI.main$.find("#control-bar"),
			template: "#control-bar-buttons",
			data: {
				currentPanel: ""
			}
		});

		this.ractives.controlBar.on("controlButtonClick", function (event) {
			var panel = $(event.node).attr("panel");
			if (event.context.currentPanel == panel) { return; }
			that.setActiveControlPanel(panel);
		});
	};



	self.setActiveControlPanel = function (panel) {
		var buttons$ = $(this.ractives.controlBar.findAll(".button")).removeClass("selected");
		var panels = this.ractives.controlPanel.findAll('.panel');
		for (var i = 0; i < panels.length; i++) {
			var el = $(panels[i]);
			if (el.attr("id") == panel) {
				buttons$.parent().find("[panel='{0}']".format(panel)).addClass("selected");
				el.addClass("active");
				this.ractives.controlBar.set("currentPanel", panel);
			} else {
				el.removeClass("active");
			}
		}
	};

	self.bindControlPanel = function () {
		var that = this;

		this.ractives.controlPanel = new Ractive({
			el: UI.main$.find("#control-options-view"),
			template: "#control-view-panels",
			data: {
				connection: {
					connectionStatus: "Not Connected",
					channelbox: ""
				},
				serverLog: {
					log: []
				}
			}
		});

		this.ractives.controlPanel.on("connectionClick", function (event) {
			var channelName = event.context.connection.channelbox;
			Sleek.cm.newChat(channelName).join("#{0}".format(channelName));
		});

		this.ractives.controlPanel.on("sendcommand", function (event, message) {
			Sleek.sendServerCommand(message);
			$(event.node).parent().find("input").val("").focus();
		});
	};

	self.addServerLog = function (sender, message) {
		this.ractives.controlPanel.get("serverLog").log.push({ timestamp: "00", sender: sender, message: message });
	};


	self.bindChatContainer = function () {
		var that = this;
		this.ractives.chatView = new Ractive({
			el: UI.main$.find("#chat-view")[0],
			template: "#chat-view-template",
			data: {
				chats: []
			}
		});

		this.ractives.chatView.on("chatTabClicked", function (event, channel) {
			console.dir(event);
			that.switchActiveChat(event.context.name);
		});

		this.ractives.chatView.on("sendmessage", function (event, channel, message) {
			Sleek.cm.sendMessage(channel, message);
			$(event.node).parent().find("input").val("").focus();
		});
	};

	self.switchActiveChat = function (channel) {
		var elements = this.ractives.chatView.findAll('.instance');
		for (var i = 0; i < elements.length; i++) {
			var el = $(elements[i]);
			el.attr("instance") == channel ? el.addClass("active") : el.removeClass("active");
		}
	};

})(UI);