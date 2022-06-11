import './tins-header.js';
import './tins-sidebar.js';

import { LitElement, html, css } from 'lit';

export class TinsFrame extends LitElement {

	static get styles() {
		return css`
		:host {
			display: flex;
			min-height: 100vh;
		}
		
		@media (min-width: 1024px) {
			:host {
				flex-direction: row;
			}
		
			#leftcontent {
				flex: 0 0 15%;
			}
		
			#maincontent {
				flex: 4 4 0;
		
				z-index: 2; /* to make sure shadow is cast over rightcontent */
				box-shadow:20px 0px 40px black;
				border-left: 4px dashed #000;
				border-right: 4px dashed #000;
			}
		
			#rightcontent {
				flex: 0 1 25%;
			}
		}
		
		@media (max-width: 1023px) {
		
			:host {
				flex-direction: column-reverse;
			}
		
			#leftcontent {
				flex: 1 1 200px;
			}
		
			#maincontent {
				flex: 1 1 auto;
				
				z-index: 2; /* to make sure shadow is cast over bottom */
				box-shadow: 0px 20px 40px black;	
				border-top: 4px dashed #000;
				border-bottom: 4px dashed #000;	
			}
		
			#rightcontent {
				flex: 1 1 auto;
			}


		}
		
		img {
			max-width: 100%;
			height: auto; 
		}
		
		#leftcontent {
			margin: 0px 0px 0px 0px;
			background-image: url("./static/newborder2.png");
			background-repeat: repeat;
		}
		
		#maincontent {
			margin: 0px 0px 0px 0px;
			padding: 0px 30px 60px 30px;
			vertical-align: top;
			font-size: 18px;
		}
		
		#rightcontent {
			margin: 0px 0px 0px 0px;
			background-image: url("./static/newborder2.png");
			background-repeat: repeat;
			background-position-x: right;
		}
		
		table {
			border-spacing: 0px;
		}
		
		p.warning {
			color: red;
		}
		
		.errorlist {
			color: red;
		}
		
		p.small {
			font-size: x-small;
			text-align: center;
		}
		`;
	}

	render() {
		return html`	
		<div id="leftcontent"></div>
		
		<div id="maincontent">
			<tins-header></tins-header>
			<slot/>
		</div>

		<tins-sidebar id="rightcontent"></tins-sidebar>
		`;
	}
}
