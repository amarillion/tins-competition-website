import { LitElement, html, css } from 'lit-element';
import { dispatch, subscribe } from '../store.js';
import { refreshCurrentUser } from '../data/currentUser.js';

customElements.define('tins-currentuser', class extends LitElement {

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
			subscribe(s => s.currentUser.data && s.currentUser.data.login, login => { console.log({login}); this.username = login; })
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
		html`You are logged in as: <b>${this.username}</b> <a href="/accounts/logout">log out</a>` : 
		html`Welcome, new user. Please <a href="/accounts/login">log in</a> or <a href="/accounts/register">register</a>.`}
	</p>`;
	}
});

