
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
const compose = (...fns) => {
	return (...args) => {
		return fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];
	}
}


const getRootElement = x => document.getElementById(x);
const createDOMElement = x => document.createElement(x);
const addClass = curry((x, ...cn) => x.classList.add(...cn));
const addChildElement = curry((x, ch) => x.append(ch));

