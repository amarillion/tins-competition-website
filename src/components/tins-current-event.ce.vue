<script setup>
import { fetchJSONOrThrow } from '../util';
import { usePromise } from '../usePromise.js';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { subscribe } from '../store.js';

const currentEventRef = ref({});
let subscriptions;
const currentEventLoading = ref(true);
const currentEventError = ref('');

onMounted(() => {
	subscriptions = [
		subscribe(s => s.currentEvent.data && s.currentEvent.data.currentEvent, val => { currentEventRef.value = val; refreshLogs(); }),
		subscribe(s => s.currentEvent.loading, val => { currentEventLoading.value = val; }),
		subscribe(s => s.currentEvent.error, val => { currentEventError.value = val; }),
	];
	
	refreshLogs();
});

onUnmounted(() => {
	subscriptions.forEach(unsub => unsub());
});

const posts = usePromise();

async function refreshLogs() {
	if (!currentEvent.value) return;
	if (posts.result.value) return; // already loaded...
	
	const { short } = currentEvent.value;
	posts.doAsync(async () => {
		const data = await fetchJSONOrThrow(`/api/v1/log/event/${short}`);
		if (data) {
			return data.posts;
		}
	});
}

// TODO -> is this correct?
const currentEvent = computed(() => currentEventRef.value );

function formatRelativeTime(millis) {
	try {
		const rtf = new Intl.RelativeTimeFormat("en", {
			style: "long", // other values: "long", "short" or "narrow"
		});
		const deltaMillis = new Date(millis) - Date.now();
		const deltaMinutes = Math.round(deltaMillis / 60000);
		if (Math.abs(deltaMinutes) < 60) {
			return rtf.format(deltaMinutes, "minute");
		}
		else if (Math.abs(deltaMinutes) < 60*24) {
			const deltaHours = Math.round(deltaMinutes / 60);
			return rtf.format(deltaHours, "hour");
		}
		else {
			const deltaDays = Math.round(deltaMinutes / (60*24));
			return rtf.format(deltaDays, "day");
		}
	}
	catch (e) {
		// Intl.RelatvieTimeFormat not supported
		return '';
	}
}

const slug = post => {	
	const stripped = new DOMParser().parseFromString(post.text, 'text/html').body.textContent;
	const fragment = stripped.split(" ").slice(0, 15).join(" ") + "...";
	return fragment;
};

const lastPost = computed(() => {
	if (!posts.result.value) return;
	const [ post ] = posts.result.value;
	return post;
});

</script>
<template>
	<div class="currentEvent" v-if="currentEvent">
		Current event:
		<h1>{{currentEvent.title}}</h1>
		<div class="datelist">
		<tins-count-down label="Start"       :epochmillis="currentEvent.competitionStart"></tins-count-down>
		<tins-count-down label="Finish"      :epochmillis="currentEvent.competitionEnd"></tins-count-down>
		<tins-count-down label="Voting ends" :epochmillis="currentEvent.votingEnd"></tins-count-down>
		</div>
		<template v-if="currentEvent.canJoin">
			Already {{currentEvent.numEntrants}} signed up. <a href="/join/" router-ignore>Click to join</a>!
		</template>


		<template v-if="currentEvent.canPost">
		<hr>
			<a :href="`/${currentEvent.short}/log/`">View the latest logs</a>.
			
			<div class="latestPost" v-if="lastPost">
				<i>{{slug(lastPost)}}</i>
				<span style="color: grey;">posted {{formatRelativeTime(lastPost.date)}} by {{lastPost.entrant.name}}</span>.
			</div>
		</template>
	</div>
</template>
<style>
	.currentEvent {
		display: block;
		background: #FFEEDD;
		padding: 10px;
		color: black;
		margin-bottom: 1rem;
	}

	.latestPost {
		padding: 10px;
	}

	h1 {
		margin: 0;
		color: teal;
		font-size: 24px;
	}

	a        { font-weight: bold; text-decoration: none; }
	a:link   { color: #600; }
	a:hover  { text-decoration: underline; }
	a:active { text-decoration: underline; }
</style>