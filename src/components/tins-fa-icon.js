import { LitElement, html, css } from 'lit';

export class TinsFaIcon extends LitElement {
	static get properties() {
		return {
			color: String,
			src: String,
			size: Number
		};
	}

	static get styles() {
		return css`
	  :host {
		display: inline-block;
		vertical-align: sub;
		padding: 0;
		margin: 0;
		--size: 24px;
		--color: black;
		--src: url('dummy');
	  }
	  div.fa-icon {
		  width: var(--size);
		  height: var(--size);
		  background-color: var(--color);
		  mask: var(--src) no-repeat center;
		  -webkit-mask: var(--src) no-repeat center;
	  }
	`;
	}

	constructor() {
		super();

		// this.iClass = '';
		// default values:
		this.src = '';
		this.size = '24px';
		this.color = 'black';
	}

	updated(changedProperties) {
		if (changedProperties.has("src")) {
			this.shadowRoot.host.style.setProperty('--src', `url('${this.src}')`);
		}
		if (changedProperties.has("size")) {
			this.shadowRoot.host.style.setProperty('--size', this.size);
		}
		if (changedProperties.has("color")) {
			this.shadowRoot.host.style.setProperty('--color', this.color);
		}
	}

	render() {
		return html`<div class="fa-icon"></div>`;
	}
}
