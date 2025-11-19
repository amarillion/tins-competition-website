import { describe, expect, test } from 'vitest';
import TinsRichtextControlCe from '../src/components/tins-richtext-control.ce.vue';
import { mount } from '@vue/test-utils';

describe('Rich Text Control', () => {

	test('When text property is modified, component contents follows', async () => {
		const wrapper = await mount(TinsRichtextControlCe, {
			props: {
				text: 'Some initial text'
			}
		});
		
		expect(wrapper.find('tins-richtext-view').exists()).toBe(true);
		expect(wrapper.find('tins-richtext-view').attributes('text')).toBe('Some initial text');

		await wrapper.setProps({ text: 'Another value' });
		expect(wrapper.find('tins-richtext-view').attributes('text')).toBe('Another value');
	});

});
