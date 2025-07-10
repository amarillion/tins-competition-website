<script setup lang="ts">
import { fetchJSONOrThrow } from '../util';
import { onMounted } from 'vue';
import { usePromise } from '../usePromise.js';

const m = window.location.pathname.match(`/(?<compoId>[^/]+)/results/?$`);
const { compoId } = m.groups;

const breadcrumbs = [
	{ url: `/${compoId}/`, title: compoId },
	{ title: 'Results' }
];

const data = usePromise<string>();
onMounted(() => data.doAsync(async() => (await fetchJSONOrThrow<{ result: string }>(`/api/v1/compo/${compoId}/results`)).result));
</script>

<template>
	<tins-breadcrumbs :data="breadcrumbs"></tins-breadcrumbs>
	<tins-status-helper :error="data.error.value" :loading="data.loading.value">
		<h1>Results</h1>
		<div v-html="data.result.value"></div>
	</tins-status-helper>
</template>

<style>
</style>