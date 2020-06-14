import { dispatch } from '../store';
import { LitElement, html, css } from 'lit-element';
import { refreshPosts } from '../data/news.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsUpcoming } from '../components/tins-upcoming.js';
import { TinsFrame } from '../components/tins-frame';
import { TinsNewsFeed } from '../components/tins-newsfeed';

export class TinsNewsPage extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-frame': TinsFrame,
			'tins-newsfeed': TinsNewsFeed,
			'tins-upcoming': TinsUpcoming,
		};
	}

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

			@media (min-width: 1024px) {
				.twocol {
					display: grid;
					grid-template-columns: 3fr 1fr;
					column-gap: 1rem;
					align-items: start;
				}
			}
			@media (max-width: 1023px) {
				.twocol {
					display: flex;
    				flex-direction: column-reverse;
				}
				.tins-upcoming {
					margin-bottom: 1rem;
				}
			}
		`;
	}

	render() {
		return html`
		<tins-frame>
			<div class="twocol">
				<tins-newsfeed></tins-newsfeed>	
				<tins-upcoming class="tins-upcoming"></tins-upcoming>
			</div>
		</tins-frame>
		`;
	}
}

customElements.define('tins-newspage', TinsNewsPage);
