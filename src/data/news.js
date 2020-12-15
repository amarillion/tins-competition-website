function postLoading() {
	return { type: 'POST_LOADING' };
}

function postError(error) {
	return { type: 'POST_ERROR', error };
}

function postSuccess(posts) {
	return { type: 'POST_SUCCESS', posts };
}

export const refreshPosts = (id) => async (dispatch) => {
	dispatch(postLoading(id));

	let url;
	if (id) url = `/api/v1/news/${id}`;
	else url = '/api/v1/news';

	const response = await fetch(url);
	if (response.status < 200 || response.status > 299) {
		dispatch(postError(await response.text()));
	}
	else {
		const posts = (await response.json()).posts;
		dispatch(postSuccess(posts));
	}
};

export default function reducer(state = { loading: false, error: null, posts: [] }, action) {
	switch (action.type) {
	case 'POST_LOADING':
		return { ...state, loading: true, error: null, posts: [] };
	case 'POST_ERROR':
		return { ...state, loading: false, error: action.error, posts: [] };
	case 'POST_SUCCESS':
		return { ...state, loading: false, error: null, posts: action.posts };
	default:
		return state;
	}
}
