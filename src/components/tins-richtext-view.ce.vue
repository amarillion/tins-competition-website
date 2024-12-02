<script setup lang="ts">

import { renderRichText } from '../util';
import { defineProps } from 'vue';

defineProps({
	text: { type: String, required: true }
});
</script>

<template>
	<div v-html="renderRichText(text)"></div>
</template>

<style>
	:host {
		display: block; /* solves text selection issues */
	}

	a 			{ font-weight: bold; text-decoration: none; }
	a:link 		{ color: #600; }
	a:hover 	{ text-decoration: underline; }
	a:active 	{ text-decoration: underline; }

	.video-container {
		position: relative;
		width: 100%;
		padding-bottom: 56.25%;
	}

	.video {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}

	img {
		max-width: 100%;
	}

	pre {
		white-space: pre-wrap;
	}
</style>