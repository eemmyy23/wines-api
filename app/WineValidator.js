let _ = require('underscore');
let validate = require('validate.js');
validate.validators.presence.options = {message: '^MISSING'};
validate.validators.inclusion.options = {message: '^NOT_VALID_OPTION'};
validate.validators.length.tooShort = '^LENGTH_TOO_SHORT';
validate.validators.length.notValid = '^INVALID';
validate.validators.numericality.notValid = '^INVALID';

class WineValidator {

}

WineValidator.validate = (object, constraints) =>
  new Promise((resolv, reject) => {
    let errors = validate(object, constraints);
    if (errors) {
      reject(WineValidator.errorMessage(errors));
    }
    resolv(validate.cleanAttributes(object, constraints));
  });

WineValidator.validateFilters = query =>
  WineValidator.validate(query, WineValidator.constraintsFilters())
  .then(filters => {
    if (filters.hasOwnProperty('year')) {
      filters.year = parseInt(filters.year);
    }
    return filters;
  });

WineValidator.validateInsert = body =>
  WineValidator.validate(body, WineValidator.constraintsInsert());


WineValidator.validateUpdate = body =>
  WineValidator.validate(body, WineValidator.constraintsUpdate());

WineValidator.validateId = params =>
  WineValidator.validate(params, WineValidator.constraintsId);


WineValidator.errorMessage = errors => {
  for (let key in errors) {
    if (errors.hasOwnProperty(key)) {
      errors[key] = errors[key][0];
    }
  }
  return {
    error: 'VALIDATION_ERROR',
    validation: errors,
  };
};

WineValidator.schema = {
  name: {
    presence: true,
    length: {minimum: 3},
  },
  year: {
    presence: true,
    numericality: {
      noStrings: true,
      onlyInteger: true,
      greaterThanOrEqualTo: 350,
      lessThanOrEqualTo: new Date().getFullYear(),
    },
  },
  country: {
    presence: true,
    length: {minimum: 2},
  },
  type: {
    presence: true,
    inclusion: {
      within: ['red', 'white', 'rose'],
    },
  },
  description: {
    length: {minimum: 5},
  },
};

WineValidator.constraintsInsert = () => _.clone(WineValidator.schema);

WineValidator.constraintsUpdate = () =>
  _.mapObject(_.clone(WineValidator.schema), val => _.omit(val, 'presence'));

WineValidator.constraintsFilters = () => {
  let filters = _.mapObject(
    _.clone(WineValidator.schema), () => { return {}; }
  );
  filters.year = {
    numericality: { noStrings: false, onlyInteger: true },
  };
  return filters;
};

WineValidator.constraintsId = {
  id: {
    numericality: { noStrings: false, onlyInteger: true, greaterThan: 0 },
  },
};

module.exports = WineValidator;
