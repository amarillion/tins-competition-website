<script setup lang="ts">
import { formatBytes } from '../util';
import { defineProps, ref } from 'vue';

const props = defineProps({
	sizeLimit: { type: Number, default: 0 },
	label: { type: String, default: 'Upload image' },

	//TODO: use event
	submitCallback: { type: Function, default: () => { console.log("WARN: submitCallback not set"); } },
});

const error = ref('');
const imageUploadElt = ref(null);
async function upload() {
	const fileNum = imageUploadElt.value.files.length;
	if (fileNum != 1) {
		error.value = `Internal error. Expected 1 file, but got ${fileNum}`;
		return;
	}

	let myImage = imageUploadElt.value.files[0];
	if (myImage.size > props.sizeLimit) {
		error.value = `Error: File too large! Received: ${formatBytes(myImage.size)}, maximum: ${formatBytes(props.sizeLimit)}`;
		return;
	}
	
	try {
		error.value = "";
		await props.submitCallback(myImage);
	}
	catch (e) {
		error.value = e.toString();
	}
}
</script>
<template>
	<label>{{ label }}
		<input ref="imageUploadElt"
			type="file" 
			accept="image/*,video/webm"
			@change="upload"/>
		<div v-if="error" class="error">{{ error }}</div>
	</label>
</template>
<style>
	:host {
		display: block;
		border: 2px dashed grey;
		padding: 10px;
		color: black;
		background: lightgrey;
	}

	.error {
		color: red;
	}
</style>