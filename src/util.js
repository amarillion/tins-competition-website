/*
	Adds an event listener on a DOM element, and returns a function that 
	removes it again when called.
*/
export default function registerEventListener(elt, type, func, capture = false) {
	elt.addEventListener(type, func, capture);
	return () => {
		elt.removeEventListener(type, func, capture);
	};
}
