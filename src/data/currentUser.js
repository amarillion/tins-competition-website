function loading() {
	return { type: 'CURRUSER_LOADING' };
}

function error(error) {
	return { type: 'CURRUSER_ERROR', error };
}

function success(data) {
	return { type: 'CURRUSER_SUCCESS', data };
}

export const refreshCurrentUser = () => async (dispatch) => {
	dispatch(loading());

	const response = await fetch('/api/v1/currentUser');
	if (response.status < 200 || response.status > 299) {
		dispatch(error(await response.text()));
	}
	else {
		const data = (await response.json());
		dispatch(success(data));
	}
}

export default function reducer(state = { loading: false, error: null, data: null }, action) {
	switch (action.type) {
	case 'CURRUSER_LOADING':
		return { ...state, loading: true, error: null, data: null };
	case 'CURRUSER_ERROR':
		return { ...state, loading: false, error: action.error, data: null };
	case 'CURRUSER_SUCCESS':
		return { ...state, loading: false, error: null, data: action.data };
	default:
		return state;
	}
}
