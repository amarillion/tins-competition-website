<script setup lang="ts">
import { fetchJSONOrThrow, IMAGE_UPLOAD_SIZE_LIMIT, postOrThrow } from '../util';
import gamepadIcon from '@fortawesome/fontawesome-free/svgs/solid/gamepad.svg';
import { computed, onMounted } from 'vue';
import { usePromise } from '../usePromise.js';

const data = usePromise();

const m = window.location.pathname.match(`/entry/(?<entryId>[^/]+)/?$`);
const { entryId } = m.groups;

onMounted(() => data.doAsync(async () => fetchJSONOrThrow(`/api/v1/entry/${entryId}/`)));

async function submitImage(value) {
	data.doAsync(async () => {
		// https://medium.com/@adamking0126/asynchronous-file-uploads-with-django-forms-b741720dc952
		let formData = new FormData();
		formData.append("image", value);
		
		const response = await postOrThrow(`/api/v1/entry/${entryId}/image`, formData);
		return response.json();
	});
}

async function submitText(unsafeText) {
	const response = await postOrThrow(
		`/api/v1/entry/${entryId}/text`, 
		JSON.stringify({ text: unsafeText })
	);
	const data = await response.json(); 
	return data.text;
}

const entry = computed(() => data.result.value || {});
const text = computed(() => data.result.value?.text || '');
const tags = computed(() => data.result.value?.tags);
const title = computed(() => data.result.value?.title || 'Untitled');
const uploads = computed(() => data.result.value?.uploads || []);
const competition = computed(() => data.result.value?.competition || {});
</script>
<template>
	<tins-status-helper :error="data.error.value" :loading="data.loading.value">
		<template v-if="!data.loading.value">
			<div class="floatright">
				<img v-for="t of tags" :key="t" :src="`/upload/${t.icon}`" :title="`${t.desc}`"/>
			</div>

			<h1><tins-fa-icon :src="gamepadIcon" size="2rem"></tins-fa-icon> {{title}}</h1>
			
			<div class="authorbox">
				Event: <a :href="`/${competition.short}`" router-ignore>{{competition.title}}</a><br>
				<div v-if="entry.editable" class="floatright"><a :href="`/${competition.short}/team`">Manage Team</a></div>
				Game by:
				<span v-for="e of entry.entrants" :key="e.id">
					{{e.name}} <a :href='`${competition.short}/log/entrant/${e.id}`'>log ({{entry.logCounts[e.id]}})</a>&nbsp;
				</span>
			</div>

			<!-- TODO: test!-->
			<p v-if="entry.editable && !competition.afterEnd && competition.afterStart">
				<a :href="`/${competition.short}/upload`" router-ignore>Upload your entry!</a> Time remaining: <tins-inline-count-down :epochMillis="competition.competitionEnd"></tins-inline-count-down>
			</p>

			<img v-if="entry.imagefile" :src="`/upload/${entry.imagefile}`"/>
			<hr v-else>

			<tins-image-upload v-if="entry.editable"
				:submitCallback="submitImage" 
				:size-limit="IMAGE_UPLOAD_SIZE_LIMIT">
			</tins-image-upload>

			<p>
				<tins-richtext class="richtext" 
					:submitCallback="submitText" 
					:readOnly="!entry.editable" 
					:text="text">
				</tins-richtext>
			</p>

			<template v-if="uploads && uploads.length > 0">
				<h3>Uploaded files:</h3>
				<tins-entry-download-box :uploads="uploads"></tins-entry-download-box>
			</template>
	
			<p>
				<a :href="`/${competition.short}/reviews/entry/${entryId}/`" router-ignore>Reviews ({{entry.reviewCount}})</a>
			</p>
		</template>
	</tins-status-helper>
</template>
<style>
	a 			{ font-weight: bold; text-decoration: none; }
	a:link 		{ color: #600; }
	a:hover 	{ text-decoration: underline; }
	a:active 	{ text-decoration: underline; }

	.authorbox {
		color: grey;
		margin-bottom: 1rem;
	}

	.edit-image {
		width: 100%;
		background: lightgrey;
	}

	.floatright {
		float: right;
	}

	.color {
		width: 100%;
		background: red;
	}

	.richtext {
		width: 100%;
	}

	img {
		max-width: 100%;
	}

</style>
