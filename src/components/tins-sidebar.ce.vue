<script setup>
import { refreshCurrentEvent } from '../data/currentEvent.js';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { subscribe, dispatch } from '../store.js';
import { currentUserStore } from '../store/index';

const currentEvent = ref(null);
let subscriptions = [];
const currentEventLoading = ref(true);
const currentEventError = ref('');
const latestEvent = ref({});

onMounted(() => {
	subscriptions = [
		subscribe(s => s.currentEvent.data && s.currentEvent.data.currentEvent, val => { currentEvent.value = val; }),
		subscribe(s => s.currentEvent.loading, val => { currentEventLoading.value = val; }),
		subscribe(s => s.currentEvent.error, val => { currentEventError.value = val; }),
		subscribe(s => s.currentEvent.data && s.currentEvent.data.events[0], val => { latestEvent.value = val; }),
	];
	
	dispatch(refreshCurrentEvent());
});

onUnmounted(() => {
	subscriptions.forEach(unsub => unsub());
});

const short = computed(() => currentEvent.value?.short);
const joinedCompetition = computed(() => currentEvent.value?.joinedCompetition);
const afterStart = computed(() => latestEvent.value?.afterStart);
const afterEnd = computed(() => latestEvent.value?.afterEnd);
const canJoin = computed(() => currentEvent.value?.canJoin);
const canVote = computed(() => currentEvent.value?.canVote);
const hasSecretSanta = computed(() => currentEvent.value?.hasSecretSanta);
const title = computed(() => currentEvent.value?.title);
</script>
<template>

	<nav id="rightcontent">

		<div class="toc">
			<a href="/news">News</a>
			<a href="/about">About</a>
			<a href="/support">Shop &amp; Support</a>
			<a href="/faq">FAQ</a>
			<a href="/history">History</a>

			<template v-if="currentUserStore.username">
				<a :href="`/user/${currentUserStore.username}`">My Profile</a>
				<a href="`/accounts/password/change" router-ignore>Change password</a>
			</template>
			<template v-if="currentUserStore.isStaff">
				<hr>
				<a href="/admin/" router-ignore>admin</a>
			</template>
		</div>
		
		<!-- Current event -->
		<div class="toc" v-if="currentEvent">
			<a :href="`/${short}/`">{{ title }}</a>
			<hr>
			<a v-if="afterStart && !afterEnd && hasSecretSanta" href="/secretsanta">My Secret Santa</a>
			<a v-if="canJoin" href="/join" router-ignore>Join</a>
			<a :href="`/${short}/rules`">Rules</a>
			<a :href="`/${short}/entrants`">Entrants</a>
			<a v-if="afterStart" :href="`/${short}/entries`" router-ignore>Entries</a>
			<a v-if="afterEnd" :href="`/${short}/results`">Results</a>
			<a v-if="afterEnd" :href="`/${short}/reviews`" router-ignore>Reviews</a>
			<a :href="`/${short}/log`">Logs</a>
			<a v-if="joinedCompetition && afterStart" :href="`/${short}/upload`" router-ignore>Upload</a>
			<a v-if="joinedCompetition && afterStart" :href="`/${short}/myEntry`">My entry</a>
			<a v-if="joinedCompetition && canVote" :href="`/${short}/vote`" router-ignore>Vote</a>
		</div>

	</nav>
</template>
<style>	
	a 			{ font-weight: bold; text-decoration: none; }
	a:link 		{ color: #600; }
	a:hover 	{ text-decoration: underline; }
	a:active 	{ text-decoration: underline; }

	nav {
		display: flex;
	}

	@media (max-width: 1023px) {
		nav {
			flex-direction: row;
			flex-wrap: wrap;
		}
		
		.toc {
			flex: 1 1 auto;
		}
	}

	@media (min-width: 1024px) {
		nav {
			flex-direction: column;
			align-items: stretch;
			flex-wrap: nowrap;
		}

		.toc {
			flex: 0 0 auto;
		}
	}

	.toc {
		background-color: #ff8;
		border: 4px dashed #cc0;
		padding: 10px 20px 10px 20px;
		margin: 20px 40px;
	}

	.toc a {
		color: #00f;
		font-size: small;
		white-space: nowrap;
		padding-right: 20px;
		display: block;
	}
</style>
