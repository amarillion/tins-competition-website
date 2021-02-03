import { LitElement, html, css } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import linkifyHtml from 'linkifyjs/html';
import { TinsSpinner } from './tins-spinner';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

export class TinsRichText extends ScopedElementsMixin(LitElement) {

	static get properties() {
		return {
			editMode: { type: Boolean, reflect: true },
			readOnly: { type: Boolean },
			text: { type: String },
			placeholder: { type: String },

			// internal use:
			loading: { type: Boolean },
			error: { type: String },
			safeText: { type: String },
			unsafeText: { type: String },
			submitCallback: { type: Function },
		};
	}

	static get scopedElements() {
		return {
			'tins-spinner': TinsSpinner
		};
	}

	constructor() {
		super();
		this.editMode = false;
		this.readOnly = false;
		this.loading = false;
		this.error = "";

		this.unsafeText = "";
		this.safeText = "";
		this.placeHolder = "(no description)";
		this._submitCallback = () => { console.log("WARN: submitCallback not set"); };
	}

	set submitCallback(value) {
		this._submitCallback = value;
	}

	/** text provided by attribute, must be safe */
	set text(value) {
		this.safeText = value;
		this.unsafeText = value;
	}

	renderError() {
		return this.error ? html`<div class="error">${this.error}</div>`: '';
	}

	renderEditButton() {
		return this.readOnly ? '' : html`<div class="buttons"><button @click=${() => this.clickEdit()}>Edit</button></div>`;
	}

	render() {
		if (this.loading) {
			return html`<tins-spinner class="spinner editor"></tins-spinner>`;
		}
		else {
			if (this.editMode) {
				return html`${this.renderError()}
				<div class="buttons">
					<button @click=${() => this.clickSave()}>Save</button>
					<button @click=${() => this.clickCancel()}>Cancel</button>
				</div>
				<textarea class="editor">${this.unsafeText}</textarea>`;
			}
			else {
				return html`${this.renderEditButton()}
				<div>${this.safeText ? unsafeHTML(this.renderRichText(this.safeText)) : html`<i>${this.placeHolder}</i>`}</div>
				`;
			}
		}
	}

	transformYoutubeLinks(text) {
		if (!text) return text;
		const youtubeLink = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?/gm;
		// trick for responsive aspect ratio in iframe: https://www.ankursheel.com/blog/full-width-you-tube-video-embed
		const replacement = '<div class="video-container"><iframe class="video" src="https://www.youtube.com/embed/$1" allowfullscreen></iframe><br/></div>';
		return text.replaceAll(youtubeLink, replacement);
	}

	renderRichText(text) {
		// convert youtube links
		// must be done before linkifying and converting newlines
		text = this.transformYoutubeLinks(text);

		// convert urls
		text = linkifyHtml(text, {
			validate: {
				// only linkify URLs that start with a protocol
				// http://www.google.com but not google.com
				url: (value) => /^(http|ftp)s?:\/\//.test(value)
			}
		});
	
		// replace double newlines with paragraph breaks
		text = `<p>${text.replaceAll("\n\n", "</p><p>")}</p>`;
		// insert line breaks
		return text.replaceAll("\n", "<br>");
	}

	async clickSave() {
		try {
			this.unsafeText = this.shadowRoot.querySelector("textarea").value;
			this.loading = true;
			this.error = "";
			
			// text processed on server side before it's considered safe 
			this.safeText = await this._submitCallback(this.unsafeText);
			this.loading = false;
			this.editMode = false;
		}
		catch(e) {
			console.log(e);
			this.loading = false;
			this.editMode = true;
			this.error = e.toString();
		}
	}

	clickCancel() {
		// discard edited text
		this.unsafeText = this.safeText;
		this.loading = false;
		this.editMode = false;
	}

	clickEdit() {
		if (!this.readOnly) {
			this.editMode = true;
		}
	}

	static get styles() {
		return css`

		:host {
			display: block;
			min-height: 3rem;
		}

		.buttons {
			float: right;
		}

		button {
			padding: 0.5rem;
			border: 2px solid black;
			width: 4rem;
			background: #FF8;
			color: black;
		}

		button:hover {
			background: #CC0;
			transition: 0.1s
		}

		.error {
			width: 100%;
			color: red;
		}

		.editor {
			min-height: 20rem;
		}

		.video-container {
			position: relative;
			width: 100%;
			padding-bottom: 56.25%;
		}

		.video {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border: 0;
		}

		textarea {
			width: 100%;
		}
		`;
	}
}
