<script setup lang="ts">
import { onMounted } from 'vue';
import { currentEventStore } from '../store/index.js';
import { storeToRefs } from 'pinia';

const { events, error: currentEventError, loading: currentEventLoading } = storeToRefs(currentEventStore);

onMounted(() => currentEventStore.refreshCurrentEvent());
</script>
<template>
	<h2>TINS event history</h2>
	
	There have been game programming competitions on this site all the way back since 2003. 

	<tins-status-helper  :error="currentEventError" :loading="currentEventLoading">
		<div class="two-col">
		<ul>
			<li v-for="e of events" :key="e.short"><a :href="`/${e.short}/`">{{e.title}}</a></li>
		</ul>
		</div>
	</tins-status-helper>

	<p>Browse <a href="/all/entries">all games</a> ever submitted!</p>
	<iframe width="560" height="315" src="https://www.youtube.com/embed/LbHNcPQeTCk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
	<p>There are more video's, watch the <a href="https://www.youtube.com/playlist?list=PLmBvSmxxEM36slHhzQrIF3tjh-iX52M1F">complete playlist</a></p>
	<h2>Other community events</h2>
	<p>
	The allegro community has a long and rich history of wacky competitions.
	</p>
	<ul>
		<li><a href="http://www.speedhack.allegro.cc/2015/">Speedhack 2015</a></li>
		<li><a href="http://www.speedhack.allegro.cc/2014/">Speedhack 2014</a></li>
		<li><a href="http://www.speedhack.allegro.cc/2011/">Speedhack 2011</a></li>
		<li><a href="http://www.speedhack.allegro.cc/2009/">Speedhack 2009</a></li>
		<li><a href="http://www.speedhack.allegro.cc/2007/">Speedhack 2007</a></li>
		<li><a href="http://www.speedhack.allegro.cc/2006/">Speedhack 2006</a></li>
		<li><a href="http://www.speedhack.allegro.cc/2005/">Speedhack 2005</a></li>
		<li><a href="http://www.speedhack.allegro.cc/2004/">Speedhack 2004</a></li>
		<li><a href="https://web.archive.org/web/20060720222623/http://www.binarysurge.com/blitzhack/">BlitzHack 2003</a></li>
		<li><a href="http://www.speedhack.allegro.cc/2003">Speedhack 2003</a></li>
		<li><a href="http://www.speedhack.allegro.cc/2002/">SpeedHack 2002</a></li>
		<li><a href="https://web.archive.org/web/20040218222341/http://gamecode.tripod.com/sizehack3d.html">The Allegro SizeHack3D 2001</a></li>
		<li><a href="https://web.archive.org/web/20131031223551/http://amarillion.bafsoft.net/teamcompo/index.htm">The Allegro Team Competition 2001</a></li>
		<li><a href="https://web.archive.org/web/20110405080130/http://binarysurge.netfirms.com/pgc/">The Pixelate Games Competition 2001</a></li>
		<!-- Following link unfortunately dead !-->
		<li><!-- http://www.hot.ee/ideahack/ -->IdeaHack 2001</li>
		<li><a href="http://www.speedhack.allegro.cc/2001/">SpeedHack 2001</a></li>
		<li>The Allegro SizeHack 2000</li>
		<li><a href="http://www.speedhack.allegro.cc/1999/">SpeedHack 1999</a></li>
	</ul>
</template>
<style>
:host {
	display: block; /* solves text selection issues */
}

a 			{ font-weight: bold; text-decoration: none; }
a:link 		{ color: #600; }
a:hover 	{ text-decoration: underline; }
a:active 	{ text-decoration: underline; }

@media (min-width: 1024px) {
	ul {
		columns: 2;
	}
}
</style>