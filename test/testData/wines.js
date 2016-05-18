const wines = {
  post: {
    id: 1,
    name: 'Cabernet sauvignon',
    year: 2013,
    country: 'France',
    type: 'red',
    description: 'The Sean Connery of red wines',
  },
  postErr: {
    name: 'Cabernet sauvignon',
    year: 'abc',
    type: 'blue',
    description: 'The Sean Connery of red wines',
  },
  postErrRes: { error: 'VALIDATION_ERROR',
    validation: {
      year: 'INVALID',
      country: 'MISSING',
      type: 'NOT_VALID_OPTION',
    },
  },
  put: {
    year: 2016,
    description: 'Work in progress ...',
  },
  unknownErrRes: { error: 'UNKNOWN_OBJECT' },
  successRes: {success: true},
};

module.exports = wines;
