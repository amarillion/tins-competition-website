import { LitElement, html, css } from 'lit';
import twitterIcon from '@fortawesome/fontawesome-free/svgs/brands/twitter.svg';
import emailIcon from '@fortawesome/fontawesome-free/svgs/solid/envelope.svg';
import { TinsFaIcon } from '../components/tins-fa-icon.js';

export class TinsAbout extends LitElement {

	render() {
		return html`
	<h1>About this site...</h1>
	<p>
	This site is the home of two online Game Jams: <b>TINS</b> and <b>KrampusHack</b>. 
	TINS is a speedhack, where you make a game in 72 hours. KrampusHack is a more relaxed game jam where you make a gift for somebody else, secret-santa style.
	These game jams orginated in the <a href="https://www.allegro.cc">Allegro community</a>, but you may use any engine or programming framework you like.
	</p>
	<h2>About TINS</h2>
	<p>
	TINS is a 72 hour game programming competition. That means that you have to write a complete computer game <b>from scratch</b> in 
	just one weekend! Sounds challenging, doesn't it? 
	</p><p>
	But wait, there is more! Right at the start of the competition, <b>additional rules</b> will be announced. 
	These rules are picked at random by the <i>rule-o-matic</i>., and they may set limits on the genre of the game, 
	require the implementation of a certain technical feat, or perhaps require 
	something artistic addition. You have to be prepared for anything!
	</p><p>
	These extra rules always lead to a lot of creativity, see for example some of the submissions we got in 2020 in this video:
	</p>
	<iframe width="560" height="315" 
		src="https://www.youtube.com/embed/3yR10fjSDtU" 
		title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
	</iframe>
	<p>
	There are some other <b>important rules</b>, such as the requirement to publish source. See the rules page for each competition for details. TINS is held every year in the summer.
	</p><p>
	We <b>welcome newbies</b> in all shapes and sizes. Don't be put off by the challenge! Maybe you won't win, but I guarantee you'll have a lot of fun, 
	and learn a lot too! Your game will be seen and reviewed by members of the community. 
	</p><p>
	The Allegro Community has a <a href="/history">long history</a> of these kind of wacky game jams. Originally there was a series of events called "Speedhack". Some people found however, that one speedhack per year is not enough. That is why TINS came into existence,
	it is basically a copy of the Speedhack event. This also explains the name: TINS is an acronym for "TINS Is Not Speedhack". It is, however, very much <i>like</i> Speedhack.
	</p>
	
	<h2>About KrampusHack</h2>
	<p>
	KrampusHack works like a secret santa. During KrampusHack, each participant posts a wishlist of what they like to see in a game. 
	At the start of the competition, you are assigned a random person and you have to make a game just for them, based on their wishlist.
	</p>
	<p>
	Where TINS is a challenge of leet hacking skills, KrampusHack is much more relaxed. You get more time, there are fewer restrictions, and there is no voting, It's just a chance to hang out, 
	have fun, be creative and do something nice for the community.
	<h2>About the organizers</h2>
	<p>
	TINS is organized by <a href="http://www.helixsoft.nl">Amarillion</a>, who has been doing this kind of thing since 2001. 
	Contact me: <tins-fa-icon src="${emailIcon}" size="1rem"></tins-fa-icon> amarillion@yahoo.com or <tins-fa-icon src="${twitterIcon}" size="1rem"></tins-fa-icon> <a href="https://twitter.com/mpvaniersel">@mpvaniersel</a>
	</p>
	
		`;
	}

	static get styles() {
		return css`
			:host {
				display: block; // solves text selection issues
			}
			a 			{ font-weight: bold; text-decoration: none; }
			a:link 		{ color: #600; }
			a:hover 	{ text-decoration: underline; }
			a:active 	{ text-decoration: underline; }
		`;
	}

}
