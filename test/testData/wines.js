const wines = {
  initialList: [{
    _id: 1,
    name: 'Pinot noir',
    year: 2011,
    country: 'France',
    type: 'red',
    description: 'Sensual and understated',
  }, {
    _id: 2,
    name: 'Zinfandel',
    year: 1990,
    country: 'Croatia',
    type: 'red',
    description: 'Thick and jammy',
  }],
  post: {
    // _id: 3,
    name: 'Cabernet sauvignon',
    year: 2013,
    country: 'France',
    type: 'red',
    description: 'The Sean Connery of red wines',
  },
  postErr: {
    // _id: 3,
    name: 'Cabernet sauvignon',
    year: 'abc',
    // country: 'France',
    type: 'blue',
    description: 'The Sean Connery of red wines',
  },
  postErrRes: { error: 'VALIDATION_ERROR',
    validation: {
      year: 'INVALID',
      country: 'MISSING',
      type: 'NOT_VALID_OPTION',
    },
  }
,
};

module.exports = wines;
