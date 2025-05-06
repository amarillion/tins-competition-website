import { flushPromises, mount } from '@vue/test-utils';
import TinsCurrentUser from '../src/components/tins-currentuser.ce.vue';
import { afterEach, describe, expect, it } from 'vitest';
import { currentUserStore } from '../src/store/index.js';
import { FetchMock } from './util/fetchMock.js';

describe('Tins current user component', () => {

	afterEach(() => {
		currentUserStore.clearCurrentUser();
	});

	it('displays username when logged in', async () => {
		await FetchMock.builder().get('/api/v1/currentUser', { login: 'player1', isStaff: false }).run(async () => {
			const wrapper = mount(TinsCurrentUser);
			await flushPromises();
			expect(wrapper.text()).toEqual('You are logged in as: player1 log out');
		});
	});

	it('links to login and register when not logged in', async () => {
		await FetchMock.builder().get('/api/v1/currentUser', { login: '', isStaff: false }).run(async () => {
			const wrapper = mount(TinsCurrentUser);
			await flushPromises();
			expect(wrapper.text()).toEqual('Welcome, new user. Please log in or register');
		});
	});

});