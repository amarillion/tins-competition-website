<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, watch } from 'vue';
import { usePromise } from '../usePromise.js';
import { postOrThrow } from '../util.js';

/**
 *
 * The function of this page is to fetch the entry id for the given entrant (Creating it if it doesn't exist)
 * and redirect to that.
 */
const props = defineProps<{ compoId: string }>();
const compoId = computed(() => props.compoId);
const router = useRouter();

const data = usePromise();
watch(compoId, () => {
	data.doAsync(async () => {
		try {
			const response = await postOrThrow(`/api/v1/compo/${compoId.value}/myEntry`, '');
			const myEntryData = await response.json();
			await router.push(`/entry/${myEntryData.entryId}/`);
			return myEntryData;
		}
		catch(e) {
			throw new Error('Could not get or create your entry' );
		}
	});
}, { immediate: true });
</script>
<template>
	<tins-status-helper :error="data.error.value" :loading="data.loading.value"></tins-status-helper>
</template>
<style scoped>
</style>
