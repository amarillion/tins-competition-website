<script setup lang="ts">
import commentIcon from '@fortawesome/fontawesome-free/svgs/regular/comment.svg';
import gamepadIcon from '@fortawesome/fontawesome-free/svgs/solid/gamepad.svg';
import reviewIcon from '@fortawesome/fontawesome-free/svgs/solid/check-to-slot.svg';
import { fetchJSONOrThrow, renderRichText } from '../util.js';
import { computed, watch } from 'vue';
import { usePromise } from '../usePromise.js';

const props = defineProps<{ compoId: string }>();
const compoId = computed(() => props.compoId);

const breadcrumbs = computed(() => [
	{ title: compoId.value, url: `/${compoId.value}/` },
	{ title: 'entrants' },
]);

type EntrantType = {
	entrantId: number,
	info: string,
	location: string,
	username: string,
	numPosts: number,
	numReviews: number,
	entryId: null | number,
	isSelf: boolean
};

const entrants = usePromise<EntrantType[]>();

watch(compoId, () => {
	entrants.doAsync(async() => {
		const data = await fetchJSONOrThrow<{ result: EntrantType[] }>(`/api/v1/compo/${compoId.value}/entrants`);
		return data.result;
	});
}, { immediate: true });
</script>

<template>
	<div class="tins-entrants">
		<tins-breadcrumbs :data="breadcrumbs"></tins-breadcrumbs>

		<tins-status-helper :error="entrants.error.value" :loading="entrants.loading.value">
			<div v-if="entrants.result.value">
				<h1>Entrants</h1>
				<p>
					At this moment, {{entrants.result.value.length}} people have registered for the competition.
				</p>
				<div v-for="e of entrants.result.value" :key="e.entrantId" class="entrant">
					<p>
						<b>Name:</b> <a :href="`/user/${e.username}`">{{e.username}}</a> <br>
						<b>From:</b> {{e.location}}
					</p>
					<p v-html="renderRichText(e.info)"></p>
					<p>
						<a :href="`/${compoId}/log/entrant/${e.entrantId}`"><tins-fa-icon :src="commentIcon"></tins-fa-icon> log ({{e.numPosts}})</a>
						<span v-if="e.numReviews > 0">&nbsp;<a router-ignore :href="`/${compoId}/reviews/entrant/${e.entrantId}`"><tins-fa-icon :src="reviewIcon"></tins-fa-icon> reviews ({{e.numReviews}})</a></span>
						<span v-if="e.entryId">&nbsp;<a :href="`/entry/${e.entryId}`"><tins-fa-icon :src="gamepadIcon"></tins-fa-icon> submission</a></span>
					</p>
				</div>
			</div>
		</tins-status-helper>
	</div>
</template>

<style scoped>
	.tins-entrants :deep(div.entrant) {
		display: block;
		border-top: 1px solid black;
		line-height: 1.5rem;
	}
	.tins-entrants :deep(div.entrant img) {
		max-width: 100%;
	}

	.tins-entrants :deep(a) { font-weight: bold; text-decoration: none; }
	.tins-entrants :deep(a:link) { color: #600; }
	.tins-entrants :deep(a:hover) { text-decoration: underline; }
	.tins-entrants :deep(a:active) { text-decoration: underline; }
</style>
