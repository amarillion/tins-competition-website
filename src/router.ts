import {
	RouterView,
	createRouter,
	createWebHistory,
	type RouteLocationNormalizedLoaded,
	type RouteRecordRaw,
} from 'vue-router';
import { defineComponent, h, type Component } from 'vue';

import { registerCustomElements } from './customElements.js';

registerCustomElements();

function ceRoute(tag: string) {
	return defineComponent({
		name: `CeRoute-${tag}`,
		render: () => h(tag),
	});
}

/**
 * Renders the matched page component inside the current route level.
 * The page is keyed by the full route path so route-parameter changes remount
 * the underlying web component. The pages currently read window.location in
 * setup(), so a remount is required to pick up new dynamic-route values.
 */
const RoutedView = defineComponent({
	name: 'RoutedView',
	render() {
		return h(RouterView, null, {
			default: (slotProps: { Component?: Component; route: RouteLocationNormalizedLoaded }) => {
				const { Component, route } = slotProps;
				if (!Component) {
					return null;
				}
				return h(Component, { key: route.fullPath });
			},
		});
	},
});

const FrameRoute = defineComponent({
	name: 'FrameRoute',
	render() {
		// Keep the existing DOM model: Vue Router drives navigation, while the
		// layout and pages remain custom elements with shadow-DOM styles.
		return h('tins-frame', null, [
			h(RoutedView),
		]);
	},
});

export const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: FrameRoute,
		children: [
			{ path: '', redirect: '/news/' },
			{ path: 'news', component: ceRoute('tins-newspage') },
			{ path: 'news/:newsId', component: ceRoute('tins-newspage') },
			{ path: 'faq', component: ceRoute('tins-faq') },
			{ path: 'about', component: ceRoute('tins-about') },
			{ path: 'history', component: ceRoute('tins-history') },
			{ path: 'secretSanta', component: ceRoute('tins-my-secret-santa') },
			{ path: 'support', component: ceRoute('tins-support') },
			{ path: 'all/entries', component: ceRoute('tins-all-entries') },
			{ path: 'user/:userId', component: ceRoute('tins-user') },

			// TODO: add a 404 page.
			// TODO: possibly add game name at end of url.
			{ path: 'entry/:entryId', component: ceRoute('tins-entry') },

			{ path: 'rule-o-matic', component: ceRoute('tins-rule-o-matic') },

			{ path: ':compoId', component: ceRoute('tins-compo-main') },
			{ path: ':compoId/rules', component: ceRoute('tins-rules') },
			{ path: ':compoId/results', component: ceRoute('tins-results') },
			{ path: ':compoId/entrants', component: ceRoute('tins-entrants') },

			{ path: ':compoId/reviews', component: ceRoute('tins-reviews') },
			{ path: ':compoId/reviews/entry/:entryId', component: ceRoute('tins-reviews') },
			{ path: ':compoId/reviews/entrant/:entrantId', component: ceRoute('tins-reviews') },
			{ path: ':compoId/reviews/:reviewId', component: ceRoute('tins-reviews') },

			{ path: ':compoId/myEntry', component: ceRoute('tins-my-entry') },
			{ path: ':compoId/team', component: ceRoute('tins-team-management') },

			{ path: ':compoId/log/edit', component: ceRoute('tins-log-edit') },
			{ path: ':compoId/log/id/:postId', component: ceRoute('tins-logs') },
			{ path: ':compoId/log', component: ceRoute('tins-logs') },
			{ path: ':compoId/log/entrant/:entrantId', component: ceRoute('tins-logs') },
			{ path: ':compoId/log/page/:page', component: ceRoute('tins-logs') },
			{ path: ':compoId/log/entrant/:entrantId/page/:page', component: ceRoute('tins-logs') },

			{ path: ':compoId/results/calculate', component: ceRoute('tins-admin-calculate-results') },
		],
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
