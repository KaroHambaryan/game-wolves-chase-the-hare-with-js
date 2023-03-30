"use strict";

//! Pattern functions
// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
function curry(fn) {
	const arity = fn.length;
	return function $curry(...args) {
		if (args.length < arity) {
			return $curry.bind(null, ...args);
		}
		return fn.call(null, ...args);
	};
}

// ! basic building functions
// get DOM element with id
const getRoot = x => document.getElementById(x);

// create DOM element
const element = x => document.createElement(x);

// return value
const val = v => v;

// return text
const txt = t => t;

const nam = n => n;
// render that has just mutation effect
const render = curry((x, ch) => x.append(ch));

// return classes array
const className = (...a) => [...a];

// return fragments array
const fragments = (...a) => [...a];

//  in the x element is adding classes and fragments
const htmlElement = curry((el, cl = false, fr = false) => {
	if (cl) {
		el.classList.add(...cl);
		if (fr) {
			el.append(...fr)
			return el;
		}
		return el;
	} else if (fr) {
		el.append(...fr)
		return el;
	}
	return el;
});

// add atribut and value
const addAtributes = curry((x, n = false, v = false, t = false) => {
	if (x && v && t && n) {
		x.setAttribute(n, v);
		x.textContent = t;
		return x;
	} else if (x && v && n) {
		x.setAttribute(n, v);
		return x;
	} else if (x && t) {
		x.textContent = t;
		return x;
	}

	return x;
})

// ! connecting application to root
// get root element
const root = getRoot('root');
// render application
render(root, app())



//! application  

// App component
function app() {

	return htmlElement(
		element('div'),
		className('app-flexible_centering_w'),
		fragments(
			gameground()
		))
}

// Gameground component
function gameground() {

	return htmlElement(
		element('div'),
		className('gameground_wrapper', 'gameground-flexible_centering_column'),
		fragments(
			boardSizeSelecton(),
			startButton()
		))
}

// BoardSizeSelecton component
function boardSizeSelecton() {

	return htmlElement(
		addAtributes(element('select'), nam('name'), val('boardSizeSelecton')),
		null,
		fragments(
			addAtributes(element('option'), nam('value'), val(5), txt('5x5')),
			addAtributes(element('option'), nam('value'), val(7), txt('7x7')),
			addAtributes(element('option'), nam('value'), val(10), txt('10x10')),
		)
	)
}

// StartButton
function startButton() {

	return htmlElement(
		addAtributes(element('button'), null, null, txt('Start'))
	)
}




