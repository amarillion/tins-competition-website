import { LitElement, html, css } from 'lit';
import { repeat } from 'lit-html/directives/repeat.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

const FAQ = [
	{
		question: "Q: What communication channels are there for TINS?",
		answer: `<p>
	To stay up-to-date with the latest news, or get to know the other participants, use one of the following communication channels:
	</p>
	<ul>
	<li>Join the <a href="https://discord.gg/7uK6jNtNX9">TINS Discord server</a>. Hang out, chat, ask questions.
	<li>Or visit the <a href="https://web.libera.chat/#allegro">#allegro</a> channel on Libera IRC. Hang out and chat, old-school style.
	<li>Sign up for our <a href="https://groups.google.com/forum/#!forum/tinscompetition">Google group</a> to receive important announcements by e-mail.
	<li>Post on the <a href="https://allegro.cc/forums/">Allegro.cc forums</a> to share your game, and get more feedback from a community of enthusiasts.
	</ul>`
	}, {
		question: "Q: I'm new to Game Jams. Do you have any tips?",
		answer: `<p>
	Sure! First of all:
	</p><p>
		<b>
		Start small.
		</b><br>
		If you've never done this before it may be hard to guess how much you can achieve in one weekend. However, it will always be less than you think. 
	</p><p>
		<b>
		Don't be over-ambitious, because you don't need to be.
		</b><br>
		Entries are usually not judged on how ambitious the game is, but more on how well the details are worked out. A platformer with 100 levels won't get a high score if they all look the same. A small arcade game that is fun, well-balanced, with eye for detail will get more credit.
	</p><p>
		<b>
		Make some plans.
		</b><br>
		The only problem is that you don't know what the rules are going to be, and possibly your plan won't fit with the rules. Therefore you need to have a bunch of ideas laying around. It is probably good to work out maybe three very different types of games on a sheet of paper. Then as soon as the additional rules are announced you can select the idea that fits the best (possibly modifying it slightly to fit even better).
	</p>`
	}, {
		question: "Q: Can I reuse code for TINS?",
		answer: `<p>
	Sure. Code reuse is an essential hacking skill. You can use any code that you are legally able to do so (your own, GPLed, giftware, public domain or any other Free Software licence). But, to ensure a level playing field and help newbies, we have an additional requirement:
	</p>
	<p>
	<i>You may only reuse your own code if it is publicly available before the start of the competition.</i>
	</p>
	<p>
	A simple way to adhere to this rule is to open a github repo, and stick all the code that you want to reuse on there.
	</p>
	<p>
	If you re-use a lot of code, I would ask you to indicate what changes that have been made, so that everyone can judge your hack on its merits.
	</p>
	`
	}, {
		question: "Q: Do I have to supply the source? I'm worried about people stealing my work!",
		answer: `<p>
	I'm afraid so. It proves that it is your own work. Plus, people can also learn from it.
	</p>
	<p>
	If you are worried about people exploiting your code, then you could release it under a licence like the GPL (GNU Public Licence) that allows people to examine and play with what you have written, whilst preventing people from simply adding it to their project and not crediting you or sharing the source with other people..
	</p>
	<p>
	I recommend you explicitly attach a license to your code, so that the terms of use are clear and will remain clear in the future. You may choose yourself which license to use, for example the GPL or the more liberal allegro license.	
	</p>`
	}, {
		question: "Q: I'm using Unity. How do I share my sources? My project folder is huge!",
		answer: `A basic solution for sharing sources of a Unity project, 
		you can share the files that are left over after excluding files listed in this <a href="https://github.com/github/gitignore/blob/master/Unity.gitignore">Unity .gitignore</a>. 
		That should give you all the files you need to recover the project (with minimal junk), 
		assuming that one has the correct version of the Unity editor installed.`
	}, {
		question: "Q: How do I review games if I only get the source code? Am I expected to compile all entries from scratch?",
		answer: `
	<p>
	Most entrants do provide binaries. It's in their own interest to make the game easy to play! Even if not, the community shares the load. 
	We usually put together a "binary pack", so you can install &amp; play all the games from a single convenient zip file.
	</p>`
	}, {
		question: "Q: Can the competition start at a different time for me since I live many hours away from GMT?",
		answer: `<p>
	It is just a deception that living in the GMT timezone is an advantage. 
	Everyone will get some sleep at some point, so it all works itself out. 
	Example: if the competition starts at 6AM your time and you are a nocturnal programmer, you may wake up at 11AM. 
	The competition has already started, but when night comes, you'll be able to make up the lost five hours as the early birds get 
	their sleep. The bottom line is that whoever sleeps the least gets the most time - but you'll have to balance that out yourself.
	</p>
	<p>
	It may be that your personal schedule doesn't work well with the deadlines, but that is something that you'll have to work out. 
	In any case, 72 hours is a long time, and you should be able to get at least *some* time to code.
	</p>`
	}, {
		question: "Q: Can I use other programs like utilities for graphics and sound in my entry?",
		answer: `<p>
	Of course. You can use any package that you like to develop data, sound and graphics for your entry. You might like to point out 
	what you used as part of your entry documentation, but it isn't necessary to do so. 
	You will need to include any files that you generate (obviously) which will take up space in the zipfile that you create.
	</p>
	<p>
	You do not need to include any utility in your entry, unless it is something developed as part of your entry, is required to run your program and can be compiled from source.
	</p>`
	}, {
		question: "Q: I can't make it on the date you mention, will there be another TINS / KrampusHack later?",
		answer: `<p>
	Yes! We've settled on a schedule for TINS and KrampusHack: TINS will be hosted somewhere in the summer each year, and KrampusHack each December.
	</p>`
	}, {
		question: "Q: One weekend is way too short!",
		answer: `
	<p>
	Not true. Take a look at earlier speedhack entries and you will see that a lot of them are really complete games which are fun to play. 
	Of course you will have to limit your goals a bit because there is no way you will be able to write a Final Fantasy-like RPG 
	in just a weekend. On the other hand, most people are not able to write such a game anyway.
	</p>`
	}, {
		question: "Q: Are teams allowed?",
		answer: `<p>
	Yes! I recommend that all team members register and join the competition.
	Once the competition start, you can find a team management button on your entry page.
	</p>`
	}, {
		question: "Q: I've participated in TINS/KrampuHack/SpeedHack before, but I never come up with any good ideas...",
		answer: `<p>
	Good ideas can come at the strangest moments, not necessarily when you need them most. 
	When you get an idea, write them down on a sheet of paper and keep them together on a 
	stack or in an organizer. Then when the competition starts, all you have to do is leaf 
	through them and if you've got a good set of ideas, there is bound to be one that suits 
	the additional rules without too much modification.
	</p>`
	}, 
];

export class TinsFaq extends ScopedElementsMixin(LitElement) {

	render() {
		return html`
	<h1>Frequently Asked Questions</h1>
	${repeat(FAQ, f => html`<h3>${f.question}</h3>${unsafeHTML(f.answer)}`)};
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
