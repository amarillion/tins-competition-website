<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
	color: { type: String, default: 'black' },
	src: { type: String, default: '' },
	size: { type: String, default: '24px' }
});

// recommended way to inject css variables in vue:
// https://stackoverflow.com/questions/42872002/in-vue-js-component-how-to-use-props-in-css/52280182#52280182
const cssProps = computed(() => {
	return {
		'--size': props.size,
		'--color': props.color,
		'--src': `url("${props.src.startsWith("data:image") ? props.src : "invalid src property, must be image data"}")`,
	};
});

</script>

<template>
	<div class="fa-icon" :style="cssProps"></div>
</template>

<style>
	:host {
		display: inline-block;
		vertical-align: sub;
		padding: 0;
		margin: 0;
	}
	div.fa-icon {
		width: var(--size);
		height: var(--size);
		background-color: var(--color);
		mask: var(--src) no-repeat center;
		-webkit-mask: var(--src) no-repeat center;
	}
</style>