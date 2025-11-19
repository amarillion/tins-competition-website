<script setup lang="ts">
import { usePromise } from '../usePromise.js';
import { fetchJSONOrThrow } from '../util';
import sleighIcon from '@fortawesome/fontawesome-free/svgs/solid/sleigh.svg';
import { computed, onMounted } from 'vue';

const formatDateLong = (millis: number) => new Date(millis).toLocaleDateString([], { dateStyle:'long' });

type MySecretSantaType = {
	competitionStarted: boolean,
	competitionEnded: boolean,
	competition: { title: string, short: string, canJoin: boolean, competitionStart: number, competitionEnd: number },
	joinedCompetition: boolean,
	secretSanta: { giver: { name: string }, receiver: { name: string, entrantId: number } },
	reverse: { name?: string, entryId?: number, entrantId?: number }
};

const data = usePromise<MySecretSantaType>();
function refresh() {
	data.doAsync(async () => fetchJSONOrThrow('/api/v1/mySecretSanta'));
}

onMounted(refresh);

function countDownFinished() {
	setTimeout(() => refresh(), 1000);
}

const competitionStarted = computed(() => data.result.value?.competitionStarted || false);
const competitionEnded = computed(() => data.result.value?.competitionEnded || false);
const competition = computed(() => data.result.value?.competition || null);
const joinedCompetition = computed(() => data.result.value?.joinedCompetition || false);
const title = computed(() => competition.value ? `Your Secret Santa for ${competition.value.title}` : 'Secret Santa');
const secretSanta = computed(() => data.result.value?.secretSanta || null); // note that absence of secretSanta info is only a problem after the start of the competition
const reverse = computed(() => data.result.value?.reverse || { });
</script>
<template>
	<tins-status-helper :error="data.error.value" :loading="data.loading.value">
		<h2>{{ title }}</h2>
		
		<template v-if="!competition">
			<p>There is no competition going on today. Come back later!</p>
		</template>
		<template v-else-if="!joinedCompetition">
			<p>You haven't signed up for this competition.
				<span v-if="competition.canJoin">You can still <a href="/join" router-ignore>sign up</a>.</span>
				<span v-else>Unfortunately, registration is closed...</span>
			</p>
		</template>
		<template v-else-if="!competitionStarted">
			Please be patient!
			Your secret santa will be revealed in
			<tins-inline-count-down :epochMillis="competition.competitionStart" @countDownZero="countDownFinished"></tins-inline-count-down>
		</template>
		<template v-else-if="!secretSanta">
			<!-- NOTE that absence of secretSanta info is only a problem after start of competition! -->
			<p>There is no secret santa information available for the current competition.</p>
		</template>
		<template v-else>
			<!-- Post competition letter -->
			<div class="letter" v-if="competitionEnded">
				<p class="right">North Pole, {{formatDateLong(competition.competitionEnd)}}</p>
				<div style="float: right;">
					<tins-fa-icon :src="sleighIcon" color="crimson" size="4rem"></tins-fa-icon>
				</div>
				<p>Hello {{secretSanta.giver.name}},</p>
				<p>
				Did you already receive your gift from {{reverse.name}}?
				</p>
				<p>
				Check
				<span v-if="reverse.entryId"> <a :href="`/entry/${reverse.entryId}/`">their entry page</a> and </span>
				<a :href="`/${competition.short}/log/entrant/${reverse.entrantId}/`">their log</a>
				to see if they uploaded something for you!
				</p>
				<br>
				<p>Best wishes, </p>
				<p class="indent">Santa.</p>
			</div>
			<!-- Letter at start, remains visible after the end too -->
			<div class="letter">
				<p class="right">North Pole, {{formatDateLong(competition.competitionStart)}}</p>
				<div style="float: right;">
					<tins-fa-icon :src="sleighIcon" color="crimson" size="4rem"></tins-fa-icon>
				</div>
				<p>Hello {{secretSanta.giver.name}},</p>
				<p>
				I have decided that you will give a gift to {{secretSanta.receiver.name}}!
				</p>
				<p>
				You can find their wishlist on
				<a :href="`/${competition.short}/log/entrant/${secretSanta.receiver.entrantId}/`">their log</a>
				</p>
				<br>
				<p>Best wishes, </p>
				<p class="indent">Santa.</p>
			</div>
		</template>
	</tins-status-helper>
</template>
<style>
	a 			{ font-weight: bold; text-decoration: none; }
	a:link 		{ color: #600; }
	a:hover 	{ text-decoration: underline; }
	a:active 	{ text-decoration: underline; }

	.letter {
		margin: 3rem;
		padding: 3rem;
		border: 1px solid black;
		box-shadow: 10px 10px 10px black;
	}

	.right {
		text-align: right;
	}

	.indent {
		padding-left: 6rem;
	}
</style>
