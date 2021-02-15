import { LitElement, html, css } from 'lit-element';
import { formatBytes } from '../util.js';

export class TinsImageUpload extends LitElement {

	static get properties() {
		return {
			progress: { type: Number },
			error: { type: String },
			sizeLimit: { type: Number },
			label: { type: String },
		};
	}

	constructor() {
		super();
		this.error = "";
		this.label = "Upload image:";
		this.progress = 0;
		this.sizeLimit = 0;
		this._submitCallback = () => { console.log("WARN: submitCallback not set"); };
	}

	set submitCallback(value) {
		this._submitCallback = value;
	}

	async upload(e) {
		const elt = this.shadowRoot.querySelector("#image-upload")

		const fileNum = elt.files.length;
		if (fileNum != 1) {
			this.error = `Internal error. Expected 1 file, but got ${fileNum}`;
			return;
		}

		let myImage = elt.files[0];
		if (myImage.size > this.sizeLimit) {
			this.error = `Error: File too large! Received: ${formatBytes(myImage.size)}, maximum: ${formatBytes(this.sizeLimit)}`;
			return;
		}
		
		try {
			this.error = "";
			await this._submitCallback(myImage);
		}
		catch (e) {
			this.error = e.toString();
		}
	}


	renderError() {
		return this.error ? html`<div class="error">${this.error}</div>` : '';
	}

	render() {
		return html`
		<label>${this.label}
			<input id="image-upload"
				type="file" 
				accept="image/*,video/webm"
				@change=${(e) => this.upload(e)}>
			</input>
			${this.renderError()}
		</label>
		`;
	}

	static get styles() {
		return css`
			:host {
				display: block;
				border: 2px dashed grey;
				padding: 10px;
				color: black;
				background: lightgrey;
			}

			.error {
				color: red;
			}
		`;
	}

}
