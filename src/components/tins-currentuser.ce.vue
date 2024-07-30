<script setup>
import { subscribe, dispatch } from '../store.js';
import { currentUserSelector, refreshCurrentUser } from '../data/currentUser.js';
import { ref, onMounted, onUnmounted, computed } from 'vue';

const username = ref("");
let subscriptions;

onMounted(() => {
	subscriptions = [
		subscribe(currentUserSelector, val => { username.value = val; })
	];
	
	dispatch(refreshCurrentUser());
});

onUnmounted(() => {
	subscriptions.forEach(unsub => unsub());
});

const currentPath = computed(() => window.location.pathname);

</script>
<template>
	<p class="status" v-if="username">
		You are logged in as: <b>{{username}}</b> <a :href="`/accounts/logout?next=${currentPath}`" router-ignore>log out</a>
	</p>
	<p class="status" v-else>
		Welcome, new user. Please <a :href="`/accounts/login?next=${currentPath}`" router-ignore>log in</a> or <a href="/accounts/register" router-ignore>register</a>
	</p>
</template>
<style>
	.status {
		font-size: small;
		text-align: right;
	}

	a 			{ font-weight: bold; text-decoration: none; }
	a:link 		{ color: #600; }
	a:hover 	{ text-decoration: underline; }
	a:active 	{ text-decoration: underline; }
</style>