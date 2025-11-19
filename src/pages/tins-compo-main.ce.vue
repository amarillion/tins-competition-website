<script setup lang="ts">
import calendarIcon from '@fortawesome/fontawesome-free/svgs/solid/calendar.svg';
import joinIcon from '@fortawesome/fontawesome-free/svgs/regular/hand-point-right.svg';
import rulesIcon from '@fortawesome/fontawesome-free/svgs/solid/book.svg';
import logsIcon from '@fortawesome/fontawesome-free/svgs/solid/comments.svg';
import gamepadIcon from '@fortawesome/fontawesome-free/svgs/solid/gamepad.svg';
import voteIcon from '@fortawesome/fontawesome-free/svgs/solid/check-to-slot.svg';
import trophyIcon from '@fortawesome/fontawesome-free/svgs/solid/trophy.svg';
import liveIcon from '@fortawesome/fontawesome-free/svgs/solid/heart-pulse.svg';

import { usePromise } from '../usePromise.js';
import { onMounted } from 'vue';
import { fetchJSONOrThrow } from '../util';

type CompoType = {
	short: string,
	title: string,
	canJoin: boolean,
	canPost: boolean,
	canVote: boolean,
	votingEnd: number,
	competitionStart: number,
	competitionEnd: number,
	numEntrants: number,
	hasResults: boolean,
	numReviews: number,
	numEntries: number,
	numLogs: number,
	serverTime: number,
	joinedCompetition: boolean
};

const compo = usePromise<CompoType>();

const m = window.location.pathname.match('/(?<compoId>[^/]+)/?$');
const { compoId } = m.groups;

onMounted(() => {
	compo.doAsync(async () => fetchJSONOrThrow(`/api/v1/compo/${compoId}`));
});

const formatDate = (d: number) => new Date(d).toLocaleDateString('en-GB', { month: 'short', day: 'numeric'});

</script>
<template>
	<tins-status-helper :error="compo.error.value" :loading="compo.loading.value">
		<tins-breadcrumbs :data="[{ title: compoId }]"></tins-breadcrumbs>
		<div v-if="compo.result.value">
			<h1>{{compo.result.value.title}}</h1>
			<div class="container">

				<!-- Live block -->
				<div v-if="(compo.result.value.serverTime < compo.result.value.competitionEnd && compo.result.value.serverTime > compo.result.value.competitionStart)" class="block">
					<h3><tins-fa-icon class="icon" :src="liveIcon" size="2rem"></tins-fa-icon>{{compo.result.value.title}} is live</h3>
					<tins-count-down label="Finish" :epochMillis="compo.result.value.competitionEnd"></tins-count-down>
					<p><a :href="`/${compoId}/upload`" router-ignore>Upload here</a></p>
				</div>

				<!-- Calendar block-->
				<div v-if="compo.result.value.canJoin && (compo.result.value.serverTime < compo.result.value.competitionStart)" class="block">
					<h3><tins-fa-icon class="icon" :src="calendarIcon" size="2rem"></tins-fa-icon>Important dates</h3>
					<p>
					{{compo.result.value.title}} will be held from <b>{{formatDate(compo.result.value.competitionStart)}}</b> to <b>{{formatDate(compo.result.value.competitionEnd)}}</b>. Mark your calendar!
					</p>
				</div>

				<!-- Join block -->
				<div v-if="compo.result.value.canJoin" class="block">
					<h3><tins-fa-icon class="icon" :src="joinIcon" size="2rem"></tins-fa-icon>Sign up!</h3>
					<p>There are {{compo.result.value.numEntrants}} participants.</p>
					<p v-if="compo.result.value.joinedCompetition">You signed up successfully! <a href="/join/" router-ignore>Click to modify</a></p>
					<p v-else><a href="/join/" router-ignore>Click to join</a>!</p>
				</div>

				<!-- Rules block -->
				<div class="block">
					<h3><tins-fa-icon class="icon" :src="rulesIcon" size="2rem"></tins-fa-icon>Rules</h3>
					<p><a :href="`${compoId}/rules`">Read the rules</a></p>
					<tins-count-down label="Find out your extra rules in" :epochMillis="compo.result.value.competitionStart"></tins-count-down>
				</div>

				<!-- Results block -->
				<div v-if="compo.result.value.hasResults" class="block">
					<h3><tins-fa-icon class="icon" :src="trophyIcon" size="2rem"></tins-fa-icon>Results</h3>
					<p><a :href="`/${compoId}/results`">Click here to see the results</a></p>
				</div>

				<!-- Entries block--->
				<div v-if="compo.result.value.numEntries" class="block">
					<h3><tins-fa-icon class="icon" :src="gamepadIcon"></tins-fa-icon>Entries</h3>
					<p>{{compo.result.value.numEntries}} submissions. <a :href="`${compoId}/entries`" router-ignore>Download and try them out!</a></p>
					<p v-if="compo.result.value.numReviews"><a :href="`/${compoId}/reviews`" router-ignore>Read reviews</a></p>
				</div>

				<!-- Logs block -->
				<div v-if="compo.result.value.canPost || compo.result.value.numLogs" class="block">
					<h3><tins-fa-icon class="icon" :src="logsIcon" size="2rem"></tins-fa-icon>Log messages</h3>
					<p v-if="compo.result.value.canPost && compo.result.value.joinedCompetition"><a :href="`/${compoId}/log/`">Add or update your log</a></p>
					<p v-else><a :href="`/${compoId}/log/`">View logs ({{compo.result.value.numLogs}} posts)</a></p>
				</div>

				<!-- Voting block-->
				<div v-if="compo.result.value.canVote && compo.result.value.joinedCompetition" class="block">
					<h3><tins-fa-icon class="icon" :src="voteIcon" size="2rem"></tins-fa-icon>Voting</h3>
					<tins-count-down label="Voting ends" :epochMillis="compo.result.value.votingEnd"></tins-count-down>
					<p>Voting is now active. <a :href="`/${compoId}/vote/`" router-ignore>Cast your vote!</a></p>
				</div>
		
			</div>
		</div>
	</tins-status-helper>

</template>

<style>
a 			{ font-weight: bold; text-decoration: none; }
a:link 		{ color: #600; }
a:hover 	{ text-decoration: underline; }
a:active 	{ text-decoration: underline; }

.block {
	border: 2px dashed black;
	width: 100%;
	padding: 1rem;
	box-sizing: border-box;

	display: inline-block;
	margin-bottom: 1rem;
}

.icon {
	margin-right: 0.5rem;
}

.block h3 {
	color: teal;
	margin-top: 0;
}

@media (min-width: 1024px) {
	.container {
		column-count: 2;
	}
}
</style>
