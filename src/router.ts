import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import TinsAbout from './pages/tins-about.vue';
import TinsAdminCalculateResults from './pages/tins-admin-calculate-results.vue';
import TinsAllEntries from './pages/tins-all-entries.vue';
import TinsCompoMain from './pages/tins-compo-main.vue';
import TinsEntrants from './pages/tins-entrants.vue';
import TinsEntry from './pages/tins-entry.vue';
import TinsFaq from './pages/tins-faq.vue';
import TinsHistory from './pages/tins-history.vue';
import TinsLogEdit from './pages/tins-log-edit.vue';
import TinsLogs from './pages/tins-logs.vue';
import TinsMyEntry from './pages/tins-my-entry.vue';
import TinsMySecretSanta from './pages/tins-my-secret-santa.vue';
import TinsNewsPage from './pages/tins-newspage.vue';
import TinsResults from './pages/tins-results.vue';
import TinsReviews from './pages/tins-reviews.vue';
import TinsRuleOMatic from './pages/tins-rule-o-matic.vue';
import TinsRules from './pages/tins-rules.vue';
import TinsSupport from './pages/tins-support.vue';
import TinsTeamManagement from './pages/tins-team-management.vue';
import TinsUser from './pages/tins-user.vue';

import { registerCustomElements } from './customElements.js';

registerCustomElements();

export const routes: RouteRecordRaw[] = [
	{ path: '/', redirect: '/news/' },
	{ path: '/news', component: TinsNewsPage, props: true },
	{ path: '/news/:newsId', component: TinsNewsPage, props: true },
	{ path: '/faq', component: TinsFaq },
	{ path: '/about', component: TinsAbout },
	{ path: '/history', component: TinsHistory },
	{ path: '/secretSanta', component: TinsMySecretSanta },
	{ path: '/support', component: TinsSupport },
	{ path: '/all/entries', component: TinsAllEntries },
	{ path: '/user/:userId', component: TinsUser, props: true },

	// TODO: add a 404 page.
	// TODO: possibly add game name at end of url.
	{ path: '/entry/:entryId', component: TinsEntry, props: true },

	{ path: '/rule-o-matic', component: TinsRuleOMatic },

	{ path: '/:compoId', component: TinsCompoMain, props: true },
	{ path: '/:compoId/rules', component: TinsRules, props: true },
	{ path: '/:compoId/results', component: TinsResults, props: true },
	{ path: '/:compoId/entrants', component: TinsEntrants, props: true },

	{ path: '/:compoId/reviews', component: TinsReviews, props: true },
	{ path: '/:compoId/reviews/entry/:entryId', component: TinsReviews, props: true },
	{ path: '/:compoId/reviews/entrant/:entrantId', component: TinsReviews, props: true },
	{ path: '/:compoId/reviews/:reviewId', component: TinsReviews, props: true },

	{ path: '/:compoId/myEntry', component: TinsMyEntry, props: true },
	{ path: '/:compoId/team', component: TinsTeamManagement, props: true },

	{ path: '/:compoId/log/edit', component: TinsLogEdit, props: true },
	{ path: '/:compoId/log/id/:postId', component: TinsLogs, props: true },
	{ path: '/:compoId/log', component: TinsLogs, props: true },
	{ path: '/:compoId/log/entrant/:entrantId', component: TinsLogs, props: true },
	{ path: '/:compoId/log/page/:page', component: TinsLogs, props: true },
	{ path: '/:compoId/log/entrant/:entrantId/page/:page', component: TinsLogs, props: true },

	{ path: '/:compoId/results/calculate', component: TinsAdminCalculateResults, props: true },
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
