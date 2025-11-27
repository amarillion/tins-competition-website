<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { currentUserStore } from '../store/index';
import Cookies from 'js-cookie';

onMounted(() => {
	currentUserStore.refreshCurrentUser();
});

// being able to access the cookie proves that this code is running in the proper domain
const csrftoken = Cookies.get('csrftoken');

const currentPath = computed(() => window.location.pathname);
</script>
<template>
	<p class="status">
		<template v-if="currentUserStore.username">
			<span>You are logged in as: <b>{{currentUserStore.username}}</b></span>
			<form :action="`/accounts/logout/?next=${currentPath}`" method="post">
				<input type="hidden" name="csrfmiddlewaretoken" :value="csrftoken"/>
				<button type="submit">Log out</button>
			</form>
		</template>
		<template v-else>
			<span>Welcome, new user. Please <a :href="`/accounts/login?next=${currentPath}`" router-ignore>log in</a> or <a href="/accounts/register" router-ignore>register</a></span>
		</template>
	</p>
</template>
<style>
	.status {
		font-size: small;
		justify-content: flex-end;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		gap: 0.2em;
	}

	a 			{ font-weight: bold; text-decoration: none; }
	a:link 		{ color: #600; }
	a:hover 	{ text-decoration: underline; }
	a:active 	{ text-decoration: underline; }
</style>