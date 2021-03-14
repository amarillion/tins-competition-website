import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

export class TinsAbout extends ScopedElementsMixin(LitElement) {

	static get styles() {
		return css`
			a 			{ font-weight: bold; text-decoration: none; }
			a:link 		{ color: #600; }
			a:hover 	{ text-decoration: underline; }
			a:active 	{ text-decoration: underline; }
		`;
	}

	render() {
		return html`
	<h1>About TINS - Game Jam</h1>

	<h2>Do you have what it takes?</h2>
	<p>
	Have you always wanted to make a game? Can you never find the time? Do you start but then get distracted by other stuff? Can you never find the focus to finish something?
	</p>
	<p>
	Here is your chance! Because here is TINS, a game jam where you can match your game programming skills against other fellow game programmers all around the world. Get your ideas out, get your game played. It is intense, but it is a lot of fun!
	</p>
	<h2>What is this is all about?</h2>
	<p>
	</p>
	TINS is a 72 hour game programming competition. That means that you have to write a complete computer game <b>from scratch</b> in just one weekend! Sounds challenging, doesn't it? In fact, this is a very good way to learn a lot more about game programming. The short time span forces you to avoid needless fiddling, and really focus on what makes your game tick.
	<p>
	Here is the catch: there are a couple of <b>additional rules</b> that are not announced until the moment that the competition starts. In fact, these rules are picked at random by a device called the <i>rule-o-matic</i>, so not even the organizers know on beforehand what they are going to be. These rules may set limits on the genre of the game, require the implementation of a certain technical feat, or perhaps require something on the artistic side. You have to be prepared for anything! These extra rules are a safeguard to make sure nobody tries to cheat by working ahead before the start of the competition. One good strategy to deal with this is to plan a couple of small games that you would make, and select one of those ideas based on the additional rules.
	</p>
	<p>
	There is one other thing you should know from the start: You have to use the <a href="http://alleg.sf.net/">allegro game programming library</a>, because this event is organized by and for the allegro community.
	However, don't let this stop you if you don't know about Allegro! Allegro is really easy to learn, very flexible, and highly portable - it works on devices varying from mobile phones to the Raspberry Pi.
	Allegro itself is written in C, but you can write your game in C++, Java, Python, D, Rust, Pascal and more.
	</p>
	<p>
	There are some other <b>important rules</b>, such as a size limit and the requirement to publish source. See the rules page for each competition for details.
	</p>
	<p>
	Please let it be known that we <b>welcome newbies</b> in all shapes and sizes. Don't be put off by the challenge! Maybe you won't win, but I guarantee you'll have a lot of fun, and learn a lot too! Your game will be seen and reviewed by many members of the allegro community.
	</p>
	<p>
	The Allegro Community has a <a href="/history">long history</a> of these kind of wacky game jams. Originally there was a series of events called "Speedhack". Some people found however, that one speedhack per year is not enough. That is why TINS came into existence,
	it is basically a copy of the Speedhack event. This also explains the name: TINS is an acronym for "TINS Is Not Speedhack". It is, however, very much <i>like</i> Speedhack.
	</p>
	<p>
	Please go to the <a href="/accounts/register">registration page</a> if you want to join. Contact me at amarillion@yahoo.com if you have any questions.
	</p>
	<h2>About the organizers</h2>
	<p>
	TINS is organized by <a href="http://www.helixsoft.nl">Amarillion</a>, who has been doing this kind of thing since 2001.
	</p>
		`;
	}
}
