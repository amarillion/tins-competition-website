import { LitElement, html, css } from 'lit-element';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';

export class TinsFaq extends ScopedElementsMixin(LitElement) {

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
	<h1>FAQ</h1>

	<h3>
	I'm new to Game Jams. Do you have any tips?
	</h3>
	<p>
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
	</p>
	
	<h3>
	Can I reuse code for TINS?
	</h3>
	<p>
	Sure. Code reuse is an essential hacking skill. You can use any code that you are legally able to do so (your own, GPLed, giftware, public domain or any other Free Software licence). But it must be available for others too, see question below.
	
	</p>
	<p>
	I would ask you to indicate what changes that have been made to the code, so that I (and others) can judge your hack on it's merits.
	</p>
	<p>
		
	<h3>
	How do you differentiate between code reuse and cheating by starting early?
	</h3>
	<p>
	There have been a lot of questions about where exactly lies the border between proper re-use and cheating. 
	Therefore, the rule is:
	</p>
	<p>
	<i>You may only reuse your own code if that is available online at least two weeks before the start of the competition.
	</i>
	</p>
	<p>
	This will ensure that nobody can get a clear advantage by reusing large parts of code that they just wrote before the competition.
	Note that this rule applies to code that you wrote yourself. For libraries and tools, 
	you can simply use the latest version that's available online, no need to chase down a two-week old version.
	</p>
	
	<h3>
	Do I have to supply the source? I'm worried about people stealing my work!
	</h3>
	<p>
	I'm afraid so. It proves that it is your own work. Plus, people can also learn from it.
	</p>
	<p>
	If you are worried about people exploiting your code, then you could release it under a licence like the GPL (GNU Public Licence) that allows people to examine and play with what you have written, whilst preventing people from simply adding it to their project and not crediting you or sharing the source with other people..
	</p>
	<p>
	I recommend you explicitly attach a license to your code, so that the terms of use are clear and will remain clear in the future. You may choose yourself which license to use, for example the GPL or the more liberal allegro license.	
	</p>
	
	<h3>
	Can the competition start at a different time for me since I live many hours away from GMT?
	</h3>
	<p>
	It is just a deception that living in the GMT timezone is an advantage. 
	Everyone will get some sleep at some point, so it all works itself out. 
	Example: if the competition starts at 6AM your time and you are a nocturnal programmer, you may wake up at 11AM. 
	The competition has already started, but when night comes, you'll be able to make up the lost five hours as the early birds get 
	their sleep. The bottom line is that whoever sleeps the least gets the most time - but you'll have to balance that out yourself.
	</p>
	<p>
	It may be that your personal schedule doesn't work well with the deadlines, but that is something that you'll have to work out. 
	In any case, 72 hours is a long time, and you should be able to get at least *some* time to code.
	</p>
	
	<h3>
	Can I use other programs like utilities for graphics and sound in my entry?
	</h3>
	<p>
	Of course. You can use any package that you like to develop data, sound and graphics for your entry. You might like to point out 
	what you used as part of your entry documentation, but it isn't necessary to do so. 
	You will need to include any files that you generate (obviously) which will take up space in the zipfile that you create.
	</p>
	<p>
	You do not need to include any utility in your entry, unless it is something developed as part of your entry, is required to run your program and can be compiled from source.
	</p>
	
	<h3>
	I can't make it on the date you mention, will there be another TINS / KrampusHack later?
	</h3>
	<p>
	Yes! We've settled on a schedule for TINS and KrampusHack: TINS will be hosted somewhere in the summer each year, and KrampusHack each December.
	</p>
	
	<h3>
	One weekend is way too short!
	</h3>
	<p>
	Not true. Take a look at earlier speedhack entries and you will see that a lot of them are really complete games which are fun to play. 
	Of course you will have to limit your goals a bit because there is no way you will be able to write a Final Fantasy-like RPG 
	in just a weekend. On the other hand, most people are not able to write such a game anyway.
	</p>
	
	<h3>
	Are teams allowed?
	</h3>
	<p>
	Yes, although the registration system is not designed for this - I suggest that you all sign up
	but mention in the info field who you are going to team up with.
	</p>
	
	<h3>
	
	I've participated in TINS/KrampuHack/SH before, but I never come up with any good ideas...
	</h3>
	<p>
	Good ideas can come at the strangest moments, not necessarily when you need them most. 
	When you get an idea, write them down on a sheet of paper and keep them together on a 
	stack or in an organizer. Then when the competition starts, all you have to do is leaf 
	through them and if you've got a good set of ideas, there is bound to be one that suits 
	the additional rules without too much modification.
	</p>
	`;
	}
}
