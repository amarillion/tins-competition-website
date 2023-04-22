import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { renderRichText } from '../util.js';

export class TinsRichTextView extends LitElement {

	static get properties() {
		return {
			text: { type: String },
		};
	}

	render() {
		return html`${unsafeHTML(renderRichText(this.text))}`;
	}

	static get styles() {
		return css`
		:host {
			display: block; /* solves text selection issues */
		}

		a 			{ font-weight: bold; text-decoration: none; }
		a:link 		{ color: #600; }
		a:hover 	{ text-decoration: underline; }
		a:active 	{ text-decoration: underline; }

		.video-container {
			position: relative;
			width: 100%;
			padding-bottom: 56.25%;
		}

		.video {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border: 0;
		}

		img {
			max-width: 100%;
		}

		pre {
			white-space: pre-wrap;
		}
		`;
	}
}
