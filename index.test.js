// imports
const test = require("ava");
const applyHtmlStyles = require("./index");


// // mock data
const text = `To be, or not to be, that is the question.`;

const longText = `Ich bin so glücklich, mein Bester. So ganz in dem Gefühle von ruhigem Dasein versunken, daß meine Kunst darunter leidet. Ich könnte jetzt nicht zeichnen, nicht einen Strich, und bin nie ein größerer Maler gewesen als in diesen Augenblicken. Wenn das liebe Tal um mich dampft, und die hohe Sonne an der Oberfläche der undurchdringlichen Finsternis meines Waldes ruht.`;
const longTextRendered = "<strong>Ich bin so <em>glücklich,</em> mein Bester.</strong> <em>So ganz in dem Gefühle von ruhigem Dasein versunken,</em> daß meine Kunst <u>darunter</u> <code>leidet.</code> Ich könnte jetzt nicht zeichnen, nicht einen Strich, und bin nie ein größerer Maler gewesen als in diesen Augenblicken. Wenn das liebe Tal um mich dampft, und die hohe Sonne an der Oberfläche der undurchdringlichen Finsternis meines Waldes ruht.";

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
		renderedText: `To be, or not to <del>be,</del> that is the question.`
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
			offset: 17,
			length: 12,
			style: "UNDERLINE"
		} ],
		renderedText: `<strong>To <del>be, or not to <u>be,</u></del></strong><u> that is the</u> question.`
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

const longTextRangeExample = [ {
		"offset": 0,
		"length": 34,
		"style": "BOLD"
	}, {
		"offset": 11,
		"length": 10,
		"style": "ITALIC"
	}, {
		"offset": 35,
		"length": 52,
		"style": "ITALIC"
	}, {
		"offset": 104,
		"length": 8,
		"style": "UNDERLINE"
	}, {
		"offset": 113,
		"length": 7,
		"style": "CODE"
	}
];


// basic tests
for (const key in rangesExamples) {
	test(`basic styling [${ key }]`, ({ is }) => {
		is(
			applyHtmlStyles(text, rangesExamples[key].rules),
			rangesExamples[key].renderedText
		);
	});
}

test(`long text`, ({ is }) => {
	is(
		applyHtmlStyles(longText, longTextRangeExample),
		longTextRendered
	);
});

// invalid tests that should throw an error
test(`invalid ranges`, ({ throws }) => {
	throws(() => applyHtmlStyles(text, invalidRangeExamples.incorrectRange));
});