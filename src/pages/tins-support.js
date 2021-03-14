import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

export class TinsSupport extends ScopedElementsMixin(LitElement) {

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
	<h1>Support the TINS Game Jams!</h1>

	<p>Do you enjoy TINS or KrampusHack? Do you want to see more events in the future, and help me make them extra cool and shiny? 
	Then why not donate and support the event financially?
	</p>
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
}
