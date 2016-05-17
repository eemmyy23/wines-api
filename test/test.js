require('dotenv').config({path: '.env.test'});
require('dotenv').config();
/* eslint-disable vars-on-top */
var chai = require('chai');

/* eslint-disable no-unused-vars */
var expect = chai.expect;
var should = chai.should();
/* eslint-enable no-unused-vars */

chai.use(require('chai-http'));

let MongoClient = require('mongodb').MongoClient;
var server = chai.request(process.env.TEST_SERVER_URL);

var wines = require('./testData/wines');

describe('DEVELOPER CHALLENGE', () => {
  describe('API WINES', () => {
    before('drop wines collection', () =>
      MongoClient.connect(process.env.MONGO_URL)
      .then(db =>
        db.dropCollection('wines')
        .then( () =>
          db.collection('wines').insert(wines.initialList)
          .then( r =>
            r.insertedCount.should.equal(wines.initialList.length)
          )
        )
      )
    );

    it('should list all wines on GET /wines', () =>
      server
      .get('/wines')
      .then( res => {
        res.should.have.status(200);
        res.body.should.be.an('array');
        res.body.should.have.lengthOf(wines.initialList.length);
        // res.body[0].should.have.property('name');
        // res.body[0].should.have.all.keys(
        //   ['_id', 'name', 'year', 'country', 'type', 'description']
        // );
        res.body.should.deep.equal(wines.initialList);
      })
    );

    it('should create new wine on POST /wines', () =>
      server
      .post('/wines')
      .send(wines.post)
      .then(res => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        delete res.body._id;
        res.body.should.deep.equal(wines.post);
      })
    );

    it('should return validation error on POST /wines', () =>
      server
      .post('/wines')
      .send(wines.postErr)
      .catch(err => {
        err.should.have.status(400);
        // console.log(err.response.res.body);
        err.response.res.body.should.be.an('object');
        err.response.res.body.should.deep.equal(wines.postErrRes);
      })
    );

    it('should update the wine on PUT /wines/:id');
    it('should retrive a wine on GET /wines/:id');
    it('should delete a wine on DELETE /wines/:id');

    // hello
  });
});
