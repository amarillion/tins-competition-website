<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { currentUserStore } from '../store/index';

onMounted(() => {
	currentUserStore.refreshCurrentUser();
});

const currentPath = computed(() => window.location.pathname);
</script>
<template>
	<p class="status" v-if="currentUserStore.username">
		You are logged in as: <b>{{currentUserStore.username}}</b> <a :href="`/accounts/logout?next=${currentPath}`" router-ignore>log out</a>
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