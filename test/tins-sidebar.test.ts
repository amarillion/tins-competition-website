import { flushPromises, mount } from '@vue/test-utils';
import TinsSidebar from '../src/components/tins-sidebar.ce.vue';

import { FetchMock } from './util/fetchMock.js';
import { beforeEach, describe, expect, test } from 'vitest';
import { currentEventStore, currentUserStore  } from '../src/store';

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

describe('Side Bar Test', () => {

	beforeEach(() => {
		currentEventStore.testResetTimestamp(); // make sure store is in clean state, because getCurrentEvent is cached...
	});

	test('shows news link', async () => {
		await FetchMock.builder()
			.get('/api/v1/currentEvent', DEFAULT_RESPONSE)
			.run(async () => {
				const wrapper = mount(TinsSidebar);
				await flushPromises();
				expect(wrapper.find(`a[href='/news']`).exists()).toBe(true);
			});
	});

	test('shows current event rules link', async () => {
		await FetchMock.builder()
			.get('/api/v1/currentEvent', DEFAULT_RESPONSE)
			.run(async () => {
				const wrapper = mount(TinsSidebar);
				await flushPromises();
				expect(wrapper.find(`a[href='/${COMPO_ID}/rules']`).exists()).toBe(true);
			});
	});

	test('shows admin link if staff', async () => {
		await FetchMock.builder()
			.get('/api/v1/currentEvent', DEFAULT_RESPONSE)
			.run(async() => {
				// sidebar component doesn't refresh store by itself, so we inject data here...
				currentUserStore.$patch({ currentUser: { login: 'amarillion', isStaff: true }});
				const wrapper = mount(TinsSidebar);
				await flushPromises();
				expect(wrapper.find(`a[href='/admin/']`).exists()).toBe(true);
			});
	});


	test('during competition', async () => {
		await FetchMock.builder()
			.get('/api/v1/currentEvent', {
				...DEFAULT_RESPONSE,
				currentEvent: {
					...DEFAULT_CURRENT_EVENT,
					joinedCompetition: true,
				},
				events: [{
					...DEFAULT_EVENT,
					afterStart: true,
				}],
			})
			.run(async() => {
				const wrapper = mount(TinsSidebar);
				await flushPromises();
				expect(wrapper.find(`a[href='/${COMPO_ID}/upload']`).exists()).toBe(true);
			});
	});

});
