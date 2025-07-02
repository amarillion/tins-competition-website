<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { currentUserStore } from '../store';
import { usePromise } from '../usePromise';
import { fetchJSONOrThrow } from '../util';

const m = window.location.pathname.match(`/(?<compoId>[^/]+)/results/calculate/?$`);
const { compoId } = m.groups;

const {
	isStaff
} = storeToRefs(currentUserStore);

type ScoreType = {
	'score': number,
	'category': 'art'|'all'|'tech'|'genre',
	'entryId': number,
	'team': string
};

const data = usePromise<ScoreType[]>();

onMounted(() => {
	data.doAsync(async () => (await fetchJSONOrThrow<{ scores: ScoreType[] }>(`/api/v1/scores/byCompo/${compoId}`)).scores);
});

function ranked(data: number[]) {
	const result: number[] = [];
	let rank = 1;
	let idx = 1;
	let prev = NaN;

	for (const i of data) {
		if (i !== prev) {
			rank = idx;
		}
		result.push(rank);
		prev = i;
		idx++;
	}
	return result;
}

const entries = computed(() => {
	const scores = data.result.value;
	const entryIds = new Set<number>();
	const result: { entryId: number, team: string }[] = [];
	for (const score of scores) {
		if (!entryIds.has(score.entryId)) {
			entryIds.add(score.entryId);
			result.push({ entryId: score.entryId, team: score.team });
		}
	}
	return result;
});

const excludedEntries = ref(new Set<number>());

const rankedData = computed(() => {
	const scores = data.result.value;
	
	let maxLength = 0;
	let minLength = Number.MAX_SAFE_INTEGER;

	const result = Object.fromEntries(['all', 'art', 'tech', 'genre'].map(category => {
		const slice = scores.filter(r => r.category === category).map(({ score, entryId, team }) => ({ score, entryId, team }));
		maxLength = Math.max(maxLength, slice.length);
		minLength = Math.min(minLength, slice.length);
		slice.sort((a, b) => {
			const excludedA = excludedEntries.value.has(a.entryId) ? 1 : 0;
			const excludedB = excludedEntries.value.has(b.entryId) ? 1 : 0;
			return excludedA - excludedB || b.score - a.score;
		});
		const ranks = ranked(slice.filter(e => !excludedEntries.value.has(e.entryId)).map(r => r.score));
		return [ category, slice.map((r, idx) => ({
			...r,
			rank: ranks[idx] // NB: will be undefined if excluded
		})) ];
	}));

	if (maxLength !== minLength) {
		throw new Error(`Inconsistent lengths: maxLength=${maxLength}, minLength=${minLength}`);
	}
	
	const combined = new Array(maxLength).fill(0).map((elt, idx) => ({
		all: result.all[idx],
		art: result.art[idx],
		tech: result.tech[idx],
		genre: result.genre[idx],
		idx
	}));

	return combined;
});

function colorForRank(rank: number) {
	if (rank === 1) { 
		return "#00ff00";
	} 
	else if (rank === 2) {
		return "#00ffff";
	}
	else if (rank === 3) {
		return "#00ffff";
	}
	else return undefined;
}
</script>
<template>
	<template v-if="isStaff">

	<tins-status-helper :error="data.error.value" :loading="data.loading.value">
	
	<h1>Generated Results</h1>

	<table CELLSPACING=0 CELLPADDING=5 style="word-break: normal">
	<tr bgcolor="#ffff00">
	<td colspan="3">Overall</td>
	<td colspan="3">Art</td>
	<td colspan="3">Tech</td>
	<td colspan="3">Genre</td>
	</tr>
	
	<tr v-for="row of rankedData" :key="row.idx" :bgcolor="colorForRank(row.all.rank)">
		<template v-for="category of ['all', 'art', 'tech', 'genre']" :key="category">
			<td>{{row[category].rank}}</td>
			<td><a :href="`/${compoId}/entry/${row[category].entryId}`">{{row[category].team}}</a></td>
			<td>{{row[category].score.toFixed(2)}}</td>
		</template>
	</tr>

	</table>

	<h2>Exclude entries from ranking</h2>
	<div>
		<template v-for="entry of entries" :key="entry.entryId">
			<label>
				<input type="checkbox" v-model="excludedEntries" :value="entry.entryId" />
				{{entry.team}} ({{entry.entryId}})
			</label>
			<br>
		</template>
	</div>

	</tins-status-helper>

	</template>
	<template v-else>
		You need to be logged in with admin rights.
	</template>
</template>
<style>

</style>