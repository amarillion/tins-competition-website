<script setup lang="ts">
import { fetchJSONOrThrow } from '../util.js';
import { computed, watch } from 'vue';
import { usePromise } from '../usePromise.js';

const props = defineProps<{ compoId: string }>();
const compoId = computed(() => props.compoId);

const breadcrumbs = computed(() => [
	{ title: compoId.value, url: `/${compoId.value}/` },
	{ title: 'rules' },
]);

const data = usePromise<string>();
watch(compoId, () => {
	data.doAsync(async() => (await fetchJSONOrThrow<{ result: string }>(`/api/v1/compo/${compoId.value}/rules`)).result);
}, { immediate: true });

</script>
<template>
	<div class="tins-rules">
		<tins-breadcrumbs :data="breadcrumbs"></tins-breadcrumbs>

		<tins-status-helper :error="data.error.value" :loading="data.loading.value">
			<div v-html="data.result.value"></div>
		</tins-status-helper>
	</div>
</template>

<style scoped>
	.tins-rules :deep(img) {
		max-width: 100%;
	}
	.tins-rules :deep(pre) {
		white-space: pre-wrap;
	}
</style>
