let assert = require('assert');
let validate = require('validate.js');
let db = require('./db');
class APIwines {

}
/* eslint-disable func-style */
let collection = db.get().collection('wines');


let respondError = (errors, res, next) => {
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

let constraintsUpdate = {
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

let constraintsId = {
  id: {
    numericality: {
      noStrings: false,
      onlyInteger: true,
      greaterThan: 0,
    },
  },
};

let getNextWineId = () =>
  db.get().collection('counters').findOneAndUpdate(
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

  return collection.find(filters, { _id: 0 }).toArray()
    .then(docs=>{
      res.json(docs);
    })
    .catch(err => {
      res.json({
        error: err,
      });
    });
};

APIwines.insertOne = (req, res, next) => {
  let errors = validate(req.body, constraintsInsert);
  if (errors) {
    return respondError(errors, res, next);
  }

  let newWine = validate.cleanAttributes(req.body, constraintsInsert);
  return getNextWineId()
    .then( r =>
      collection.insertOne(Object.assign({}, {id: r.value.seq}, newWine))
    )
    .then(r=>{
      assert.equal(1, r.insertedCount);
      delete r.ops[0]._id;
      res.json(r.ops[0]);
    })
    .catch(err => {
      res.json({
        error: err,
      });
    });
};

APIwines.updateOne = (req, res, next) => {
  let errors = validate(req.params, constraintsId);
  if (errors) {
    return respondError(errors, res, next);
  }

  errors = validate(req.body, constraintsUpdate);
  if (errors) {
    return respondError(errors, res, next);
  }

  let id = parseInt(req.params.id);
  let updateWine = validate.cleanAttributes(req.body, constraintsUpdate);

  return collection.findOneAndUpdate(
    { id: id }, // filter
    { $set: updateWine }, // update
    { upsert: false, returnOriginal: false} // options
  )
  .then(r=>{
    assert.ok(r.value, 'UNKNOWN_OBJECT');
    delete r.value._id;
    res.json(r.value);
  })
  .catch(err =>
    res.json(400, {
      error: err.message,
    })
  );
};

APIwines.showOne = (req, res, next) => {
  let errors = validate(req.params, constraintsId);
  if (errors) {
    return respondError(errors, res, next);
  }
  let id = parseInt(req.params.id);
  return collection.findOne({ id: id }, { _id: 0 })
    .then(doc=>{
      assert.ok(doc, 'UNKNOWN_OBJECT');
      res.json(doc);
    })
    .catch(err =>
      res.json(400, {
        error: err.message,
      })
    );
};

APIwines.deleteOne = (req, res, next) => {
  let errors = validate(req.params, constraintsId);
  if (errors) {
    return respondError(errors, res, next);
  }
  let id = parseInt(req.params.id);
  return collection.deleteOne({ id: id })
    .then(r=>{
      assert.equal(1, r.deletedCount, 'UNKNOWN_OBJECT');
      res.json({success: true});
    })
    .catch(err =>
      res.json(400, {
        error: err.message,
      })
    );
};

module.exports = APIwines;
