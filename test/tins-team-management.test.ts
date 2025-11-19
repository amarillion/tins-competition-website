import { flushPromises, mount } from '@vue/test-utils';
import TinsTeamManagement from '../src/pages/tins-team-management.ce.vue';

import { FetchMock } from './util/fetchMock.js';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { currentEventStore } from '../src/store/index.js';

const COMPO_ID='2024';
const ENTRY_ID='99';
const DEFAULT_INVITATION_DATA = {
	'toMe': [],
	'fromMe': [
		{'id': 9, 'recipientName': 'InvitationRecipient', 'recipientEntrantId': 4397, 'entryId': 323, 'senderEntrantId': 4404, 'senderName': 'Yourself'},
	]
};
const DEFAULT_ENTRY_DATA = {
	'id': ENTRY_ID,
	'competition': {
		'short': COMPO_ID,
		'title': 'TINS 2024',
		'competitionStart': 0, 'competitionEnd': 0,
		'afterStart': true, 'afterEnd': false
	},
	'title': 'Dummy Title',
	'team': 'Dummy Team',
	'entrants': [{'id': 4404, 'name': 'Yourself'}],
	'logCounts': {'4404': 1},
	'text': 'This is my entry!\n\nTEST 123',
	'tags': [],
	'editable': true,
	'lastSubmission': {},
	'reviewCount': 0
};
describe('Team Management Test', () => {

	beforeAll(() => {
		// window location used to extract compo id
		window.location = { pathname: `https://www.example.com/${COMPO_ID}/team` } as Location;
	});

	beforeEach(() => {
		currentEventStore.testResetTimestamp(); // make sure store is in clean state, because getCurrentEvent is cached...
	});

	test('Check that team members contain your own name', async () => {
		await FetchMock.builder()
			.get(`/api/v1/invitation/byCompo/${COMPO_ID}`, DEFAULT_INVITATION_DATA)
			.post(`/api/v1/compo/${COMPO_ID}/myEntry`, { entryId: ENTRY_ID })
			.get(`/api/v1/entry/${ENTRY_ID}/`, DEFAULT_ENTRY_DATA)
			.run(async () => {
				const wrapper = mount(TinsTeamManagement);
				await flushPromises();
				expect(wrapper.text()).toContain('Your current team:');
				expect(wrapper.text()).toContain('Yourself');
			});
	});

});