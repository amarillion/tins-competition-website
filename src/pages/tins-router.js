import { LitElement, html } from "lit-element";

import UniversalRouter from 'universal-router';
import { TinsNewsPage } from './tins-newspage.js';

const routes = [
	{
		path: '/news',
		action: () => {
				// could be dynamic import...
				// could do some injection here...
				const instance = new TinsNewsPage();
				return instance;
		}
	},
	{
		path: '/news/:newsId',
		action: (context) => {
				// could be dynamic import...
				// could do some injection here...
				const instance = new TinsNewsPage();
				instance.newsId = context.params.newsId;
				return instance;
		}
	}
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