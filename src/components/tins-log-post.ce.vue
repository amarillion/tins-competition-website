<script setup lang="ts">
import invisibleIcon from '@fortawesome/fontawesome-free/svgs/solid/eye-slash.svg';
import { spoilerExplanation } from '../util';
import { computed } from 'vue';

const props = defineProps({
	post: { type: Object, required: true },
	competition: { type: Object, required: true },
	spoiler: { type: Boolean } // TODO: reflect?
});

const spoiler = computed(() => props.post.spoiler);
const formattedDate = computed(() => new Date(props.post.date).toLocaleString([], { dateStyle:'full', timeStyle: 'short'}));

</script>
<template>
	<div class="top" :id="post.id">
		<a :href="`/${competition.short}/log/entrant/${post.entrant.id}`">{{post.entrant.name}}</a>
		{{ formattedDate }}
		
		<div v-if="spoiler" class="right" :title="spoilerExplanation">&nbsp;<tins-fa-icon size="1rem" :src="invisibleIcon"></tins-fa-icon></div>
	</div>
		
	<tins-richtext-view :text="post.text"></tins-richtext-view>
		
	<img v-if="post.image" :src="`/upload/${post.image}`">
</template>
<style>
	:host {
		display: block;
		padding: 0.5rem;
	}

	.top {
		font-style: italic;
	}

	img {
		max-width: 100%;
	}

	:host([spoiler]) {
		background: #ccc;
	}

	.right {
		float: right;
	}
</style>