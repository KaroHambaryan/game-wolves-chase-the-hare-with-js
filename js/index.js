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
const getElemsWitCLass = x => document.getElementsByClassName(x);

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
});

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
function participants(w, b) {
	return [
		rabbit(),
		...logicRender(w, wolf),
		...logicRender(b, barrier),
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
	const elem = compose(addClass('wolves', 'wlf_sze', 'part_glob_sze', 'part_trans'), create);
	return elem('div');
}

// Barrier Component
function barrier() {
	const elem = compose(addClass('barriers', 'barr_sze', 'part_glob_sze', 'part_trans'), create);
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
		return n.map(() => {
			return fn()
		})
	})
	return el(a, b)
}

// ----------------------- Dynamic part of the application -----------------
// ! CREATE GAME STORE--------------------------------------------
const store = new Map();

// initial state values
store.set('rabbit', {});
store.set('house', {});
store.set('wolves', {});
store.set('barriers', {});
store.set('boardSize', 5);


// get Store data
const getStoreData = x => {
	return store.get(x);
};

// dispatch for set data
function dispatch(n, fn) {
	if (n === 'rabbit') {

		store.set('rabbit', rabbitReducer(store.get('rabbit'), fn));

	} else if (n === 'house') {

		store.set('house', houseReducer(store.get('house'), fn));

	} else if (n === 'wolves') {

		store.set('wolves', wolvesReducer(store.get('wolves'), fn));

	} else if (n === 'barriers') {

		store.set('barriers', barrierReducer(store.get('barriers'), fn));
		barrierReducer
	} else if (n === 'boardSize') {

		store.set('boardSize', boardSizeReduser(store.get('boardSize'), fn));

	}
}
//! ----------------------------------------------
// Create CSS Coordinates
const convertToCSS = o => {
	let s = 40;
	if (Array.isArray(o)) {
		return o.map((e) => {
			return { x: +e.x * s, y: +e.y * s }
		})
	}
	const d = { x: +o.x * s, y: +o.y * s };
	return d;
};

//Transform Translate
const toTranslate = curry((e, d) => {
	if (e.length) {
		for (let i = 0; i < e.length; i++) {
			e[i].style.transform = `translate(${d[i].x}px, ${d[i].y}px)`;
		}
	} else {
		e.style.transform = `translate(${d.x}px, ${d.y}px)`;
	}
});

//Create New CSS Position
const newPosition = n => {
	const data = compose(convertToCSS, getStoreData);
	if (getElemsWitCLass(n).length) {
		toTranslate(getElemsWitCLass(n), data(n));
	} else {
		toTranslate(getElementWithId(n), data(n));
	}
};

// Delete All Childes
const deleteAllChildes = p => {
	while (p.firstChild) {
		p.removeChild(p.firstChild);
	}
	return p;
};

// create Random Coordinates
const randomCoords = s => {
	let n = s + 2
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
};

// Sort Random Coordinates
const sortCoords = a => {
	const w = [];
	const b = [];
	const r = [];
	const h = [];
	r.push(a.pop());
	h.push(a.pop());

	if (a.length === 5) {
		while (w.length < 3) {
			w.push(a.pop());
		}
	} else if (a.length === 7) {
		while (w.length < 4) {
			w.push(a.pop());
		}
	} else if (a.length === 10) {
		while (w.length < 5) {
			w.push(a.pop());
		}
	}

	while (a.length) {
		b.push(a.pop());
	}
	return { w, b, r, h };
};

// Create Random Coordinates
const createCoords = compose(sortCoords, randomCoords);

// ----- RABBIT FEATURES ----------
// Create Feature Step
const createFeatureStep = curry((r, t) => {
		let x = r.x;
		let y = r.y;
		switch (t) {
			case "up":
				let up = y - 1;
				return { x, y: up };
			case "down":
				let down = y + 1;
				return { x, y: down };
			case "left":
				let left = x - 1;
				return { x: left, y };
			case "right":
				let right = x + 1;
				return { x: right, y };
			default:
				return r;
		}
	});


// Check Outside The Board or Not
const ifOutside = r => {
	const s = getStoreData('boardSize')
	if (r.x >= s || r.y >= s) {
		return true
	} else if (r.x <= -1 || r.y <= -1) {
		return true
	} else {
		return false
	}
}

// Check on The Barrier or Not
const ifBarrier = r => {
	const b = getStoreData('barriers');
	return b.some(e => e.x === r.x && e.y === r.y);
}

// compose Fn for cecking with the Barrier
const ifOnBarrier = compose(ifBarrier,createFeatureStep)

// ! EVENT DEVELOPMENT BLOCK
// get game area
const game = document.getElementById('game');

// get select button
const select = document.getElementById('select');

