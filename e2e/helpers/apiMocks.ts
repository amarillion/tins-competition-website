import type { Page } from '@playwright/test';

export const ANONYMOUS_USER = {
	login: '',
	isStaff: false,
};

export const CURRENT_EVENT_RESPONSE = {
	currentEvent: {
		short: 'demo25',
		title: 'Demo Jam 2025',
		canJoin: false,
		canPost: false,
		canVote: false,
		votingEnd: 0,
		competitionStart: 0,
		competitionEnd: 0,
		joinedCompetition: false,
		hasSecretSanta: false,
		numEntrants: 0,
	},
	events: [
		{
			short: 'demo25',
			title: 'Demo Jam 2025',
			afterStart: true,
			afterEnd: true,
			canPost: false,
		},
	],
	upcoming: [],
};

export const DEFAULT_NEWS_POSTS = [
	{
		id: 1,
		date: Date.now(),
		img: null,
		text: '<p>Hello from the Playwright smoke test</p>',
	},
];

export const MOCK_ENTRY = {
	id: 148,
	competition: {
		short: '2025',
		title: 'Demo Jam 2025',
		competitionStart: 0,
		competitionEnd: 0,
		afterStart: true,
		afterEnd: false,
	},
	title: 'Playwright Entry',
	team: 'Playwright',
	imagefile: null,
	thumbnail: null,
	entrants: [{ id: 1, name: 'playwright-user' }],
	logCounts: {},
	text: '<p>Entry body from Playwright</p>',
	tags: [],
	editable: false,
	lastSubmission: null,
	uploads: [],
	reviewCount: 0,
};

export async function mockDefaultApi(page: Page) {
	await page.route('**/api/v1/currentUser', async (route) => {
		await route.fulfill({ json: ANONYMOUS_USER });
	});

	await page.route('**/api/v1/currentEvent', async (route) => {
		await route.fulfill({ json: CURRENT_EVENT_RESPONSE });
	});

	// The app reports frontend errors to this endpoint; make sure failed tests
	// do not get extra network noise from unrelated runtime errors.
	await page.route('**/api/v1/error', async (route) => {
		await route.fulfill({ status: 204 });
	});
}

export async function mockNewsList(page: Page, posts: unknown[] = DEFAULT_NEWS_POSTS) {
	await page.route('**/api/v1/news', async (route) => {
		await route.fulfill({ json: { posts } });
	});
}

export async function mockEntry(page: Page, entry: unknown = MOCK_ENTRY) {
	const entryId = typeof entry === 'object' && entry && 'id' in entry
		? String(entry.id)
		: '148';

	await page.route(`**/api/v1/entry/${entryId}/`, async (route) => {
		await route.fulfill({ json: entry });
	});
}
