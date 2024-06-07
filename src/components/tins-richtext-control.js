import { LitElement, html, css } from 'lit';

export class TinsRichTextControl extends LitElement {

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
				<tins-richtext-view text="${this.safeText || `<i>${this.placeHolder}</i>`}"></tins-richtext-view>
				`;
			}
		}
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

		textarea {
			width: 100%;
		}
		`;
	}
}
