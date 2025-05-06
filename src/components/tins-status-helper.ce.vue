<script setup lang="ts">
defineProps({
	error: { type: String },
	loading: { type: Boolean }
});
</script>

<template>
	<tins-spinner v-if="loading" class="spinner"></tins-spinner>
	<div v-else-if="error" class="error">{{ error }}</div>
	<slot v-else></slot>
</template>

<style>
:host {
	display: block; /* solves text selection issues */
}

.error {
	width: 100%;
	color: red;
}
</style>