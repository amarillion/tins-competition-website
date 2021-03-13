import { subscribe } from "../store.js";

const SUBSCRIPTIONS = Symbol();

/**
 * Define a 'get selectors()' on your class or in your constructor.
 * 
 * The mixin reads this as a property -> selectors map.
 * Subscribes on the store in each selector and sets property on self.
 * Automatically unsubscribes in the disconnected callback.
 * 
 * @param {*} superclass 
 * @returns 
 */
export const StoreSubscriberMixin = superclass => class extends superclass {

	constructor(args) {
		super(args);
		this[SUBSCRIPTIONS] = [];
	}

	connectedCallback() {
		super.connectedCallback();
		const { selectors } = this;
		for(const [ property, selector ] of Object.entries(selectors)) {
			const unsub = subscribe(selector, val => {
				this[property] = val;
			});
			this[SUBSCRIPTIONS].push(unsub);
		}
	}

	disconnectedCallback() {
		this[SUBSCRIPTIONS].forEach(unsub => unsub());
		super.disconnectedCallback();
	}

};
