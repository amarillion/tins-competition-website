import { expect, test } from 'vitest';
import { renderRichText } from '../src/util';

test('test linkification', () => {
	expect(
		renderRichText("Linkify this: http://www.google.com")
	).toBe(
		'<p>Linkify this: <a href="http://www.google.com">http://www.google.com</a></p>'
	);

	expect(
		renderRichText("Don't linkify this: www.google.com")
	).toBe(
		`<p>Don't linkify this: www.google.com</p>`
	);

	expect(
		renderRichText("Two paragraphs\n\nand a line\nbreak")
	).toBe(
		`<p>Two paragraphs</p><p>and a line<br>break</p>`
	);

	expect(
		renderRichText("Don't linkify something that looks like an email@example.com")
	).toBe(
		`<p>Don't linkify something that looks like an email@example.com</p>`
	);

	expect(
		renderRichText(`Ordered list: <ol><li>Apples</li><li>Pears</li><li></ol>, Unordered list: <ul><li>Red</li><li>Green</li></ul></li>`)
	).toBe(
		`<p>Ordered list: <ol><li>Apples</li><li>Pears</li><li></ol>, Unordered list: <ul><li>Red</li><li>Green</li></ul></li></p>`
	);

});