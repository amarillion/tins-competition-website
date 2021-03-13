import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { LitElement, html, css } from 'lit-element';
import { TinsRichTextView } from './tins-richtext-view.js';
 
export class TinsLogPost extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-richtext-view': TinsRichTextView
		};
	}

	static get properties() {
		return {
			_post: { type: Object },
			_competition: { type: Object }
		};
	}

	constructor() {
		super();
		this._post = {};
		this._competition = {};
	}

	set post(value) {
		this._post = value;
	}

	set competition(value) {
		this._competition = value;
	}

	render() {
		const post = this._post;
		const competition = this._competition;

		return html`<div class="top" id="${post.id}">
			<a href="/${competition.short}/log/entrant/${post.entrant.id}">${post.entrant.name}</a>
			${new Date(post.date).toLocaleString([], { dateStyle:'full', timeStyle: 'short'})}
		</div>
		
		<tins-richtext-view text="${post.text}"></tins-richtext-view>
		
		${post.image ? html`<img src="/upload/${post.image}">` : ''}`;
	}

	static get styles() {
		return css`
			:host {
				display: block;
				padding: 0.5rem;
			}

			.top {
				font-style: italic;
			}

			img {
				max-width: 100%;
			}
		`;
	}

}
