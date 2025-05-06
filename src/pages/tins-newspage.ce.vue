<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { currentEventStore } from '../store/index.js';
const params = new URLSearchParams(window.location.search);
const newsId = params.get('newsId');

const { upcoming, error, loading } = storeToRefs(currentEventStore);

onMounted(() => currentEventStore.refreshCurrentEvent());

</script>
<template>
	<div class="twocol">
		<tins-newsfeed class="tins-newsfeed" :newsId="newsId"></tins-newsfeed>	
		<div class="rightcol">
			<tins-current-event class="tins-current-event"></tins-current-event>
			<tins-status-helper :error="error" :loading="loading">
				<tins-upcoming v-if="upcoming" class="tins-upcoming" :upcoming="upcoming"></tins-upcoming>
			</tins-status-helper>
		</div>
	</div>
</template>
<style>
	/* 
		NOTE: advantage of flex over grid: 
		flex can deal with tins-upcoming setting itself hidden.
		With grid, you'd always have an empty column there.
		With flex, the remaining space goes to the newsfeed.
	*/
	@media (min-width: 1024px) {
		.twocol {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
		}
		.tins-newsfeed {
			flex-grow: 2;
			flex-basis: 0;
		}
		.rightcol {
			flex-basis: 0;
			flex-grow: 1;
			margin-left: 1rem;
		}
	}
	@media (max-width: 1023px) {
		.twocol {
			display: flex;
			flex-direction: column-reverse;
		}
		.rightcol {
			margin-bottom: 1rem;
		}
	}
</style>