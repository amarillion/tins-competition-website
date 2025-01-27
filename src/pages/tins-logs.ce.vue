<script setup>
import { fetchJSONOrThrow, postOrThrow } from '../util';
import { canPostSelector, refreshCurrentEvent } from '../data/currentEvent.js';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { usePromise } from '../usePromise.js';
import { subscribe, dispatch } from '../store.js';
import { currentUserStore } from '../store/index';

const m = window.location.pathname.match(`/(?<compoId>\\w+)/log(/entrant/(?<entrantId>\\d+)|/page/(?<page>\\d+)|/id/(?<postId>\\d+))?/?$`);
const { compoId, postId, entrantId } = m.groups;
const page = Number(m.groups.page) || 1;
const url = entrantId ? `/${compoId}/log/entrant/${entrantId}` : `/${compoId}/log`;

let subscriptions = [];
const currentEvent = ref(null);
const canPost = ref(false);
const data = usePromise();

onMounted(() => {
	subscriptions = [
		subscribe(s => s.currentEvent.data && s.currentEvent.data.currentEvent, val => { currentEvent.value = val; }),
		subscribe(canPostSelector(compoId), val => { canPost.value = val; }),
	];
	
	dispatch(refreshCurrentEvent());
	data.doAsync(refreshData);
});

onUnmounted(() => {
	subscriptions.forEach(unsub => unsub());
});

async function refreshData() {
	let response;
	if (postId) {
		response = await fetchJSONOrThrow(`/api/v1/log/id/${postId}`);
	}
	else if (entrantId) {
		response = await fetchJSONOrThrow(`/api/v1/log/entrant/${entrantId}?page=${page}`);
	}
	else if (compoId) { 
		response = await fetchJSONOrThrow(`/api/v1/log/event/${compoId}?page=${page}`);
	}
	
	return response;
}

async function submit(formData) {
	data.doAsync(async () => {
		const response = await postOrThrow(`/api/v1/log/event/${compoId}`, formData);
		return await response.json();
	});
}

const breadcrumbs = [
	{ url: `/${compoId}/`, title: compoId },
	{ title: 'log' }
];


const loggedIn = computed(() => Boolean(currentUserStore.username));
const posts = computed(() => data.result.value?.posts || []);
const competition = computed(() => data.result.value?.competition || {});
const numPages = computed(() => data.result.value?.numPages || -1);
</script>
<template>

	<tins-breadcrumbs :data="breadcrumbs"></tins-breadcrumbs>
	<tins-status-helper :error="data.error.value" :loading="data.loading.value">
		
		<template v-if="loggedIn && competition && canPost">
			<p>Add a message to your log <a :href="`${compoId}/log/edit`">(click here to edit your previous post)</a>
			</p><p>
			<tins-log-form :submitCallback="(formData) => submit(formData)"></tins-log-form>
			</p>
			<hr>
		</template>
		<h1>{{competition.title}} logs</h1>

		<table v-if="posts.length">
			<tr v-for="p of posts" :key="p.id"><td><tins-log-post :post="p" :competition="competition"></tins-log-post></td></tr>
		</table>
		<p v-else>Nothing posted yet...</p>

		<!-- page nav -->
		<template v-if="!postId"> <!-- no nav bar needed -->
			<span v-if="page > 1"><a :href="`${url}/page/${page-1}`">previous</a>&nbsp;</span>
			<span class="current">Page {{page}} of {{numPages}}</span>
			<span v-if="page < numPages">&nbsp;<a :href="`${url}/page/${page+1}`">next</a></span>
		</template>
	</tins-status-helper>

</template>
<style>
	a 			{ font-weight: bold; text-decoration: none; }
	a:link 		{ color: #600; }
	a:hover 	{ text-decoration: underline; }
	a:active 	{ text-decoration: underline; }

	.error {
		width: 100%;
		color: red;
	}

	.authorbox {
		color: grey;
	}

	.downloadbox {
		background: lightgrey;
		border: 2px dashed grey;
		padding: 10px;
	}

	.edit-image {
		width: 100%;
		background: lightgrey;
	}

	.floatright {
		float: right;
	}

	.color {
		width: 100%;
		background: red;
	}

	table, tr, td {
		border-collapse: collapse;
		border: 1px solid grey;
	}
</style>
