import { Router } from '@vaadin/router';
import { defineCustomElement } from 'vue';

import { TinsSecretSanta } from './pages/tins-my-secret-santa.js';
import { TinsEntry } from './pages/tins-entry.js';
import { TinsLogs } from './pages/tins-logs.js';
import { TinsLogEdit } from './pages/tins-log-edit.js';
import { TinsMyEntry } from './pages/tins-my-entry.js';
import { TinsRuleOMatic } from './pages/tins-rule-o-matic.js';
import { TinsTeamManagement } from './pages/tins-team-management.js';

import TinsAbout from './pages/tins-about.ce.vue';
import TinsAllEntries from './pages/tins-all-entries.ce.vue';
import TinsCompoMain from './pages/tins-compo-main.ce.vue';
import TinsEntrants from './pages/tins-entrants.ce.vue';
import TinsFaq from './pages/tins-faq.ce.vue';
import TinsHistory from './pages/tins-history.ce.vue';
import TinsNewsPage from './pages/tins-newspage.ce.vue';
import TinsResults from './pages/tins-results.ce.vue';
import TinsRules from './pages/tins-rules.ce.vue';
import TinsSupport from './pages/tins-support.ce.vue';
import TinsUser from './pages/tins-user.ce.vue';

import { TinsFrame } from './components/tins-frame.js';
import { TinsCurrentUser } from './components/tins-currentuser.js';
import { TinsCountDown } from './components/tins-count-down.js';
import { TinsSideBar } from './components/tins-sidebar.js';
import { TinsHeader } from './components/tins-header.js';
import { TinsCurrentEvent } from './components/tins-current-event.js';
import { TinsFaIcon } from './components/tins-fa-icon.js';
import { TinsImageUpload } from './components/tins-image-upload.js';
import { TinsInlineCountDown } from './components/tins-inline-count-down.js';
import { TinsLogForm } from './components/tins-log-form.js';
import { TinsStatusHelper } from './components/tins-status-helper.js';
import { TinsLogPost } from './components/tins-log-post.js';
import { TinsNewsFeed } from './components/tins-newsfeed.js';
import { TinsRange } from './components/tins-range.js';
import { TinsRichTextControl } from './components/tins-richtext-control.js';
import { TinsRichTextView } from './components/tins-richtext-view.js';
import { TinsSpinner } from './components/tins-spinner.js';
import { TinsUpcoming } from './components/tins-upcoming.js';

import TinsBreadcrumbs from './components/tins-breadcrumbs.ce.vue';
import TinsEntryThumbnail from './components/tins-entry-thumbnail.ce.vue';

const outlet = document.getElementById('outlet');
const router = new Router(outlet);

// pages
customElements.define('tins-about', defineCustomElement(TinsAbout));
customElements.define('tins-all-entries', defineCustomElement(TinsAllEntries));
customElements.define('tins-compo-main', defineCustomElement(TinsCompoMain));
customElements.define('tins-entrants', defineCustomElement(TinsEntrants));
customElements.define('tins-entry', TinsEntry);
customElements.define('tins-faq', defineCustomElement(TinsFaq));
customElements.define('tins-history', defineCustomElement(TinsHistory));
customElements.define('tins-log-edit', TinsLogEdit);
customElements.define('tins-logs', TinsLogs);
customElements.define('tins-my-entry', TinsMyEntry);
customElements.define('tins-my-secret-santa', TinsSecretSanta);
customElements.define('tins-newspage', defineCustomElement(TinsNewsPage));
customElements.define('tins-results', defineCustomElement(TinsResults));
customElements.define('tins-rule-o-matic', TinsRuleOMatic);
customElements.define('tins-rules', defineCustomElement(TinsRules));
customElements.define('tins-support', defineCustomElement(TinsSupport));
customElements.define('tins-team-management', TinsTeamManagement);
customElements.define('tins-user', defineCustomElement(TinsUser));

// components
customElements.define('tins-count-down', TinsCountDown);
customElements.define('tins-current-event', TinsCurrentEvent);
customElements.define('tins-currentuser', TinsCurrentUser);
customElements.define('tins-entry-thumbnail', defineCustomElement(TinsEntryThumbnail));
customElements.define('tins-fa-icon', TinsFaIcon);
customElements.define('tins-frame', TinsFrame);
customElements.define('tins-header', TinsHeader);
customElements.define('tins-image-upload', TinsImageUpload);
customElements.define('tins-inline-count-down', TinsInlineCountDown);
customElements.define('tins-log-form', TinsLogForm);
customElements.define('tins-log-post', TinsLogPost);
customElements.define('tins-newsfeed', TinsNewsFeed);
customElements.define('tins-range', TinsRange);
customElements.define('tins-richtext', TinsRichTextControl);
customElements.define('tins-richtext-view', TinsRichTextView);
customElements.define('tins-sidebar', TinsSideBar);
customElements.define('tins-spinner', TinsSpinner);
customElements.define('tins-status-helper', TinsStatusHelper);
customElements.define('tins-upcoming', TinsUpcoming);
customElements.define('tins-breadcrumbs', defineCustomElement(TinsBreadcrumbs));

router.setRoutes([{ 
	path: '/',
	component: 'tins-frame',
	children: [ 

		// special exclusion - these routes are served by original multi-page django application
		// special exclusion added because results pages link to these reviews
		{
			path: '/:compoId/reviews/entry/(.*)',
			action: (ctx, /* commands */) => {
				console.log("Explicitly ignored by vaadin configuration");
				window.location.pathname = ctx.pathname;
			}
		},

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
