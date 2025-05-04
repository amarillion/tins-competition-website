import { describe, expect, test } from 'vitest';
import { mount } from '@vue/test-utils';

import TinsCountDown from '../src/components/tins-count-down.ce.vue';

describe('Count-down component', () => {

	test('countdown 60 seconds from now', async () => {
		const wrapper = await mount(TinsCountDown, { props: { label: 'MyLabel: ', epochmillis: Date.now() + 59500 }});
		expect(wrapper.isVisible()).toBe(true);
		expect(wrapper.text()).toContain('MyLabel');
		expect(wrapper.text()).toContain('59sec');
	});

	test('countdown just finished', async () => {
		const wrapper = await mount(TinsCountDown, { props: { label: 'MyLabel: ', epochmillis: Date.now() - 1000 }});
		expect(wrapper.isVisible()).toBe(false);
	});

});
