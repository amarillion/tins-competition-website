import { LitElement, html, css } from 'lit';
import { repeat } from 'lit-html/directives/repeat.js';
import twitterIcon from '@fortawesome/fontawesome-free/svgs/brands/twitter.svg';
import discordIcon from '@fortawesome/fontawesome-free/svgs/brands/discord.svg';
import { StoreSubscriberMixin } from '../data/storeSubscriberMixin.js';
import { TinsFaIcon } from './tins-fa-icon.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
 
export class TinsUpcoming extends ScopedElementsMixin(StoreSubscriberMixin(LitElement)) {

	static get scopedElements() {
		return {
			'tins-fa-icon': TinsFaIcon,
		};
	}

	static get properties() {
		return {
			loading: { type: Boolean },
			error: { type: String },
			upcoming: { type: Array },
			hidden: { type: Boolean, reflect: true },
		};
	}

	constructor() {
		super();
		this.hidden = true;
		this.upcoming = [];
	}

	static get styles() {
		return css`
			:host {
				display: block;
				border: 2px dashed grey;
				padding: 10px;
				color: black;
				background: lightgrey;
			}

			:host([hidden]) {
				display: none;
			}

			h1 {
				margin: 0;
				color: teal;
			}

			a        { font-weight: bold; text-decoration: none; }
			a:link   { color: #600; }
			a:hover  { text-decoration: underline; }
			a:active { text-decoration: underline; }
		`;
	}

	get selectors() {
		return {
			upcoming: s => s.currentEvent.data && s.currentEvent.data.upcoming,
			loading: s => s.currentEvent.loading,
			error: s => s.currentEvent.error
		};
	}

	updated(changedProperties) {
		if (changedProperties.has('upcoming')) {
			this.hidden = this.upcoming ? this.upcoming.length === 0 : false;
		}
	}

	render() {
		const upcoming = this.upcoming || [];
		return html`
			<h1>Coming up</h1>
			<p><i>Mark these events in your calendar!</i></p>
			${repeat(upcoming, u => html`<b>${u.dateStr}</b> <span>${u.title}</span><br>`)}
			<hr>
			Stay informed! <a href="https://groups.google.com/d/forum/tinscompetition">join our google group</a><br> 
			<tins-fa-icon src="${discordIcon}" size="1rem"></tins-fa-icon><a href="https://discord.gg/7uK6jNtNX9">our Discord server</a><br>
			<tins-fa-icon src="${twitterIcon}" size="1rem"></tins-fa-icon><a href="https://twitter.com/mpvaniersel">@mpvaniersel</a>
		`;
	}
}
