<script setup lang="ts">
import sourceIcon from '@fortawesome/fontawesome-free/svgs/brands/osi.svg';
import windowsIcon from '@fortawesome/fontawesome-free/svgs/brands/windows.svg';
import linuxIcon from '@fortawesome/fontawesome-free/svgs/brands/linux.svg';
import macIcon from '@fortawesome/fontawesome-free/svgs/brands/apple.svg';
import downloadIcon from '@fortawesome/fontawesome-free/svgs/solid/paperclip.svg';
import { formatBytes } from '../util';
import { computed } from 'vue';

const props = defineProps({
	uploads: { type: Array, default: () => [] }
});

const getFileName = (url) => url.split('/').pop();
const formatUploadTime = (time) => Intl.DateTimeFormat("en", {
	weekday: 'short',
	hour: '2-digit',
	minute: '2-digit',
}).format(new Date(time));

const icons = {
	hasSource: sourceIcon,
	hasWindows: windowsIcon,
	hasLinux: linuxIcon,
	hasMac: macIcon,
};
const titles = {
	hasSource: 'Source included',
	hasWindows: 'Windows Binary',
	hasLinux: 'Linux Binary',
	hasMac: 'Mac Binary',
};

const preDeadline = computed(() => props.uploads.filter(u => !u.postCompo).slice(0, 4));
const postDeadline = computed(() => props.uploads.filter(u => u.postCompo).slice(0, 4));

</script>
<template>
	<div class="downloadbox">
		<table border=1 frame=void rules=rows>

			<tr v-for="upload of preDeadline" :key="upload">
				<td><tins-fa-icon :src="downloadIcon" color="gray" size="2rem"></tins-fa-icon></td>
				<td><a :href="`/upload/${upload.url}`" router-ignore>{{getFileName(upload.url)}}</a></td>
				<td>{{formatBytes(upload.size)}}</td>
				<td>{{formatUploadTime(upload.time)}}</td>
				<td><tins-fa-icon v-for="t of upload.tags.sort()" :key="t" :src="icons[t]" :title="titles[t]"></tins-fa-icon></td>
			</tr>

			<tr v-if="postDeadline.length > 0"><td colspan="5" style="background: white;"><h4>Post competition additions:</h4></td></tr>

			<tr v-for="upload of postDeadline" :key="upload">
				<td><tins-fa-icon :src="downloadIcon" color="gray" size="2rem"></tins-fa-icon></td>
				<td><a :href="`/upload/${upload.url}`" router-ignore>{{getFileName(upload.url)}}</a></td>
				<td>{{formatBytes(upload.size)}}</td>
				<td>{{formatUploadTime(upload.time)}}</td>
				<td><tins-fa-icon v-for="t of upload.tags.sort()" :key="t" :src="icons[t]" :title="titles[t]"></tins-fa-icon></td>
			</tr>

		</table>
	</div>

</template>
<style>
.downloadbox {
	background: lightgrey;
}

table {
	width: 100%;
	border-top: 1px solid black;
	border-bottom: 1px solid black;
}

</style>