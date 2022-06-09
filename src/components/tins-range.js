import { LitElement, html, css } from 'lit';
import { repeat } from 'lit-html/directives/repeat.js';

/** Range between 1 and 5. Starts with null value. Must be adjusted to be valid. */
export class TinsRange extends LitElement {

	static get properties() {
		return {
			_value: { type: Number },
			_valid: { type: Boolean },
			_labels: { type: Array }
		};
	}

	constructor() {
		super();
		this._value = 3;
		this._valid = false;
		this._labels = ['1', '2', '3', '4', '5'];
	}

	clear() {
		for (const x of this.shadowRoot.querySelectorAll('input')) {
			x.checked = false;
		}
	}

	valueSelected(newValue) {
		this._value = newValue;
		this._valid = true;
		const event = new CustomEvent ('changed', { detail: { value: newValue, target: this }, bubbles: true });
		this.dispatchEvent(event);
	}

	get value() {
		return this._value;
	}

	get valid() {
		return this._valid;
	}

	set labels(value) {
		this._labels = value;
	}

	render() {
		return html`${repeat([0,1,2,3,4], i => 
			html`<input title="${[this._labels[i]]}" @click=${() => this.valueSelected(i+1)} value="${i+1}" type="radio" name="range-group">`
		)}`;
	}

	static get styles() {
		return css`
		:host {
			display: grid;
			grid-auto-flow: column;
		}
		`;
	}
}
