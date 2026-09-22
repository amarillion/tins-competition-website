import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { defineCustomElement } from 'vue';

import TinsLogPost from '../src/components/tins-log-post.ce.vue';
import TinsLogs from '../src/pages/tins-logs.vue';
import { FetchMock } from './util/fetchMock.js';

const MOCK_COMPO_ID = '2026';

const MOCK_POST = {
	id: 999,
	text: "I've been hacking furiously!",
	image: null,
	date: 1780607622000,
	spoiler: false,
	entrant: { id: 99, name: 'leeroy' },
};
const MOCK_LOG = {
	posts: [MOCK_POST],
	competition: { short: MOCK_COMPO_ID, title: 'TINS 2026' },
	numPages: 1,
};

// tins-log-post is a custom element, not a Vue component. Make sure it's defined.
if (!customElements.get('tins-log-post')) {
	customElements.define('tins-log-post', defineCustomElement(TinsLogPost));
}

describe('Log Page Test', () => {
	test('shows a post from the competition log', async () => {

		await FetchMock.builder()
			.get(`/api/v1/log/event/${MOCK_COMPO_ID}?page=1`, MOCK_LOG)
			.run(async () => {
				const wrapper = mount(TinsLogs, { props: { compoId: MOCK_COMPO_ID } });
				await flushPromises();

				// The page rendered the fetched log ...
				expect(wrapper.text()).toContain('TINS 2026 logs');

				// ... and handed the post to a tins-log-post element.
				const posts = wrapper.findAll('tins-log-post');
				expect(posts).toHaveLength(1);
				const element = posts[0].element as HTMLElement & { post: typeof MOCK_POST };
				expect(element.post).toEqual(MOCK_POST);
			});
	});
});
