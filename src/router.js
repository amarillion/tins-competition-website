import { Router } from '@vaadin/router';

import { TinsFaIcon } from './components/tins-fa-icon.js';

import { TinsNewsPage } from './pages/tins-newspage';
import { TinsAbout } from './pages/tins-about';
import { TinsFaq } from './pages/tins-faq';
import { TinsHistory } from './pages/tins-history';
import { TinsSecretSanta } from './pages/tins-my-secret-santa';
import { TinsSupport } from './pages/tins-support.js';
import { TinsEntry } from './pages/tins-entry.js';
import { TinsAllEntries } from './pages/tins-all-entries.js';
import { TinsUser } from './pages/tins-user.js';
import { TinsLogs } from './pages/tins-logs.js';
import { TinsLogEdit } from './pages/tins-log-edit.js';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

customElements.define('tins-newspage', TinsNewsPage);
customElements.define('tins-about', TinsAbout);
customElements.define('tins-faq', TinsFaq);
customElements.define('tins-history', TinsHistory);
customElements.define('tins-secret-santa', TinsSecretSanta);
customElements.define('tins-fa-icon', TinsFaIcon);
customElements.define('tins-support', TinsSupport);
customElements.define('tins-entry', TinsEntry);
customElements.define('tins-all-entries', TinsAllEntries);
customElements.define('tins-user', TinsUser);
customElements.define('tins-logs', TinsLogs);
customElements.define('tins-log-edit', TinsLogEdit);

router.setRoutes([
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

	{ path: '/:compoId/log/edit', component: 'tins-log-edit' },
	{ path: '/:compoId/log', component: 'tins-logs' },
	{ path: '/:compoId/log/id/:postId', component: 'tins-logs' },
	{ path: '/:compoId/log/:entrantId', component: 'tins-logs' },

]);
