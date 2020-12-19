import { LitElement, html, css } from 'lit-element';
import { dispatch, subscribe } from '../store.js';
import { refreshCurrentUser } from '../data/currentUser.js';

export class TinsCurrentUser extends LitElement {

	static get properties() {
		return {
			username: { type: String },
		};
	}

	constructor() {
		super();
	}

	connectedCallback() {
		super.connectedCallback();
		dispatch(refreshCurrentUser());

		this.unsubscribe = [
			subscribe(s => s.currentUser.data && s.currentUser.data.login, login => { this.username = login; })
		];
	}

	disconnectedCallback() {
		this.unsubscribe.forEach(unsub => unsub());
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
			html`You are logged in as: <b>${this.username}</b> <a href="/accounts/logout" router-ignore>log out</a>` : 
			html`Welcome, new user. Please <a href="/accounts/login" router-ignore>log in</a> or <a href="/accounts/register" router-ignore>register</a>.`}
	</p>`;
	}
}

customElements.define('tins-currentuser', TinsCurrentUser);