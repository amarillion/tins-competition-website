<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(defineProps<{
	readOnly?: boolean,
	placeholder?: string,
	text?: string,
	submitCallback?: Function,
}>(), {
	readOnly: false,
	placeholder: '(no description)',

	text: '',
	// TODO: replace with event
	submitCallback: () => { console.log("WARN: submitCallback not set"); },
});

const loading = ref(false);
const error = ref('');
const editMode = ref(false);

/** text provided by attribute must be safe */
const safeText = ref<string>(props.text);
const unsafeText = ref<string>(props.text);
watch(() => props.text, (value: string) => {
	safeText.value = value;
	unsafeText.value = value;
});

async function clickSave() {
	try {
		loading.value = true;
		error.value = '';
		
		// text processed on server side before it's considered safe 
		safeText.value = await props.submitCallback(unsafeText.value);
		loading.value = false;
		editMode.value = false;
	}
	catch(e) {
		console.log(e);
		loading.value = false;
		editMode.value = true;
		error.value = e.toString();
	}
}

function clickCancel() {
	// discard edited text
	unsafeText.value = safeText.value;
	loading.value = false;
	editMode.value = false;
}

function clickEdit() {
	if (!props.readOnly) {
		editMode.value = true;
	}
}
</script>
<template>
	<template v-if="loading">
		<tins-spinner class="spinner editor"></tins-spinner>
	</template>
	<template v-else>
		<template v-if="editMode">
			<div v-if="error" class="error">{{ error }}</div>
			<div class="buttons">
				<button @click="clickSave">Save</button>
				<button @click="clickCancel">Cancel</button>
			</div>
			<textarea class="editor" v-model="unsafeText"></textarea>
		</template>
		<template v-else>
			<div v-if="!readOnly" class="buttons"><button @click="clickEdit">Edit</button></div>
			<tins-richtext-view :text="`${safeText || `<i>${placeholder}</i>`}`"></tins-richtext-view>
		</template>
	</template>
</template>
<style lang="css">
	:host {
		display: block;
		min-height: 3rem;
	}

	.buttons {
		float: right;
	}

	button {
		padding: 0.5rem;
		border: 2px solid black;
		width: 4rem;
		background: #FF8;
		color: black;
	}

	button:hover {
		background: #CC0;
		transition: 0.1s
	}

	.error {
		width: 100%;
		color: red;
	}

	.editor {
		min-height: 20rem;
	}

	textarea {
		width: 100%;
	}
</style>
