import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { LitElement, html, css } from 'lit-element';
import { TinsFaIcon } from './tins-fa-icon.js';
import { TinsRichTextView } from './tins-richtext-view.js';
import invisibleIcon from '@fortawesome/fontawesome-free/svgs/solid/eye-slash.svg';
import { spoilerExplanation } from './tins-log-form.js';

export class TinsLogPost extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-richtext-view': TinsRichTextView,
			'tins-fa-icon': TinsFaIcon,
		};
	}

	static get properties() {
		return {
			_post: { type: Object },
			_competition: { type: Object },
			spoiler: { type: Boolean, reflect: true }
		};
	}

	constructor() {
		super();
		this._post = {};
		this._competition = {};
	}

	set post(value) {
		this._post = value;
		this.spoiler = value.spoiler;
	}

	set competition(value) {
		this._competition = value;
	}

	renderSpoilerMessage(spoiler) {
		if (!spoiler) return '';
		return html`<div class="right" title="${spoilerExplanation}"><tins-fa-icon size="1rem" src=${invisibleIcon}></tins-fa-icon></div>`;
	}

	render() {
		const post = this._post;
		const competition = this._competition;
		if (!(post && competition)) return '';

		return html`<div class="top" id="${post.id}">
			<a href="/${competition.short}/log/entrant/${post.entrant.id}">${post.entrant.name}</a>
			${new Date(post.date).toLocaleString([], { dateStyle:'full', timeStyle: 'short'})}
			${this.renderSpoilerMessage(post.spoiler)}
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

			:host([spoiler]) {
				background: #ccc;
			}

			.right {
				float: right;
			}
		`;
	}

}
