/**** String ****/
String.prototype.generateId = function () {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return this + uuid;
};
String.prototype.format = function () {
	http://stackoverflow.com/questions/1038746/equivalent-of-string-format-in-jquery
	var s = this,
        i = arguments.length;
	while (i--) {
		s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
	}
	return s;
};


/**** Number ****/
Number.prototype.clamp = function (min, max) {
	return Math.min(Math.max(this, min), max);
};


/**** Array ****/
Array.prototype.copy = function () {
	return $.extend(true, [], this);
};

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function (from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

Array.prototype.first = function (filter) {
	if (filter && filter instanceof Function) {
		var thisLen = this.length;
		for (var i = 0; i < thisLen; i++) {
			if (filter(this[i])) {
				return this[i];
			}
		}
	}
	return null;
};
