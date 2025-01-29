import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCurrentEventStore = defineStore('currentEvent', () => {
	
	const currentEvent = ref<{}>(null);
	const byShort = ref<Record<string, {}>>(null);
	const events = ref<[]>([]);
	const upcoming = ref<[]>([]);
	const timestamp = ref(0);
	const loading = ref(false);
	const error = ref(null);

	const canPost = computed((compoId: string) => 
		currentEvent.value && currentEvent.value.byShort[compoId].canPost);

	function transformResponse(data) {
		const { events, upcoming, currentEvent } = data;
		const byShort = {};
		for (const e of events) {
			byShort[e.short] = e;
		}
		return { events, upcoming, byShort, currentEvent };
	}

	async function refreshCurrentEvent() {
		// TODO: timestamp missing. Did this ever work?
		const ageInMinutes = (Date.now() - timestamp.value) / 1000 / 60;
		if (ageInMinutes < 60) { return; }

		loading.value = true;

		const response = await fetch('/api/v1/currentEvent', { credentials: 'same-origin' } );
		if (response.status < 200 || response.status > 299) {
			error.value = await response.text();
		}
		else {
			const data = transformResponse(await response.json());
			currentEvent.value = data.currentEvent;
			upcoming.value = data.upcoming;
			events.value = data.events;
			byShort.value = data.byShort;
		}
		loading.value = false;
	}

	// for testing only...
	function testResetTimestamp() {
		timestamp.value = 0;
	}

	return { refreshCurrentEvent, loading, error, canPost, currentEvent, events, upcoming, byShort, testResetTimestamp };
});
