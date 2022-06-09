import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsSpinner } from '../components/tins-spinner.js';
import { TinsFaIcon } from '../components/tins-fa-icon.js';
import { asyncFetchJSON, postOrThrow } from '../util.js';
import { TinsRange } from '../components/tins-range.js';
import infoIcon from '@fortawesome/fontawesome-free/svgs/solid/info-circle.svg';

import { currentUserSelector } from '../data/currentUser.js';
import { subscribe } from '../store.js';

export class TinsRuleOMatic extends ScopedElementsMixin(LitElement) {

	static get scopedElements() {
		return {
			'tins-spinner': TinsSpinner,
			'tins-fa-icon': TinsFaIcon,
			'tins-range': TinsRange,
		};
	}

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			data: { type: Object }
		};
	}

	constructor() {
		super();
		this.data = {};
		this.error = "";
		this.loading = false;
	}

	async connectedCallback() {
		super.connectedCallback();
		this.subscriptions = [
			subscribe(currentUserSelector, val => {
				this.username = val;
				this.fetchNewRule();
			})
		];
		this.fetchNewRule();
	}

	disconnectedCallback() {
		this.subscriptions.forEach(unsub => unsub());
		super.disconnectedCallback();
	}

	async fetchNewRule() {
		const data = await asyncFetchJSON(`/rule-o-matic/ratings`, this);
		if (data) {
			this.data = data.needsRating[0];
		}
		this.resetForm();
	}

	resetForm() {
		this.interest = null;
		this.challenge = null;
		this.valid = false;

		this.saveButton = this.shadowRoot.querySelector('#saveButton');
		this.challengeInput = this.shadowRoot.querySelector('#challengeInput');
		this.interestInput = this.shadowRoot.querySelector('#interestInput');

		if (this.saveButton && this.challengeInput && this.interestInput) {
			this.saveButton.disabled = true;
			this.challengeInput.clear();
			this.interestInput.clear();
		}
	}

	async skipRating() {
		//TODO: prevent double submission?
		this.fetchNewRule();
	}

	async submitRating() {
		const response = await postOrThrow(`/rule-o-matic/ratings`, JSON.stringify({
			ruleId: this.data.id,
			challenge: this.challenge,
			interest: this.interest
		}));
		this.resetForm();
		const data = await response.json();
		if (data) {
			this.data = data.needsRating[0];
		}
	}

	ratingChanged(event) {
		const { target, value } = event.detail;

		if (target == this.challengeInput) {
			this.challenge = value;
		}
		else if (target == this.interestInput) {
			this.interest = value;
		}
		const valid = this.challenge && this.interest;
		if (valid) {
			this.saveButton.disabled = false;
		}
	}

	renderContents() {
		const loggedIn = !!this.username;

		if (!loggedIn) return html`<p>You must be logged in.</p>`;
		const INTEREST_LABELS = ['Why would you want that!?', 'Meh', 'Ok, I guess', 'Nice one!', 'Ooh! I love it!'];
		const CHALLENGE_LABELS = ['I can do this in my sleep!', 'Piece of cake', 'Not too much trouble', 'A real challenge!' ,'No way, nearly impossible!'];
		if (this.loading) return '';

		const rule = this.data || {};
		return html`<h1>Your input for the Rule-O-Matic</h1>
		
<p>Rate the following rule</p>

<pre>
${rule.category} rule #${rule.number}:
${rule.text}
</pre>

Choose a rating

<p><span title="This rating determines how much fun a rule is, ranging from 'boring' to 'extremely fun and interesting'. Rules that are fun, that stimulate creativity, or are open to a variety of interesting interpretations should be rated highly. Rules that are boring, cliche, confusing, or limiting should be rated lowly. Rules scoring below 3 on average will be excluded from a rule-o-matic roll.">
<tins-fa-icon src="${infoIcon}" color="navy" size="1rem"></tins-fa-icon> Rate how interesting this rule is </span><br>
<div class="range">
	<div>Uninteresting</div><tins-range id="interestInput" .labels=${INTEREST_LABELS} @changed=${this.ratingChanged}></tins-range><div>Interesting</div>
</div>
</p>
<p title="Ranges from 'I can do this in my sleep' to 'this is almost impossible'. Challenging rules are neither good nor bad: each roll of the rule-o-matic will include one challenging rule (above 3 on average) and several non-challenging rules (below 3 on average). Rules above 4.5 on average (nearly impossible) will be excluded from the roll.">
<tins-fa-icon src="${infoIcon}" color="navy" size="1rem"></tins-fa-icon> Rate how challenging this rule is:<br>
<div class="range">
	<div>Easy</div><tins-range id="challengeInput" .labels=${CHALLENGE_LABELS} @changed=${this.ratingChanged}></tins-range><div>Hard</div>
</div>
</p>

<button id="skipButton" @click=${this.skipRating}>Skip</button>
<button id="saveButton" @click=${this.submitRating}>Save and next</button>
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
			pre {
				white-space: pre-wrap;
			}

			.range {
				display: grid;
				justify-content: center;
				grid-template-columns: 8rem 10rem 8rem;
				gap: 1rem;
				margin: 2rem 0;
			}

			.range > :first-child {
				text-align: right;
			}
		`;
	}

}
