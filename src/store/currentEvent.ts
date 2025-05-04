import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type EventType = {
	short: string,
	title: string,
	afterStart: boolean,
	afterEnd: boolean,
	canPost: boolean
};
export type UpcomingType = {
	title: string,
	dateStr: string
}
export type CurrentEventType = {
	short: string,
	title: string,
	canJoin: boolean,
	canPost: boolean,
	canVote: boolean,
	votingEnd: number,
	competitionStart: number,
	competitionEnd: number,
	joinedCompetition: boolean,
	hasSecretSanta: boolean,
	numEntrants: number,
}

export const useCurrentEventStore = defineStore('currentEvent', () => {
	
	const currentEvent = ref<CurrentEventType>(null);
	const events = ref<EventType[]>([]);
	const upcoming = ref<UpcomingType[]>([]);
	const timestamp = ref(0);
	const loading = ref(false);
	const error = ref(null);

	function byShortMapper(events: EventType[]) {
		const byShort: Record<string, EventType> = {};
		for (const e of events) {
			byShort[e.short] = e;
		}
		return byShort;
	}
	
	const byShort = computed(() => byShortMapper(events.value));

	const canPost = (compoId: string) => byShort.value && byShort.value[compoId].canPost;
	
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
			const data = await response.json();
			currentEvent.value = data.currentEvent;
			upcoming.value = data.upcoming;
			events.value = data.events;
		}
		loading.value = false;
	}

	// for testing only...
	function testResetTimestamp() {
		timestamp.value = 0;
	}

	return { refreshCurrentEvent, loading, error, canPost, currentEvent, events, upcoming, byShort, testResetTimestamp };
});
