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
	I'm new to this. Do you have any tips?
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
	
		Entries are usually not judged on how ambitious the game is, but more on how well the details are worked out. A platformer with 100 levels won't get a high score if you didn't have time to design more than 4 different tiles. A small arcade game that is fun, well-balanced, with eye for detail will get more credit.
	</p><p>
		<b>
		Make some plans.
		</b><br>
		Nothing in the rules says that it is not allowed to work out a couple of ideas for the competition. The only problem is that you don't know what the rules are going to be, and possibly your idea won't fit with the rules. Therefore you need to have a couple of ideas laying around. It is probably good to work out maybe three very different types of games on a sheet of paper. Then as soon as the additional rules are announced you can select the idea that fits the best (possibly modifying it slightly to fit even better).
	</p>
	
	<h3>
	Can I reuse code for the Speedhack?
	</h3>
	<p>
	Sure. Code reuse is an essential hacking skill. You can use any code that you are legally able to do so (your own, GPLed, giftware, public domain or any other Free Software licence). But it must be available for others too, see question below.
	
	</p>
	<p>
	I would ask you to indicate what changes that have been made to the code, so that I (and others) can judge your hack on it's merits.
	</p>
	<p>
	
	<h3>
	Can't I write a single line of code before the competition starts?
	</h3>
	<p>
	No, not a single line of code, so all entrants will have exactly the same amount of time available. 
	One weekend is a very short timespan and an extra day of coding will give you a great advantage. 
	</p>
	
	<h3>
	How do you differentiate between code reuse and cheating by starting early?
	</h3>
	<p>
	
	First of all, this competition is all in good faith. There is no money to be won, it is all just about having fun. 
	I trust everybody to be able to distinguisth between fair competition and cheating by their own conscience.
	</p>
	<p>
	There have been a lot of questions lately about where exactly lies the border between proper re-use and cheating. 
	Therefore, the rule is:
	</p>
	<p>
	<i>You may only reuse your own code if that is available online at least two weeks before the start of the competition.
	</i>
	</p>
	<p>
	This will insure that nobody can get a clear advantage by reusing large parts of code that they just wrote before the competition.
	Note that this rules applies to code that you wrote yourself: of course, in case there are new 
	releases to currently existing libraries (e.g. the ones on the allegro.cc libraries section) within those 2 weeks, 
	you may use those anyway.
	</p>
	
	<h3>
	A 400 kb zipfile is not enough!
	</h3>
	<p>
	
	Seriously though, for a weekend's work, you are not likely to fill the entire 
	file with code. The compression rate is around 50% - so you have approximately 800 KB to play with.
	</p>
	<p>
	If space is short for graphics and sound, then look into otherways of producing them. Dynamic generation such as plasmas and fractal music need no space apart from the code. Use the opportunity to try new things. This is after all, a hacking competition!
	</p>
	
	<h3>
	Do I have to supply the source? I'm worried about people stealing my work!
	</h3>
	<p>
	I'm afraid so. You have insufficient space to supply a statically linked binary, so you need to supply the source only with the data for the program. It also shows that it is your own work, and people can also learn from it.
	</p>
	<p>
	If you are worried about people exploiting your code, then you could release it under a licence like the GPL (GNU Public Licence) that allows people to examine and play with what you have written, whilst preventing people from simply adding it to their project and not crediting you or sharing the source with other people..
	</p>
	<p>
	I recommend you explicitly attach a license to your code, so that the terms of use are clear and will remain clear in the future. You may choose yourself which license to use, for example the GPL or the more liberal allegro license.
	
	</p>
	
	<h3>
	Can the competition start at a different time for me since I live many hours away from UTC?
	</h3>
	<p>
	It is just a deception that living in the UTC timezone is an advantage. 
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
	Can
	I use other programs like utilities for graphics and sound in my entry?
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
	What about add-on libraries and other helper code? What if the website that I got it from no longer exists?
	</h3>
	<p>
	Libraries, add-ons and public domain code that is self contained (compiled independently from your code) does not need to be included. 
	I am assuming that the code is freely available from a website, and you will need to supply a web address where it can be downloaded. 
	if the website no longer exists (as sites are created and vanish all the time) then you should upload the version that you used onto 
	your own website so that I can compile the code to check it. I have no desire to trawl the internet looking for add-ons as 
	I have enough to do..! :) 
	</p>
	
	<h3>
	I can't make it on the date you mention, will there be another TINS later?
	</h3>
	<p>
	It is likely that there will be another TINS in the future. And then there is also still the original Speedhack, 
	that is held more or less every year.
	
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
	
	I've participated in TINS/SH before, but I never come up with any good ideas...
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
