<script setup>
import { onMounted } from 'vue';
import { usePromise } from '../usePromise.js';
import { postOrThrow } from '../util.js';

/**
 * 
 * The function of this page is to fetch the entry id for the given entrant (Creating it if it doesn't exist)
 * and redirect to that.
 */
const m = window.location.pathname.match(`\/(?<compoId>[^\/]+)\/myEntry\/?$`);
const { compoId } = m.groups;

const data = usePromise();
onMounted(async () => {
	data.doAsync(async () => {
		try {
			const response = await postOrThrow(`/api/v1/compo/${compoId}/myEntry`, '');
			const data = await response.json();
			window.location.href = `/entry/${data.entryId}/`; //TODO: use Vue router...
			return data;
		}
		catch(e) {
			throw new Error('Could not get or create your entry' );
		}
	});

});
</script>
<template>
	<tins-status-helper :error="data.result.error" :loading="data.result.loading"></tins-status-helper>
</template>
<style>
</style>