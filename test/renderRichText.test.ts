import { expect, test } from 'vitest';
import { renderRichText } from '../src/util.js';

test('test linkification and youtube videos', () => {
	expect(
		renderRichText('Linkify this: http://www.google.com')
	).toBe(
		'<p>Linkify this: <a href="http://www.google.com">http://www.google.com</a></p>'
	);

	expect(
		renderRichText("Don't linkify this: www.google.com")
	).toBe(
		'<p>Don\'t linkify this: www.google.com</p>'
	);

	expect(
		renderRichText('Two paragraphs\n\nand a line\nbreak')
	).toBe(
		'<p>Two paragraphs</p><p>and a line<br>break</p>'
	);

	expect(
		renderRichText("Don't linkify something that looks like an email@example.com")
	).toBe(
		'<p>Don\'t linkify something that looks like an email@example.com</p>'
	);

	expect(
		renderRichText('Ordered list: <ol><li>Apples</li><li>Pears</li><li></ol>, Unordered list: <ul><li>Red</li><li>Green</li></ul></li>')
	).toBe(
		'<p>Ordered list: <ol><li>Apples</li><li>Pears</li><li></ol>, Unordered list: <ul><li>Red</li><li>Green</li></ul></li></p>'
	);

	// youtube link by itself will be converted to embedded video
	expect(
		renderRichText('\nhttps://www.youtube.com/watch?v=T-YczcgExS0\n')
	).toBe(
		'<p><br><div class="video-container"><iframe class="video" src="https://www.youtube.com/embed/T-YczcgExS0" allowfullscreen=""></iframe><br /></div><br></p>'
	);

	// youtube video as a link will remain a link
	expect(
		renderRichText('<a href="https://www.youtube.com/watch?v=T-YczcgExS0">Link to youtube</a>')
	).toBe(
		'<p><a href="https://www.youtube.com/watch?v=T-YczcgExS0">Link to youtube</a></p>'
	);
});
