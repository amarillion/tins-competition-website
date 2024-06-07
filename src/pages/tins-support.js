import { LitElement, html, css } from 'lit';

export class TinsSupport extends LitElement {

	render() {
		return html`
	<h1>Shop &amp; Support</h1>

	<h3>Buy T-shirts and more...</h3>

	<p>Buy your own unique TINS T-shirt! Just head over to the <a href="https://clubcatt.com/tins">Official TINS Collection on clubcatt.com</a>.</p>
	
	<a href="https://clubcatt.com/tins/"><img src="./static/store.png" alt="T-shirts for TINS Hackathon"></a>
	
	<p>With your purchase, you contribute towards the organization of future TINS events.</p>

	<p>Some more cool designs are still available at the <a href="https://tins-is-not-speedhack.myspreadshop.nl/">old TINS store</a></p>

	<h3>Donations</h3>

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

	<p>
	Donations will go towards hosting costs. Money really helps to keep this server running ;-)
	</p>
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

			img {
				max-width: 100%;
			}

			a 			{ font-weight: bold; text-decoration: none; }
			a:link 		{ color: #600; }
			a:hover 	{ text-decoration: underline; }
			a:active 	{ text-decoration: underline; }
		`;
	}

}
