let restify = require('restify');
// let restifyValidator = require('restify-validator');

let APIwines = require('./APIwines');

module.exports = (server) => {
  server.use(restify.queryParser());
  server.pre(restify.pre.sanitizePath());
  server.use(restify.bodyParser());
  // server.use(restifyValidator);

  server.pre((req, res, next) => {
    console.log(req.method, req.url);
    next();
  });

  server.get('/wines', APIwines.showAll);
  server.post('/wines', APIwines.insertOne);
  server.put('/wines/:id', APIwines.updateOne);
  server.get('/wines/:id', APIwines.showOne);
  server.del('/wines/:id', APIwines.deleteOne);
};
