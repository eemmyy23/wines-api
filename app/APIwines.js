let assert = require('assert');
let validate = require('validate.js');

class APIwines {

}
/* eslint-disable func-style */
let collection = req => req.db.collection('wines');


let respondError = (errors, res, next) => {
  console.log(errors);
  for (let key in errors) {
    if (errors.hasOwnProperty(key)) {
      errors[key] = errors[key][0];
    }
  }

  res.status(400);
  res.json({
    error: 'VALIDATION_ERROR',
    validation: errors,
  });
  next();
};

validate.validators.presence.options = {message: '^MISSING'};
validate.validators.inclusion.options = {message: '^NOT_VALID_OPTION'};
validate.validators.length.tooShort = '^LENGTH_TOO_SHORT';
validate.validators.length.notValid = '^INVALID';
validate.validators.numericality.notValid = '^INVALID';

let constraintsInsert = {
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


let constraintsFilters = {
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

let getNextWineId = db =>
  db.collection('counters').findOneAndUpdate(
    { _id: 'wines' }, // filter
    { $inc: { seq: 1 } }, // update
    { upsert: true, returnOriginal: false} // options
  );

APIwines.showAll = (req, res, next) => {
  let errors = validate(req.query, constraintsFilters);
  if (errors) {
    return respondError(errors, res, next);
  }

  let filters = validate.cleanAttributes(req.query, constraintsFilters);
  if (filters.hasOwnProperty('year'))  {
    filters.year = parseInt(filters.year);
  }

  return collection(req).find(filters, { _id: 0 }).toArray()
    .then(docs=>{
      res.json(docs);
    })
    .catch(err => {
      res.json({
        error: 'DB_ERROR',
        message: err,
      });
    });
};

APIwines.insertOne = (req, res, next) => {
  let errors = validate(req.body, constraintsInsert);
  if (errors) {
    return respondError(errors, res, next);
  }

  let newWine = validate.cleanAttributes(req.body, constraintsInsert);
  return getNextWineId(req.db)
    .then( r => {
      newWine.id = r.value.seq;
      return collection(req).insertOne(newWine);
    })
    .then(r=>{
      assert.equal(1, r.insertedCount);
      delete r.ops[0]._id;
      res.json(r.ops[0]);
    })
    .catch(err => {
      res.json({
        error: 'DB_ERROR',
        message: err,
      });
    });
};

// APIwines.updateOne = (req, res, next) => {};
// APIwines.showOne(req, res, next) => {};
// APIwines.deleteOne(req, res, next) => {};

module.exports = APIwines;
