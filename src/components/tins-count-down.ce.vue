<script setup>
import { defineProps, onMounted, ref } from 'vue';

const props = defineProps({
	epochmillis: { type: Number, required: true },
	label: { type: String, required: true },
});

function getDeltaSec() {
	const d = new Date(props.epochmillis);
	const now = Date.now();

	const deltaSec = Math.floor((d - now) / 1000);
	return deltaSec;
}

const deltaSec = ref(0);
const numbers = ref([]);
const labels = ref([]);

function update() {
	const _deltaSec = getDeltaSec();
	if (_deltaSec < 0) return ''; // time in past is not displayed

	const sec = _deltaSec % 60;
	const min = Math.floor(_deltaSec / 60) % 60;
	const hours = Math.floor(_deltaSec / 3600) % 24;
	const days = Math.floor(_deltaSec / 86400);

	deltaSec.value = _deltaSec;

	if (days > 0) {
		numbers.value = [ days, hours ];
		labels.value = [ "days", "hours" ];
		setTimeout(() => update(), 60*60*1000);
	}
	else if (hours > 0) {
		numbers.value = [ hours, min ];
		labels.value = [ "hours", "min" ];
		setTimeout(() => update(), 60*1000);
	}
	else {
		numbers.value = [ min, sec ];
		labels.value = [ "min", "sec" ];
		setTimeout(() => update(), 1000);
	}
}

onMounted(update);
</script>

<template>
	<template v-if="deltaSec > 0">
		<div>{{label}}:</div>
		<div class="countdown">
			<div class="numbers">{{numbers[0]}}</div><div class="labels">{{labels[0]}}</div>
			<div class="numbers">{{numbers[1]}}</div><div class="labels">{{labels[1]}}</div>
		</div>
	</template>
</template>

<style>
	:host {
		display: grid;
		grid-template-columns: 1fr 1fr;
		justify-items: end;
		align-items: center;
	}

	.countdown {
		margin: 1rem 0;
		display: grid;
		grid-auto-flow: column;
		grid-template-columns: 4rem 4rem;
		grid-template-rows: 3rem 1rem;
	}

	:host([hidden]) {
		display: none;
	}

	.numbers {
		background: #ff9000;
		color: white;
		margin: 4px;
		text-align: center;
		font-size: 32px;
		box-shadow: 3px 3px 6px grey;
		border-radius: 3px;
		font-weight: bold;
	}

	.labels {
		color: grey;
		text-align: center;
	}	
</style>
