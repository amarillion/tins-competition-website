import { LitElement, html, css } from 'lit';

import './tins-currentuser.js';

export class TinsHeader extends LitElement {

	static get styles() {
		return css`
		a 			{ font-weight: bold; text-decoration: none; }
		a:link 		{ color: #600; }
		a:hover 	{ text-decoration: underline; }
		a:active 	{ text-decoration: underline; }

		
		img {
			max-width: 100%;
			height: auto; 
		}
		`;
	}

	render() {
		return html`
		<a href="/news"><img src="./static/tinslogo06.gif" alt="TINS Logo" /></a>
		<div><small>game jams by the <a href="http://www.allegro.cc">allegro community</a></small></div>
		<hr />
		<tins-currentuser></tins-currentuser>
		`;
	}
}
