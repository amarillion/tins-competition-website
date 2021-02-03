import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { LitElement, html, css } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat.js';
import { subscribe } from '../store';
import { TinsRichTextView } from './tins-richtext-view';

export class TinsNewsFeed extends ScopedElementsMixin(LitElement) {

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			posts: { type: Array },
		};
	}

	static get scopedElements() {
		return {
			'tins-richtext-view': TinsRichTextView
		};
	}

	constructor() {
		super();
		this.posts = [];
	}

	connectedCallback() {
		super.connectedCallback();

		this.unsubscribe = [
			subscribe(s => s.news.posts, posts => { this.posts = posts || []; }),
			subscribe(s => s.news.loading, loading => { this.loading = loading; }),
			subscribe(s => s.news.error, error => { this.error = error; }),
		];
	}

	disconnectedCallback() {
		this.unsubscribe.forEach(unsub => unsub());
	}

	static get styles() {
		return css`
		a 			{ font-weight: bold; text-decoration: none; }
		a:link 		{ color: #600; }
		a:visited 	{	}
		a:hover 	{ text-decoration: underline; }
		a:active 	{ text-decoration: underline; }

		div.message {
			background: #88FF88;
			padding-top: 10px;
			padding-bottom: 10px;
			border-top: 1px solid black;
			border-bottom: 1px solid black;
		}
		
		div.window {
			display: block;
			border-style: solid;
			border-color: #000000;
			background: #ffffff;
			padding: 10px;
			border-width: 1px;
			line-height: 24px;
		}
		div.window img {
			max-width: 100%;
		}
		div.header {
			display: block;
			border-style: solid;
			border-color: #000000;
			background: #c0c0c0;
			padding: 5px;
			border-width: 1 1 0 1px;
			font-weight: bold;
		}
		pre {
			white-space: pre-wrap;
		}
		h1 {
			margin: 0;
		}
		`;
	}

	renderPost(post) {
		const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' });
		const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(new Date(post.date));
		return html`
		<br />
		<div class="header">
			${day} ${month} ${year}
		</div>
		<div class="window">
			<tins-richtext-view text="${post.text}"></tins-richtext-view">
			${post.img ? html`<img src='/upload/${post.img}'/>` : ''}
		</div>
		`;
	}

	render() {
		return html`
		<h1>News</h1>
		${repeat(this.posts, p => p.id, p => this.renderPost(p))}
	`;
	}
}
