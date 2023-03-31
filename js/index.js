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
var bSize = 5;
const changeBsize = curry((y) => {
	bSize = y
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

//START GAMEGROUND CONTENT
// Gameground component
function gameground() {

	return htmlElement(
		element('div'),
		className('gameground_wrapper', 'gameground-flexible_centering_column'),
		fragments(
			boardSizeSelecton(),
			startButton(),
			board(),
		))
}

// BoardSizeSelecton component
function boardSizeSelecton() {

	return htmlElement(
		addAtributes(element('select'), nam('id'), val('boardSize')),
		null,
		fragments(
			addAtributes(element('option'), nam('value'), val(5), txt('5x5')),
			addAtributes(element('option'), nam('value'), val(7), txt('7x7')),
			addAtributes(element('option'), nam('value'), val(10), txt('10x10')),
		)
	)
}

// StartButton component
function startButton() {

	return htmlElement(
		addAtributes(element('button'), null, null, txt('Start'))
	)
}

//START BOARD CONTENT
// Board component
function board() {
	
	const createCells = (size) => {
		const row = [];
		for (let i = 0; i < size; i++) {
			const newRow = [];
			for (let j = 0; j < size; j++) {
				newRow.push(0)
			}
			row.push(newRow);
		}
		return row;
	}

	const boardSize = createCells(10)

	return htmlElement(
		element('div'),
		className('board_wrapper', 'board_wrapper_position'),
		fragments(
			...boardSize.map((row) => {
				return htmlElement(
					element('div'),
					null,
					row.map(() => {
						return cell()
					})
				)
			}),
			...participants(),
		)
	)
}

// cell component
function cell() {

	return htmlElement(
		element('div'),
		className('cell_size')
	)
}

// PARTICIPANTS 
function participants() {
	return fragments(
		rabbit(),
		...logicRenderWolves(),
		...logicRenderBarriers(),
	)
}

// rabbit component
function rabbit() {
	return htmlElement(
		element('div'),
		className('rabbit_size')
	);
}

// logicRenderWolves
function logicRenderWolves() {
	const wolves = new Array(3).fill(0)
	return wolves.map(() => {
		return wolf()
	})
}
// wolf component
function wolf() {
	return htmlElement(
		element('div'),
		className('wolves_size')
	);
}

// LogicRenderBarriers
function logicRenderBarriers() {
	const barriers = new Array(3).fill(0)
	return barriers.map(() => {
		return barrier()
	})
}

// barrier component
function barrier() {
	return htmlElement(
		element('div'),
		className('barriers_size')
	);
}

// house component

// END PARTICIPANTS

// END BOARD CONTENT


// END GAMEGROUND CONTENT

const size = document.getElementById('boardSize');
size.addEventListener('change', function (e) {
	e.stopPropagation();
	changeBsize(+e.target.value)
	
	console.log(bSize);
})

console.log(element("div"));