<script setup>

import { defineProps, defineEmits, onMounted, ref, computed } from 'vue';

const props = defineProps({
	epochmillis: { type: Number, required: true },
});

const emit = defineEmits(['countdownZero'])

function getDeltaSec() {
	const d = new Date(props.epochmillis);
	const now = Date.now();

	const deltaSec = Math.floor((d - now) / 1000);
	return deltaSec;
}

const deltaSec = ref(0);

let zeroEventSent = false;

function update() {
	deltaSec.value = getDeltaSec();
}

onMounted(() => update());

const message = computed(() => {
	
	// TODO: side-effect in computed function is not desirable...
	if (deltaSec.value < 0) {
		if (!zeroEventSent) {
			emit('countdownZero');
			zeroEventSent = true;
		}
		return '0 min 0 sec'; // timer just stays at 0
	}

	const sec = deltaSec.value % 60;
	const min = Math.floor(deltaSec.value / 60) % 60;
	const hours = Math.floor(deltaSec.value / 3600) % 24;
	const days = Math.floor(deltaSec.value / 86400);

	let numbers, labels;
	if (days > 0) {
		numbers = [ days, hours ];
		labels = [ "days", "hours" ];
		setTimeout(update, 60*60*1000);
	}
	else if (hours > 0) {
		numbers = [ hours, min ];
		labels = [ "hours", "min" ];
		setTimeout(update, 60*1000);
	}
	else {
		numbers = [ min, sec ];
		labels = [ "min", "sec" ];
		setTimeout(update, 1000);
	}
	
	return `${numbers[0]} ${labels[0]} ${numbers[1]} ${labels[1]}`
});

</script>

<template>{{ message }}</template>

<style>
	:host {
		display: inline;
	}
</style>