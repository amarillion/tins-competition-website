import './tins-frame.js';
import './tins-newsfeed.js';

import { dispatch } from '../store';
import { LitElement, html, css } from 'lit-element';
import { refreshPosts } from '../data/news.js';

export class TinsNewsPage extends LitElement {

	set newsId(val) {
		this._id = val;
	}

	connectedCallback() {
		super.connectedCallback();
		dispatch(refreshPosts(this._id));
	}

	constructor() {
		super();
		this._id = null;
	}

	static get styles() {
		return css`
		`;
	}

	render() {
		return html`
		<tins-frame>
			<tins-newsfeed></tins-newsfeed>	
		</tins-frame>
		`;
	}
}

customElements.define('tins-newspage', TinsNewsPage);
