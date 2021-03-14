import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsRichTextControl } from '../components/tins-richtext-control.js';
import { asyncFetchJSON, formatBytes, IMAGE_UPLOAD_SIZE_LIMIT, postOrThrow } from '../util.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { TinsSpinner } from '../components/tins-spinner.js';
import gamepadIcon from '@fortawesome/fontawesome-free/svgs/solid/gamepad.svg';
import downloadIcon from '@fortawesome/fontawesome-free/svgs/solid/download.svg';
import { TinsFaIcon } from '../components/tins-fa-icon.js';
import { TinsImageUpload } from '../components/tins-image-upload.js';

export class TinsEntry extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-richtext': TinsRichTextControl,
			'tins-spinner': TinsSpinner,
			'tins-fa-icon': TinsFaIcon,
			'tins-image-upload': TinsImageUpload,
		};
	}

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			entry: { type: Object },
		};
	}

	constructor() {
		super();
		this.entry = {};
		this.error = {};
		this.loading = false;
	}

	async connectedCallback() {
		super.connectedCallback();
		const entryId = this.location.params.entryId;
		const data = await asyncFetchJSON(`/api/v1/entry/${entryId}`, this);
		if (data) {
			this.entry = data;
		}
	}

	async submitImage(data) {
		const entryId = this.location.params.entryId;
		// https://medium.com/@adamking0126/asynchronous-file-uploads-with-django-forms-b741720dc952
		let formData = new FormData();
		formData.append("image", data);
		
		const response = await postOrThrow(`/api/v1/entry/${entryId}/image`, formData);
		this.entry = await response.json();
	}

	async submitText(unsafeText) {
		const entryId = this.location.params.entryId;
		const response = await postOrThrow(
			`/api/v1/entry/${entryId}/text`, 
			JSON.stringify({ text: unsafeText })
		);
		const data = await response.json(); 
		return data.text;
	}

	renderEditImage() {
		if (!this.entry.editable) return '';
		return html`<tins-image-upload 
				.submitCallback=${(data) => this.submitImage(data)} 
				sizeLimit="${IMAGE_UPLOAD_SIZE_LIMIT}">
			</tins-image-upload>`;
	}
	
	renderContents() {
		const { entrants, tags, competition, logCounts, id, 
			title, imagefile, editable, text, lastSubmission, reviewCount } = this.entry;
		return html`
			<div class="floatright">
				${repeat(tags, t => html`<img src="/upload/${t.icon}" title="${t.desc}"/>`)}
			</div>

			<h1><tins-fa-icon src="${gamepadIcon}" size="2rem"></tins-fa-icon> ${title}</h1>
			
			<p class="authorbox">
				Event: <a href="/${competition.short}" router-ignore>${competition.title}</a><br>
				Game by: ${repeat(
			entrants, 
			e => e.id, 
			e => html`${e.name} <a href='${competition.short}/log/${e.id}'>log (${logCounts[e.id]})</a>`
		)}
			</p>

			${imagefile ? html`<img src="/upload/${imagefile}"/>` : html`<hr>`}
			${this.renderEditImage()}

			<p>
				<tins-richtext class="richtext" .submitCallback=${(data) => this.submitText(data)} ?readOnly=${!editable} text="${text}"></tins-richtext>
			</p>
			${lastSubmission ? html`
			<div class="downloadbox">
				<tins-fa-icon src="${downloadIcon}" color="gray" size="2rem"></tins-fa-icon>
				<a href="/upload/${lastSubmission.url}" router-ignore>${title}<a>
				${formatBytes(lastSubmission.size)}
			</div>` : ''}
			<p><a href="/${competition.short}/reviews/entry/${id}/" router-ignore>Reviews (${reviewCount})</a>
		`;
	}

	renderError() {
		return this.error ? html`<div class="error">${this.error}</div>`:'';
	}
	
	render() {
		return html`
			${this.loading 
			? html`<tins-spinner class="spinner"></tins-spinner>` 
			: this.error 
				? html`${this.renderError()}`
				: html`${this.renderContents()}`
			}`;
	}

	static get styles() {
		return css`
			:host {
			}

			.error {
				width: 100%;
				color: red;
			}

			.authorbox {
				color: grey;
			}

			.downloadbox {
				background: lightgrey;
				border: 2px dashed grey;
				padding: 10px;
			}
	
			.edit-image {
				width: 100%;
				background: lightgrey;
			}

			.floatright {
				float: right;
			}

			.color {
				width: 100%;
				background: red;
			}

			.richtext {
				width: 100%;
			}

			img {
				max-width: 100%;
			}
		`;
	}

}

