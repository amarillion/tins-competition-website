import { LitElement, html, css } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsRichTextControl } from '../components/tins-richtext-control.js';
import { asyncFetchJSON, formatBytes, IMAGE_UPLOAD_SIZE_LIMIT, postOrThrow } from '../util.js';
import { repeat } from 'lit-html/directives/repeat.js';
import gamepadIcon from '@fortawesome/fontawesome-free/svgs/solid/gamepad.svg';
import downloadIcon from '@fortawesome/fontawesome-free/svgs/solid/download.svg';
import { TinsFaIcon } from '../components/tins-fa-icon.js';
import { TinsImageUpload } from '../components/tins-image-upload.js';
import { TinsStatusHelper } from '../components/tins-status-helper.js';
import { TinsInlineCountDown } from '../components/tins-inline-count-down.js';

export class TinsEntry extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-richtext': TinsRichTextControl,
			'tins-status-helper': TinsStatusHelper,
			'tins-fa-icon': TinsFaIcon,
			'tins-image-upload': TinsImageUpload,
			'tins-inline-count-down': TinsInlineCountDown,
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

	renderUploadBox() {
		if (!this.entry.editable) return '';
		const { competition } = this.entry;
		const { afterStart, afterEnd, competitionEnd } = competition;
		if (afterEnd || !afterStart) return '';
		return html`
			<p>
				<a href="/${competition.short}/upload" router-ignore>Upload your entry!</a> Time remaining: <tins-inline-count-down epochMillis=${competitionEnd}></tins-inline-count-down>
			</p>`;
	}

	renderAuthorBox() {
		const { competition, entrants, logCounts } = this.entry;
		return html`<p class="authorbox">
		Event: <a href="/${competition.short}" router-ignore>${competition.title}</a><br>
		${this.entry.editable ? 
			html`<div class="floatright"><a href="/${competition.short}/team">Manage Team</a></div>` 
			: ''
		}
		Game by: ${repeat(
			entrants, 
			e => e.id, 
			e => html`${e.name} <a href='${competition.short}/log/entrant/${e.id}'>log (${logCounts[e.id]})</a> `
		)}
	</p>`;
	}

	renderContents() {
		if (this.loading) return;
		const { tags, competition, id, 
			imagefile, editable, text, lastSubmission, reviewCount } = this.entry;
		const title = (this.entry && this.entry.title) || 'Untitled';
		return html`
			<div class="floatright">
				${repeat(tags, t => html`<img src="/upload/${t.icon}" title="${t.desc}"/>`)}
			</div>

			<h1><tins-fa-icon src="${gamepadIcon}" size="2rem"></tins-fa-icon> ${title}</h1>
			${this.renderAuthorBox()}
			${this.renderUploadBox()}

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


	render() {
		return html`<tins-status-helper 
				error="${this.error}" ?loading=${this.loading}
			>${this.renderContents()}</tins-status-helper>`;
	}

	static get styles() {
		return css`
			:host {
			}

			a 			{ font-weight: bold; text-decoration: none; }
			a:link 		{ color: #600; }
			a:hover 	{ text-decoration: underline; }
			a:active 	{ text-decoration: underline; }

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

