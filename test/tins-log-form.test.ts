import { mount } from '@vue/test-utils';
import TinsLogForm from '../src/components/tins-log-form.ce.vue';

import { describe, expect, test } from 'vitest';

describe('Log Form test', () => {

	test('without prefill, component is empty', () => {
		const wrapper = mount(TinsLogForm);

		expect(wrapper.find('textarea').text()).toBeFalsy();
		expect((wrapper.find('input[name=\'spoiler\']').element as HTMLInputElement).checked).toBe(false);
		expect(wrapper.find('div.screenshot').isVisible()).toBe(true);
	});

	test('prefill text is applied to text area', () => {
		const wrapper = mount(TinsLogForm, {
			props: { text: 'Prefilled text' }
		});

		expect(wrapper.find('textarea').element.value).toBe('Prefilled text');
	});

	test('prefill spoiler flag is applied to form', () => {
		const wrapper = mount(TinsLogForm, {
			props: { spoiler: true }
		});

		expect((wrapper.find('input[name=\'spoiler\']').element as HTMLInputElement).checked).toBe(true);
	});

	test('prefill image applied to form', () => {
		const wrapper = mount(TinsLogForm, {
			props: { image: 'DummyData' }
		});

		// screenshot invisible, because by default the option keep-as-is is enabled.
		expect(wrapper.find('div.screenshot').isVisible()).toBe(false);
	});

	test('after submitting, form is cleared', async () => {
		const wrapper = mount(TinsLogForm, { props: {
			text: 'This is my post 123',
			spoiler: true,
			screenshot: 'dummy'
		}});

		const textArea = wrapper.find('textarea');

		await wrapper.find('form').trigger('submit');

		// after submitting, the form must be cleared, to ensure the user can't do a double submission
		expect(textArea.element.value).toBe('');
		
		// spoiler flag must also be cleared
		// expect(wrapper.find(`input[name='spoiler']`).element.value).toBe("off");
	});

});