let validate = require('validate.js');
validate.validators.presence.options = {message: '^MISSING'};
validate.validators.inclusion.options = {message: '^NOT_VALID_OPTION'};
validate.validators.length.tooShort = '^LENGTH_TOO_SHORT';
validate.validators.length.notValid = '^INVALID';
validate.validators.numericality.notValid = '^INVALID';

class WineValidator {

}

WineValidator.validateFilters = (query) => {
  return new Promise( (resolv, reject) => {
    let errors = validate(query, WineValidator.constraintsFilters);
    if (errors) {
      return reject(WineValidator.errorMessage(errors));
    }
    let filters = validate
      .cleanAttributes(query, WineValidator.constraintsFilters);

    if (filters.hasOwnProperty('year'))  {
      filters.year = parseInt(filters.year);
    }
    return resolv(filters);
  });
};

WineValidator.validateInsert = (body) => {
  return new Promise( (resolv, reject) => {
    let errors = validate(body, WineValidator.constraintsInsert);
    if (errors) {
      return reject(WineValidator.errorMessage(errors));
    }
    let obj = validate
      .cleanAttributes(body, WineValidator.constraintsInsert);
    return resolv(obj);
  });
};

WineValidator.validateUpdate = (body) => {
  return new Promise( (resolv, reject) => {
    let errors = validate(body, WineValidator.constraintsUpdate);
    if (errors) {
      return reject(WineValidator.errorMessage(errors));
    }
    let obj = validate
      .cleanAttributes(body, WineValidator.constraintsUpdate);

    return resolv(obj);
  });
};

WineValidator.validateId = (params) => {
  return new Promise( (resolv, reject) => {
    let errors = validate(params, WineValidator.constraintsId);
    if (errors) {
      return reject(WineValidator.errorMessage(errors));
    }
    return resolv(params);
  });
};

WineValidator.errorMessage = (errors) => {
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

WineValidator.constraintsInsert = {
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

WineValidator.constraintsUpdate = {
  name: {
    length: {minimum: 3},
  },
  year: {
    numericality: {
      noStrings: true,
      onlyInteger: true,
      greaterThanOrEqualTo: 350,
      lessThanOrEqualTo: new Date().getFullYear(),
    },
  },
  country: {
    length: {minimum: 2},
  },
  type: {
    inclusion: {
      within: ['red', 'white', 'rose'],
    },
  },
  description: {
    length: {minimum: 5},
  },
};

WineValidator.constraintsFilters = {
  name: {
  },
  year: {
    numericality: {
      noStrings: false,
      onlyInteger: true,
    },
  },
  country: {
  },
  type: {
  },
};

WineValidator.constraintsId = {
  id: {
    numericality: {
      noStrings: false,
      onlyInteger: true,
      greaterThan: 0,
    },
  },
};


module.exports = WineValidator;


