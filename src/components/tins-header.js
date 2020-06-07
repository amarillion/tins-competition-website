import { LitElement, html, css } from 'lit-element';

import './tins-currentuser.js';

customElements.define('tins-header', class extends LitElement {

	static get properties() {
		return {
			name: { type: String },
		};
	}

	constructor() {
		super();
		this.name = "Unnamed";
	}

	static get styles() {
		return css`
		`;
	}

	render() {
		return html`
		<img src="./static/tinslogo06.gif" alt="TINS Logo" />
		<hr />
		<tins-currentuser></tins-currentuser>
		`;
	}
});

