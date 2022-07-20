import { LitElement, html, css } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { TinsFaIcon } from '../components/tins-fa-icon.js';
import patreonIcon from '@fortawesome/fontawesome-free/svgs/brands/patreon.svg';

export class TinsSupport extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-fa-icon': TinsFaIcon,
		};
	}

	render() {
		return html`
	<h1>Shop &amp; Support</h1>

	<h3>Buy T-shirts and more...</h3>

	<p>Did you fail to win a T-shirt? You can now buy one! Just head over to the <a href="https://tins-is-not-speedhack.creator-spring.com">TINS store</a>.</p>
	
	<a href="https://tins-is-not-speedhack.creator-spring.com"><img src="./static/store.png" alt="Sample products from the TINS store"></a>
	
	<p>All profits go towards the organization of future TINS events.</p>

	<h3>Donations</h3>

	<p>Do you enjoy TINS or KrampusHack? Do you want to see more events in the future, and help me make them extra cool and shiny? 
	Then why not donate and support the event financially?
	</p>

	<h4>Periodic donations</h4>
	<p>
	If you want to set up a periodic donation, use my <tins-fa-icon src="${patreonIcon}" size="1rem"></tins-fa-icon> <a href="https://www.patreon.com/tins_competition">patreon page</a>.
	</p>

	<h4>One-off donations</h4>
	<p>
	Suggested donation: <b>€10.00</b>
	</p>
	<form action="https://www.paypal.com/donate" method="post" target="_top">
		<input type="hidden" name="cmd" value="_donations" />
		<input type="hidden" name="business" value="XK9DV8JHM3UBN" />
		<input type="hidden" name="item_name" value="Sponsor the TINS competition" />
		<input type="hidden" name="currency_code" value="EUR" />
		<input type="image" src="https://www.paypalobjects.com/en_US/NL/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
		<img alt="" border="0" src="https://www.paypal.com/en_NL/i/scr/pixel.gif" width="1" height="1" />
	</form>

	<h3>What will your money be used for?</h3>

	<p>Donations will be used to make the TINS events even more spectacular! Here is what I plan to use the money for:
	<ul>
	<li>Upgrade the server so I can increase upload size limits
	<li>Award prizes to the winners of future events.
	</ul>
	These additions will make the event more attractive and popular, thus helping the allegro community in general.
	<p>
	Only donate what you can easily miss yourself.
	I promise that the TINS events will always remain free and open for everybody.
	</p>
		`;
	}

	static get styles() {
		return css`
			:host {
				display: block; // solves text selection issues
			}

			a 			{ font-weight: bold; text-decoration: none; }
			a:link 		{ color: #600; }
			a:hover 	{ text-decoration: underline; }
			a:active 	{ text-decoration: underline; }
		`;
	}

}
