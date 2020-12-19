import { LitElement, html, css } from 'lit-element';

export class TinsInlineCountDown extends LitElement {

	static get properties() {
		return {
			epochMillis: { type: Number },
			hidden: { type: Boolean, reflect: true },
		};
	}

	constructor() {
		super();
		this.label = "";
		this.hidden = false;
		this.epochMillis = 0;
	}

	render() {
		if (!this.epochMillis) return ''; // attribute not set... yet...

		const d = new Date(this.epochMillis);
		const now = Date.now();

		const deltaSec = Math.floor((d - now) / 1000);
		
		if (deltaSec < 0) return ''; // time in past is not displayed

		const sec = deltaSec % 60;
		const min = Math.floor(deltaSec / 60) % 60;
		const hours = Math.floor(deltaSec / 3600) % 24;
		const days = Math.floor(deltaSec / 86400);

		let numbers, labels;
		if (days > 0) {
			numbers = [ days, hours ];
			labels = [ "days", "hours" ];
			setTimeout(() => this.requestUpdate(), 60*60*1000);
		}
		else if (hours > 0) {
			numbers = [ hours, min ];
			labels = [ "hours", "min" ];
			setTimeout(() => this.requestUpdate(), 60*1000);
		}
		else {
			numbers = [ min, sec ];
			labels = [ "min", "sec" ];
			if (deltaSec > 1) {
				setTimeout(() => this.requestUpdate(), 1000);
			}
			else {
				console.log("Refreshing in 2 sec");
				setTimeout(() => location.reload(), 2000);
			}
		}
		
		return html`${numbers[0]} ${labels[0]} ${numbers[1]} ${labels[1]}`;
	}

	static get styles() {
		return css`
			:host {
				display: inline;
			}
		`;
	}
}
