import { configureStore } from "@reduxjs/toolkit";
import { reducer } from "./reducer.js";
 
const store = configureStore({reducer});

/**
 * Call the callback when the state changes, and optionally one time initially.
 *
 * @param selector Lambda that takes the state, and returns the value that we are interested in.
 * @param {*} callback What to do initially, and when the state changes.
 * @param {*} options May contain a truthy initialCall, which results in the callback firing right after subscribing.
 */
export const subscribe = (selector, callback, { initialCall = true } = {}) => {
	let previous = selector(store.getState());
	
	const unsubscribe = store.subscribe(() => {
		const current = selector(store.getState());
		
		if (current !== previous) {
			previous = current;
			callback(current);
		}
	});
	
	if (initialCall) {
		callback(previous);
	}
	
	return unsubscribe;
};


export const dispatch = store.dispatch;
export const getState = store.getState;

