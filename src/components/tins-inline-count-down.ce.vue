<script setup lang="ts">
import { defineEmits, onMounted, ref } from 'vue';

const emit = defineEmits(['countDownZero']);

const props = defineProps<{ epochmillis: number }>();

function getDeltaSec() {
	const d = new Date(props.epochmillis);
	const now = Date.now();

	const deltaSec = Math.floor((d.valueOf() - now.valueOf()) / 1000);
	return deltaSec;
}

const deltaSec = ref(0);

onMounted(() => update());
const numbers = ref([]);
const labels = ref([]);

let waitingForZero: boolean;
function emitOnce() {
	if (waitingForZero) {
		emit('countDownZero');
		waitingForZero = false;
	}
}

function update() {
	const _deltaSec = getDeltaSec();
	deltaSec.value = _deltaSec;
	if (_deltaSec < 0) {
		emitOnce();
		return;
	}

	const sec = _deltaSec % 60;
	const min = Math.floor(_deltaSec / 60) % 60;
	const hours = Math.floor(_deltaSec / 3600) % 24;
	const days = Math.floor(_deltaSec / 86400);

	if (days > 0) {
		numbers.value = [ days, hours ];
		labels.value = [ 'days', 'hours' ];
		setTimeout(() => update(), 60*60*1000);
	}
	else if (hours > 0) {
		numbers.value = [ hours, min ];
		labels.value = [ 'hours', 'min' ];
		setTimeout(() => update(), 60*1000);
	}
	else {
		numbers.value = [ min, sec ];
		labels.value = [ 'min', 'sec' ];
		setTimeout(() => update(), 1000);
	}
}

onMounted(() => {
	// if we're already in the past at mount time, don't emit event.
	waitingForZero = getDeltaSec() > 0;
	update();
});
</script>

<template>
	<template v-if="deltaSec >= 0">
		{{ numbers[0] }} {{ labels[0] }} {{numbers[1]}} {{ labels[1] }}
	</template>
</template>

<style>
	:host {
		display: inline;
	}
</style>