﻿var UI = {};
(function (self) {
	self.gui = require('nw.gui');
	var main = null;
	var resources = null;

	self.window = self.gui.Window.get();
	self.window.on('maximize', function () {
		self.window.isMaximized = true;
	});

	self.window.on('unmaximize', function () {
		self.window.isMaximized = false;
	});

	self.window.on('new-win-policy', function (frame, url, policy) {
		self.gui.Shell.openExternal(url);
		policy.ignore();
	});

	self.app = angular.module("sleek", ["ngSanitize", "ui.utils"]);
	self.app.directive('ngFocus', function ($timeout) {
		return {
			link: function (scope, element, attrs) {
				scope.$watch(attrs.ngFocus, function (val) {
					if (angular.isDefined(val) && val) {
						$timeout(function () { element[0].focus(); });
					}
				}, true);

				element.bind('blur', function () {
					if (angular.isDefined(attrs.ngFocusLost)) {
						if (!scope.$$phase) {
							scope.$apply(attrs.ngFocusLost);
						}

					}
				});
			}
		};
	});

	self.app.filter("linkify", function () {
		return function (message) {
			var msgHTML = $("<div>").text(message);
			msgHTML.text();
			msgHTML.linkify({
				tagName: 'a',
				target: '_blank',
				newLine: '\n',
				linkClass: null,
				linkAttributes: null
			});
			return msgHTML.html();
		};
	});

	self.app.directive("handleController", function () {
		return {
			restrict: "A",
			controllerAs: "handle",
			controller: function () {
				this.close = function () { self.window.close() };
				this.maximize = function () {
					if (self.window.isMaximized) {
						self.window.unmaximize();
					} else {
						self.window.maximize();
					}
				};
				this.minimize = function () { self.window.minimize() };
			}
		}
	});

	self.app.directive("hudController", function () {
		return {
			restrict: "A",
			controllerAs: "hud",
			controller: function () {
				this.panel = "noSelection";
				this.setPanel = function (panel) {
					if (this.panel == panel) {
						this.panel = "noSelection";
					} else {
						this.panel = panel;
					}
				};
				this.isPanel = function (panel) {
					return this.panel == panel;
				};
			}
		};
	});

	self.app.directive("connectionController", function () {
		return {
			restrict: "A",
			controllerAs: "connection",
			controller: function () {
				this.getServers = function () {
					return Sleek.servers;
				};
				this.STATUS = STATUS;
				this.changeUsername = function (username) {
					Sleek.profile.name = username;
				};
				this.setPassword = function (password) {
					Sleek.profile.password = password;
				};
				this.connect = function () {
					Sleek.client.opt.nick = Sleek.profile.name;
					Sleek.client.opt.userName = Sleek.profile.name;
					Sleek.client.opt.password = Sleek.profile.password;
					Sleek.client.connect(function (e, r) {
						if (e) {
							Sleek.servers[0].status = STATUS.CONNECTED;
							var scope = angular.element($(".connection")).scope()
							if (!scope.$$phase) {
								scope.$apply();
							}
						}
						console.log(e);
						console.log(r);
					});
				};
			}
		};
	});

	self.app.directive("chatsController", function () {
		return {
			restrict: "A",
			controllerAs: "chats",
			controller: ['$scope', function ($scope) {
				this.sendMessage = {};
				this.getChats = function () {
					return Sleek.chats;
				}
				this.join = function () {
					if (Sleek.servers[0].status == STATUS.NOTCONNECTED) {
						alert("Not connected. Need to connect before joining");
						return;
					}
					var newChat = $scope.newChatName;
					if (!newChat || newChat.length <= 0) {
						return;
					}
					var chatExists = Sleek.getChatByName(newChat);
					if (chatExists) {
						chatExists.makeActive();
					} else {
						if (newChat.indexOf("#") == 0) {
							//join channel
							//Create new channel connection
							var newChannel = new Channel(newChat, function () {
								if (!$scope.$$phase) {
									$scope.$apply();
								}
							});
							Sleek.chats.push(newChannel); //Push to array first so angular can view changes.
							newChannel.join();
							$scope.newChatName = "";
						} else {
							//pm user
							var newPM = new Private(newChat, function () {
								if (!$scope.$$phase) {
									$scope.$apply();
								}
							});
							Sleek.chats.push(newPM); //Push to array first so angular can view changes.
							newPM.chatJoined(true);
							$scope.newChatName = "";
						}
					}
				};
			}]
		};
	});


	self.init = function () {
		main = $(".programContainer");
		setHeightOfMain(main);
		self.window.on('resize', function () { setHeightOfMain(main); });
		self.window.on('unmaximize', function () { setHeightOfMain(main); });
		self.window.on('close', function () {
			var _this = this;
			this.hide();
			Sleek.closeSequence(function () {
				_this.close(true);
			});
		});
	};

	function setHeightOfMain($main) {
		var mainHeight = window.innerHeight - $(".topBar").height(); -(self.gui.App.manifest.window.toolbar ? 32 : 0);
		$main.height(mainHeight);
	};

	self._addMessage = function ($html, timestamp, sender, message, isSelf) {

	};

	self.updateServerStatus = function (connected) {
		var statusText = connected ? "CONNECTED" : "NOT CONNECTED";
		main.find(".chatlist .status").text(statusText);
	};

	self.updateNotifications = function ($html, number) {
		var button = $html.button;
		if (Sleek.settings.useMaxNotifications && number >= Sleek.settings.maxNotifications) {
			button.find(".notifications").text("!");
		} else {
			button.find(".notifications").text(number);
		}
		if (number > 0) {
			button.addClass("newNotifications");
		} else {
			button.removeClass("newNotifications");
		}
	};

})(UI);