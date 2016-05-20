let MongoClient = require('mongodb').MongoClient;

let db = null;

exports.connect = url =>
  new Promise((resolve, reject) => {
    if (db) return resolve(db);

    return MongoClient.connect(url)
    .then(database => {
      db = database;
      resolve(db);
    })
    .catch(e => reject(e));
  });

exports.get = () => db;
