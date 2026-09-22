import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';

import TinsLogPost from '../src/components/tins-log-post.ce.vue';
import TinsRichTextView from '../src/components/tins-richtext-view.ce.vue';
import TinsLogs from '../src/pages/tins-logs.vue';
import { FetchMock } from './util/fetchMock.js';

const MOCK_COMPO_ID = '2026';
const MOCK_POST_TEXT = "I've been hacking furiously!";

const MOCK_CURRENT_EVENT = {
	events: [],
	upcoming: [],
	currentEvent: { short: MOCK_COMPO_ID, title: 'TINS 2026', canPost: true },
	serverTime: 1790076091277,
};

const MOCK_LOG = {
	posts: [{
		id: 999,
		text: MOCK_POST_TEXT,
		image: null,
		date: 1780607622000,
		spoiler: false,
		entrant: { id: 99, name: 'leeroy' },
	}],
	competition: { short: MOCK_COMPO_ID, title: 'TINS 2026' },
	numPages: 1,
};

describe('Log Page Test', () => {
	test('shows a post from the competition log', async () => {
		// The page is reached through a dynamic route, and older versions derived the
		// competition from window.location rather than from the compoId prop.
		window.history.pushState({}, '', `/${MOCK_COMPO_ID}/log`);

		await FetchMock.builder()
			.get('/api/v1/currentEvent', MOCK_CURRENT_EVENT)
			.get(`/api/v1/log/event/${MOCK_COMPO_ID}?page=1`, MOCK_LOG)
			.run(async () => {
				const wrapper = mount(TinsLogs, {
					props: { compoId: MOCK_COMPO_ID },
					global: {
						components: {
							'tins-log-post': TinsLogPost,
							'tins-richtext-view': TinsRichTextView,
						},
					},
				});
				await flushPromises();

				expect(wrapper.text()).toContain(MOCK_POST_TEXT);
			});
	});
});
