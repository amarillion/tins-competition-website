<script setup>
import infoIcon from '@fortawesome/fontawesome-free/svgs/solid/circle-info.svg';
import { formatBytes, IMAGE_UPLOAD_SIZE_LIMIT, markupMessage, spoilerExplanation } from '../util.js';
import { ref } from 'vue';

const props = defineProps({
	hidden: { type: Boolean, default: false },

	text: { type: String, default: '' },

	image: { type: Object, default: undefined },

	spoiler: { type: Boolean, default: false },
	
	// TODO: use event
	submitCallback: { type: Function, default: () => { console.log("WARN: submitCallback not set"); } }
});

const textRef = ref(props.text);
const formElt = ref(null);
const imgDisabled = ref(Boolean(props.image));

function submit(e) {
	e.preventDefault();
	const formData = new FormData(formElt.value);
	props.submitCallback(formData);

	// TODO: BUG! resetting form means that the form now shows old values from init time...
	formElt.value.reset(); // reset not automatic due to preventDefault...
}

function disableImage() {
	imgDisabled.value = true;
}
function enableImage() {
	imgDisabled.value = false;
}

</script>
<template>
	<form name="msglog" @submit="submit" enctype="multipart/form-data" ref="formElt">
		<div :title="markupMessage">
		Write your message (markup allowed <tins-fa-icon :src="infoIcon" color="navy" size="1rem"></tins-fa-icon>):
		</div>
		<textarea name="message" cols="40" rows="10" required id="id_message" v-model="textRef"></textarea>
		
		<div :title="spoilerExplanation">
			<label>Spoiler:
			<input type="checkbox" name="spoiler" id="id_spoiler" :checked="spoiler">
			<tins-fa-icon :src="infoIcon" color="navy" size="1rem"></tins-fa-icon>
			</label>
		</div>

		<!-- screenshot selector -->
		<div v-if="image">
			<label><input @input="disableImage" 
				type="radio" name="img_option" value="as_is" checked>Leave image as is</label><br>
			<label><input @input="disableImage" 
				type="radio" name="img_option" value="remove">Remove current image</label><br>
			<label><input @input="enableImage" 
				type="radio" name="img_option" value="add_or_replace">Replace image</label><br>
		</div>
		<input v-else type="hidden" name="img_option" value="add_or_replace">
		
		<div class="screenshot" :hidden="imgDisabled" :title="`note: screenshots should be GIF, JPG or PNG files of less than ${formatBytes(IMAGE_UPLOAD_SIZE_LIMIT)}`">
			<label>Screenshot: <tins-fa-icon :src="infoIcon" color="navy" size="1rem"></tins-fa-icon>
				<input type="file" name="screenshot" accept="image/*">
			</label>
		</div>
		<!-- end of screenshot selector-->
	
		<div style="text-align: right">
			<input class="tins-button" type="submit" name="submit" value="Submit">
		</div>
	
	</form>
</template>
<style>
	textarea {
		width: 100%;
	}

	.tins-button {
		padding: 0.5rem;
		border: 2px solid black;
		width: 8rem;
		background: #FF8;
		color: black;
	}

	.tins-button:hover {
		background: #CC0;
		transition: 0.1s
	}

	.screenshot[hidden] {
		display: none;
	}
</style>
