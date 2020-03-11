# Javascript Styles to Text

A small module for styling text with html by using arrays of text style definitions. Commonly necessary for parsing text blocks from content management systems like [Takeshape.io](https://www.takeshape.io/) and other cm-systems.

## Example

[![Edit react-styles-to-text-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/hungry-monad-kb7ze?fontsize=14&hidenavigation=1&theme=dark)

## Install

```shell script
npm i styles-to-text
# or
yarn styles-to-text
```

## Usage

```javascript
import stylesToText from "styles-to-text";

const textToStyle = `To be, or not to be, that is the question.`;

const styleDefinitions = [  {
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
}  ];

console.log(stylesToText(textToStyle, styleDefinitions));
```

## Contributors are welcome!

Feel free to contribute and improve this little module! 😇

## ToDos
- [ ] Documentation :D
- [ ] More features?
- [x] Tests
