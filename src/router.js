import { Router } from '@vaadin/router';
import { TinsNewsPage } from './pages/tins-newspage';
import { TinsAbout } from './pages/tins-about';
import { TinsFaq } from './pages/tins-faq';
import { TinsHistory } from './pages/tins-history';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

customElements.define('tins-newspage', TinsNewsPage);
customElements.define('tins-about', TinsAbout);
customElements.define('tins-faq', TinsFaq);
customElements.define('tins-history', TinsHistory);
				
router.setRoutes([
	{ path: '/news', component: 'tins-newspage' },
	{ path: '/news/:newsId', component: 'tins-newspage' },
	{ path: '/faq', component: 'tins-faq' },
	{ path: '/about', component: 'tins-about' },
	{ path: '/history', component: 'tins-history' },

	// fallback to server routing
	{ path: '(.*)', action: ( { pathname }) => { 
		console.log(`Fallback handler: ${pathname}`);
		// window.history.pushState(null, document.title, window.location.href);
		window.location.href = pathname; 
	}},
]);
