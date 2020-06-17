import { LitElement, html } from "lit-element";

import UniversalRouter from 'universal-router';
import { TinsNewsPage } from './tins-newspage.js';
import { TinsAbout } from './tins-about.js';
import { TinsFaq } from './tins-faq.js';
import { TinsHistory } from './tins-history.js';

const routes = [
	{
		path: '/news',
		action: () => {
				// must be called before instantiating the class
				customElements.define('tins-newspage', TinsNewsPage);
				
				// could be dynamic import...
				// could do some injection here...
				const instance = new TinsNewsPage();
				return instance;
		}
	}, {
		path: '/news/:newsId',
		action: (context) => {
				// must be called before instantiating the class
				customElements.define('tins-newspage', TinsNewsPage);

				// could be dynamic import...
				// could do some injection here...
				const instance = new TinsNewsPage();
				instance.newsId = context.params.newsId;
				return instance;
		}
	}, {
		path: '/faq',
		action: () => {
				// must be called before instantiating the class
				customElements.define('tins-faq', TinsFaq);
				
				const instance = new TinsFaq();
				return instance;
		}
	}, {
		path: '/about',
		action: () => {
				// must be called before instantiating the class
				customElements.define('tins-about', TinsAbout);

				const instance = new TinsAbout();
				return instance;
		}
	}, {
		path: '/history',
		action: () => {
				// must be called before instantiating the class
				customElements.define('tins-history', TinsHistory);

				const instance = new TinsHistory();
				return instance;
		}
	},
];

const CONTENT = Symbol('content');

export class TinsRouter extends LitElement {

	static get properties() {
		return {
			[CONTENT]: { Object }
		};
	}

	constructor() {
		super();
		this.router = new UniversalRouter(routes);
	}

	connectedCallback() {
		super.connectedCallback();
		this.resolve(window.location.pathname);
	}

	async resolve(pathname) {
		
		const routeResult = await this.router.resolve(pathname);
		// if (routeResult[REDIRECT]) {
		// 	history.replaceState({}, '', routeResult[REDIRECT]);
		// 	return this.resolve(routeResult[REDIRECT]);
		// }
		
		this[CONTENT] = routeResult;
	}

	render() {
		return html`
			<td-wim-app>
				${this[CONTENT]}
			</td-wim-app>
		`;
	}
}