import { LitElement, html, css } from 'lit-element';
import { subscribe, dispatch } from '../store';
import { repeat } from 'lit-html/directives/repeat.js';
import { refreshCurrentEvent } from '../data/currentEvent.js';

customElements.define('tins-sidebar', class extends LitElement {

	static get properties() {
		return {
			isStaff: { type: Boolean },
			events: { type: Array },
		};
	}

	constructor() {
		super();
		this.isStaff = false;
		this.events = [];
	}

	connectedCallback() {
		super.connectedCallback();
		dispatch(refreshCurrentEvent());

		this.unsubscribe = [
			subscribe(s => s.currentUser.data && s.currentUser.data.isStaff, val => { this.isStaff = val; }),
			subscribe(s => s.currentEvent.data && s.currentEvent.data.events, val => { this.events = val || []; })
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

		nav {
			display: flex;
		}
		
		@media (max-width: 1023px) {
			nav {
				flex-direction: row;
				flex-wrap: wrap;
			}
			
			.toc {
				flex: 1 1 auto;
			}
		}
		
		@media (min-width: 1024px) {
			nav {
				flex-direction: column;
				align-items: stretch;
				flex-wrap: nowrap;
			}
		
			.toc {
				flex: 0 0 auto;
			}
		}
		
		.toc {
			background-color: #ff8;
			border: 4px dashed #cc0;
			padding: 10px 20px 10px 20px;
			margin: 20px 40px;
		}
		
		.toc a {
			color: #00f;
			font-size: small;
			white-space: nowrap;
			padding-right: 20px;
			display: block;
		}
		
		`;
	}

	render() {
		return html`
		<nav id="rightcontent">

			
			<div class="toc">
		
				<a href="/news">News</a>
				<a href="/about">About</a>
				<a href="/faq">FAQ</a>
				<a href="/history">History</a>
		
			
				<a href="/profile" router-ignore>Profile</a>
				<a href="/join" router-ignore>Join a competition</a>
				<a href="/accounts/password/change" router-ignore>Change password</a>
			
			</div>
		
			
		
			
			<div class="toc">
				${repeat(this.events, e => e.short, e => html`<a href="/${e.short}/" router-ignore>${e.title}</a>`)}
			</div>
			
			${this.isStaff ? html`<div class="toc">
				<a href="/admin/" router-ignore>admin<br>
			</div>` : '' }
		</nav>
		
		`;
	}
});
