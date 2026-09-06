<script setup lang="ts">
import { fetchJSONOrThrow, postOrThrow } from '../util.js';
import { computed, watch } from 'vue';
import { usePromise } from '../usePromise.js';
import { currentUserStore } from '../store/index.js';
import { currentEventStore } from '../store/index.js';

const props = defineProps<{
	compoId: string,
	entrantId?: string,
	page?: string,
	postId?: string,
}>();

const compoId = computed(() => props.compoId);
const postId = computed(() => props.postId);
const entrantId = computed(() => props.entrantId);
const page = computed(() => props.page ? Number(props.page) : 1);
const url = computed(() => entrantId.value ? `/${compoId.value}/log/entrant/${entrantId.value}` : `/${compoId.value}/log`);

const canPost = computed(() => currentEventStore.canPost(compoId.value));
type PostType = { id: number };
type CompetitionType = { title: string };
const data = usePromise<{
	posts: PostType[],
	competition: CompetitionType,
	numPages: number
}>();

watch(() => [compoId.value, entrantId.value, page.value, postId.value], () => {
	currentEventStore.refreshCurrentEvent();
	data.doAsync(refreshData);
}, { immediate: true });

async function refreshData() {
	let response;
	if (postId.value) {
		response = await fetchJSONOrThrow(`/api/v1/log/id/${postId.value}`);
	}
	else if (entrantId.value) {
		response = await fetchJSONOrThrow(`/api/v1/log/entrant/${entrantId.value}?page=${page.value}`);
	}
	else if (compoId.value) {
		response = await fetchJSONOrThrow(`/api/v1/log/event/${compoId.value}?page=${page.value}`);
	}

	return response;
}

async function submit(formData) {
	data.doAsync(async () => {
		const response = await postOrThrow(`/api/v1/log/event/${compoId.value}`, formData);
		return await response.json();
	});
}

const breadcrumbs = computed(() => [
	{ url: `/${compoId.value}/`, title: compoId.value },
	{ title: 'log' }
]);

const loggedIn = computed(() => Boolean(currentUserStore.username));
const posts = computed(() => data.result.value?.posts || []);
const competition = computed(() => data.result.value?.competition || {} as CompetitionType);
const numPages = computed(() => data.result.value?.numPages || -1);
</script>
<template>
	<div class="tins-logs">
		<tins-breadcrumbs :data="breadcrumbs"></tins-breadcrumbs>
		<tins-status-helper :error="data.error.value" :loading="data.loading.value">

			<template v-if="loggedIn && competition && canPost">
				<p>Add a message to your log <a :href="`/${compoId}/log/edit`">(click here to edit your previous post)</a>
				</p><p>
				<tins-log-form :submitCallback="(formData: FormData) => submit(formData)"></tins-log-form>
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
	</div>

</template>
<style scoped>
	.tins-logs :deep(a) { font-weight: bold; text-decoration: none; }
	.tins-logs :deep(a:link) { color: #600; }
	.tins-logs :deep(a:hover) { text-decoration: underline; }
	.tins-logs :deep(a:active) { text-decoration: underline; }

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

	.tins-logs :deep(table), .tins-logs :deep(tr), .tins-logs :deep(td) {
		border-collapse: collapse;
		border: 1px solid grey;
	}
</style>
