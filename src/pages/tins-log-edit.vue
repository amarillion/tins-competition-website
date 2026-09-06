<script setup lang="ts">
import { postOrThrow, fetchJSONOrThrow } from '../util.js';
import { usePromise } from '../usePromise.js';
import { computed, watch } from 'vue';

const props = defineProps<{ compoId: string }>();
const compoId = computed(() => props.compoId);

type MyLatestType = {
	post: { text: string, image: unknown, spoiler: unknown },
	competition: unknown,
	canPostAndAuthenticated: unknown
};

const data = usePromise<MyLatestType>();
watch(compoId, () => {
	data.doAsync(async() => (await fetchJSONOrThrow(`/api/v1/log/event/${compoId.value}/myLatest`)));
}, { immediate: true });

async function submit(formData: FormData) {
	data.doAsync(async() => {
		const raw = await postOrThrow(`/api/v1/log/event/${compoId.value}/myLatest`, formData);
		return await raw.json();
	});
}

const post = computed(() => data.result.value?.post );
const competition = computed(() => data.result.value?.competition );
const canPostAndAuthenticated = computed(() => data.result.value?.canPostAndAuthenticated );
</script>
<template>
	<div class="tins-log-edit">
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
						:submitCallback="(formData: FormData) => submit(formData)"
					></tins-log-form>
					<hr>
				</template>
				<table border="1" width="100%">
					<tins-log-post :post="post" :competition="competition"></tins-log-post>
				</table>
			</template>
		</tins-status-helper>
	</div>
</template>
<style scoped>
	.tins-log-edit .authorbox {
		color: grey;
	}

	.tins-log-edit .downloadbox {
		background: lightgrey;
		border: 2px dashed grey;
		padding: 10px;
	}

	.tins-log-edit .edit-image {
		width: 100%;
		background: lightgrey;
	}

	.tins-log-edit .floatright {
		float: right;
	}

	.tins-log-edit .color {
		width: 100%;
		background: red;
	}

	.tins-log-edit .richtext {
		width: 100%;
	}

	.tins-log-edit :deep(img) {
		max-width: 100%;
	}
</style>
