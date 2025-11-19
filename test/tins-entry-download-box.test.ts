import { flushPromises, mount } from '@vue/test-utils';
import TinsEntryDownloadBox from '../src/components/tins-entry-download-box.ce.vue';

import { describe, expect, test } from 'vitest';

describe('Entry Download box Test', () => {
	
	test('Component table has one row for one download', async () => {
		const wrapper = mount(TinsEntryDownloadBox, { propsData: {
			uploads: [
				{'id': 1, 'url': '2016/dummy.zip', 'time': '2016-06-20T18:25:12', 'size': 300000, 'postCompo': false, tags: []},
			]
		}});
		await flushPromises();
		console.log(wrapper.html());
		expect(wrapper.find('table').exists()).toBe(true);
		expect(wrapper.findAll('tr').length).toBe(1);
		expect(wrapper.findAll('td').length).toBe(5);
	});

	test('Component shows separate sections for pre and post-download', async () => {
		const wrapper = mount(TinsEntryDownloadBox, { propsData: {
			uploads: [
				{'id': 1, 'url': '2016/dummy.zip', 'time': '2016-06-20T18:25:12', 'size': 300000, 'postCompo': false, tags: []},
				{'id': 2, 'url': '2016/postcompo.zip', 'time': '2016-06-20T18:25:13', 'size': 300000, 'postCompo': true, tags: []},
			]
		}});
		await flushPromises();
		console.log(wrapper.html());
		expect(wrapper.find('table').exists()).toBe(true);
		expect(wrapper.findAll('tr').length).toBe(3);
		expect(wrapper.findAll('td').length).toBe(2*5+1);
	});

	//TODO: test rendering of tags

});
