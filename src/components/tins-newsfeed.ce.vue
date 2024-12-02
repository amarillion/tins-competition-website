<script setup lang="ts">
import { fetchJSONOrThrow } from '../util';
import { defineProps, onMounted, computed } from 'vue';
import { usePromise } from '../usePromise.js';

const props = defineProps({
	newsId: { type: Number, required: false }
});

const data = usePromise();
onMounted(() => {
	data.doAsync(async() => {
		const url  = props.newsId ? `/api/v1/news/${props.newsId}` : '/api/v1/news';
		return fetchJSONOrThrow(url);
	});
});


const posts = computed(() => data.result.value?.posts);

function formatPostDate(date: number) {
	const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' });
	const [{ value: month },,{ value: day },,{ value: year }] = dateTimeFormat.formatToParts(new Date(date));
	return `${day} ${month} ${year}`;
}

</script>
<template>
	<h1>News 123</h1>

	<div v-for="p of posts" :key="p">
		<br />
		<div class="header">
			{{ formatPostDate(p.date) }}
		</div>
		<div class="window">
			<tins-richtext-view :text="p.text"></tins-richtext-view>
			<img v-if="p.img" :src='`/upload/${p.img}`'/>
		</div>
	</div>

</template>
<style>
	a 			{ font-weight: bold; text-decoration: none; }
	a:link 		{ color: #600; }
	a:visited 	{	}
	a:hover 	{ text-decoration: underline; }
	a:active 	{ text-decoration: underline; }

	div.message {
		background: #88FF88;
		padding-top: 10px;
		padding-bottom: 10px;
		border-top: 1px solid black;
		border-bottom: 1px solid black;
	}

	div.window {
		display: block;
		border-style: solid;
		border-color: #000000;
		background: #ffffff;
		padding: 10px;
		border-width: 1px;
		line-height: 24px;
	}
	div.window img {
		max-width: 100%;
	}
	div.header {
		display: block;
		border-style: solid;
		border-color: #000000;
		background: #c0c0c0;
		padding: 5px;
		border-width: 1px 1px 0 1px;
		font-weight: bold;
	}
	pre {
		white-space: pre-wrap;
	}
	h1 {
		margin: 0;
	}
</style>