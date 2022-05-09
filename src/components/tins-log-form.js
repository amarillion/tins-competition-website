import { LitElement, html, css } from 'lit';
import infoIcon from '@fortawesome/fontawesome-free/svgs/solid/info-circle.svg';
import { formatBytes, IMAGE_UPLOAD_SIZE_LIMIT } from '../util.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { TinsFaIcon } from './tins-fa-icon.js';

export const spoilerExplanation = `\
Posts marked spoiler will be hidden from the public until the competition is over. 
For secret-santa competitions, they're hidden from your giftee as well.`;

export const markupMessage = `\
Certain html tags are allowed: <a> <abbr> <b> <i> <s> <li> <ul> <ol> <pre> <code> <blockquote>
URLs are automatically linkified. 
Youtube links on a line by themselves are converted to embedded videos.
Newlines are preserved.
You can edit the text of your last post only.
`;

export class TinsLogForm extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-fa-icon': TinsFaIcon,
		};
	}

	static get properties() {
		return {
			hidden: { type: Boolean, reflect: true },
			imgDisabled: { type: Boolean },
			_prefill: { type: Object }
		};
	}

	constructor() {
		super();
		this.hidden = false;
		this.imgDisabled = false;
		this._submitCallback = () => { console.log("WARN: submitCallback not set"); };
		this._prefill = {};
	}

	static get styles() {
		return css`
			textarea {
				width: 100%;
			}

			.tins-button {
				padding: 0.5rem;
				border: 2px solid black;
				width: 8rem;
				background: #FF8;
				color: black;
			}

			.tins-button:hover {
				background: #CC0;
				transition: 0.1s
			}

			.screenshot[hidden] {
				display: none;
			}
		`;
	}

	set submitCallback(value) {
		this._submitCallback = value;
	}

	set prefill(value) {
		this._prefill = value;
		this.imgDisabled = !!this._prefill.image;
	}

	submit(e) {
		e.preventDefault();
		const formElt = this.shadowRoot.querySelector('form');
		const formData = new FormData(formElt);
		this._submitCallback(formData);
		formElt.reset(); // reset not automatic due to preventDefault...
	}

	renderScreenshotSelector() {
		const { image } = this._prefill;

		return html`${image ? html`
		<div>
			<label><input @input=${() => this.imgDisabled = true } 
				type="radio" name="img_option" value="as_is" checked>Leave image as is</label><br>
			<label><input @input=${() => this.imgDisabled = true } 
				type="radio" name="img_option" value="remove">Remove current image</label><br>
			<label><input @input=${() => this.imgDisabled = false } 
				type="radio" name="img_option" value="add_or_replace">Replace image</label><br>
		</div>`
			: html`<input type="hidden" name="img_option" value="add_or_replace">`}
		
		<div class="screenshot" ?hidden=${this.imgDisabled} title="note: screenshots should be GIF, JPG or PNG files of less than ${formatBytes(IMAGE_UPLOAD_SIZE_LIMIT)}">
			<label>Screenshot: <tins-fa-icon src="${infoIcon}" color="navy" size="1rem"></tins-fa-icon>
				<input type="file" name="screenshot" accept="image/*">
			</label>
		</div>`;
	}
	render() {
		const { text, spoiler } = this._prefill;

		return html`
		<form name="msglog" @submit=${(e) => this.submit(e)} enctype="multipart/form-data">
		
		<div title="${markupMessage}">
		Write your message (markup allowed <tins-fa-icon src="${infoIcon}" color="navy" size="1rem"></tins-fa-icon>):
		</div>
		<textarea name="message" cols="40" rows="10" required id="id_message">${text}</textarea>
		
		<div title="${spoilerExplanation}">
			<label>Spoiler:
			<input type="checkbox" name="spoiler" id="id_spoiler" ?checked=${spoiler}>
			<tins-fa-icon src="${infoIcon}" color="navy" size="1rem"></tins-fa-icon>
			</label>
		</div>
	
		${this.renderScreenshotSelector()}
	
		<div style="text-align: right">
			<input class="tins-button" type="submit" name="submit" value="Submit">
		</div>
	
		</form>
			`;
	}
}
