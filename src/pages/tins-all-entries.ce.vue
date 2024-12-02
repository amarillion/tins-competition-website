<script setup>
import { usePromise } from '../usePromise.js';
import { ref, computed, onMounted } from 'vue';
import { fetchJSONOrThrow } from '../util.js';

const groupBy = ref('byUser');

const data = usePromise();
onMounted(() => {
	data.doAsync(async() => (await fetchJSONOrThrow(`/api/v1/entries/all`)).result);
});

function _byCompo() {
	const byCompo = {};
	for(const entry of data.result.value) {
		const { short } = entry.competition;
		if (!(short in byCompo)) {
			byCompo[short] = {
				entries: [ entry ],
				competition: entry.competition,
			};
		}
		else {
			byCompo[short].entries.push( entry );
		}
	}
	return Object.values(byCompo).sort(
		(a, b) => b.competition.competitionStart - a.competition.competitionStart
	);
}
const byCompo = computed(_byCompo);

function _byUser() {
	const byUser = {};
	for(const entry of data.result.value) {
		for (const entrant of entry.entrants) {
			const { name, id } = entrant;
			if (!(name in byUser)) {
				byUser[name] = {
					entries: [ entry ],
					user: { name, id },
				};
			}
			else {
				byUser[name].entries.push( entry );
			}
		}
	}

	return Object.values(byUser);
}
const byUser = computed(_byUser);
</script>

<template>
	<tins-status-helper  :error="data.error.value" :loading="data.loading.value">
		<div v-if="data.result.value">
			<div class="buttons">
				<button @click="groupBy = 'byEvent'">by&nbsp;event</button>&nbsp;
				<button @click="groupBy = 'byUser'">by&nbsp;user</button>
			</div>

			<div v-if="groupBy === 'byEvent'">
				<div v-for="i of byCompo" :key="i.competition.short">
					<h2>{{i.competition.title}}</h2>
					<div class="entry-list">
						<a v-for="e of i.entries" :key="e.id" :href="`/entry/${e.id}`">
							<tins-entry-thumbnail 
								.entry="e"
								:footer="e.team"
								></tins-entry-thumbnail>
						</a>
					</div>
				</div>
			</div>
			<div v-else>
				<div v-for="i of byUser" :key="i.user.id">
					<h2>{{i.user.name}}</h2>
					<div class="entry-list">
						<a v-for="e of i.entries" :key="e.id" :href="`/entry/${e.id}`">
							<tins-entry-thumbnail 
								.entry="e"
								:footer="e.competition.title"
								></tins-entry-thumbnail>
						</a>
					</div>
				</div>
			</div>
		</div>
	</tins-status-helper>
</template>

<style>
.entry-list {
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
}

.richtext {
	width: 100%;
}

.buttons {
	float: right;
}

button {
	padding: 0.5rem;
	border: 2px solid black;
	width: 5rem;
	background: #FF8;
	color: black;
}

button:hover {
	background: #CC0;
	transition: 0.1s
}
</style>