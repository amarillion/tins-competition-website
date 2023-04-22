import { LitElement, html, css } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { TinsSpinner } from '../components/tins-spinner.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { asyncStateFlags, postOrThrow } from '../util.js';

export class TinsTeamManagement extends ScopedElementsMixin(LitElement) {

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			data: { type: Object }
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

	async onBeforeEnter(location, commands /*, router */) {
		const compoId = location.params.compoId;

		const data = await asyncStateFlags(
			async () => {
				const response = await postOrThrow(`/api/v1/compo/${compoId}/myEntry`, '');
				return response.json();
			}, this
		);

		if (!data) {
			this.error = { msg: 'Could not get or create your entry' };
		}
	}

	renderInvitation() {
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

	renderPending() {
		const pendingInvitations = this.entry;
		return this.pendingInvitations ? html`Pending invitations: ${repeat(
			pendingInvitations, 
			e => e.id, 
			e => html`${e.name}`
		)}` : '';
	}

	renderContents() {
		return html`${this.pendingInvitations} ${this.renderInvitation()}`;

	}

	render() {
		return html`<tins-status-helper 
				error="${this.error}" ?loading=${this.loading}
			>${this.renderContents()}</tins-status-helper>`;
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
