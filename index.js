/* eslint-disable no-console */
require('dotenv').config();

let restify = require('restify');
let server = restify.createServer();
let MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.MONGO_URL)
.then(db => {
  require('./app/serverRoutes.js')(server, db);
  server.listen(process.env.PORT, () => {
    console.log('%s listening at %s', server.name, server.url);
  });
})
.catch(err => {throw err;} );
