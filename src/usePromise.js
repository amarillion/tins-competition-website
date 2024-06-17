import { ref } from 'vue';

export function usePromise() {
	const result = ref(null);
	const loading = ref(false);
	const error = ref(null);
	const doAsync = async (fn) => {
		loading.value = true;
		error.value = null;
		result.value = null;
		try {
			result.value = await fn();
		} catch (err) {
			error.value = err;
		} finally {
			loading.value = false;
		}
	};
	return { result, loading, error, doAsync };
}