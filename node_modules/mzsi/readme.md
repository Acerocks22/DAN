# My Zodiac Sign Is [![Build Status](https://travis-ci.org/ceasbz/mzsi.svg?branch=master)](https://travis-ci.org/ceasbz/mzsi) [![Dependency Status](https://david-dm.org/ceasbz/mzsi.svg?style=flat-square)](https://david-dm.org/ceasbz/mzsi) [![Npm Package Version](https://img.shields.io/npm/v/mzsi.svg?style=flat-square)](https://www.npmjs.org/package/mzsi)

> Discover the zodiac sign and know what their information, such as elements and behavioral characteristics.

> :aries: :taurus: :gemini: :cancer: :leo: :virgo: :libra: :scorpius: :sagittarius: :capricorn: :aquarius: :pisces:

<br />

## Install 

Via [Node.js](https://nodejs.org) run the following:
```bash
$ npm i mzsi --save
```

## Usage
```js
import mzsi from 'mzsi';

let day = 22,
    month = 8;
    
let sign = mzsi(month, day);

console.log(sign.name); // Leo
console.log(sign.symbol); // ♌
console.log(sign.about.element); // Fire
console.log(sign.about.keywords.strength); // ["confident", "ambitious", "generous", "loyal", "encouraging"]
console.log(sign.about.keywords.weakness); // ["pretentious", "domineering", "melodramatic", "stubborn", "vain"]
```

## API

### mzsi(month, day, language)

Returns an object with:

- `name` *(string)* - The name of sign.
- `symbol` *(unicode char)* - The representative symbol.
- `about` *(object)* - The informations of element and characteristics.


Currently, the mzsi has translate with two languages (pt-br, en-us). You can choose via `language` parameter.

## Related
- [mzsi-cli](https://github.com/ceasbz/mzsi-cli) - CLI for this module.

## License

MIT © [Cauê Alves](./LICENSE)
