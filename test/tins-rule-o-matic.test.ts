import { flushPromises, mount } from '@vue/test-utils';
import TinsRuleOMatic from '../src/pages/tins-rule-o-matic.ce.vue';
import { describe, expect, it } from 'vitest';
import { currentUserStore } from '../src/store';
import fetchMock from 'fetch-mock';

const MOCK_NO_RULES = {
	needsRating: [],
	totalRules: 545,
	yourRatings: 528,
	rank: 3,
	toBeat: { author: 'player2', count: 545 },
};

describe('Tins Rule-o-matic', () => {
	
	it("Show error when not logged in", () => {
		const wrapper = mount(TinsRuleOMatic);
		expect(wrapper.text()).toEqual('You must be logged in.');	
	});

	
	it("When logged in but there are no rules", async () => {
		fetchMock.mockGlobal().getOnce(`/rule-o-matic/ratings`, MOCK_NO_RULES);

		currentUserStore.$patch({ currentUser: { login: 'amarillion', isStaff: false }});

		// currentUserStore.currentUser = { login: 'testUser', isStaff: false };
		const wrapper = mount(TinsRuleOMatic);
		
		await flushPromises();
		expect(wrapper.text()).toContain(`So far you've rated 528 out of 545 rules. You're the #3 contributor`);	
	});

});