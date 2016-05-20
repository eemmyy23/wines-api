let restify = require('restify');
let APIwines = require('./APIwines');

module.exports = (server) => {
  server.use(restify.queryParser());
  server.pre(restify.pre.sanitizePath());
  server.use(restify.bodyParser());

  server.get('/wines', APIwines.showAll);
  server.post('/wines', APIwines.insertOne);
  server.put('/wines/:id', APIwines.updateOne);
  server.get('/wines/:id', APIwines.showOne);
  server.del('/wines/:id', APIwines.deleteOne);
};
