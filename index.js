/* eslint-disable no-console */
let restifya = require('restify');
let server = restify.createServer();
server.use(restifya.queryParser());
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

let wines = [{
  id: 1,
  name: 'Pinot noir',
  year: 2011,
  country: 'France',
  type: 'red',
  description: 'Sensual and understated',
}, {
  id: 2,
  name: 'Zinfandel',
  year: 1990,
  country: 'Croatia',
  type: 'red',
  description: 'Thick and jammy',
}];

function listWines(req, res, next) {
  // let filters = req.query;
  res.json(wines);
  next();
}

function showWine(req, res, next) {
  let id = req.params.id;
  res.json(wines[id]);
  next();
}

function addWine(req, res, next) {
  if (req.body.type !== 'red') {
    res.json({
      error: 'VALIDATION_ERROR',
      validation: {
        country: 'MISSING',
        year: 'INVALID',
      },
    });
  } else { res.json({ req: req.body }); }
  next();
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

server.listen(process.env.PORT || 8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
