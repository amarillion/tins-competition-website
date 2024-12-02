import { ref } from 'vue';

export function usePromise<T>() {
	const result = ref<T>(null);
	const loading = ref(false);
	const error = ref<unknown>(null);
	const doAsync = async (fn: () => Promise<T>) => {
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