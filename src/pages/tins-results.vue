<script setup lang="ts">
import { fetchJSONOrThrow } from '../util.js';
import { computed, watch } from 'vue';
import { usePromise } from '../usePromise.js';

const props = defineProps<{ compoId: string }>();
const compoId = computed(() => props.compoId);

const breadcrumbs = computed(() => [
	{ url: `/${compoId.value}/`, title: compoId.value },
	{ title: 'Results' }
]);

const data = usePromise<string>();
watch(compoId, () => {
	data.doAsync(async() => (await fetchJSONOrThrow<{ result: string }>(`/api/v1/compo/${compoId.value}/results`)).result);
}, { immediate: true });
</script>

<template>
	<div class="tins-results">
		<tins-breadcrumbs :data="breadcrumbs"></tins-breadcrumbs>
		<tins-status-helper :error="data.error.value" :loading="data.loading.value">
			<h1>Results</h1>
			<div v-html="data.result.value"></div>
		</tins-status-helper>
	</div>
</template>

<style scoped>
	.tins-results :deep(a) { font-weight: bold; text-decoration: none; }
	.tins-results :deep(a:link) { color: #600; }
	.tins-results :deep(a:hover) { text-decoration: underline; }
	.tins-results :deep(a:active) { text-decoration: underline; }

	.tins-results :deep(table) { border-collapse:collapse; border-spacing:0; empty-cells:show }
	.tins-results :deep(table *) { margin:0; }
</style>
