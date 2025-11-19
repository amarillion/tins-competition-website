<script setup lang="ts">
import { usePromise } from '../usePromise.js';
import { computed, ref, watch } from 'vue';
import { fetchJSONOrThrow, postOrThrow } from '../util';

import infoIcon from '@fortawesome/fontawesome-free/svgs/solid/circle-info.svg';
import thumbsUpIcon from '@fortawesome/fontawesome-free/svgs/solid/thumbs-up.svg';
import thumbsDownIcon from '@fortawesome/fontawesome-free/svgs/solid/thumbs-down.svg';
import easyIcon from '@fortawesome/fontawesome-free/svgs/solid/bicycle.svg';
import hardIcon from '@fortawesome/fontawesome-free/svgs/solid/shuttle-space.svg';

import { currentUserStore } from '../store/index';
import { storeToRefs } from 'pinia';

const { isLoggedIn } = storeToRefs(currentUserStore);

let interest = ref(null);
let challenge = ref(null);

async function skipRating() {
	fetchNewRule();
}

async function submitRating() {
	const rule = data.result.value?.needsRating[0];
	data.doAsync(async () => {
		if (!valid.value) { throw Error('Trying to submit invalid values'); }
		const response = await postOrThrow('/rule-o-matic/ratings', JSON.stringify({
			ruleId: rule?.id,
			challenge: challenge.value,
			interest: interest.value
		}));
		resetForm();
		return response.json();
	});
}

function interestChanged(event) {
	const { detail: [ value ] } = event;
	interest.value = value;
}

function challengeChanged(event) {
	const { detail: [ value ] } = event;
	challenge.value = value;
}

type RuleType = {
	category: unknown,
	number: unknown,
	text: unknown,
	id: number,
};

type RatingType = {
	needsRating: RuleType[],
	yourRatings: unknown,
	toBeat: { author: string, count: number },
	totalRules: number,
	rank: number
};
const data = usePromise<RatingType>();

const INTEREST_LABELS = ['Why would you want that!?', 'Meh', 'Ok, I guess', 'Nice one!', 'Ooh! I love it!'];
const CHALLENGE_LABELS = ['I can do this in my sleep!', 'Piece of cake', 'Let me sit down for this', 'A real challenge!' ,'No way, nearly impossible!'];

watch(isLoggedIn, () => {
	fetchNewRule();
}, { immediate: true });

async function fetchNewRule() {
	if (data.loading.value) return; // prevent double parallel requests
	data.doAsync(async () => {
		const result = await fetchJSONOrThrow<RatingType>('/rule-o-matic/ratings');
		resetForm();
		return result;
	});
}

function resetForm() {
	interest.value = null;
	challenge.value = null;
}

const validRange = (val: unknown) => typeof val === 'number' && val > 0 && val <= 5;
const valid = computed(() => validRange(interest.value) && validRange(challenge.value));
const rule = computed(() => data.result.value?.needsRating[0]);
const result = computed(() => data.result.value );

</script>
<template>
	<p v-if="!isLoggedIn">You must be logged in.</p>
	<template v-else>
		<tins-status-helper :error="data.error.value" :loading="data.loading.value">
			<template v-if="result">
				<h1>Rate some Rules</h1>
				
				<template v-if="rule">
<pre>
{{rule.category}} rule #{{rule.number}}:
{{rule.text}}
</pre>

<div>
<details>
<summary>Rate how much you <b>like</b> this rule (Expand for explainer)</summary>
<blockquote>
	<p>
	<tins-fa-icon :src="infoIcon" color="navy" size="1rem"></tins-fa-icon>
	Give a rating for how good, fun, or interesting a rule is. In other words: would you <i>like</i> this rule to be in the next competition?
	</p>
	<p>
	What makes good rules? A rule must be fun, stimulate creativity, and be open to a variety of interesting interpretations.
	Rules that are boring, cliche, confusing, or limiting your creativity, should get a low rating.
	</p>
	<p>
	The rating scale ranges from 'Why would you want <i>that</i>?' to 'Ooh! I love it!'. Hover over the radio buttons to see the meaning of each level.
	Rules with a rating of 3 or higher will have a chance to be included in competitions. Ratings below that will be excluded.
	</p>
</blockquote>
</details>
<br>
<div class="range">
	<tins-fa-icon title="Bad" :src="thumbsDownIcon" color="black" size="1.6rem"></tins-fa-icon>
	<tins-range :value="interest" :labels="INTEREST_LABELS" @changed="interestChanged"></tins-range>
	<tins-fa-icon title="Good" :src="thumbsUpIcon" color="black" size="1.6rem"></tins-fa-icon>
</div>
</div>

<div>
<details>
<summary>Rate how <b>challenging</b> you find this rule (Expand for explainer)</summary>
<blockquote>
<p>
<tins-fa-icon :src="infoIcon" color="navy" size="1rem"></tins-fa-icon>
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
	<tins-fa-icon title="Easy" :src="easyIcon" color="black" size="1.6rem"></tins-fa-icon>
	<tins-range :value="challenge" :labels="CHALLENGE_LABELS" @changed="challengeChanged"></tins-range>
	<tins-fa-icon title="Hard" :src="hardIcon" color="black" size="1.6rem"></tins-fa-icon>
</div>
</div>
				</template>
				<p v-else>Zarroo rules remain!</p>

				<p><i>
					Thanks for helping to improve TINS! So far you've rated {{ result.yourRatings }} out of {{ result.totalRules }} rules.
					You're the #{{ result.rank }} contributor <span v-if="result.toBeat"> (behind {{ result.toBeat.author }} who rated {{ result.toBeat.count }})</span>
				</i></p>
				
				<template v-if="rule">
					<button id="skipButton" @click="skipRating">Skip</button>&nbsp;
					<button id="saveButton" @click="submitRating" :disabled="!valid">Save &amp; Next</button>
				</template>

			</template>
		</tins-status-helper>
	</template>
</template>

<style>
	@keyframes slide {
		0% {
			opacity: 0;
			transform: translateX(4rem);
		}
		100% {
			opacity: 1;
			transform: translateX(0);
		}
	}

	pre {
		white-space: pre-wrap;
		padding: 1rem;
		animation: slide 0.4s ease;
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
</style>