import { LitElement, html, css } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { renderRichText } from '../util';

export class TinsRichTextView extends ScopedElementsMixin(LitElement) {

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
		`;
	}
}
