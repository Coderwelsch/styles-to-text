// imports
const test = require("ava");
const applyHtmlStyles = require("./index");


// // mock data
const text = `To be, or not to be, that is the question.`;

const rangesExamples = {
	// basic
	italic: {
		rules: [ {
			offset: 7,
			length: 13,
			style: "ITALIC"
		} ],
		renderedText: `To be, <em>or not to be,</em> that is the question.`
	},
	bold: {
		rules: [ {
			offset: 0,
			length: 20,
			style: "BOLD"
		} ],
		renderedText: `<strong>To be, or not to be,</strong> that is the question.`
	},
	underline: {
		rules: [ {
			offset: 21,
			length: 21,
			style: "UNDERLINE"
		} ],
		renderedText: `To be, or not to be, <u>that is the question.</u>`
	},
	strike: {
		rules: [ {
			offset: 17,
			length: 3,
			style: "STRIKE"
		} ],
		renderedText: `To be, or not to <strike>be,</strike> that is the question.`
	},

	// advanced styles
	nestedSimple: {
		rules: [ {
			offset: 0,
			length: 6,
			style: "BOLD"
		}, {
			offset: 3,
			length: 3,
			style: "ITALIC"
		} ],
		renderedText: `<strong>To <em>be,</em></strong> or not to be, that is the question.`
	},

	nestedAndOverlapping: {
		rules: [ {
			offset: 0,
			length: 20,
			style: "BOLD"
		}, {
			offset: 14,
			length: 18,
			style: "ITALIC"
		} ],
		renderedText: `<strong>To be, or not <em>to be,</em></strong><em> that is the</em> question.`
	},

	nestedAndOverlappingExtreme: {
		rules: [ {
			offset: 0,
			length: 20,
			style: "BOLD"
		}, {
			offset: 3,
			length: 17,
			style: "STRIKE"
		}, {
			offset: 14,
			length: 15,
			style: "UNDERLINE"
		} ],
		renderedText: `<strong>To <strike>be, or not to <u>be,</u></strike></strong><u> that is the</u> question.`
	}
};

// falsy ranges
const invalidRangeExamples = {
	incorrectRange: [ {
		offset: -5,
		length: -10,
		style: "IM NOT A VALID STYLE"
	} ]
};


// basic tests
for (const key in rangesExamples) {
	test(`basic styling [${ key }]`, ({ is }) => {
		is(
			applyHtmlStyles(text, rangesExamples[key].rules),
			rangesExamples[key].renderedText
		);
	});
}

// invalid tests that should throw an error
test(`invalid ranges`, ({ throws }) => {
	throws(() => applyHtmlStyles(text, invalidRangeExamples.incorrectRange));
});