function noop () {};

function debounce(fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };
}

function makeElement(tagName, options) {
	var options = options || {};
	var $el = document.createElement(tagName);
	Object.entries(options).forEach(([key, value]) => {
		$el.setAttribute(key, value);
	});
	return $el;
}

function replaceElement(oldElement, newElement) {
	oldElement.parentNode.replaceChild(newElement);
}
