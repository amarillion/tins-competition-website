function currentEventLoading() {
	return { type: 'CURREVENT_LOADING' };
}

function currentEventError(error) {
	return { type: 'CURREVENT_ERROR', error };
}

function currentEventSuccess(data) {
	return { type: 'CURREVENT_SUCCESS', data };
}

export const canPostSelector = (compoId) => 
	s => s.currentEvent.data && s.currentEvent.data.byShort[compoId].canPost;

function transformResponse(data) {
	const { events, upcoming, currentEvent } = data;
	const byShort = {};
	for (const e of events) {
		byShort[e.short] = e;
	}
	return { events, upcoming, byShort, currentEvent };
}

export const refreshCurrentEvent = () => async (dispatch, getState) => {
	const { currentEvent } = getState();
	const ageInMinutes = (Date.now() - currentEvent.timestamp) / 1000 / 60;
	if (ageInMinutes < 60) { return; }

	dispatch(currentEventLoading());

	const response = await fetch('/api/v1/currentEvent', { credentials: 'same-origin' } );
	if (response.status < 200 || response.status > 299) {
		dispatch(currentEventError(await response.text()));
	}
	else {
		const data = transformResponse(await response.json());
		dispatch(currentEventSuccess(data));
	}
};

export default function reducer(state = { loading: false, error: null, data: null }, action) {
	switch (action.type) {
	case 'CURREVENT_LOADING':
		return { ...state, loading: true, error: null, data: null, timestamp: null };
	case 'CURREVENT_ERROR':
		return { ...state, loading: false, error: action.error, data: null, timestamp: null };
	case 'CURREVENT_SUCCESS':
		return { ...state, loading: false, error: null, data: action.data, timestamp: Date.now() };
	default:
		return state;
	}
}
