import { LitElement, html, css } from 'lit-element';
import { asyncStateFlags, postOrThrow } from '../util.js';

/**
 * 
 * The function of this page is to fetch the entry id for the given entrant (Creating it if it doesn't exist)
 * and redirect to that.
 * 
 */
export class TinsMyEntry extends LitElement {

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
		};
	}

	constructor() {
		super();
		this.error = {};
		this.loading = false;
	}

	async onBeforeEnter(location, commands /*, router */) {
		const compoId = location.params.compoId;

		const data = await asyncStateFlags(
			async () => {
				const response = await postOrThrow(`/api/v1/compo/${compoId}/myEntry`, '');
				return response.json();
			}, this
		);

		if (data) {
			return commands.redirect(`/entry/${data.entryId}/`);
		}
		else {
			this.error = { msg: 'Could not get or create your entry' };
		}
	}

	render() {
		return html`<tins-status-helper 
				error="${this.error}" ?loading=${this.loading}
			></tins-status-helper>`;
	}

	static get styles() {
		return css`
			:host {
			}
		`;
	}

}

