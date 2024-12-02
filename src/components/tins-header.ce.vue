<script setup lang="ts">
</script>

<template>
	<a href="/news"><img src="../assets/tinslogo06.gif" alt="TINS Logo" /></a>
	<div><small>game jams by the <a href="http://www.allegro.cc">allegro community</a></small></div>
	<hr />
	<tins-currentuser></tins-currentuser>
</template>

<style>
	a 			{ font-weight: bold; text-decoration: none; }
	a:link 		{ color: #600; }
	a:hover 	{ text-decoration: underline; }
	a:active 	{ text-decoration: underline; }

	
	img {
		max-width: 100%;
		height: auto; 
	}
</style>