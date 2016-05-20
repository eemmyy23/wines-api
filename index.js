/* eslint-disable no-console */
require('dotenv').config();

let restify = require('restify');
let db = require('./app/db');

db.connect(process.env.MONGO_URL)
.then(() => {
  let server = restify.createServer();
  require('./app/serverRoutes.js')(server);
  server.listen(process.env.PORT, () => {
    console.log('%s listening at %s', server.name, server.url);
  });
})
.catch(e => console.error(e));
