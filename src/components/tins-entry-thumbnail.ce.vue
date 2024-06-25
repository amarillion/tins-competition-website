<script>
export default {
	props: {
		entry: { type: Object, required: true },
		footer: { type: String, required: true }
	}
}
</script>

<template>
	<div class="top">{{entry.title}}</div>
	<img v-if="entry.thumbnail" :src="`/upload/${entry.thumbnail}`">
	<img v-else src="../assets/no-screenshot-plain.svg">
	<div class="bottom">{{footer}}</div>
</template>

<style>
:host {
	display: block;
	width: 320px;
	height: 248px;
	margin: 0.5rem;
	position: relative;
	background: #444;
	color: white;
	font-size: 16px;
}

.top {
	position: absolute;
	top: 2px;
	left: 8px;
}

.bottom {
	position: absolute;
	bottom: 2px;
	right: 8px;
	text-align: right;
}

img {
	max-width: 100%;
	position: absolute;
	left: 0px;
	top: 24px;
}
</style>