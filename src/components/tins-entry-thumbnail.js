import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

export class TinsEntryThumbnail extends ScopedElementsMixin(LitElement) {

	static get properties() {
		return {
			entry: { type: Object },
		};
	}

	render() {
		if (!this.entry) return '';
		const imgUrl = this.entry.thumbnail ? `/upload/${this.entry.thumbnail}` : './static/no-screenshot-plain.svg';
		return html`
		<div class="top">${this.entry.title}</div>
		<img src="${imgUrl}">
		<div class="bottom">${this.entry.team}</div>
		`;
	}

	static get styles() {
		return css`
		:host {
			display: block;
			width: 320px;
			height: 248px;
			margin: 0.5rem;
			position: relative;
			background: #444;
			color: white;
			font-height: 16px;
		}

		.top {
			position: absolute;
			top: 2px;
			left: 8px;
		}

		.bottom {
			position: absolute;
			bottom: 2px;
			right: 8px;
			text-align: right;
		}

		img {
			max-width: 100%;
			position: absolute;
			left: 0px;
			top: 24px;
		}
		`;
	}
}
