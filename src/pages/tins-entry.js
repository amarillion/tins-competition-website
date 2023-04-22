import { LitElement, html, css } from 'lit';

import { TinsRichTextControl } from '../components/tins-richtext-control.js';
import { asyncFetchJSON, formatBytes, IMAGE_UPLOAD_SIZE_LIMIT, postOrThrow } from '../util.js';
import { repeat } from 'lit-html/directives/repeat.js';
import gamepadIcon from '@fortawesome/fontawesome-free/svgs/solid/gamepad.svg';
import downloadIcon from '@fortawesome/fontawesome-free/svgs/solid/paperclip.svg';
import sourceIcon from '@fortawesome/fontawesome-free/svgs/brands/osi.svg';
import windowsIcon from '@fortawesome/fontawesome-free/svgs/brands/windows.svg';
import linuxIcon from '@fortawesome/fontawesome-free/svgs/brands/linux.svg';
import macIcon from '@fortawesome/fontawesome-free/svgs/brands/apple.svg';

import { TinsFaIcon } from '../components/tins-fa-icon.js';
import { TinsImageUpload } from '../components/tins-image-upload.js';
import { TinsStatusHelper } from '../components/tins-status-helper.js';
import { TinsInlineCountDown } from '../components/tins-inline-count-down.js';

export class TinsEntry extends LitElement {

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

	renderSingleUpload(u) {
		const getFileName = (url) => url.split('/').pop();
		const formatUploadTime = (time) => Intl.DateTimeFormat("en", {
			weekday: 'short',
			hour: '2-digit',
			minute: '2-digit',
		}).format(new Date(time));
		return html`<tr>
			<td><tins-fa-icon src="${downloadIcon}" color="gray" size="2rem"></tins-fa-icon></td>
			<td><a href="/upload/${u.url}" router-ignore>${getFileName(u.url)}</a></td>
			<td>${formatBytes(u.size)}</td>
			<td>${formatUploadTime(u.time)}</td>
			<td>${u.tags ? this.renderTags(u.tags) : ''}</td>
		</tr>`;
	}

	renderUploads(uploads) {
		const preDeadline = uploads.filter(u => !u.postCompo);
		const postDeadline = uploads.filter(u => u.postCompo);
		return html`
		<table class="uploadgrid" border=1 frame=void rules=rows>
			${repeat(preDeadline.slice(0, 4), u => this.renderSingleUpload(u))}
			${postDeadline.length > 0 ? html`
				<td colspan="6" style="background: white;"><h4>Post competition additions:</h4></td>
				${repeat(postDeadline.slice(0, 4), u => this.renderSingleUpload(u))}
			` : ''}
		</table>`;
	}

	renderTags(tags) {
		console.log("renderTags: ", tags);
		tags.sort();
		const icons = {
			hasSource: sourceIcon,
			hasWindows: windowsIcon,
			hasLinux: linuxIcon,
			hasMac: macIcon,
		};
		const titles = {
			hasSource: 'Source included',
			hasWindows: 'Windows Binary',
			hasLinux: 'Linux Binary',
			hasMac: 'Mac Binary',
		};
		return repeat(tags, t => html`<tins-fa-icon src="${icons[t]}" title="${titles[t]}"></tins-fa-icon>`);
	}

	renderContents() {
		if (this.loading) return;
		const { tags, competition, id, 
			imagefile, editable, text, uploads, reviewCount } = this.entry;
		
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
			${(uploads && uploads.length > 0) ? html`
				<h3>Uploaded files:</h3>
				<div class="downloadbox">
					${this.renderUploads(uploads)}
				</div>
				` : ''}

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

			table {
				width: 100%;
				border-top: 1px solid black;
				border-bottom: 1px solid black;
			}
		`;
	}

}

