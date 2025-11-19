<script setup lang="ts">
import calendarIcon from '@fortawesome/fontawesome-free/svgs/solid/calendar.svg';
import discordIcon from '@fortawesome/fontawesome-free/svgs/brands/discord.svg';
import type { UpcomingType } from '../store/currentEvent';

defineProps<{ upcoming: UpcomingType[] }>();
</script>
<template>
	<div v-if="upcoming && upcoming.length > 0">
		<h1>Coming up</h1>
		<p><i>Mark these events in your calendar!</i></p>
			<div v-for="u of upcoming" :key="u.title"><b>{{u.dateStr}}</b> <span>{{u.title}}</span><br></div>
		<hr>
		Stay informed! <br>
		<a href="https://groups.google.com/d/forum/tinscompetition">Join the Google Group</a><br>
		<tins-fa-icon class="icon" :src="calendarIcon" size="1rem"></tins-fa-icon> <a href="/calendar.ics" router-ignore>Import Calendar.ics</a><br>
		<tins-fa-icon :src="discordIcon" size="1rem"></tins-fa-icon> <a href="https://discord.gg/7uK6jNtNX9">Chat on Discord</a><br>
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