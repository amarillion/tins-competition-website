<script setup lang="ts">
import { fetchJSONOrThrow, renderRichText } from '../util';
import { onMounted, computed } from 'vue';
import { usePromise } from '../usePromise.js';
const m = window.location.pathname.match('/(?<compoId>\\w+)/reviews(/entrant/(?<entrantId>\\d+)|/entry/(?<entryId>\\d+)|/(?<reviewId>\\d+))?/?$');
const { compoId, entrantId, entryId, reviewId } = m.groups;

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

const entry = computed(() => (entryId && reviews.value.length > 0) ? reviews.value[0].entry.title : undefined);
const entrant = computed(() => (entrantId && reviews.value.length > 0) ? reviews.value[0].entrant.name : undefined);
const reviewNum = computed(() => reviews.value?.length ?? NaN);

onMounted(() => {
	data.doAsync(refreshData);
});

async function refreshData() {
	let response;
	if (reviewId) {
		response = await fetchJSONOrThrow(`/api/v1/reviews/id/${reviewId}`);
	}
	else if (entrantId) {
		response = await fetchJSONOrThrow(`/api/v1/reviews/byEntrant/${entrantId}`);
	}
	else if (entryId) {
		response = await fetchJSONOrThrow(`/api/v1/reviews/forEntry/${entryId}`);
	}
	else if (compoId) {
		response = await fetchJSONOrThrow(`/api/v1/reviews/event/${compoId}`);
	}
	return response;
}

const breadcrumbs = [
	{ url: `/${compoId}/`, title: compoId },
	{ title: 'reviews' }
];

</script>
<template>
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

	div.window {
		display: block;
		border-style: solid;
		border-color: #000000;
		background: #ffffff;
		padding: 10px;
		border-width: 1px;
		line-height: 24px;
	}
	div.header {
		display: block;
		border-style: solid;
		border-color: #000000;
		background: #c0c0c0;
		padding: 5px;
		border-width: 1 1 0 1px;
		font-weight: bold;
	}

	img {
		max-width: 100%;
		height: auto;
	}
</style>
