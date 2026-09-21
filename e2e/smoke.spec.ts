import { expect, test } from '@playwright/test';

import { mockDefaultApi, mockEntry, mockNewsList } from './helpers/apiMocks';

test.beforeEach(async ({ page }) => {
	await mockDefaultApi(page);
});

test('loads /news/ and shows the news feed', async ({ page }) => {
	await mockNewsList(page);
	await page.goto('/news/');

	await expect(page.getByRole('heading', { name: 'News' })).toBeVisible();
	await expect(page.getByText('Hello from the Playwright smoke test')).toBeVisible();
});

test('loads /about as a direct URL', async ({ page }) => {
	await page.goto('/about');

	await expect(page.getByRole('heading', { name: 'About this site...' })).toBeVisible();
});

test('loads /faq as a direct URL', async ({ page }) => {
	await page.goto('/faq');

	await expect(page.getByRole('heading', { name: 'Frequently Asked Questions' })).toBeVisible();
});

test('redirects / to /news/', async ({ page }) => {
	await mockNewsList(page);
	await page.goto('/');

	await expect(page).toHaveURL(/\/news\/?$/);
	await expect(page.getByRole('heading', { name: 'News' })).toBeVisible();
});

test('loads a dynamic entry URL', async ({ page }) => {
	await mockEntry(page);
	await page.goto('/entry/148/');

	await expect(page.getByRole('heading', { name: 'Playwright Entry' })).toBeVisible();
	await expect(page.getByText('Entry body from Playwright')).toBeVisible();
});

test('router-ignore links perform a full page navigation', async ({ page }) => {
	await page.route('**/accounts/login**', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'text/html',
			body: '<html><body>Django login placeholder</body></html>',
		});
	});

	await page.goto('/about');
	await expect(page.getByRole('heading', { name: 'About this site...' })).toBeVisible();

	await page.getByRole('link', { name: 'log in' }).click();

	await expect(page).toHaveURL(/\/accounts\/login\?next=/);
	await expect(page.getByText('Django login placeholder')).toBeVisible();
});

test('sidebar navigation moves from /news/ to /about without a full reload', async ({ page }) => {
	await mockNewsList(page);
	await page.goto('/news/');
	await expect(page.getByRole('heading', { name: 'News' })).toBeVisible();

	await page.getByRole('link', { name: 'About', exact: true }).click();

	await expect(page).toHaveURL(/\/about\/?$/);
	await expect(page.getByRole('heading', { name: 'About this site...' })).toBeVisible();
});

test('browser back returns from /about to /news/', async ({ page }) => {
	await mockNewsList(page);
	await page.goto('/about');
	await expect(page.getByRole('heading', { name: 'About this site...' })).toBeVisible();

	await page.goto('/news/');
	await expect(page.getByRole('heading', { name: 'News' })).toBeVisible();

	await page.goBack();

	await expect(page).toHaveURL(/\/about\/?$/);
	await expect(page.getByRole('heading', { name: 'About this site...' })).toBeVisible();
});
