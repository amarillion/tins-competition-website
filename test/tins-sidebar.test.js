import { flushPromises, mount } from '@vue/test-utils';
import TinsSidebar from '../src/components/tins-sidebar.ce.vue';

import fetchMock from 'fetch-mock';
import { beforeEach, describe, expect, test } from 'vitest';

describe('Side Bar Test', () => {
	beforeEach(() => {
		fetchMock.mockGlobal();
		fetchMock.config.allowRelativeUrls = true;
		fetchMock.get('/api/v1/currentEvent', {
			"currentEvent": {
				"short": "krampu24",
				"title": "KrampusHack 2024",
				"canJoin": true,
				"canPost": true,
				"canVote": false,
				"votingEnd": 1735063200000,
				"competitionStart": 1733076000000,
				"competitionEnd": 1735063200000,
				"joinedCompetition": false,
				"hasSecretSanta": false,
				"numEntrants": 9
			}, 
			"events": [{
				"short": "krampu24",
				"title": "KrampusHack 2024",
				"afterStart": false,
				"afterEnd": false,
				"canPost": true
			}],
			"upcoming": [{
				"title": "TINS",
				"dateStr": "May-Jun 2025"
			}]
		});
	});

	test('shows news link', () => {
		const wrapper = mount(TinsSidebar);
		expect(wrapper.find(`a[href='/news']`).exists()).toBe(true);
	});

	test('shows current event rules link', async () => {
		const wrapper = mount(TinsSidebar);
		await flushPromises();
		expect(wrapper.find(`a[href='/krampu24/rules']`).exists()).toBe(true);

	});
});
