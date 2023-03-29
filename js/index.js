//! JavaScriptDOM and his prototype metodes
function JavaScriptDOM(idName) {
	this.element = document.getElementById(idName);

}

JavaScriptDOM.prototype.addClass = function (className) {
	this.element.classList.add(className);
};

JavaScriptDOM.prototype.removeClass = function (className) {
	this.element.classList.remove(className);
};

JavaScriptDOM.prototype.toggleClass = function (className) {
	this.element.classList.toggle(className);
};

JavaScriptDOM.prototype.html = function (htmlString) {
	if (htmlString) {
		this.element.innerHTML = htmlString;
	} else {
		return this.element.innerHTML;
	}
};

JavaScriptDOM.prototype.text = function (textString) {
	if (textString) {
		this.element.textContent = textString;
	} else {
		return this.element.textContent;
	}
};

JavaScriptDOM.prototype.append = function (childNode) {
	this.element.appendChild(childNode);
};

JavaScriptDOM.prototype.prepend = function (childNode) {
	this.element.insertBefore(childNode, this.element.firstChild);
};

JavaScriptDOM.prototype.remove = function () {
	this.element.parentNode.removeChild(this.element);
};

JavaScriptDOM.prototype.on = function (eventName, callback) {
	this.element.addEventListener(eventName, callback);
};

JavaScriptDOM.prototype.off = function (eventName, callback) {
	this.element.removeEventListener(eventName, callback);
};

JavaScriptDOM.prototype.trigger = function (eventName) {
	var event = new Event(eventName);
	this.element.dispatchEvent(event);
};
// ! ----------- end  JavaScriptDOM metodes block ----------

