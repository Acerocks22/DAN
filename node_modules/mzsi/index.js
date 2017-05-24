
module.exports = (month, day, languageCode) => {
  'use strict';

  const monthTypeOf = typeof month;

  if (monthTypeOf !== 'number') {
    throw new TypeError('The month should be a number');
  }

  const dayTypeOf = typeof day;

  if (dayTypeOf !== 'number') {
    throw new TypeError('The day should be a number');
  }

  const possibilities = [
    {
      id: 1,
      name: 'aquarius',
      begin: [20, 1],
      end: [18, 2]
    },
    {
      id: 2,
      name: 'pisces',
      begin: [19, 2],
      end: [20, 3]
    },
    {
      id: 3,
      name: 'aries',
      begin: [21, 3],
      end: [19, 4]
    },
    {
      id: 4,
      name: 'taurus',
      begin: [20, 4],
      end: [20, 5]
    },
    {
      id: 5,
      name: 'gemini',
      begin: [21, 5],
      end: [20, 6]
    },
    {
      id: 6,
      name: 'cancer',
      begin: [21, 6],
      end: [21, 7]
    },
    {
      id: 7,
      name: 'leo',
      begin: [22, 7],
      end: [22, 8]
    },
    {
      id: 8,
      name: 'virgo',
      begin: [23, 8],
      end: [22, 9]
    },
    {
      id: 9,
      name: 'libra',
      begin: [23, 9],
      end: [22, 10]
    },
    {
      id: 10,
      name: 'scorpio',
      begin: [23, 10],
      end: [21, 11]
    },
    {
      id: 11,
      name: 'sagittarius',
      begin: [22, 11],
      end: [21, 12]
    },
    {
      id: 12,
      name: 'capricorn',
      begin: [22, 12],
      end: [19, 1]
    }
  ];

  const sign = possibilities.filter(sign => {
    const itIsAmongTheBeginning = (day >= sign.begin[0] && month === sign.begin[1]);
    const itIsAmongTheEnd = (day <= sign.end[0] && month === sign.end[1]);

    return (itIsAmongTheBeginning || itIsAmongTheEnd);
  });

  const translatedLanguages = ['en-us', 'pt-br'];

  let languageToDisplay = 'en-us';

  if (translatedLanguages.indexOf(languageCode) > -1) {
    languageToDisplay = languageCode;
  }

  const aboutSign = JSON.parse(
      require('fs').readFileSync(
          require('path').resolve(__dirname, `i18n/${languageToDisplay}-about.json`),
          'utf8'
      )
  )[sign[0].id];

  return {
    name: aboutSign.name,
    symbol: require('./get-symbol')(sign[0].id),
    about: aboutSign
  };
};