//!CAME CLICK LISTENER 
game.addEventListener('click', mapForAction);
// The Map of all the Activities We Need on Click
function mapForAction(e) {
	if (e.target.value === 'start') {
		const SIZE = getStoreData('boardSize');
		const RANDOM_COORDS = createCoords(SIZE);
		// --------------------------------
		//changing values 
		dispatch('rabbit', randomPosition(RANDOM_COORDS));
		dispatch('house', randomPosition(RANDOM_COORDS));
		dispatch('wolves', randomPosition(RANDOM_COORDS));
		dispatch('barriers', randomPosition(RANDOM_COORDS));
		// -------------------------------
		// changed values


		//-------------------------------
		// rendering new elements
		addParticipants('wolves', 'barriers', SIZE);
		newPosition('rabbit');
		newPosition('house');
		newPosition('wolves');
		newPosition('barriers');
	} else if (
		['left', 'right', 'up', 'down'].includes(e.target.value) &&
		!!getElementWithId('rabbit')
	) {
		// Global Variables
		// --------------------------
		const RABBIT = getStoreData('rabbit');
		const EVENT = e.target.value;
		const ifNextStep = ifOnBarrier(RABBIT,EVENT)
		// --------------------------------
		//changing values 
		if (!ifNextStep) {
			// changing
			dispatch('rabbit', rabbitStep(EVENT));
			// rendering
			newPosition('rabbit');
		}
			
		// -------------------------------
		// changed values

		//-------------------------------
		// rendering new elements
	}
	e.stopPropagation();
}



// ! SELECT CHANGE LISTENER
select.addEventListener('change', change);
// All Actions We Need on Change
function change(e) {
	// --------------------------------
	//changing values 
	dispatch('boardSize', keepSize(+e.target.value))
	changeBoard('board', +e.target.value);
	// changeParticipantsDisplay('d_none');
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

function keepSize(data) {
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
	const PAYLOAD = action.payload;
	const TYPE = action.type;

	switch (TYPE) {
		case 'random_coords':
			const [r] = PAYLOAD.data.r
			return { x: r.x, y: r.y };
		case 'up':
			return { ...state, y: state.y - 1 };
		case 'down':
			return { ...state, y: state.y + 1 };
		case 'left':
			return { ...state, x: state.x - 1 };
		case 'right':
			return { ...state, x: state.x + 1 };
		default:
			return state;
	}
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

// Rabbit Action creators


// Global Action creators
function randomPosition(data) {
	return {
		type: 'random_coords',
		payload: {
			data,
		}
	}
}
// !---------------------------------------



// ! HOUSE REDUCER---------------------------------------
function houseReducer(state = {}, action) {
	const PAYLOAD = action.payload;
	switch (action.type) {
		case 'random_coords':
			const [h] = PAYLOAD.data.h
			return { x: h.x, y: h.y };
		default:
			return state
	}
}
//House Action Creators

// !--------------------------------------------
// ----- HOUSE FEATURES ----------

// ! WOLVES REDUCER---------------------------------------
function wolvesReducer(state = {}, action) {
	const PAYLOAD = action.payload;
	switch (action.type) {
		case 'random_coords':
			const w = PAYLOAD.data.w
			return w.map((e) => {
				return { x: e.x, y: e.y };
			})
		default:
			return state
	}
}
//Wolves Action Creators
function logAction(val) {
	return {
		type: val,
	}
}
// !--------------------------------------------
// ----- WOLVES FEATURES ----------

// ! BARRIER REDUCER---------------------------------------
function barrierReducer(state = {}, action) {
	const PAYLOAD = action.payload;
	switch (action.type) {
		case 'random_coords':
			const b = PAYLOAD.data.b
			return b.map((e) => {
				return { x: e.x, y: e.y };
			})
		default:
			return state
	}
}
//Barrier Action Creators

// !--------------------------------------------
// ----- Barrier FEATURES ----------




//! GENERAL PURPOSE FUNCTIONS FOR RENDERING

// Changing Board size
function changeBoard(id, s, c) {
	const b = curry((id, r, p = []) => {
		const e = compose(
			addChild([
				...createCell(r),
				...p
			]),
			deleteAllChildes,
			getElementWithId
		)
		e(id);
	});
	b(id, s, c);
}

function addParticipants(wn, bn, s) {
	const w = getStoreData(wn);
	const b = getStoreData(bn);
	changeBoard('board', s, participants(w, b));
}

// function changeParticipantsDisplay(n) {
// 	const rabbit = compose(addClass(n), getElementWithId);
// 	const house = compose(addClass(n), getElementWithId);
// 	const wolves = compose(addClases(n), getElemsWitCLass);
// 	const barriers = compose(addClases(n), getElemsWitCLass);
// 	rabbit('rabbit');
// 	house('house');
// 	wolves('wolves');
// 	barriers('barriers');
// }

