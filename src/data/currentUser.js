function loading() {
	return { type: 'CURRUSER_LOADING' };
}

function error(error) {
	return { type: 'CURRUSER_ERROR', error };
}

function success(data) {
	return { type: 'CURRUSER_SUCCESS', data };
}

export const currentUserSelector = s => s.currentUser.data && s.currentUser.data.login;

export function clearCurrentUser() {
	return { type: 'CURRUSER_CLEAR' };
}

export const refreshCurrentUser = () => async (dispatch, getState) => {
	const { currentUser } = getState();
	const ageInMinutes = (Date.now() - currentUser.timestamp) / 1000 / 60;
	if (ageInMinutes < 15) { return; }

	dispatch(loading());

	const response = await fetch('/api/v1/currentUser', { credentials: 'same-origin' });
	if (response.status < 200 || response.status > 299) {
		dispatch(error(await response.text()));
	}
	else {
		const data = (await response.json());
		dispatch(success(data));
	}
};

export default function reducer(state = { loading: false, error: null, data: null }, action) {
	switch (action.type) {
	case 'CURRUSER_CLEAR':
		return { ...state, timestamp: null };
	case 'CURRUSER_LOADING':
		return { ...state, loading: true, error: null, data: null, timestamp: null };
	case 'CURRUSER_ERROR':
		return { ...state, loading: false, error: action.error, data: null, timestamp: null };
	case 'CURRUSER_SUCCESS':
		return { ...state, loading: false, error: null, data: action.data, timestamp: Date.now() };
	default:
		return state;
	}
}
