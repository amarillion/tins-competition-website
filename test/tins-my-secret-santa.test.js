import { flushPromises, mount } from '@vue/test-utils';
import TinsSecretSanta from '../src/pages/tins-my-secret-santa.ce.vue';

import fetchMock from 'fetch-mock';
import { describe, expect, test } from 'vitest';

const COMPETITION_DEFAULTS = {
	short: "krampu24", 
	title: "KrampusHack 2024",
	canPost: true,
	canVote: false, 
	votingEnd: 0,
	canJoin: false, 
	competitionStart: 0, 
	competitionEnd: 0
};
const API_DEFAULTS = {
	serverTime: 0,
	competition: COMPETITION_DEFAULTS,
	competitionStarted: false, 
	competitionEnded: false, 
	joinedCompetition: false
};
const SECRET_SANTA_DATA = {
	secretSanta: {
		giver: { entrantId: 1, name: "Yourself" }, 
		receiver: { entrantId: 2, name: "Receiver" }
	}
};
const REVERSE_GIVER_DATA = {
	reverse: {
		name: 'Giver',
		entrantId: 3,
		entryId: 99,
	}
};

describe('Secret Santa Test', () => {
	/*
	Can't test this here - error is actually displayed by tins-status-helper which isn't stubbed or mocked here
	test('Error when not logged in', async () => {
		fetchMock.get('/api/v1/mySecretSanta', 401);
		const wrapper = mount(TinsSecretSanta);
		await flushPromises();
		expect(wrapper.text()).toContain('Access denied: Error: requires login first');
	});
	*/

	test('Error when no active competition', async () => {
		fetchMock.mockGlobal().getOnce('/api/v1/mySecretSanta', {});
		const wrapper = mount(TinsSecretSanta);
		await flushPromises();
		expect(wrapper.text()).toContain('There is no competition going on today. Come back later!');
	});

	test('Error when competition not joined, but can join', async () => {
		fetchMock.mockGlobal().getOnce('/api/v1/mySecretSanta', {
			...API_DEFAULTS,
			competition: {
				...COMPETITION_DEFAULTS,
				canJoin: true
			},
			joinedCompetition: false
		});
		const wrapper = mount(TinsSecretSanta);
		await flushPromises();
		expect(wrapper.text()).toContain('You can still sign up');
	});

	test('Error when competition cannot be joined', async () => {
		fetchMock.mockGlobal().getOnce('/api/v1/mySecretSanta', {
			...API_DEFAULTS,
			competition: {
				...COMPETITION_DEFAULTS, 
				"canJoin": false, 
			}, 
			joinedCompetition: false
		});
		const wrapper = mount(TinsSecretSanta);
		await flushPromises();
		expect(wrapper.text()).toContain('Unfortunately, registration is closed...');
	});

	test('Error when competition not yet started', async () => {
		fetchMock.mockGlobal().getOnce('/api/v1/mySecretSanta', {
			...API_DEFAULTS,
			competitionStarted: false, 
			joinedCompetition: true
		});
		const wrapper = mount(TinsSecretSanta);
		await flushPromises();
		expect(wrapper.text()).toContain('Your secret santa will be revealed in');
	});

	test('Error when not a secret santa competition', async () => {
		fetchMock.mockGlobal().getOnce('/api/v1/mySecretSanta', {
			...API_DEFAULTS,
			competitionStarted: true,
			joinedCompetition: true
		});
		const wrapper = mount(TinsSecretSanta);
		await flushPromises();
		expect(wrapper.text()).toContain('There is no secret santa information available for the current competition.');
	});
	
	test('Letter when competition started', async () => {
		fetchMock.mockGlobal().getOnce('/api/v1/mySecretSanta', {
			...API_DEFAULTS,
			...SECRET_SANTA_DATA,
			joinedCompetition: true,
			competitionStarted: true, 
			competitionEnded: false, 
		});
		const wrapper = mount(TinsSecretSanta);
		await flushPromises();
		expect(wrapper.text()).toContain('I have decided that you will give a gift to Receiver');
	});

	test('Both letters when competition ended', async () => {
		fetchMock.mockGlobal().getOnce('/api/v1/mySecretSanta', {
			...API_DEFAULTS,
			...SECRET_SANTA_DATA,
			...REVERSE_GIVER_DATA,
			joinedCompetition: true,
			competitionStarted: true, 
			competitionEnded: true, 
		});
		const wrapper = mount(TinsSecretSanta);
		await flushPromises();
		expect(wrapper.text()).toContain('I have decided that you will give a gift to Receiver');
		expect(wrapper.text()).toContain('Did you already receive your gift from Giver');
	});

});
