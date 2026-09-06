import { defineCustomElement } from 'vue';

import TinsBreadcrumbs from './components/tins-breadcrumbs.ce.vue';
import TinsCountDown from './components/tins-count-down.ce.vue';
import TinsCurrentEvent from './components/tins-current-event.ce.vue';
import TinsCurrentUser from './components/tins-currentuser.ce.vue';
import TinsEntryThumbnail from './components/tins-entry-thumbnail.ce.vue';
import TinsEntryDownloadBox from './components/tins-entry-download-box.ce.vue';
import TinsFaIcon from './components/tins-fa-icon.ce.vue';
import TinsFrame from './components/tins-frame.ce.vue';
import TinsHeader from './components/tins-header.ce.vue';
import TinsImageUpload from './components/tins-image-upload.ce.vue';
import TinsInlineCountDown from './components/tins-inline-count-down.ce.vue';
import TinsLogForm from './components/tins-log-form.ce.vue';
import TinsLogPost from './components/tins-log-post.ce.vue';
import TinsNewsFeed from './components/tins-newsfeed.ce.vue';
import TinsRange from './components/tins-range.ce.vue';
import TinsRichTextControl from './components/tins-richtext-control.ce.vue';
import TinsRichTextView from './components/tins-richtext-view.ce.vue';
import TinsSideBar from './components/tins-sidebar.ce.vue';
import TinsSpinner from './components/tins-spinner.ce.vue';
import TinsStatusHelper from './components/tins-status-helper.ce.vue';
import TinsUpcoming from './components/tins-upcoming.ce.vue';

export function registerCustomElements() {
	// components
	customElements.define('tins-breadcrumbs', defineCustomElement(TinsBreadcrumbs));
	customElements.define('tins-count-down', defineCustomElement(TinsCountDown));
	customElements.define('tins-current-event', defineCustomElement(TinsCurrentEvent));
	customElements.define('tins-currentuser', defineCustomElement(TinsCurrentUser));
	customElements.define('tins-entry-thumbnail', defineCustomElement(TinsEntryThumbnail));
	customElements.define('tins-entry-download-box', defineCustomElement(TinsEntryDownloadBox));
	customElements.define('tins-fa-icon', defineCustomElement(TinsFaIcon));
	customElements.define('tins-frame', defineCustomElement(TinsFrame));
	customElements.define('tins-header', defineCustomElement(TinsHeader));
	customElements.define('tins-image-upload', defineCustomElement(TinsImageUpload));
	customElements.define('tins-inline-count-down', defineCustomElement(TinsInlineCountDown));
	customElements.define('tins-log-form', defineCustomElement(TinsLogForm));
	customElements.define('tins-log-post', defineCustomElement(TinsLogPost));
	customElements.define('tins-newsfeed', defineCustomElement(TinsNewsFeed));
	customElements.define('tins-range', defineCustomElement(TinsRange));
	customElements.define('tins-richtext', defineCustomElement(TinsRichTextControl));
	customElements.define('tins-richtext-view', defineCustomElement(TinsRichTextView));
	customElements.define('tins-sidebar', defineCustomElement(TinsSideBar));
	customElements.define('tins-spinner', defineCustomElement(TinsSpinner));
	customElements.define('tins-status-helper', defineCustomElement(TinsStatusHelper));
	customElements.define('tins-upcoming', defineCustomElement(TinsUpcoming));
}
