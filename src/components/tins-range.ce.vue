<script lang="ts">
let instanceCounter = 0;
export default {
	data() {
		return { 
			uniqueId: undefined
		};
	},
	// can not be generated from setup function...
	created() {
		// each instantiation of a range gets a unique instance id, to
		// prevent clashes on older browsers (Seamonkey)
		this.uniqueId = ++instanceCounter;
	}
};
</script>

<script setup lang="ts">
import { defineEmits } from 'vue';

/*
 TODO
 a better way to communicate with parent components is using vue's defineModel() / v-model property,
 unfortunately this is not supported for components using defineCustomElement
 BUG: https://github.com/vuejs/core/issues/4428 not fixed as of July 2024
 */


const emit = defineEmits(['changed']);
defineProps({
	labels: { type: Array, default: () => ['1', '2', '3', '4', '5'] },
	/** Range between 1 and 5. Starts with null value. Must be non-null to be valid. */
	value: { type: Number }
});

function dispatchNewValue(newValue) {
	emit('changed', newValue);
}
</script>

<template>
	<input 
		v-for="i of [0,1,2,3,4]" 
		:key="i"
		:title="`${[labels[i]]}`" 
		@click="() => dispatchNewValue(i+1)" 
		:value="i+1" 
		type="radio" 
		:name="`range-group-${uniqueId}`"
		:checked="value === i+1"
	/>
</template>

<style>
	:host {
		display: grid;
		grid-auto-flow: column;
	}
	input[type=radio] {
		width: 1.6rem;
	}
</style>