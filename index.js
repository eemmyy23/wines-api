/* eslint-disable no-console */
require('dotenv').config();
let restify = require('restify');
let server = restify.createServer();
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let db;
let collWines;

server.use(restify.queryParser());
server.pre(restify.pre.sanitizePath());
server.use(restify.bodyParser());

server.pre((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

server.get('/wines', listWines);
server.post('/wines', addWine);
server.put('/wines/:id', updateWine);
server.get('/wines/:id', showWine);
server.del('/wines/:id', deleteWine);

MongoClient.connect(process.env.MONGO_URL)
  .then(database => {
    db = database;
    collWines = db.collection('wines');
    server.listen(process.env.PORT, () => {
      console.log('%s listening at %s', server.name, server.url);
    });
  })
  .catch(err => {throw err;} );

function listWines(req, res, next) {
  // let filters = req.query;
  collWines.find().toArray()
    .then(docs=>{
      res.json(docs);
    })
    .catch(err => {
      res.json({
        error: 'DB_ERROR',
        message: err,
      });
    });
  next();
}

function showWine(req, res, next) {
  let id = req.params.id;
  res.json(wines[id]);
  next();
}

function addWine(req, res, next) {
  if (req.body.type !== 'red') {
    return res.json({
      error: 'VALIDATION_ERROR',
      validation: {
        country: 'MISSING',
        year: 'INVALID',
      },
    });
  }

  collWines.insertOne(req.body)
      .then(r=>{
        assert.equal(1, r.insertedCount);
        res.json(r.ops[0]);
      })
      .catch(err => {
        res.json({
          error: 'DB_ERROR',
          message: err,
        });
      });

  return next();
}

function updateWine(req, res, next) {
  let id = req.params.id;
  if (id !== '3') {
    res.json({
      error: 'UNKNOWN_OBJECT',
    });
  } else { res.json({ req: req.body }); }
  next();
}

function deleteWine(req, res, next) {
  let id = req.params.id;
  if (id !== '3') {
    res.json({
      error: 'UNKNOWN_OBJECT',
    });
  } else {
    res.json({
      success: true,
    });
  }
  next();
}

