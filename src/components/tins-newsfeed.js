import { LitElement, html, css } from 'lit';
import { repeat } from 'lit-html/directives/repeat.js';
import { asyncFetchJSON } from '../util.js';

export class TinsNewsFeed extends LitElement {

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			posts: { type: Array },
			newsId: { type: Number },
		};
	}

	constructor() {
		super();
		this.posts = [];
	}

	async connectedCallback() {
		super.connectedCallback();
		const url  = this.newsId ? `/api/v1/news/${this.newsId}` : '/api/v1/news';
		const data = await asyncFetchJSON(url, this);
		if (data) {
			this.posts = data.posts;
		}	
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
			border-width: 1px 1px 0 1px;
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
			<tins-richtext-view text="${post.text}"></tins-richtext-view>
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
