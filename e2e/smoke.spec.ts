import { expect, test } from '@playwright/test';

import { mockDefaultApi, mockNewsList } from './helpers/apiMocks';

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
