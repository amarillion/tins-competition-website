import { LitElement, html, css } from 'lit';

// Based on: https://glennmccomb.com/articles/building-a-pure-css-animated-svg-spinner/
export class TinsSpinner extends LitElement {

	static get properties() {
		return {
			hidden: { type: Boolean, reflect: true },
		};
	}

	constructor() {
		super();
		this.hidden = false;
	}

	render() {
		return html`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<circle cx="50" cy="50" r="45"/>
		</svg>`;
	}

	static get styles() {
		return css`
		:host {
			display: block;
			margin: auto;
		}

		svg {
			animation: 2s linear infinite svg-animation;
			max-width: 100px;
			display: block;
			margin: auto;
		}
		
		@keyframes svg-animation {
		  0% {
			transform: rotateZ(0deg);
		  }
		  100% {
			transform: rotateZ(360deg);
		  }
		}
		
		circle {
		  animation: 1.4s ease-in-out infinite both circle-animation;
		  display: block;
		  fill: transparent;
		  stroke: #4f5d6c;
		  stroke-linecap: round;
		  stroke-dasharray: 283;
		  stroke-dashoffset: 280;
		  stroke-width: 4px;
		  transform-origin: 50% 50%;
		}
		
		@keyframes circle-animation {
		  0%,
		  25% {
			stroke-dashoffset: 280;
			transform: rotate(0);
		  }
		  
		  50%,
		  75% {
			stroke-dashoffset: 75;
			transform: rotate(45deg);
		  }
		  
		  100% {
			stroke-dashoffset: 280;
			transform: rotate(360deg);
		  }
		}
		`;
	}
}
