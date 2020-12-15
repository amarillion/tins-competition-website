function currentEventLoading() {
	return { type: 'CURREVENT_LOADING' };
}

function currentEventError(error) {
	return { type: 'CURREVENT_ERROR', error };
}

function currentEventSuccess(data) {
	return { type: 'CURREVENT_SUCCESS', data };
}

export const refreshCurrentEvent = () => async (dispatch) => {
	dispatch(currentEventLoading());

	const response = await fetch('/api/v1/currentEvent');
	if (response.status < 200 || response.status > 299) {
		dispatch(currentEventError(await response.text()));
	}
	else {
		const data = (await response.json());
		dispatch(currentEventSuccess(data));
	}
};

export default function reducer(state = { loading: false, error: null, data: null }, action) {
	switch (action.type) {
	case 'CURREVENT_LOADING':
		return { ...state, loading: true, error: null, data: null };
	case 'CURREVENT_ERROR':
		return { ...state, loading: false, error: action.error, data: null };
	case 'CURREVENT_SUCCESS':
		return { ...state, loading: false, error: null, data: action.data };
	default:
		return state;
	}
}
