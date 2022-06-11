import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

import { TinsSpinner } from '../components/tins-spinner.js';
import { TinsFaIcon } from '../components/tins-fa-icon.js';
import { asyncFetchJSON, postOrThrow } from '../util.js';
import { TinsRange } from '../components/tins-range.js';
import infoIcon from '@fortawesome/fontawesome-free/svgs/solid/info-circle.svg';
import thumbsUpIcon from '@fortawesome/fontawesome-free/svgs/solid/thumbs-up.svg';
import thumbsDownIcon from '@fortawesome/fontawesome-free/svgs/solid/thumbs-down.svg';
import easyIcon from '@fortawesome/fontawesome-free/svgs/solid/bicycle.svg';
import hardIcon from '@fortawesome/fontawesome-free/svgs/solid/space-shuttle.svg';

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
		const CHALLENGE_LABELS = ['I can do this in my sleep!', 'Piece of cake', 'Let me sit down for this', 'A real challenge!' ,'No way, nearly impossible!'];
		if (this.loading) return '';

		const rule = this.data || {};
		return html`<h1>Rate some Rules</h1>
		
<p>Help improve TINS by rating the following rule:</p>

<pre>
${rule.category} rule #${rule.number}:
${rule.text}
</pre>

Choose a rating

<p>
<details>
<summary>Rate how much you <b>like</b> this rule (Expand for explainer)</summary>
<blockquote>
<p>
<tins-fa-icon src="${infoIcon}" color="navy" size="1rem"></tins-fa-icon>
Give a rating for how good, fun, or interesting a rule is. In other words: would you <i>like</i> this rule to be in the next competition?
</p>
<p>
What makes good rules? A rule must be fun, stimulate creativity, and be open to a variety of interesting interpretations. 
Rules that are boring, cliche, confusing, or limiting your creativity, should get a low rating. 
</p>
The rating scale ranges from 'Why would you want <i>that</i>?' to 'Ooh! I love it!'. Hover over the radio buttons to see the meaning of each level. 
Rules with a rating of 3 or higher will have a chance to be included in competitions. Ratings below that will be excluded.
</p>
</blockquote>
</details>
 <br>
<div class="range">
	<tins-fa-icon src="${thumbsDownIcon}" color="black" size="1.6rem"></tins-fa-icon>
	<tins-range id="interestInput" .labels=${INTEREST_LABELS} @changed=${this.ratingChanged}></tins-range>
	<tins-fa-icon src="${thumbsUpIcon}" color="black" size="1.6rem"></tins-fa-icon>
</div>
</p>

<p>
<details>
<summary>Rate how <b>challenging</b> you find this rule (Expand for explainer)</summary>
<blockquote>
<p>
<tins-fa-icon src="${infoIcon}" color="navy" size="1rem"></tins-fa-icon>
How hard do you think this rule is to implement? Keep in mind that challenging rules are <i>neither good nor bad</i>. Each competition will always include one challenging rule (between 3 and 4.5 on average) and several non-challenging rules (below 3 on average). 
</p>
<p>
Impossible rules (above 4.5 on average) will be excluded from the roll.
So if you think a rule is impossible to do, rate it a 5. If many people agree, then it will be excluded.
</p>
<p>
A special note for <i>bonus rules</i>. The challenge rating is ignored when it comes to bonus rules. Bonus rules are there to help you, and therefore don't really add much to the challenge of the competition. For bonus rules, only the 'interest' aspect determines how likely it'll be rolled.
</p>
<p>
The rating scale ranges from 'I can do this in my sleep' to 'No way, this is impossible!'. Hover over the radio buttons to see each level.
</p>
</blockquote>
</details>

<div class="range">
	<tins-fa-icon src="${easyIcon}" color="black" size="1.6rem"></tins-fa-icon>
	<tins-range id="challengeInput" .labels=${CHALLENGE_LABELS} @changed=${this.ratingChanged}></tins-range>
	<tins-fa-icon src="${hardIcon}" color="black" size="1.6rem"></tins-fa-icon>
</div>
</p>

<button id="skipButton" @click=${this.skipRating}>Skip</button>
<button id="saveButton" @click=${this.submitRating}>Save &amp; Next</button>
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
				grid-template-columns: auto 10rem auto;
				gap: 1rem;
				margin: 2rem 0;
			}

			button {
				padding: 0.5rem;
				border: 2px solid black;
				min-width: 5rem;
				background: #FF8;
				color: black;
			}

			button:hover {
				background: #CC0;
				transition: 0.1s
			}

			button:disabled {
				background: lightgrey;
				transition: 0.1s
			}

		`;
	}

}
