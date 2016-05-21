/* eslint-disable func-style */
let assert = require('assert');
let db = require('./db');
let WineValidator = require('./WineValidator');
const collectionName = 'wines';
let collection = db.get().collection(collectionName);
let moment = require('moment');
let _ = require('underscore');

let formatWine = (obj) => {
  if (obj.hasOwnProperty('year')) {
    obj.year_ts = moment.utc([obj.year]).valueOf();
    delete obj.year;
  }
  return obj;
};

let displayWine = (obj) => {
  delete obj._id;
  if (obj.hasOwnProperty('year_ts')) {
    obj.year = moment.utc(obj.year_ts).get('year');
    delete obj.year_ts;
  }
  return obj;
};

let displayWines = (objs) =>
  _.map(objs, obj => displayWine(obj));

let appendId = (obj) =>
  db.get().collection('counters').findOneAndUpdate(
    {_id: collectionName}, // filter
    {$inc: {seq: 1} }, // update
    {upsert: true, returnOriginal: false} // options
  ).then(r =>
    Object.assign({}, {id: r.value.seq}, obj)
  );

let respond = (res, next, data, status = 200) => {
  res.charSet('utf-8');

  if (status !== 200) {
    return respondError(res, next, data, status);
  }

  if (typeof data !== 'object') {
    res.json(500, {unexpected_message: data});
    return next();
  }

  res.json(data);
  return next();
};

let respondError = (res, next, error, status) => {
  if (typeof error !== 'object') {
    res.json(status, {unexpected_error: error});
    return next();
  }

  if (error.name === 'AssertionError') {
    res.json(status, {error: error.message});
    return next();
  }

  res.json(status, error);
  return next();
};

class APIwines {

}

APIwines.showAll = (req, res, next) =>
  WineValidator.validateFilters(req.query)
  .then(filters => collection.find(formatWine(filters)).toArray())
  .then(docs => respond(res, next, displayWines(docs)))
  .catch(error => respond(res, next, error, 400));

APIwines.insertOne = (req, res, next) =>
  WineValidator.validateInsert(req.body)
  .then(validObj => appendId(validObj))
  .then(objWithId => collection.insertOne(formatWine(objWithId)))
  .then(r => {
    assert.equal(1, r.insertedCount, 'DB_ERROR');
    delete r.ops[0]._id;
    respond(res, next, displayWine(r.ops[0]));
  })
  .catch(error => respond(res, next, error, 400));

APIwines.updateOne = (req, res, next) =>
  WineValidator.validateId(req.params)
  .then(() => WineValidator.validateUpdate(req.body))
  .then(obj => collection.findOneAndUpdate(
      { id: parseInt(req.params.id) }, // filter
      { $set: formatWine(obj) }, // update
      { upsert: false, returnOriginal: false} // options
  ))
  .then(r => {
    assert.ok(r.value, 'UNKNOWN_OBJECT');
    delete r.value._id;
    respond(res, next, displayWine(r.value));
  })
  .catch(error => respond(res, next, error, 400));

APIwines.showOne = (req, res, next) =>
  WineValidator.validateId(req.params)
  .then(() => collection
    .findOne({id: parseInt(req.params.id)})
  )
  .then(doc => {
    assert.ok(doc, 'UNKNOWN_OBJECT');
    respond(res, next, displayWine(doc));
  })
  .catch(error => respond(res, next, error, 400));

APIwines.deleteOne = (req, res, next) =>
  WineValidator.validateId(req.params)
  .then( () => collection.deleteOne({id: parseInt(req.params.id)}))
  .then(r => {
    assert.equal(1, r.deletedCount, 'UNKNOWN_OBJECT');
    respond(res, next, {success: true});
  })
  .catch(error => respond(res, next, error, 400));

module.exports = APIwines;
