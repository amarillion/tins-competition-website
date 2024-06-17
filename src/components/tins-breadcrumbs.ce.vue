<script>
export default {
	props: {
		data: Array
	}
}
</script>

<template>
	<a href="/" router-ignore>TINS</a>
	<span v-for="a of data"> » 
		<a v-if="a.url" :router-ignore="a.routerIgnore" :href="a.url">{{ a.title }}</a>
		<span v-else>{{ a.title }}</span>
	</span>
</template>

<style>
a 			{ font-weight: bold; text-decoration: none; }
a:link 		{ color: #600; }
a:hover 	{ text-decoration: underline; }
a:active 	{ text-decoration: underline; }
</style>