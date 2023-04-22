import { Router } from '@vaadin/router';

import { TinsNewsPage } from './pages/tins-newspage.js';
import { TinsAbout } from './pages/tins-about.js';
import { TinsFaq } from './pages/tins-faq.js';
import { TinsHistory } from './pages/tins-history.js';
import { TinsSecretSanta } from './pages/tins-my-secret-santa.js';
import { TinsSupport } from './pages/tins-support.js';
import { TinsEntry } from './pages/tins-entry.js';
import { TinsAllEntries } from './pages/tins-all-entries.js';
import { TinsUser } from './pages/tins-user.js';
import { TinsLogs } from './pages/tins-logs.js';
import { TinsLogEdit } from './pages/tins-log-edit.js';
import { TinsCompoMain } from './pages/tins-compo-main.js';

import { TinsFrame } from './components/tins-frame.js';
import { TinsMyEntry } from './pages/tins-my-entry.js';
import { TinsRules } from './pages/tins-rules.js';
import { TinsResults } from './pages/tins-results.js';
import { TinsRuleOMatic } from './pages/tins-rule-o-matic.js';
import { TinsEntrants } from './pages/tins-entrants.js';
import { TinsTeamManagement } from './pages/tins-team-management.js';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

customElements.define('tins-newspage', TinsNewsPage);
customElements.define('tins-about', TinsAbout);
customElements.define('tins-faq', TinsFaq);
customElements.define('tins-history', TinsHistory);
customElements.define('tins-secret-santa', TinsSecretSanta);
customElements.define('tins-support', TinsSupport);
customElements.define('tins-entry', TinsEntry);
customElements.define('tins-my-entry', TinsMyEntry);
customElements.define('tins-all-entries', TinsAllEntries);
customElements.define('tins-user', TinsUser);
customElements.define('tins-logs', TinsLogs);
customElements.define('tins-log-edit', TinsLogEdit);
customElements.define('tins-frame', TinsFrame);
customElements.define('tins-compo-main', TinsCompoMain);
customElements.define('tins-rules', TinsRules);
customElements.define('tins-results', TinsResults);
customElements.define('tins-rule-o-matic', TinsRuleOMatic);
customElements.define('tins-entrants', TinsEntrants);
customElements.define('tins-team-management', TinsTeamManagement);

router.setRoutes([{ 
	path: '/',
	component: 'tins-frame',
	children: [ 
		{ path: '/news', component: 'tins-newspage' },
		{ path: '/news/:newsId', component: 'tins-newspage' },
		{ path: '/faq', component: 'tins-faq' },
		{ path: '/about', component: 'tins-about' },
		{ path: '/history', component: 'tins-history' },
		{ path: '/secretSanta', component: 'tins-secret-santa' },
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

		{ path: '/:compoId/myEntry', component: 'tins-my-entry' },
		{ path: '/:compoId/team', component: 'tins-team-management' },

		{ path: '/:compoId/log/edit', component: 'tins-log-edit' },
		{ path: '/:compoId/log/id/:postId', component: 'tins-logs' },

		{ path: '/:compoId/log', component: 'tins-logs' }, 
		{ path: '/:compoId/log/entrant/:entrantId', component: 'tins-logs' },

		{ path: '/:compoId/log/page/:page', component: 'tins-logs' }, 
		{ path: '/:compoId/log/entrant/:entrantId/page/:page', component: 'tins-logs' },
		
	]}
]);
