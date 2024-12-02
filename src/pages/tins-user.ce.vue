<script setup lang="ts">
import { fetchJSONOrThrow } from '../util';
import personIcon from '@fortawesome/fontawesome-free/svgs/solid/id-card.svg';
import globeIcon from '@fortawesome/fontawesome-free/svgs/solid/earth-europe.svg';
import { onMounted, computed } from 'vue';
import { usePromise } from '../usePromise.js';

const m = window.location.pathname.match(`/user/(?<userId>[^/]+)/?$`);
const { userId } = m.groups;

const data = usePromise();

onMounted(() => data.doAsync(async () => Promise.all([
	fetchJSONOrThrow(`/api/v1/user/${userId}`),
	fetchJSONOrThrow(`/api/v1/entries/user/${userId}`)
])));

const entries = computed(() => data.result.value && data.result.value[1].result);
const profile = computed(() => data.result.value && data.result.value[0]);
</script>

<template>
	<tins-status-helper :error="data.error.value" :loading="data.loading.value">
		<div v-if="profile">
			<h1><tins-fa-icon :src="personIcon" size="2rem"></tins-fa-icon> {{profile.username}}</h1>
				
			<div v-if="profile.editable" class="topright"><a href="/profile" router-ignore>Edit Profile</a></div>
				
			<div>
				<tins-fa-icon :src="globeIcon" size="1rem"></tins-fa-icon> {{profile.location}}
				<div v-if="profile.email"><a :href="`mailto:${profile.email}`">{{profile.email}}</a></div>
			</div>
			<p>
				<tins-richtext class="richtext" readOnly="true" :text="profile.info"></tins-richtext>
			</p>
			<div v-if="entries" class="entry-list">
				<a v-for="e of entries" :href="`/entry/${e.id}`" :key="e.id">
					<tins-entry-thumbnail :entry="e" :footer="e.competition.title">
					</tins-entry-thumbnail>
				</a>
			</div>
		</div>
	</tins-status-helper>
</template>

<style>
	:host {
		display: block; /* solves text selection issues */
	}

	.entry-list {
		display: flex;
		flex-flow: row wrap;
	}

	.topright {
		float: right;
	}

	.color {
		width: 100%;
		background: red;
	}

	.richtext {
		width: 100%;
	}
</style>