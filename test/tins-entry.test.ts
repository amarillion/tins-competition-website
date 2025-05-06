import { flushPromises, mount } from '@vue/test-utils';

import { FetchMock } from './util/fetchMock.js';
import { beforeAll, describe, expect, test } from 'vitest';
import TinsEntry from '../src/pages/tins-entry.ce.vue';

const ENTRY_ID = 148;
const ENTRY_TITLE = 'EntryTitle';

const MOCK_RESULT = {
	id: ENTRY_ID, 
	competition: {"short": "2016", "title": "TINS 2016", "competitionStart": 1463140800000.0, "competitionEnd": 1463400000000.0, "afterStart": true, "afterEnd": true}, 
	title: ENTRY_TITLE,
	team: "Eric", 
	imagefile: "2016/images/nojunkallowed.png", 
	thumbnail: "2016/images/nojunkallowed.png.320x200_q85_crop.jpg", 
	entrants: [{"id": 4099, "name": "Eric"}], 
	logCounts: {"4099": 32}, 
	text: "<b>How to Play</b>\n\nFole and Raul return to their favorite youth pasttime: playing with a toy train set!\nRaul likes to design and build miniature buildings.\nFole especially likes to see how fast the trains can go, and make them crash!", 
	tags: [
		{"icon": "images/400k.png", "short": "400k", "desc": "Retro challenge - zipped size of entry is under 400k"}, 
	], 
	editable: false, 
	lastSubmission: {"id": 133, "url": "2016/mori.zip", "time": "2016-05-15T03:42:19", "size": 305932, "postCompo": false},
	uploads: [
		{"id": 130, "url": "2016/mori_tins_2016_KBfVt7A.zip", "time": "2016-06-20T18:25:12", "size": 309541, "postCompo": false}, 
	], 
	reviewCount: 4
};

describe('Entry Page Test', () => {
	beforeAll(() => {
		// mock window location
		window.location = new URL(`https://www.example.com/entry/${ENTRY_ID}`);
	});

	test('Component mounts without errors and renders game title', async () => {
		FetchMock.builder()
			.get(`/api/v1/entry/${ENTRY_ID}/`, MOCK_RESULT)
			.run(async () => {
				const wrapper = mount(TinsEntry);
				await flushPromises();
				expect(wrapper.text()).toContain(ENTRY_TITLE);		
			});
	});

	test('Component renders tags', async () => {
		FetchMock.builder()
			.get(`/api/v1/entry/${ENTRY_ID}/`, MOCK_RESULT)
			.run(async () => {
				const wrapper = mount(TinsEntry);
				await flushPromises();
				expect(wrapper.find(`img[src='/upload/images/400k.png']`).exists()).toBe(true);
			});
	});

	// TODO test adding / replacing / removing image
	// TODO test editing text
});
