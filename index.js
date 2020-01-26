// imports
const Defs = require("./style-definitions.js");

// consts
const SPLIT_REGEX = /(<\/?[^>]+>)/;


function applyHtmlStyles (text, styleRanges) {
	// make a copy of the original styleRanges
	const copiedRanges = styleRanges.slice(0);

	// when no style ranges are defined we
	// should do nothing and return the text
	if (styleRanges && styleRanges.length) {
		// generates style tags by current range definition
		const firstRange = copiedRanges.shift();
		text = applyRangeStyle(text, firstRange);

		// apply html styles recursively
		return applyHtmlStyles(text, copiedRanges);
	}

	return text;
}

function applyRangeStyle (text, range) {
	const {
		offset,
		length,
		style
	} = range;

	if (offset < 0 || length < 0) {
		throw new Error(`Invalid offset (${ offset }) or length (${ length }) found!`);
	}

	if (!style || !(style in Defs)) {
		throw new Error(`Couldn’t find a style tag for «${ style }». Available styles are: ${ Object.keys(Defs).join(", ") }`);
	}

	// get html tag from style type
	const tag = Defs[style];

	// split text into html parts, example:
	// "Hello, <strong>World!</strong>" will be splitted to:
	// [ "Hello, ", "<strong>", "World!", "</strong>" ]
	const splittedText = text.split(SPLIT_REGEX).filter(part => !!part);

	// all styles etc. will be concatenated to this variable
	let styledText = "";

	// when no html tag wasw found just use the the original text
	if (splittedText.length === 1) {
		return wrapText(text, tag, offset, length);
	}

	// this variable will be used to count the current
	// processed text (without the html tags) to calculate
	// the correct styling offsets
	let textLengthCount = 0;

	// When a style overflows the bounce of another style like
	// a "<u>Hello, Java</u>script" where you want to style the
	// "Javascript" word by an <i>-tag we have to split the existing
	// html tags and apply the new style to the separated text chunks
	// to generate valid html output, I mean something like this here:
	// "<u>Hello, <i>Java</i></u><i>script</i>"
	// To count the text parts I need this variable. Puuuh… :-D
	let remainingTextToStyleLength = length;

	for (const part of splittedText) {
		const partLength = part.length;
		const newTextLength = textLengthCount + partLength;

		// when the current splitted text part is a html tag
		// we can skip it and add it to the styledText var
		if (part.startsWith("<")) {
			// there is no incrementation of the textLengthCount var,
			// because we want to skip the html tags for the style
			// ranges definitions
			styledText += part;
		} else {
			// end index of the text to style (absolute index of the whole text)
			const rangeEnd = offset + length;

			// mapped the style offset to the current text part
			const mappedOffset = offset - textLengthCount;

			const rangeStartedBefore = textLengthCount > offset;
			const rangeEndedBeforePart = rangeEnd < textLengthCount;
			const rangeEndedAfterPart = offset >= newTextLength;

			// check if this part doesn’t need to be styled, because the
			// style that should be applied ended in another text part
			// (before or after that part)
			if (rangeEndedBeforePart || rangeEndedAfterPart || !remainingTextToStyleLength) {
				// do not increase textLengthCount (because nothing will be styled)
				styledText += part;
				textLengthCount += partLength;

				// continues to the next text part
				continue;
			}

			// if style starts in this part
			if (rangeStartedBefore) {
				// remaining text length to style
				styledText += wrapText(part, tag, 0, remainingTextToStyleLength);
			} else {
				// check if the current style ends in this part
				if (offset + length <= partLength) {
					// reset the remainingTextToStyleLength to zero, because
					// there is nothing to do anymore
					remainingTextToStyleLength = 0;
				} else {
					// sets the remainingTextToStyleLength with to the remaining
					// amount of text that should be styled
					remainingTextToStyleLength = offset + length - partLength;
				}

				styledText += wrapText(part, tag, mappedOffset, length);
			}

			// update to the new text length (without counting html tags/characters)
			textLengthCount = newTextLength;
		}
	}

	return styledText || text;
}

// wraps a substring of a text by a given html tag
function wrapText (text, tag, fromIndex, textLength) {
	const preText = text.substr(0, fromIndex);
	const textToStyle = text.substr(fromIndex, textLength);
	const postText = text.substr(fromIndex + textLength);

	return `${ preText }<${ tag }>${ textToStyle }</${ tag }>${ postText }`;
}

module.exports = applyHtmlStyles;