<script setup lang="ts">
import { postOrThrow, fetchJSONOrThrow } from '../util';
import { usePromise } from '../usePromise.js';
import { onMounted, computed } from 'vue';

const m = window.location.pathname.match(`/(?<compoId>[^/]+)/log/edit/?$`);
const { compoId } = m.groups;

const data = usePromise();
onMounted(() => {
	data.doAsync(async() => (await fetchJSONOrThrow(`/api/v1/log/event/${compoId}/myLatest`)));
});

async function submit(formData) {
	data.doAsync(async() => {
		const raw = await postOrThrow(`/api/v1/log/event/${compoId}/myLatest`, formData);
		return await raw.json();
	});
}

const post = computed(() => data.result.value?.post );
const competition = computed(() => data.result.value?.competition );
const canPostAndAuthenticated = computed(() => data.result.value?.canPostAndAuthenticated );
</script>
<template>
	<tins-status-helper :error="data.error.value" :loading="data.loading.value">
		<template v-if="post && competition">
			<template v-if="canPostAndAuthenticated">
				<p>You are now editing your most recent post. 
					<a :href="`/${compoId}/log/`">Click here to add a new post instead</a>
				</p>
				<tins-log-form 
					:text="post.text"
					:image="post.image"
					:spoiler="post.spoiler"
					:submitCallback="(formData) => submit(formData)"
				></tins-log-form>
				<hr>
			</template>
			<table border="1" width="100%">
				<tins-log-post :post="post" :competition="competition"></tins-log-post>
			</table>
		</template>
	</tins-status-helper>
</template>
<style>
	.authorbox {
		color: grey;
	}

	.downloadbox {
		background: lightgrey;
		border: 2px dashed grey;
		padding: 10px;
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
