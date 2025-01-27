import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCurrentUserStore = defineStore('currentUser', () => {
	
	const currentUser = ref(null);
	const timestamp = ref(0);
	const loading = ref(false);
	const error = ref(null);

	function clearCurrentUser() {
		currentUser.value = null;
		loading.value = false;
		error.value = null;
		timestamp.value = 0;
	}
	
	// TODO: consider vueUse.useFetch or similar: https://vueuse.org/core/useFetch/#intercepting-a-request
	const refreshCurrentUser = async () => {
		const ageInMinutes = (Date.now() - timestamp.value) / 1000 / 60;
		if (ageInMinutes < 15) { return; }
		
		loading.value = true;
		const response = await fetch('/api/v1/currentUser', { credentials: 'same-origin' });
		if (response.status < 200 || response.status > 299) {
			error.value = await response.text();
		}
		else {
			const data = (await response.json());
			currentUser.value = data;
			error.value = null;
		}
		loading.value = false;
	};

	
	const isLoggedIn = computed(() => currentUser.value !== null);

	return { isLoggedIn, clearCurrentUser, refreshCurrentUser, currentUser };
});
