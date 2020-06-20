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

	connectedCallback() {
		super.connectedCallback();
		dispatch(refreshPosts(this.location.params.newsId));
	}

	constructor() {
		super();
		this._id = null;
	}

	static get styles() {
		/* 
			NOTE: advantage of flex over grid: 
			flex can deal with tins-upcoming setting itself hidden.
			With grid, you'd always have an empty column there.
			With flex, the remaining space goes to the newsfeed.
		*/
		return css`
			@media (min-width: 1024px) {
				.twocol {
					display: flex;
					flex-direction: row;
					align-items: flex-start;
				}
				.tins-newsfeed {
					flex-basis: 0;
					flex-grow: 3;
				}
				.tins-upcoming {
					flex-basis: 0;
					flex-grow: 1;
					margin-left: 1rem;
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
				<tins-newsfeed class="tins-newsfeed"></tins-newsfeed>	
				<tins-upcoming class="tins-upcoming"></tins-upcoming>
			</div>
		</tins-frame>
		`;
	}
}

