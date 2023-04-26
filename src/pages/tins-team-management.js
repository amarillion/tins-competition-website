import { LitElement, html, css } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { TinsSpinner } from '../components/tins-spinner.js';
import { repeat } from 'lit-html/directives/repeat.js';
import { asyncStateFlags, fetchJSONOrThrow, postOrThrow } from '../util.js';

export class TinsTeamManagement extends ScopedElementsMixin(LitElement) {

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			entry: { type: Object },
			invitations: { type: Array },
			pendingInvitations: { type: Array },
			invitationOpen: { type: Boolean },
			entrants: { type: Array },
		};
	}

	static get scopedElements() {
		return {
			'tins-spinner': TinsSpinner
		};
	}

	constructor() {
		super();
		this.loading = false;
		this.error = "";
		this.invitationOpen = false;
		this.entry = {};
		this.invitations = [];
	}

	async openInvitation() {
		const { competition } = this.entry;
		const response = await fetch(`/api/v1/compo/${competition.short}/entrants?simple=true`);
		const data = await response.json();
		
		// TODO: filter self, filter invitees, filter team members
		this.entrants = data.result;
		this.invitationOpen = true;
	}

	async sendInvitation() {
		const selectedRecipient = this.shadowRoot.querySelector('#invitee-select').value;
		try {
			await postOrThrow(`/api/v1/invitation/create`,
				JSON.stringify({ 
					'entryId': this.entry.id,
					'recipientEntrantId': selectedRecipient
				})
			);
			this.refresh();
		}
		catch (e) {
			//TODO: nicer error handling
			alert(`${e}`);
		}
		this.invitationOpen = false;
		//TODO: trigger refresh of entry member list.
	}

	async onBeforeEnter(location /*, commands, router */) {
		this.compoId = location.params.compoId;
		await this.refresh();
	}

	async refresh() {
		const compoId = this.compoId;
		const data = await asyncStateFlags(
			async () => {
				const invitations = await fetchJSONOrThrow(`/api/v1/invitation/byCompo/${compoId}`);
				const response = await postOrThrow(`/api/v1/compo/${compoId}/myEntry`, '');
				const myEntry = await response.json();
				const { entryId } = myEntry;
				const entry = await fetchJSONOrThrow(`/api/v1/entry/${entryId}/`, '');
				return { invitations, entry };
			}, this
		);

		if (data) {
			this.entry = data.entry;
			this.invitations = data.invitations.toMe;
			this.pendingInvitations = data.invitations.fromMe;
		}
		else {
			this.error = { msg: 'Could not get or team management data' };
		}
	}

	renderInvitation() {
		if (!this.invitationOpen) {
			return html`<div><button @click="${() => this.openInvitation()}">Invite somebody else</button></div>`;
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

	renderWaiting() {
		return this.invitations ? html`${repeat(
			this.invitations, 
			e => e.id, 
			e => html`<p>You've been invited to join the team of ${e.senderName}. 
			Do you <button @click=${() => this.resolve(e, true)}>Accept</button> 
			or <button @click=${() => this.resolve(e, false)}>Reject</button>?</p>`
		)}</p>` : '';
	}

	async resolve(invitation, isAccept) {
		await postOrThrow(`/api/v1/invitation/id/${invitation.id}/resolve`, JSON.stringify({ resolution: isAccept ? 'accept' : 'reject' }));
		this.refresh();
	}

	async leaveTeam() {
		if (window.confirm("Are you sure you want to leave this team and go by yourself?")) {
			const compoId = this.compoId;
			try {
				const data = await fetchJSONOrThrow(`/api/v1/compo/${compoId}/currentEntrant`);
				await postOrThrow(`/api/v1/removeTeamMember/${data.entrantId}`, '');
				this.refresh();
			}
			catch(e) {
				alert(`${e}`);
			}
		}
	}

	renderPending() {
		const pendingInvitations = this.pendingInvitations;
		return (pendingInvitations && pendingInvitations.length > 0) ? html`<p>Pending invitations (waiting to be accepted):<ul>${repeat(
			pendingInvitations, 
			e => e.recipientEntrantId, 
			e => html`<li>${e.recipientName}`
		)}</ul></p>` : '';
	}

	renderMembers() {
		const { entrants } = this.entry;
		return html`<p>Your current team:<ol>${repeat(
			entrants, 
			e => e.id, 
			e => html`<li>${e.name}`
		)}</ol>${entrants.length === 1 ? 
			`(You're all by yourself)` : 
			html`<button @click=${() => this.leaveTeam()}>Leave team</button>`}</p>`;
	}

	renderContents() {
		return html`
			${this.renderMembers()}
			${this.renderWaiting()}
			${this.renderInvitation()}
			${this.renderPending()}`;
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
