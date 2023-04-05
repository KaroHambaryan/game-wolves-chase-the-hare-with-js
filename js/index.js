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
const getElementWithId = x => document.getElementById(x);

// get DOM element with Selector All
const getElementsWitSelector = x => document.querySelectorAll(x);

// create DOM element
const create = x => document.createElement(x);

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

// add Class
const addClass = curry((...cl) => x => {
	x.classList.add(...cl);
	return x;
});

// add Clases
const addClases = curry((...cl) => x => {
	for (let i = 0; i < x.length; i++) {
		x[i].classList.add(...cl);
	}
	return x;
});

// render that has just mutation effect
const render = curry((x, ch) => Array.isArray(ch) ? x.append(...ch) : x.append(ch));

// ! connecting application to root
// get root element
const root = getElementWithId('root');
render(root, app());

//! APLICATION

// !GAMESTATUS

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
		addChild([
			selectSize(),
			startButton(),
			board(),
			buttonBolck()
		]),
		addAttribute('id', 'game'),
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
		addAttribute('id', 'select'),
		create
	);
	return elem('select')
}

// Create Option component
function addOptions() {
	const e1 = compose(addText('5x5'), addAttribute('value', 5), create)
	const e2 = compose(addText('7x7'), addAttribute('value', 7), create)
	const e3 = compose(addText('10x10'), addAttribute('value', 10), create)
	return [
		e1('option'),
		e2('option'),
		e3('option')
	]
}

// Start Button component
function startButton() {
	const elem = compose(addText('START'), addAttribute('value', 'start'), create);
	return elem('button');
}

