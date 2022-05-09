import { LitElement, html, css } from 'lit';
import { dispatch } from '../store.js';
import { currentUserSelector, refreshCurrentUser } from '../data/currentUser.js';
import { StoreSubscriberMixin } from '../data/storeSubscriberMixin.js';

export class TinsCurrentUser extends StoreSubscriberMixin(LitElement) {

	static get properties() {
		return {
			username: { type: String },
		};
	}

	constructor() {
		super();
	}

	get selectors() {
		return {
			username: currentUserSelector
		};
	}

	connectedCallback() {
		super.connectedCallback();
		dispatch(refreshCurrentUser());
	}

	static get styles() {
		return css`
		#status {
			font-size: small;
			text-align: right;
		}

		a 			{ font-weight: bold; text-decoration: none; }
		a:link 		{ color: #600; }
		a:visited 	{	}
		a:hover 	{ text-decoration: underline; }
		a:active 	{ text-decoration: underline; }
		`;
	}

	render() {
		return html`
	<p id="status">
	${this.username ? 
			html`You are logged in as: <b>${this.username}</b> <a href="/accounts/logout?next=${window.location.pathname}" router-ignore>log out</a>` : 
			html`Welcome, new user. Please <a href="/accounts/login?next=${window.location.pathname}" router-ignore>log in</a> or <a href="/accounts/register" router-ignore>register</a>.`}
	</p>`;
	}
}

customElements.define('tins-currentuser', TinsCurrentUser);