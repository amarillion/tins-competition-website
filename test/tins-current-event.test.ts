import { flushPromises, mount } from '@vue/test-utils';

import { beforeEach, describe, expect, test } from 'vitest';
import { currentEventStore } from '../src/store/index.js';
import TinsCurrentEvent from '../src/components/tins-current-event.ce.vue';
import { FetchMock } from './util/fetchMock.js';

const COMPO_ID='krampu24';
const DEFAULT_CURRENT_EVENT = {
	short: COMPO_ID,
	title: 'KrampusHack 2024',
	canJoin: true,
	canPost: true,
	canVote: false,
	votingEnd: 1735063200000,
	competitionStart: 1733076000000,
	competitionEnd: 1735063200000,
	joinedCompetition: false,
	hasSecretSanta: false,
	numEntrants: 9
};
const DEFAULT_EVENT = {
	short: COMPO_ID,
	title: 'KrampusHack 2024',
	afterStart: false,
	afterEnd: false,
	canPost: true
};
const DEFAULT_RESPONSE = {
	currentEvent: DEFAULT_CURRENT_EVENT,
	events: [ DEFAULT_EVENT ],
	upcoming: [{
		title: 'TINS',
		dateStr: 'May-Jun 2025'
	}]
};

describe('Current event component', () => {

	beforeEach(() => {
		currentEventStore.testResetTimestamp(); // make sure store is in clean state, because getCurrentEvent is cached...
	});

	test('Shows countdown to upcoming event', async () => {
		FetchMock.builder().get('/api/v1/currentEvent', DEFAULT_RESPONSE).
			run(async () => {
				const wrapper = mount(TinsCurrentEvent);
				currentEventStore.refreshCurrentEvent(); // TODO: design flaw: tins-current-event relies on another component to trigger refreshCurrentEvent...
				await flushPromises();
				console.log(wrapper.html());
				expect(wrapper.findAll('tins-count-down').length).toBe(3);
			});
	});

});
