import { LitElement, html, css } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { TinsSpinner } from './tins-spinner.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { postOrThrow } from '../util.js';

export class TinsTeamMembers extends ScopedElementsMixin(LitElement) {

	static get properties() {
		return {
			error: { type: String },
			loading: { type: Boolean },
			invitationOpen: { type: Boolean },
		};
	}

	static get scopedElements() {
		return {
			'tins-spinner': TinsSpinner
		};
	}

	set entry(value) {
		this._entry = value;
	}

	constructor() {
		super();
		this.loading = false;
		this.error = "";
		this.invitationOpen = false;
		this.entry = {};
	}

	renderError() {
		return this.error ? html`<div class="error">${this.error}</div>` : '';
	}

	async openInvitation() {
		const { competition } = this._entry;
		const response = await fetch(`/api/v1/compo/${competition.short}/entrants`);
		const data = await response.json();
		
		// TODO: filter self, filter invitees, filter team members
		this.entrants = data.result;
		this.invitationOpen = true;
	}

	async sendInvitation() {
		const selectedRecipient = this.shadowRoot.querySelector('#invitee-select').value;
		try {
			await postOrThrow(`/api/v1/entry/${this._entry.id}/createInvitation`,
				JSON.stringify({ 
					'recipientEntrantId': selectedRecipient
				})
			);
		}
		catch (e) {
			//TODO: nicer error handling
			alert(`${e}`);
		}
		this.invitationOpen = false;
		//TODO: trigger refresh of entry member list.
	}

	renderContents() {
		if (!this.invitationOpen) {
			return html`<div><button @click="${() => this.openInvitation()}">Invite team members</button></div>`;
		}
		else {
			return html`
			<div><select name="invitees" id="invitee-select">
				<option value="">--Please choose an option--</option>
				${repeat(this.entrants, e => e.entrantId, e => html`<option value="${e.entrantId}">${e.username}</option>`)}
			</select>
			<button @click="${() => this.sendInvitation()}">Send Invitation</button>
			</div>`;
		}
	}

	render() {
		return html`
			${this.loading 
			? html`<tins-spinner class="spinner"></tins-spinner>` 
			: this.error 
				? html`${this.renderError()}`
				: this.renderContents()
			}`;
	}

	static get styles() {
		return css`

		.error {
			width: 100%;
			color: red;
		}
		`;
	}
}
