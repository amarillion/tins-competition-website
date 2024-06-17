<script>

import commentIcon from '@fortawesome/fontawesome-free/svgs/regular/comment.svg';
import gamepadIcon from '@fortawesome/fontawesome-free/svgs/solid/gamepad.svg';
import reviewIcon from '@fortawesome/fontawesome-free/svgs/solid/check-to-slot.svg';
import { fetchJSONOrThrow, renderRichText } from '../util.js';
import { ref, onMounted } from 'vue';

export default {
	setup() {
		const m = window.location.pathname.match(`\/(?<compoId>[^\/]+)\/entrants\/?$`);
		const { compoId } = m.groups;
		
		const breadcrumbs = [
			{ title: compoId, url: `/${compoId}/` },
			{ title: 'entrants' },
		];

		const error = ref("");
		const loading = ref(false);
		const entrants = ref([]);

		onMounted(async () => {
			loading.value = true;
			error.value = "";
			try {
				const data = await fetchJSONOrThrow(`/api/v1/compo/${compoId}/entrants`)
				// clear loading flag AFTER awaiting data.
				loading.value = false; 
				entrants.value = data?.result;
			}
			catch (e) {
				loading.value = false;
				error.value = e.message;
				return null;
			}
		})

		return { 
			error, loading, entrants, breadcrumbs, compoId, 
			renderRichText, 
			commentIcon, gamepadIcon, reviewIcon
		};
	}
}
</script>

<template>
	<div class="breadcrumbs">
		<a href="/" router-ignore>TINS</a>
		<span v-for="a of breadcrumbs"> » 
			<a v-if="a.url" :router-ignore="a.routerIgnore" :href="a.url">{{ a.title }}</a>
			<span v-else>{{ a.title }}</span>
		</span>
	</div>

	<tins-status-helper :error="error" :loading="loading">
		<div v-if="!loading && !error">
			<h1>Entrants</h1>
			<p>
				At this moment, {{entrants.length}} people have registered for the competition.
			</p>
			<div v-for="e in entrants" class="entrant">
				<p>
					<b>Name:</b> <a :href="`/user/${e.username}`">{{e.username}}</a> <br>
					<b>From:</b> {{e.location}}
				</p>
				<p v-html="renderRichText(e.info)"></p>
				<p>
					<a :href="`/${compoId}/log/entrant/${e.entrantId}`"><tins-fa-icon :src="commentIcon"></tins-fa-icon> log ({{e.numPosts}})</a>
					<span v-if="e.numReviews > 0">&nbsp;<a router-ignore :href="`/${compoId}/reviews/entrant/${e.entrantId}`"><tins-fa-icon :src="reviewIcon"></tins-fa-icon> reviews ({{e.numReviews}})</a></span>
					<span v-if="e.entryId">&nbsp;<a :href="`/entry/${e.entryId}`"><tins-fa-icon :src="gamepadIcon"></tins-fa-icon> submission</a></span>
				</p>
			</div>
		</div>
	</tins-status-helper>
</template>

<style>
div.entrant {
	display: block;
	border-top: 1px solid black;
	line-height: 1.5rem;
}
div.entrant img {
	max-width: 100%;
}

a 			{ font-weight: bold; text-decoration: none; }
a:link 		{ color: #600; }
a:hover 	{ text-decoration: underline; }
a:active 	{ text-decoration: underline; }
</style>