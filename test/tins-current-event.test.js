import { flushPromises, mount } from '@vue/test-utils';

import fetchMock from 'fetch-mock';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { dispatch } from '../src/store';
import { refreshCurrentEvent, testResetTimestamp } from '../src/data/currentEvent';
import TinsCurrentEvent from '../src/components/tins-current-event.ce.vue';

const COMPO_ID='krampu24';
const DEFAULT_CURRENT_EVENT = {
	short: COMPO_ID,
	title: "KrampusHack 2024",
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
	title: "KrampusHack 2024",
	afterStart: false,
	afterEnd: false,
	canPost: true
};
const DEFAULT_RESPONSE = {
	currentEvent: DEFAULT_CURRENT_EVENT, 
	events: [ DEFAULT_EVENT ],
	upcoming: [{
		title: "TINS",
		dateStr: "May-Jun 2025"
	}]
};

describe('Current event component', () => {

	beforeAll(() => {
		fetchMock.mockGlobal();
	});

	beforeEach(() => {
		fetchMock.removeRoutes();
		dispatch(testResetTimestamp()); // make sure store is in clean state, because getCurrentEvent is cached...
	});

	test('Shows countdown to upcoming event', async () => {
		fetchMock.get('/api/v1/currentEvent', DEFAULT_RESPONSE);
		const wrapper = mount(TinsCurrentEvent);
		dispatch(refreshCurrentEvent()); // TODO: design flaw: tins-current-event relies on another component to trigger refreshCurrentEvent...
		await flushPromises();
		console.log(wrapper.html());
		expect(wrapper.findAll("tins-count-down").length).toBe(3);
	});

});
