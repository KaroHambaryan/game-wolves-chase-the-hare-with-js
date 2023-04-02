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

// compose :: ((y -> z), (x -> y),  ..., (a -> b)) -> a -> z
const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

// ! basic building functions
// get DOM element with id
const getRoot = x => document.getElementById(x);

// create DOM element
const create = x => document.createElement(x);

// return fragments array
const group = (...a) => [...a];

// add Attribute
const addAttribute = curry((n, v) => x => {
	x.setAttribute(n, v);
	return x
});

// add text
const addText = curry(t => x => {
	x.textContent = t;
	return x;
});

// add Childrens
const addChild = curry((fr) => x => {
	if (Array.isArray(fr)) {
		x.append(...fr);
		return x;
	}
	x.append(fr);
	return x;
})

// add Classes
const addClass = curry((...cl) => x => {
	x.classList.add(...cl);
	return x;
});

// render that has just mutation effect
const render = curry((x, ch) => Array.isArray(ch) ? x.append(...ch) : x.append(ch));
// ! connecting application to root
// get root element
const root = getRoot('root');
render(root, app());

//! APLICATION  
// app component
function app() {
	const elem = compose(addClass('app-flx_cen_wrap'), addChild(gameground()), create);
	return elem('div')
}

//! GAMEGROUND CONTENT
// Gameground component
function gameground() {
	const elem = compose(
		addClass('ggr_wrap', 'ggr-flx_cen_col'),
		addChild(
			group(
				selectSize(),
				startButton(),
				board(),
				addButtonBolck()
			)
		),
		create
	);
	return elem('div')
}

// Select Size component
function selectSize() {
	const elem = compose(
		addChild(
			addOptions()
		),
		create
	);
	return elem('select')
}

// Create Option component
function addOptions() {
	const e1 = compose(addText('5x5'), addAttribute('value', 5), create)
	const e2 = compose(addText('7x7'), addAttribute('value', 7), create)
	const e3 = compose(addText('10x10'), addAttribute('value', 10), create)
	return group(
		e1('option'),
		e2('option'),
		e3('option')
	)
}

// Start Button component
function startButton() {
	const elem = compose(addText('START'), create);
	return elem('button');
}

//! BOARD CONTENT
// Board component
function board() {
	const elem = compose(
		addClass('bor_wrap', 'bor_wrap_pos'),
		addChild(
			group(
				...createCell(7),
				...participants()
			)
		),
		create
	);
	return elem('div');
}

// Cell componrnt
function cell() {
	const elem = compose(addClass('cl_sze'), create);
	return elem('div');
}

// Create Cell
function createCell(s) {
	const skel = createBoardSkeleton(s);
	return skel.map((row) => {
		return cellRow(row)
	})
}

//Create Board Skeleton
function createBoardSkeleton(s) {
	const r = [];
	for (let i = 0; i < s; i++) {
		const nr = [];
		for (let j = 0; j < s; j++) {
			nr.push(0)
		}
		r.push(nr);
	}
	return r;
}

// Cell Row
function cellRow(col) {
	let elem = compose(
		addChild(
			cellColumn(col, cell)
		),
		create)
	return elem('div')
}

// Cell Column
function cellColumn(a, b) {
	const column = curry((c, fn) => {
		let elem = compose(
			addChild(
				c.map(() => {
					return fn();
				})
			),
			create)
		return elem('div')
	})

	return column(a, b)
}

// !BUTTONS CONTENT
// Buttons component
function addButtonBolck() {
	const up = compose(addText('UP'), addAttribute('value', "up"), create);
	const dw = compose(addText('DW'), addAttribute('value', "down"), create);
	const lf = compose(addText('LF'), addAttribute('value', "left"), addClass('bt_sze'), create);
	const ri = compose(addText('RI'), addAttribute('value', "right"), addClass('bt_sze'), create);

	const wr2 = compose(
		addClass('bt_flx_ver_cen', 'bt_ver_bl_wrap'),
		addChild(group(up('button'), dw('button'))),
		create
	)
	const wr1 = compose(
		addClass('bt_wrap', 'bt_flx_hor_cen'),
		addChild(group(lf('button'), wr2('div'), ri('button'))),
		create
	)
	return wr1('div')
}

//! PARTICIPANTS 
// Participants Component
function participants() {
	return group(
		rabbit(),
		...logicRender(3, wolf),
		...logicRender(3, barrier),
		house()

	)
}

// Rabbit component
function rabbit() {
	const elem = compose(addClass('rbb_sze','part_glob_sze','part_trans'), create);
	return elem('div');
}

// Wolf Component
function wolf() {
	const elem = compose(addClass('wlf_sze','part_glob_sze','part_trans'), create);
	return elem('div');
}

// Barrier Component
function barrier() {
	const elem = compose(addClass('barr_sze','part_glob_sze','part_trans'), create);
	return elem('div');
}

// House Component
function house() {
	const elem = compose(addClass('hse_sze','part_glob_sze','part_trans'), create);
	return elem('div');
}

// logic Render
function logicRender(a, b) {
	const el = curry((n, fn) => {
		const ar = new Array(n).fill(0)
		return ar.map(() => {
			return fn()
		})
	})
	return el(a, b)
}