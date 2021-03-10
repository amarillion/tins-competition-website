import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsFrame } from '../components/tins-frame.js';

export class TinsHistory extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-frame': TinsFrame,
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

	render() {
		return html`
<tins-frame>
	<h1>History</h1>


	<p>
	The allegro community has a long and rich history of wacky competitions. Take a look at this list. 
	Many of these competitions still have a download section where you can download entries. Also, you can check out what the random additional requirements turned out to be in previous Speedhacks.
	Possibly this will help you get an idea of what exactly this is all about.
	</p>
	<p>
	<a href="http://www.speedhack.allegro.cc/1999/">SpeedHack 1999</a>
	</p>
	<p>
	<a href="http://www.speedhack.allegro.cc/2001/">SpeedHack 2001</a>
	</p>
	<p>
	<a href="http://gamecode.tripod.com/sizehack3d.html">The Allegro SizeHack3D 2001</a>
	</p>
	<p>
	<a href="http://amarillion.bafsoft.net/teamcompo/index.htm">The Allegro Team Competition 2001</a>
	
	</p>
	<p>
	<a href="http://binarysurge.netfirms.com/pgc/">The Pixelate Games Competition 2001</a>
	</p>
	<p>
	<a href="http://www.hot.ee/ideahack/">IdeaHack 2001</a>
	</p>
	<p>
	<a href="http://www.speedhack.allegro.cc/2002/">SpeedHack 2002</a>
	</p>
	<p>
	<a href="http://www.binarysurge.com/blitzhack/">BlitzHack 2003</a>
	</p>
	
	<p>
	<a href="http://www.speedhack.allegro.cc/2003">Speedhack 2003</a>
	</p>
	<p>
	<a href="http://amarillion.bafsoft.net/tins/">TINS 2003</a>
	</p>
	<p>
	<a href="http://www.speedhack.allegro.cc/2004/">Speedhack 2004</a>
	</p>
	<p>
	<a href="http://amarillion.bafsoft.net/tins05/">TINS 2005</a>
	</p>
	<p>
	
	<a href="http://www.speedhack.allegro.cc/2005/">Speedhack 2005</a>
	</p>
	<p>
	<a href="http://amarillion.bafsoft.net/tins06/">TINS 2006</a>
	</p>
	<p>
	<a href="http://www.speedhack.allegro.cc/2006/">Speedhack 2006</a>
	</p>
	<p>
	<a href="http://amarillion.bafsoft.net/tins07/">TINS 2007</a>
	</p>
	<p>
	<a href="http://www.speedhack.allegro.cc/2007/">Speedhack 2007</a>
	</p>
	<p>
	<a href="http://amarillion.bafsoft.net/tins08/">TINS 2008</a>
	</p>
</tins-frame>
		`;
	}
}
