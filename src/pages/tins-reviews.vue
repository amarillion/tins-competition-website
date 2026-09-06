<script setup lang="ts">
import { fetchJSONOrThrow, renderRichText } from '../util.js';
import { computed, watch } from 'vue';
import { usePromise } from '../usePromise.js';

const props = defineProps<{
	compoId: string,
	entrantId?: string,
	entryId?: string,
	reviewId?: string,
}>();

const compoId = computed(() => props.compoId);
const entrantId = computed(() => props.entrantId);
const entryId = computed(() => props.entryId);
const reviewId = computed(() => props.reviewId);

type ReviewEntryType = { id: number, team: string, title: string, imagefile: string, tags: { desc: string, icon: string }[] };
type ReviewType = {
	id: number,
	text: string;
	date: Date;
	competition: { short: string },
	entrant: { id: number, name: string },
	entry: ReviewEntryType,
	score: { all: number, genre: number, art: number, tech: number },
};

const data = usePromise<{
	result: ReviewType[],
}>();

const reviews = computed(() => data.result.value?.result || []);

const reviewsByEntry = computed(() => {
	const lReviews = data.result.value?.result ?? [];
	const groupedReviews: Record<string, ReviewType[]> = {};
	const entries: Record<string, ReviewEntryType> = {};
	for (const review of lReviews) {
		if (!groupedReviews[review.entry.id]) {
			groupedReviews[review.entry.id] = [];
			entries[review.entry.id] = review.entry;
		}
		groupedReviews[review.entry.id].push(review);
	}

	const result: { reviews: ReviewType[], entry: ReviewEntryType }[] = [];
	for (const eId in groupedReviews) {
		result.push({
			reviews: groupedReviews[eId],
			entry: entries[eId],
		});
	}
	return result;
});

const entry = computed(() => (entryId.value && reviews.value.length > 0) ? reviews.value[0].entry.title : undefined);
const entrant = computed(() => (entrantId.value && reviews.value.length > 0) ? reviews.value[0].entrant.name : undefined);
const reviewNum = computed(() => reviews.value?.length ?? NaN);

watch(() => [compoId.value, entrantId.value, entryId.value, reviewId.value], () => {
	data.doAsync(refreshData);
}, { immediate: true });

async function refreshData() {
	let response;
	if (reviewId.value) {
		response = await fetchJSONOrThrow(`/api/v1/reviews/id/${reviewId.value}`);
	}
	else if (entrantId.value) {
		response = await fetchJSONOrThrow(`/api/v1/reviews/byEntrant/${entrantId.value}`);
	}
	else if (entryId.value) {
		response = await fetchJSONOrThrow(`/api/v1/reviews/forEntry/${entryId.value}`);
	}
	else if (compoId.value) {
		response = await fetchJSONOrThrow(`/api/v1/reviews/event/${compoId.value}`);
	}
	return response;
}

const breadcrumbs = computed(() => [
	{ url: `/${compoId.value}/`, title: compoId.value },
	{ title: 'reviews' }
]);

</script>
<template>
	<div class="tins-reviews">
		<tins-breadcrumbs :data="breadcrumbs"></tins-breadcrumbs>
		<tins-status-helper :error="data.error.value" :loading="data.loading.value">
			<h1>Reviews</h1>

			<p>Showing {{ reviewNum }} reviews
				<template v-if="entry">
					for {{ entry }}.
					<a :href="`/${ compoId }/reviews/`">all reviews</a>
				</template>
				<template v-if="entrant">
					by {{ entrant }}.
					<a :href="`/${ compoId }/reviews/`">all reviews</a>
				</template>
			</p>

			<template v-for="reviewGroup in reviewsByEntry" :key="reviewGroup.entry.id">
				<div class="header" style="position: relative;">
					<div style="float: left;">
						<p>{{ reviewGroup.entry.title }}<br><small>by {{ reviewGroup.entry.team }}</small><br>
						<small><a :href="`/${ compoId }/reviews/entry/${ reviewGroup.entry.id }`">all reviews of {{ reviewGroup.entry.title }}</a></small></p>
					</div>
					<div v-if="reviewGroup.entry.tags" style="float: right;">
						<img v-for="tag of reviewGroup.entry.tags" :key="tag.icon" :src='`/upload/${ tag.icon }`' :title='tag.desc'/>
					</div>
					<div style="clear: both;"></div>
					<img v-if="reviewGroup.entry.imagefile" :src="`/upload/${ reviewGroup.entry.imagefile }`"/>
				</div>
				<div v-for="vote in reviewGroup.reviews" :key="vote.id" class="window">
					<p>
					<small>
					<b>Review by {{ vote.entrant.name }}</b>
					&nbsp;<a :href="`/${ compoId }/reviews/entrant/${ vote.entrant.id }`">all reviews by {{ vote.entrant.name }}</a>
					</small>
					</p>
					<!-- NOTE: renderRichText function converts newlines to breaks-!-->
					<div v-html="renderRichText(vote.text)">
					</div>
					<p>
					Scores:
					<b>Overall</b> {{ vote.score.all }}
					<b>Artistical</b> {{ vote.score.art }}
					<b>Technical</b> {{ vote.score.tech }}
					<b>Genre</b> {{ vote.score.genre }}
					</p>
				</div>
				<br>
			</template>
			<!-- <p v-else>No reviews found...</p> -->

		</tins-status-helper>
	</div>

</template>
<style scoped>
	.tins-reviews :deep(a) { font-weight: bold; text-decoration: none; }
	.tins-reviews :deep(a:link) { color: #600; }
	.tins-reviews :deep(a:hover) { text-decoration: underline; }
	.tins-reviews :deep(a:active) { text-decoration: underline; }

	.error {
		width: 100%;
		color: red;
	}

	.tins-reviews :deep(div.window) {
		display: block;
		border-style: solid;
		border-color: #000000;
		background: #ffffff;
		padding: 10px;
		border-width: 1px;
		line-height: 24px;
	}
	.tins-reviews :deep(div.header) {
		display: block;
		border-style: solid;
		border-color: #000000;
		background: #c0c0c0;
		padding: 5px;
		border-width: 1 1 0 1px;
		font-weight: bold;
	}

	.tins-reviews :deep(img) {
		max-width: 100%;
		height: auto;
	}
</style>
