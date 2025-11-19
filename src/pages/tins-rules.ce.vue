<script setup lang="ts">
import { fetchJSONOrThrow } from '../util';
import { onMounted } from 'vue';
import { usePromise } from '../usePromise.js';

const m = window.location.pathname.match('/(?<compoId>[^/]+)/rules/?$');
const { compoId } = m.groups;

const breadcrumbs = [
	{ title: compoId, url: `/${compoId}/` },
	{ title: 'rules' },
];

const data = usePromise<string>();
onMounted(() => data.doAsync(async() => (await fetchJSONOrThrow<{ result: string }>(`/api/v1/compo/${compoId}/rules`)).result));

</script>
<template>
	<tins-breadcrumbs :data="breadcrumbs"></tins-breadcrumbs>

	<tins-status-helper :error="data.error.value" :loading="data.loading.value">
		<div v-html="data.result.value"></div>
	</tins-status-helper>
</template>

<style>
	:host {
		display: block; /* solves text selection issues */
	}
	img {
		max-width: 100%;
	}
	pre {
		white-space: pre-wrap;
	}
</style>