//! BOARD CONTENT
// Board component
function board() {
	const elem = compose(
		addClass('bor_wrap', 'bor_wrap_pos'),
		addChild([
			...createCell(),
			...participants()
		]),
		addAttribute('id', 'board'),
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
function createCell(s = 5) {
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
function buttonBolck() {
	const up = compose(addText('UP'), addAttribute('value', "up"), create);
	const dw = compose(addText('DW'), addAttribute('value', "down"), create);
	const lf = compose(addText('LF'), addAttribute('value', "left"), addClass('bt_sze'), create);
	const ri = compose(addText('RI'), addAttribute('value', "right"), addClass('bt_sze'), create);

	const wr2 = compose(
		addClass('bt_flx_ver_cen', 'bt_ver_bl_wrap'),
		addChild([up('button'), dw('button')]),
		create
	)
	const wr1 = compose(
		addClass('bt_wrap', 'bt_flx_hor_cen'),
		addChild([lf('button'), wr2('div'), ri('button')]),
		create
	)
	return wr1('div')
}

//! PARTICIPANTS 
// Participants Component
function participants() {
	return [
		rabbit(),
		...logicRender(3, wolf),
		...logicRender(3, barrier),
		house()
	]
}

// Rabbit component
function rabbit() {
	const elem = compose(addClass('rbb_sze', 'part_glob_sze'), addAttribute('id', 'rabbit'), create);
	return elem('div');
}

// Wolf Component
function wolf() {
	const elem = compose(addClass('wlf_sze', 'part_glob_sze', 'part_trans'), create);
	return elem('div');
}

// Barrier Component
function barrier() {
	const elem = compose(addClass('barr_sze', 'part_glob_sze', 'part_trans'), create);
	return elem('div');
}

// House Component
function house() {
	const elem = compose(addClass('hse_sze', 'part_glob_sze', 'part_trans'), addAttribute('id', 'house'), create);
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
// ----------------------- Dynamic part of the application -----------------
// ! CREATE GAME STORE--------------------------------------------
const store = new Map()

// initial state values
store.set('rabbit', { x: 0, y: 0 });
store.set('house', {});
store.set('wolves', {});
store.set('barriers', {});

store.set('gameStatus', false);
store.set('boardSize', 5);
store.set('randomCoordinates', 5);

// get Store data
const getStoreData = x => {
	return store.get(x);
}

// dispatch for set data
function dispatch(n, fn) {
	if (n === 'rabbit') {
		store.set('rabbit', rabbitReducer(store.get('rabbit'), fn))
	} else if (n === 'house') {

	} else if (n === 'wolves') {
		store.set('wolves', wolvesReducer(store.get('wolves'), fn));
	} else if (n === 'barriers') {

	} else if (n === 'gameStatus') {
		store.set('gameStatus', startButtonReduser(store.get('gameStatus'), fn));
	} else if (n === 'boardSize') {
		store.set('boardSize', boardSizeReduser(store.get('boardSize'), fn));
	} else if (n === 'randomCoordinates') {

	}
}
//! ----------------------------------------------
// Create CSS Coordinates
const convertToCSS = o => {
	let s = 40;
	const d = { x: +o.x * s, y: +o.y * s };
	return d;
}

//Transform Translate
const toTranslate = curry((e, d) => {
	e.style.transform = `translate(${d.x}px, ${d.y}px)`;
})

//Create New CSS Position
const newPosition = n => {
	const data = compose(convertToCSS, getStoreData);
	toTranslate(getElementWithId(n), data(n))
}

// Delete All Childes
const deleteAllChildes = p => {
	while (p.firstChild) {
		p.removeChild(p.firstChild);
	}
	return p;
}

// create Random Coordinates
const randomCoords = curry((n, s) => {
	const a = [];
	while (a.length < n) {
		const x = Math.floor(Math.random() * s);
		const y = Math.floor(Math.random() * s);
		const rc = { x, y };
		if (!a.some((rc) => rc.x === x && rc.y === y)) {
			a.push(rc);
		}
	}

	return a;
});

// Sort Random Coordinates
const sortCoords = a => {
	const w = [];
	const b = [];
	const r = [];
	const h = [];
	a.forEach((e, i) => {
		if (i <= 4) {
			w.push(e);
		} else if (i >= 5 && i <= 8) {
			b.push(e);
		} else if (i === 9) {
			r.push(e)
		} else if (i === 10) {
			h.push(e)
		}
	})
	return { w, b, r, h };
}

// Create Random Coordinates
const createCoords = compose(sortCoords, randomCoords)
// console.log(createCoords(11,10));



// ! EVENT DEVELOPMENT BLOCK
// get game area
const game = document.getElementById('game');

// get select button
const select = document.getElementById('select');

//!CAME CLICK LISTENER 
game.addEventListener('click', mapForAction)
// The Map of all the Activities We Need on Click
function mapForAction(e) {
	if (e.target.value === 'start') {
		// --------------------------------
		//changing values 
		changeParticipantsDisplay('d_block');

		// -------------------------------
		// changed values


		//-------------------------------
		// rendering new elements

	} else if (['left', 'right', 'up', 'down'].includes(e.target.value)) {
		// --------------------------------
		//changing values 
		dispatch('rabbit', rabbitStep(e.target.value))
		// -------------------------------
		// changed values

		//-------------------------------
		// rendering new elements
		newPosition('rabbit');
	}
	e.stopPropagation();
}

// ! SELECT CHANGE LISTENER
select.addEventListener('change', change);
// All Actions We Need on Change
function change(e) {
	// --------------------------------
	//changing values 
	dispatch('boardSize',keepSize(+e.target.value))
	changeBoard('board', +e.target.value);
	changeParticipantsDisplay('d_none');
	// -------------------------------
	// changed values

	//-------------------------------
	// rendering new elements
	e.stopPropagation();
}


// ! BOARD SIZE ---------------------------
function boardSizeReduser(state = {}, action) {
	if (action.type === 'keep_size') {
		return action.payload.data;
	}
	return state;
}

function keepSize(data){
	return {
		type: 'keep_size',
		payload: {
			data,
		}
	}
}
// !---------------------------------------



// !RABBIT REDUCER--------------------------
function rabbitReducer(state = {}, action) {
	if (action.type === 'up') {
		return {
			...state,
			y: state.y - 1,
		}
	} else if (action.type === 'down') {
		return {
			...state,
			y: state.y + 1,
		}
	} else if (action.type === 'left') {
		return {
			...state,
			x: state.x - 1,
		}
	} else if (action.type === 'right') {
		return {
			...state,
			x: state.x + 1,
		}
	}
	return state;
}

// Rabbit Action creators
function rabbitStep(type, data) {
	return {
		type,
		payload: {
			data,
		}
	}
}
// !---------------------------------------
// ----- RABBIT FEATURES ----------



// ! WOLVES REDUCER---------------------------------------
function wolvesReducer(state = {}, action) {
	if (action.type === "down") {
		return {
			wolf1: { x: 20, y: 30 }
		}
	}

	return state
}

//Wolves Action Creators
function logAction(val) {
	return {
		type: val,
	}
}
// !--------------------------------------------
// ----- WOLVES FEATURES ----------






//! GENERAL PURPOSE FUNCTIONS FOR RENDERING

// Changing Board size
function changeBoard(id, s) {
	const b = curry((id, r) => {
		const e = compose(
			addChild([
				...createCell(r),
				...participants()
			]),
			deleteAllChildes,
			getElementWithId
		)
		e(id);
	});
	b(id, s);
}

function changeParticipantsDisplay(n) {
	const rabbit = compose(addClass(n), getElementWithId);
	const house = compose(addClass(n), getElementWithId);
	const wolves = compose(addClases(n), getElementsWitSelector);
	const barriers = compose(addClases(n), getElementsWitSelector);
	rabbit('rabbit');
	house('house');
	wolves('.wlf_sze');
	barriers('.barr_sze');
}
