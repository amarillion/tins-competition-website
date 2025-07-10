import { flushPromises, mount } from '@vue/test-utils';

import { FetchMock } from './util/fetchMock.js';
import { describe, expect, test } from 'vitest';
import TinsReviews from '../src/pages/tins-reviews.ce.vue';

const MOCK_COMPO_ID = '2025';
const MOCK_ZERO_REVIEWS = { result: [] };
const MOCK_REVIEW1 = {
	id: 1, text: "Lorem ipsum", date: new Date(), competition: { short: MOCK_COMPO_ID },
	entrant: { id: 1, name: 'entrant 1' },
	entry: { id: 1, team: 'Team 1', title: 'Entry 1', imagefile: '/mock-image.png', tags: [] },
	score: { all: 3, genre: 3, art: 3, tech: 3 }
};
const MOCK_ONE_REVIEW = { result: [ MOCK_REVIEW1 ] };

describe('Review Page Test', () => {

	test('By compo, zero reviews found', async () => {
		window.location = { pathname: `https://www.example.com/${MOCK_COMPO_ID}/reviews` } as Location;
		FetchMock.builder()
			.get(`/api/v1/reviews/event/${MOCK_COMPO_ID}`, MOCK_ZERO_REVIEWS)
			.run(async () => {
				const wrapper = mount(TinsReviews);
				await flushPromises();
				expect(wrapper.text()).toContain('Showing 0 reviews');
			});
	});

	test('By compo, one review found', async () => {
		window.location = { pathname: `https://www.example.com/${MOCK_COMPO_ID}/reviews` } as Location;
		FetchMock.builder()
			.get(`/api/v1/reviews/event/${MOCK_COMPO_ID}`, MOCK_ONE_REVIEW)
			.run(async () => {
				const wrapper = mount(TinsReviews);
				await flushPromises();
				expect(wrapper.text()).toContain('Showing 1 reviews');
				expect(wrapper.text()).toContain('Review by entrant 1');
			});
	});

});