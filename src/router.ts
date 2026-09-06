import { Router } from '@vaadin/router';

import { registerCustomElements } from './customElements.js';

registerCustomElements();

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

router.setRoutes([{
	path: '/',
	component: 'tins-frame',
	children: [

		{ path: '/', redirect: '/news/' },
		{ path: '/news', component: 'tins-newspage' },
		{ path: '/news/:newsId', component: 'tins-newspage' },
		{ path: '/faq', component: 'tins-faq' },
		{ path: '/about', component: 'tins-about' },
		{ path: '/history', component: 'tins-history' },
		{ path: '/secretSanta', component: 'tins-my-secret-santa' },
		{ path: '/support', component: 'tins-support' },
		{ path: '/all/entries', component: 'tins-all-entries' },
		{ path: '/user/:userId', component: 'tins-user' },

		// { path: '(.*)', action: ( { pathname }) => {
		// 	//TODO: 404 page
		// }},
		//TODO: possibly add game name at end of url
		{ path: '/entry/:entryId', component: 'tins-entry' },

		{ path: '/rule-o-matic', component: 'tins-rule-o-matic' },

		{ path: '/:compoId/', component: 'tins-compo-main' },
		{ path: '/:compoId/rules', component: 'tins-rules' },
		{ path: '/:compoId/results', component: 'tins-results' },
		{ path: '/:compoId/entrants', component: 'tins-entrants' },

		{ path: '/:compoId/reviews', component: 'tins-reviews' },
		{ path: '/:compoId/reviews/entry/:entryId', component: 'tins-reviews' },
		{ path: '/:compoId/reviews/entrant/:entrantId', component: 'tins-reviews' },
		{ path: '/:compoId/reviews/:reviewId', component: 'tins-reviews' },

		{ path: '/:compoId/myEntry', component: 'tins-my-entry' },
		{ path: '/:compoId/team', component: 'tins-team-management' },

		{ path: '/:compoId/log/edit', component: 'tins-log-edit' },
		{ path: '/:compoId/log/id/:postId', component: 'tins-logs' },

		{ path: '/:compoId/log', component: 'tins-logs' },
		{ path: '/:compoId/log/entrant/:entrantId', component: 'tins-logs' },

		{ path: '/:compoId/log/page/:page', component: 'tins-logs' },
		{ path: '/:compoId/log/entrant/:entrantId/page/:page', component: 'tins-logs' },

		{ path: '/:compoId/results/calculate', component: 'tins-admin-calculate-results' },

	]}
]);
