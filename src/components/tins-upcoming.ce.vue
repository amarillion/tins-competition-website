<script setup>
import twitterIcon from '@fortawesome/fontawesome-free/svgs/brands/twitter.svg';
import discordIcon from '@fortawesome/fontawesome-free/svgs/brands/discord.svg';

import { defineProps } from 'vue';

defineProps({
	upcoming: {
		type: Array,
		required: true
	}
});
</script>
<template>
	<div v-if="upcoming && upcoming.length > 0">
		<h1>Coming up</h1>
		<p><i>Mark these events in your calendar!</i></p>
			<div v-for="u of upcoming"><b>{{u.dateStr}}</b> <span>{{u.title}}</span><br></div>
		<hr>
		Stay informed! <a href="https://groups.google.com/d/forum/tinscompetition">join our google group</a><br> 
		<tins-fa-icon :src="discordIcon" size="1rem"></tins-fa-icon> <a href="https://discord.gg/7uK6jNtNX9">our Discord server</a><br>
		<tins-fa-icon :src="twitterIcon" size="1rem"></tins-fa-icon> <a href="https://twitter.com/mpvaniersel">@mpvaniersel</a>
	</div>
</template>
<style>
	:host {
		display: block;
		border: 2px dashed grey;
		padding: 10px;
		color: black;
		background: lightgrey;
	}

	:host([hidden]) {
		display: none;
	}

	h1 {
		margin: 0;
		color: teal;
	}

	a        { font-weight: bold; text-decoration: none; }
	a:link   { color: #600; }
	a:hover  { text-decoration: underline; }
	a:active { text-decoration: underline; }
</style>