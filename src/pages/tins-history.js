import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { repeat } from 'lit-html/directives/repeat.js';
import { StoreSubscriberMixin } from '../data/storeSubscriberMixin.js';
import { refreshCurrentEvent } from '../data/currentEvent.js';
import { dispatch } from '../store.js';

export class TinsHistory extends StoreSubscriberMixin(ScopedElementsMixin(LitElement)) {

	constructor() {
		super();
		this.events = [];
	}

	static get properties() {
		return {
			events: { type: Array },
		};
	}

	static get styles() {
		return css`
			a 			{ font-weight: bold; text-decoration: none; }
			a:link 		{ color: #600; }
			a:hover 	{ text-decoration: underline; }
			a:active 	{ text-decoration: underline; }
		`;
	}

	get selectors() {
		return {
			events: s => s.currentEvent.data && s.currentEvent.data.events
		};
	}

	connectedCallback() {
		super.connectedCallback();
		dispatch(refreshCurrentEvent());
	}

	render() {
		const events = this.events;

		return html`
	<h2>TINS event history</h2>
	
	There have been game programming competitions on this site all the way back since 2003. 

	<div class="toc">
	<ul>
		${repeat(events, e => e.short, e => html`<li><a href="/${e.short}/">${e.title}</a></li>`)}
	</ul>
	</div>

	<p>You can browse <a href="/all/entries">all games</a> ever submitted!</p>
	
	<h2>Other community events</h2>
	<p>
	The allegro community has a long and rich history of wacky competitions.
	</p>
	<ol>
	<li><a href="http://www.speedhack.allegro.cc/2007/">Speedhack 2007</a>
	<li><a href="http://www.speedhack.allegro.cc/2005/">Speedhack 2005</a>
	<li><a href="http://www.speedhack.allegro.cc/2004/">Speedhack 2004</a>
	<li><!-- http://www.binarysurge.com/blitzhack/ -->BlitzHack 2003
	<li><a href="http://www.speedhack.allegro.cc/2003">Speedhack 2003</a>
	<li><a href="http://www.speedhack.allegro.cc/2002/">SpeedHack 2002</a>
	<!-- Following Links unfortunately dead... -->
	<li><!-- http://gamecode.tripod.com/sizehack3d.html -->The Allegro SizeHack3D 2001
	<li><!-- http://amarillion.bafsoft.net/teamcompo/index.htm -->The Allegro Team Competition 2001	
	<li><!-- http://binarysurge.netfirms.com/pgc/ -->The Pixelate Games Competition 2001
	<li><!-- http://www.hot.ee/ideahack/ -->IdeaHack 2001
	<li><a href="http://www.speedhack.allegro.cc/2001/">SpeedHack 2001</a>
	<li><a href="http://www.speedhack.allegro.cc/1999/">SpeedHack 1999</a>
	</ol>
		`;
	}
}
