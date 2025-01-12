import linkifyHtml from 'linkify-html';
import { clearCurrentUser } from './data/currentUser.js';
import { dispatch } from './store.js';
import Cookies from 'js-cookie';

export const spoilerExplanation = `\
Posts marked spoiler will be hidden from the public until the competition is over. 
For secret-santa competitions, they're hidden from your giftee as well.`;

export const markupMessage = `\
Certain html tags are allowed: <a> <abbr> <b> <i> <s> <li> <ul> <ol> <pre> <code> <blockquote>
URLs are automatically linkified. 
Youtube links on a line by themselves are converted to embedded videos.
Newlines are preserved.
You can edit the text of your last post only.
`;

export const IMAGE_UPLOAD_SIZE_LIMIT = 1 << 20;

/*
	Adds an event listener on a DOM element, and returns a function that 
	removes it again when called.
*/
export function registerEventListener(elt, type, func, capture = false) {
	elt.addEventListener(type, func, capture);
	return () => {
		elt.removeEventListener(type, func, capture);
	};
}

export function formatBytes(bytes) {
	const GB = 1 << 30;
	const MB = 1 << 20;
	const KB = 1 << 10;
	if (bytes > GB / 2) {
		return `${(bytes/GB).toFixed(2)} GiB`;
	}
	else if (bytes > MB / 2) {
		return `${(bytes/MB).toFixed(2)} MiB`;
	}
	else if (bytes > KB / 2) {
		return `${(bytes/KB).toFixed(2)} KiB`;
	}
	else {
		return `${bytes} b`;
	}
}

export async function formatErrorResponse(response) {
	const message = (await response.text()).split("\n")[0];
	switch(response.status) {
	case 401: return `Access denied: ${message}`;
	case 403: return `Unauthorized: ${message}`;
	case 404: return `Not found: ${message}`;
	default: return `Error: ${message}`;
	}
}

export async function fetchJSONOrThrow(url) {
	const response = await fetch(url, {
		credentials: 'same-origin'
	});
	if (response.ok) {
		// parse json only if response is OK. Error state may contain invalid json.
		const data = await response.json(); 
		return data;
	}
	else {
		if (response.status === 401) {
			dispatch(clearCurrentUser());
		}
		throw new Error(await formatErrorResponse(response));
	}
}

export async function postOrThrow(url, body) {
	// being able to access the cookie proves that this code is running in the proper domain
	const csrftoken = Cookies.get('csrftoken');

	const response = await fetch(url, {
		method: 'POST', 
		credentials: 'same-origin',
		headers: { 'X-CSRFToken': csrftoken }, 
		body
	});

	if (response.ok) {
		return response;
	}
	else {
		if (response.status === 401) {
			dispatch(clearCurrentUser());
		}

		throw new Error(await formatErrorResponse(response));
	}
}

function transformYoutubeLinks(text) {
	if (!text) return text;
	const youtubeLink = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]+)?$/gm;
	// trick for responsive aspect ratio in iframe: https://www.ankursheel.com/blog/full-width-you-tube-video-embed
	const replacement = '<div class="video-container"><iframe class="video" src="https://www.youtube.com/embed/$1" allowfullscreen></iframe><br/></div>';
	return text.replaceAll(youtubeLink, replacement);
}

export function renderRichText(text) {
	// convert youtube links
	// must be done before linkifying and converting newlines
	text = transformYoutubeLinks(text);

	// convert urls
	text = linkifyHtml(text, {
		validate: {
			// only linkify URLs that start with a protocol
			// http://www.google.com but not google.com
			url: (value) => /^(http|ftp)s?:\/\//.test(value),
			// do not linkify email addresses.
			email: () => false
		}
	});

	// replace double newlines with paragraph breaks
	text = `<p>${text.replaceAll("\n\n", "</p><p>")}</p>`;
	// insert line breaks
	return text.replaceAll("\n", "<br>");
}