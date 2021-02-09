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
				
router.setRoutes([
	{ path: '/news', component: 'tins-newspage' },
	{ path: '/news/:newsId', component: 'tins-newspage' },
	{ path: '/faq', component: 'tins-faq' },
	{ path: '/about', component: 'tins-about' },
	{ path: '/history', component: 'tins-history' },
	{ path: '/secretSanta', component: 'tins-secret-santa' },
	{ path: '/support', component: 'tins-support' },
	{ path: '/all/entries', component: 'tins-all-entries' },

	// { path: '(.*)', action: ( { pathname }) => { 
	// 	//TODO: 404 page
	// }},
	//TODO: possibly add game name at end of url
	{ path: '/entry/:entryId', component: 'tins-entry' },	
]);
